using Microsoft.EntityFrameworkCore;
using SeriesTracker.Core.Abstractions;
using SeriesTracker.Core.Dtos.UserDtos;
using SeriesTracker.Core.Enums;
using SeriesTracker.Core.Models;
using SeriesTracker.DataAccess.Entities;

namespace SeriesTracker.DataAccess.Repositories
{
    public class UserRepository(SeriesTrackerDbContext context) : IUserRepository
    {
        private readonly SeriesTrackerDbContext _context = context;

        /// <summary>
        /// Изменяет роль пользователя.
        /// </summary>
        /// <param name="userId">Идентификатор пользователя.</param>
        /// <param name="roleId">Идентификатор новой роли.</param>
        /// <returns><see langword="true"/>, если роль успешно изменена, иначе <see langword="false"/>.</returns>
        public async Task<bool> ChangeUserRole(Guid userId, int roleId)
        {
            // Получаем сущность роли по идентификатору.
            // AsNoTracking используется, так как мы не планируем изменять эту сущность.
            var roleEntity = await _context.RoleEntities
                .AsNoTracking()
                .FirstOrDefaultAsync(r => r.Id == roleId);

            // Получаем сущность пользователя по идентификатору, включая его роли.
            var userEntity = await _context.UserEntities
               .Include(u => u.Roles)
               .FirstOrDefaultAsync(u => u.Id == userId);

            // Если пользователь или роль не найдены, возвращаем False.
            if (userEntity == null || roleEntity == null)
            {
                return false;
            }

            // Очищаем текущие роли пользователя.
            userEntity.Roles.Clear();

            // Добавляем новую роль пользователю.
            userEntity.Roles.Add(roleEntity);

            // Сохраняем изменения в базе данных.
            await _context.SaveChangesAsync();
            return true;
        }

        /// <summary>
        /// Создает нового пользователя.
        /// </summary>
        /// <param name="user">Объект пользователя для создания.</param>
        /// <returns>Идентификатор созданного пользователя (<see cref="Guid"/>).</returns>
        public async Task<Guid> CreateUser(User user)
        {
            // Получаем сущность роли "User" по умолчанию.
            // AsNoTracking используется, так как мы не планируем изменять эту сущность.
            var roleEntity = await _context.RoleEntities
                .AsNoTracking()
                .SingleAsync(r => r.Id == (int)Role.User);

            // Создаем новую сущность пользователя на основе объекта User.
            var userEntity = new UserEntity
            {
                Id = user.Id,
                UserName = user.UserName,
                Name = user.Name,
                Roles = [roleEntity], // Устанавливаем роль по умолчанию "User"
                SurName = user.SurName,
                Email = user.Email,
                PasswordHash = user.PasswordHash,
                Avatar = user.Avatar,
                DateBirth = user.DateBirth,
                RegDate = user.RegDate,
            };

            // Добавляем сущность пользователя в контекст.
            await _context.UserEntities.AddAsync(userEntity);

            // Сохраняем изменения в базе данных.
            await _context.SaveChangesAsync();

            return userEntity.Id;
        }

        /// <summary>
        /// Удаляет пользователя по идентификатору.
        /// </summary>
        /// <param name="id">Идентификатор пользователя для удаления.</param>
        /// <returns><see langword="true"/>, если пользователь удален, иначе <see langword="false"/>.</returns>
        public async Task<bool> DeleteUser(Guid id)
        {
            // Удаляем пользователя с указанным идентификатором.
            var rowsAffected = await _context.UserEntities.Where(c => c.Id == id).ExecuteDeleteAsync();

            // Возвращаем true, если была удалена хотя бы одна строка, иначе false.
            return rowsAffected > 0;
        }

        /// <summary>
        /// Получает пользователя по email.
        /// </summary>
        /// <param name="email">Email пользователя.</param>
        /// <returns>Объект пользователя или <see langword="null"/>, если пользователь не найден.</returns>
        public async Task<User?> GetUserByEmail(string email)
        {
            // Получаем сущность пользователя по email, включая его роли.
            // AsNoTracking используется, так как мы не планируем изменять эту сущность.
            var userEntity = await _context.UserEntities
                .AsNoTracking()
                .Include(u => u.Roles)
                .FirstOrDefaultAsync(u => u.Email == email);

            // Преобразуем сущность пользователя в объект User.
            return MapUser(userEntity);
        }

        /// <summary>
        /// Получает пользователя по идентификатору.
        /// </summary>
        /// <param name="id">Идентификатор пользователя.</param>
        /// <returns>Объект пользователя или <see langword="null"/>, если пользователь не найден.</returns>
        public async Task<User?> GetUserById(Guid id)
        {
            // Получаем сущность пользователя по идентификатору, включая его роли.
            // AsNoTracking используется, так как мы не планируем изменять эту сущность.
            var userEntity = await _context.UserEntities
                            .AsNoTracking()
                            .Include(u => u.Roles)
                            .FirstOrDefaultAsync(u => u.Id == id);

            // Преобразуем сущность пользователя в объект User.
            return MapUser(userEntity);
        }

