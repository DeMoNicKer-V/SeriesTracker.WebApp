using Microsoft.EntityFrameworkCore;
using SeriesTracker.Core.Abstractions;
using SeriesTracker.Core.Dtos.Series;
using SeriesTracker.Core.Exceptions;
using SeriesTracker.Core.Models;
using SeriesTracker.DataAccess.Entities;

namespace SeriesTracker.DataAccess.Repositories
{
    /// <summary>
    /// Репозиторий для работы с пользовательскими списками  в базе данных.
    /// Предоставляет методы для добавления, удаления, получения и обновления информации о списках пользователей.
    /// </summary>
    public class UserSeriesRepository : IUserSeriesRepository
    {
        private readonly SeriesTrackerDbContext _context;

        /// <summary>
        /// Инициализирует новый экземпляр класса <see cref="UserSeriesRepository"/>.
        /// </summary>
        /// <param name="context">Контекст базы данных SeriesTrackerDbContext для доступа к данным.</param>

        public UserSeriesRepository(SeriesTrackerDbContext context)
        {
            // Внедряем зависимость (Dependency Injection) контекста базы данных и проверяем на null
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        public async Task<Guid> Add(UserSeries model)
        {
            // Преобразуем модель домена в Entity для базы данных
            UserSeriesEntity userSeriesEntity = new()
            {
                Id = model.Id,
                UserId = model.UserId,
                AnimeId = model.AnimeId,
                CategoryId = model.CategoryId,
                AddedDate = model.AddedDate,
                ChangedDate = model.ChangedDate,
                WatchedEpisodes = model.WatchedEpisodes,
                IsFavorite = model.IsFavorite,
            };

            // Добавляем Entity в контекст и сохраняем изменения
            await _context.UserSeriesEntities.AddAsync(userSeriesEntity);
            await _context.SaveChangesAsync(); // Сохраняем изменения в базе данных

            return userSeriesEntity.Id; // Возвращаем ID созданной записи
        }

        public async Task<bool> DeleteAllSeriesByUserId(Guid userId)
        {
            // Удаляем все записи для указанного UserId
            int rowsAffected = await _context.UserSeriesEntities
                 .Where(s => s.UserId == userId)
                 .ExecuteDeleteAsync();

            return rowsAffected > 0;  // Возвращаем true, если кол-во затронутых записей больше нуля, иначе - false
        }

        public async Task<bool> DeleteSeriesById(Guid seriesId)
        {
            // Удаляем запись по указанному ID
            int rowsAffected = await _context.UserSeriesEntities
                .Where(s => s.Id == seriesId)
                .ExecuteDeleteAsync();

            return rowsAffected > 0; // Возвращаем true, если кол-во затронутых записей больше нуля, иначе - false
        }

        public async Task<List<int>> GetAnimeIdsList(string userName, int page, int categoryId, bool isFavorite)
        {
            // Получаем список AnimeId пользователя с учетом пагинации, категории и избранного
            List<int> animeIds = await _context.UserSeriesEntities
                .AsNoTracking()
                .Where(s => s.User.UserName == userName && (categoryId <= 0 || s.CategoryId == categoryId) && (!isFavorite || s.IsFavorite))
                .Skip((page - 1) * 22)
                .Take(22)
                .Select(s => s.AnimeId)
                .ToListAsync();

            return animeIds; // Возвращаем список AnimeId
        }

        public async Task<List<SeriesGroupShortDto>> GetGroupShortSeries(string userName)
        {
            // Получаем список записей пользователя и группируем их по категориям (для краткого представления)
            List<UserSeriesEntity> userSeries = await _context.UserSeriesEntities
                .AsNoTracking()
                .Where(s => s.User.UserName == userName)
                .Include(s => s.Category)
                .ToListAsync();

            if (userSeries.Count == 0)
            {
                return []; // Возвращаем пустой список, если у пользователя нет записей
            }

            // Группируем записи по категориям
            List<SeriesGroupShortDto> categoryGroup = userSeries
                .GroupBy(s => new { s.Category.Id, s.Category.Name, s.Category.Color })
                .Select(g => new SeriesGroupShortDto  // Создаем DTO для каждой группы
                {
                    Key = g.Key.Id.ToString(),
                    Value = g.Count(),
                    Color = g.Key.Color
                })
                .ToList();

            // Получаем количество (если есть данные)
            int count = userSeries.Count;

            // Создаем результат и вставляем в начало:
            List<SeriesGroupShortDto> result = categoryGroup.ToList();

            result.Insert(0, new SeriesGroupShortDto { Key = "0", Value = count, Color = "" });

            return result; // Возвращаем список сгруппированных записей
        }

        public async Task<SeriesProfileDTO> GetUserProfile(Guid userId)
        {
            // Получаем профиль пользователя (список записей, сгруппированных по категориям, и 5 последних измененных записей)
            List<UserSeriesEntity> userSeriesList = await _context.UserSeriesEntities
                .AsNoTracking()
                .Where(s => s.UserId == userId)
                .Include(user => user.Category)
                .ToListAsync();

            if (userSeriesList.Count == 0)
            {
                return new SeriesProfileDTO(); // Возвращаем пустой DTO, если у пользователя нет записей
            }

            // Группируем список записей по категориям
            List<SeriesGroupDto> categoryGroup = userSeriesList
                .GroupBy(s => s.Category.Id) // Группируем по ID категории
                .Select(g =>
                {
                    CategoryEntity category = g.First().Category; // Получаем информацию о категории

                    return new SeriesGroupDto
                    {
                        Id = g.Key,
                        Name = category.Name,
                        Color = category.Color,
                        SeriesCount = g.Count() // Количество записей в категории
                    };
                })
                .ToList(); // Преобразуем в список

            // Формируем строку с ID последних 5 измененных записей
            string lastFiveSeriesString = string.Join(",", userSeriesList
                .OrderByDescending(s => s.ChangedDate) // Сортируем по дате изменения в обратном порядке
                .Take(5)
                .Select(s => s.AnimeId)
                .ToList());

            // Создаем и заполняем DTO с результатами
            SeriesProfileDTO result = new()
            {
                CategoryGroups = categoryGroup, // Группы записей по категориям
                LastFiveSeries = lastFiveSeriesString, // Строка с ID последних 5 измененных записей
            };
            return result; // Возвращаем DTO
        }

        public async Task<bool> UpdateSeries(Guid seriesId, int watched, int categoryId, bool favorite, string dateNow)
        {
            // Обновляем информацию о записи
            int rowsAffected = await _context.UserSeriesEntities.Where(s => s.Id == seriesId)
                .ExecuteUpdateAsync(s => s.SetProperty(s => s.WatchedEpisodes, s => watched)
                .SetProperty(s => s.CategoryId, s => categoryId)
                .SetProperty(s => s.IsFavorite, s => favorite)
                .SetProperty(s => s.ChangedDate, s => dateNow));

            return rowsAffected > 0;  // Возвращаем true, если кол-во затронутых записей больше нуля, иначе - false
        }
    }
}