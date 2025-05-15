using Microsoft.EntityFrameworkCore;
using SeriesTracker.Core.Abstractions;
using SeriesTracker.Core.Dtos;
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

        public async Task<List<int>> GetAnimeIdsList(Guid userId, int page, int categoryId, bool isFavorite)
        {
            // Получаем список AnimeId пользователя с учетом пагинации, категории и избранного
            List<int> animeIds = await _context.UserSeriesEntities
                .AsNoTracking()
                .Where(s => s.UserId == userId && (categoryId <= 0 || s.CategoryId == categoryId) && (!isFavorite || s.IsFavorite))
                .Skip((page - 1) * 22)
                .Take(22)
                .Select(s => s.AnimeId)
                .ToListAsync();

            return animeIds; // Возвращаем список AnimeId
        }

        public async Task<List<SeriesGroupDto>> GetGroupShortSeries(string userName)
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
            List<SeriesGroupDto> categoryGroup = userSeries
                .GroupBy(s => new { s.Category.Id, s.Category.Name, s.Category.Color })
                .Select(g => new SeriesGroupDto  // Создаем DTO для каждой группы
                {
                    Id = g.Key.Id.ToString(),
                    SeriesCount = g.Count(),
                    Color = g.Key.Color
                })
                .ToList();

            // Получаем количество (если есть данные)
            int count = userSeries.Count;

            // Создаем результат и вставляем в начало:
            List<SeriesGroupDto> result = [.. categoryGroup];

            result.Insert(0, new SeriesGroupDto { Id = "0", SeriesCount = count, Color = "" });

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
                return  new()
                {
                    CategoryGroups = [],
                    LastFiveSeries = string.Empty,
                }; // Возвращаем пустой DTO, если у пользователя нет записей
            }

            // Группируем список записей по категориям
            List<SeriesGroupFullDto> categoryGroup = [.. userSeriesList
                .GroupBy(s => s.Category.Id) // Группируем по ID категории
                .Select(g =>
                {
                    CategoryEntity category = g.First().Category; // Получаем информацию о категории

                    return new SeriesGroupFullDto
                    {
                        Id = g.Key.ToString(),
                        Name = category.Name,
                        Color = category.Color,
                        SeriesCount = g.Count() // Количество записей в категории
                    };
                })
                .OrderBy(u => u.Id)]; // Преобразуем в список

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

        public async Task<Dictionary<int, SeriesCategoryDto>> GetSeriesAnimeId(Guid userId, List<int> animeIds)
        {
            // Получаем список SeriesCategoryDto
            // AsNoTracking используется, так как мы не планируем изменять этот объект.
            var seriesCategories = await _context.UserSeriesEntities
                .AsNoTracking()
                .Where(s => s.User.Id == userId && animeIds.Contains(s.AnimeId))
                .Include(s => s.Category)
                .Select(s => new SeriesCategoryDto
                {
                    SeriesId = s.Id,
                    AnimeId = s.AnimeId,
                    CategoryId = s.CategoryId,
                    CategoryName = s.Category.Name,
                    CategoryColor = s.Category.Color,
                    WatchedEpisodes = s.WatchedEpisodes,
                    AddedDate = s.AddedDate,
                    ChangedDate = s.ChangedDate,
                    IsFavorite = s.IsFavorite
                })
                .ToListAsync();

            // Преобразуем список SeriesCategoryDto в словарь, где ключ - AnimeId
            var seriesCategoriesDictionary = seriesCategories.ToDictionary(c => c.AnimeId, c => c);

            return seriesCategoriesDictionary; // Возвращаем словарь
        }

        public async Task<bool> UpdateSeries(Guid seriesId, int watched, int categoryId, bool favorite, string dateNow)
        {
            // Загружаем существующую запись.
            var userSeries = await _context.UserSeriesEntities.FindAsync(seriesId);

            if (userSeries == null)
            {
                return false; // Запись не найдена.
            }

            // Обновляем свойства.
            userSeries.WatchedEpisodes = watched;
            userSeries.CategoryId = categoryId;
            userSeries.IsFavorite = favorite;
            userSeries.ChangedDate = dateNow;

            try
            {
                // Сохраняем изменения.
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception)
            {
                return false; // Обрабатываем ошибки сохранения.
            }
        }
    }
}