        /// <summary>
        /// Получает пользователя по никнейму.
        /// </summary>
        /// <param name="userName">Никнейм пользователя.</param>
        /// <returns>Объект пользователя или <see langword="null"/>, если пользователь не найден.</returns>
        public async Task<User?> GetUserByUserName(string userName)
        {
            // Получаем сущность пользователя по никнейму, включая его роли.
            // AsNoTracking используется, так как мы не планируем изменять эту сущность.
            var userEntity = await _context.UserEntities
                            .AsNoTracking()
                            .Include(u => u.Roles)
                            .FirstOrDefaultAsync(u => u.UserName == userName);

            // Преобразуем сущность пользователя в объект User.
            return MapUser(userEntity);
        }

        /// <summary>
        /// Получает список пользователей с пагинацией.
        /// </summary>
        /// <param name="page">Номер страницы.</param>
        /// <returns>Кортеж, содержащий список пользователей (<see cref="UserDto"/>) и общее количество пользователей (<see cref="int"/>).</returns>
        public async Task<(List<UserDto>, int)> GetUserList(int page)
        {
            // Получаем общее количество пользователей.
            var totalCount = await _context.UserEntities.CountAsync();

            // Получаем список пользователей с учетом пагинации, включая их роли.
            // AsNoTracking используется, так как мы не планируем изменять эти сущности.
            var users = await _context.UserEntities
                .AsNoTracking()
                .Include(u => u.Roles)
                .Skip((page - 1) * 10)
                .Take(10)
                .Select(u => new UserDto
                {
                    Id = u.Id,
                    Email = u.Email,
                    UserName = u.UserName,
                    RoleId = u.Roles.First().Id, // Предполагается, что у пользователя всегда есть хотя бы одна роль
                    RegDate = u.RegDate,
                }).ToListAsync();

            return (users, totalCount);
        }

        /// <summary>
        /// Получает набор разрешений для указанного пользователя.
        /// </summary>
        /// <param name="userId">Идентификатор пользователя.</param>
        /// <returns>
        /// Набор разрешений, которыми обладает пользователь.
        /// Возвращает пустой HashSet, если пользователь не найден или у него нет разрешений.
        /// </returns>
        public async Task<HashSet<Permission>> GetUserPermissions(Guid userId)
        {
            // 1. Получаем пользователя по идентификатору и загружаем связанные данные:
            //    - AsNoTracking(): Отключаем отслеживание изменений для повышения производительности,
            //                       так как мы не планируем изменять полученные данные.
            // 2. Извлекаем разрешения:
            //      Преобразуем структуру данных (User -> Roles -> Permissions) в плоский список идентификаторов разрешений.
            // 3. Преобразуем список разрешений в HashSet:
            //    - ToHashSet(): Создаем HashSet из списка разрешений для обеспечения уникальности и быстрого поиска.
            var permissions = await _context.UserEntities
                .AsNoTracking()
                .Where(u => u.Id == userId)
                .Include(u => u.Roles)
                .ThenInclude(r => r.Permissions)
                .SelectMany(u => u.Roles.SelectMany(r => r.Permissions.Select(p => (Permission)p.Id)))
                .ToListAsync();

            // 4. Возвращаем набор разрешений
            return [.. permissions]; // Создаем HashSet из списка разрешений
        }

        /// <summary>
        /// Изменяет данные пользователя.
        /// </summary>
        /// <param name="id">Идентификатор пользователя.</param>
        /// <param name="userName">Никнейм пользователя.</param>
        /// <param name="name">Имя пользователя.</param>
        /// <param name="surName">Фамилия пользователя.</param>
        /// <param name="email">Email пользователя.</param>
        /// <param name="passwordHash">Хэш пароля пользователя.</param>
        /// <param name="avatar">Url аватара пользователя.</param>
        /// <param name="dateBirth">Дата рождения пользователя.</param>
        /// <returns><see langword="true"/>, если пользователь изменен, иначе <see langword="false"/>.</returns>
        public async Task<bool> UpdateUser(Guid id, string userName, string name, string surName, string email, string passwordHash, string avatar, string dateBirth)
        {
            var rowsAffected = await _context.UserEntities.Where(s => s.Id == id)
                .ExecuteUpdateAsync(s => s
                .SetProperty(s => s.UserName, s => userName)
                .SetProperty(s => s.Name, s => name)
                .SetProperty(s => s.SurName, s => surName)
                .SetProperty(s => s.Email, s => email ?? s.Email) // если email отсутсвует - не меняем значение
                .SetProperty(s => s.PasswordHash, s => passwordHash ?? s.PasswordHash) // то же самое и с passwordHash
                .SetProperty(s => s.DateBirth, s => dateBirth)
                .SetProperty(s => s.Avatar, s => avatar));

            return rowsAffected > 0;
        }

        // Приватный метод для преобразования UserEntity в User
        /// <summary>
        /// Преобразует сущность <see cref="UserEntity"/> в модель <see cref="User"/>
        /// </summary>
        /// <param name="userEntity">Сущность для преобразования.</param>
        /// <returns><see cref="User"/>, если userEntity != <see langword="null"/>, иначе <see langword="null"/>.</returns>
        private static User? MapUser(UserEntity? userEntity)
        {
            // если userEntity отсуствует - возвращаем null
            if (userEntity == null)
            {
                return null;
            }
            else
            {
                // используем фабричный метод модели User для создания экземпляра
                var user = User.Create(userEntity.Id,
                    userEntity.UserName,
                    userEntity.Name,
                    userEntity.SurName,
                    userEntity.Email,
                    userEntity.PasswordHash,
                    userEntity.Avatar,
                    userEntity.DateBirth,
                    userEntity.RegDate,
                    userEntity.Roles.First().Id);
                return user;
            }
        }
    }
}