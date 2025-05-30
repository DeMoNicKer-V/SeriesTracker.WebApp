﻿using Microsoft.EntityFrameworkCore;
using SeriesTracker.Core.Abstractions;
using SeriesTracker.Core.Dtos;
using SeriesTracker.Core.Enums;
using SeriesTracker.Core.Models;
using SeriesTracker.DataAccess.Entities;

namespace SeriesTracker.DataAccess.Repositories
{
    /// <summary>
    /// Репозиторий для работы с данными о пользователях в базе данных.
    /// </summary>
    public class UserRepository : IUserRepository
    {
        private readonly SeriesTrackerDbContext _context;

        /// <summary>
        /// Инициализирует новый экземпляр класса <see cref="UserRepository"/>.
        /// </summary>
        /// <param name="context">Контекст базы данных для доступа к данным.</param>
        public UserRepository(SeriesTrackerDbContext context)
        {
            // Внедряем зависимость (Dependency Injection) контекста базы данных и проверяем на null
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        public async Task<bool> ChangeUserRole(Guid userId, int roleId)
        {
            // Получаем сущность роли по идентификатору.
            var roleEntity = await _context.RoleEntities
             .SingleOrDefaultAsync(r => r.Id == roleId);

            // Если роль не найдена - то констатируем, что изменение прошло неудачно
            if (roleEntity == null)
            {
                return false;
            }

            // Загружаем пользователя с его ролями
            var user = await _context.UserEntities
             .Include(u => u.Role)
             .FirstOrDefaultAsync(u => u.Id == userId);

            // Если пользователь не найден, возвращаем false
            if (user == null)
            {
                return false;
            }

            // Проверяем, что роль уже назначена пользователю
            if (user.Role.Id == roleEntity.Id)
            {
                return true; // Роль уже назначена, возвращаем true
            }

            // Обновляем роли пользователя
            user.Role = roleEntity;

            // Сохраняем изменения в базе данных
            var rowsAffected = await _context.SaveChangesAsync();

            // Возвращаем true, если была изменена хотя бы одна строка, иначе false.
            return rowsAffected > 0;
        }

        public async Task<Guid> CreateUser(User user)
        {
            // Получаем сущность роли "User" по умолчанию.
            var roleEntity = await _context.RoleEntities
                .SingleAsync(r => r.Id == (int)Role.User);

            // Присоединяем сущность к контексту в состоянии Unchanged (на всякий случай)
            _context.Attach(roleEntity);

            // Создаем новую сущность пользователя на основе объекта User.
            var userEntity = new UserEntity
            {
                Id = user.Id,
                UserName = user.UserName,
                Name = user.Name,
                SurName = user.SurName,
                Email = user.Email,
                PasswordHash = user.PasswordHash,
                Avatar = user.Avatar,
                DateBirth = user.DateBirth,
                RegDate = user.RegDate,
            };

            // Добавляем роль в навигационное свойство
            userEntity.Role = roleEntity;

            // Добавляем сущность пользователя в контекст.
            await _context.UserEntities.AddAsync(userEntity);

            // Сохраняем изменения в базе данных.
            await _context.SaveChangesAsync();

            return userEntity.Id;
        }

        public async Task<bool> DeleteUser(Guid id)
        {
            // Удаляем пользователя с указанным идентификатором.
            var rowsAffected = await _context.UserEntities.Where(c => c.Id == id).ExecuteDeleteAsync();

            return rowsAffected > 0; // Возвращаем true, если кол-во затронутых записей больше нуля, иначе - false
        }

        public async Task<User?> GetUserByEmail(string email)
        {
            // Получаем сущность пользователя по email, включая его роли.
            // AsNoTracking используется, так как мы не планируем изменять эту сущность.
            var userEntity = await _context.UserEntities
                .AsNoTracking()
                .Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.Email == email);

            // Преобразуем сущность пользователя в объект User.
            return MapUser(userEntity);
        }

        public async Task<User?> GetUserById(Guid id)
        {
            // Получаем сущность пользователя по идентификатору, включая его роли.
            // AsNoTracking используется, так как мы не планируем изменять эту сущность.
            var userEntity = await _context.UserEntities
                            .AsNoTracking()
                            .Include(u => u.Role)
                            .FirstOrDefaultAsync(u => u.Id == id);

            // Преобразуем сущность пользователя в объект User.
            return MapUser(userEntity);
        }

        public async Task<User?> GetUserByUserName(string userName)
        {
            // Получаем сущность пользователя по никнейму, включая его роли.
            // AsNoTracking используется, так как мы не планируем изменять эту сущность.
            var userEntity = await _context.UserEntities
                            .AsNoTracking()
                            .Include(u => u.Role)
                            .FirstOrDefaultAsync(u => u.UserName == userName);

            // Преобразуем сущность пользователя в объект User.
            return MapUser(userEntity);
        }

        public async Task<(List<UserDto>, int)> GetUserList(int page)
        {
            // Получаем общее количество пользователей.
            var totalCount = await _context.UserEntities.CountAsync();

            // Получаем список пользователей с учетом пагинации, включая их роли.
            // AsNoTracking используется, так как мы не планируем изменять эти сущности.
            var users = await _context.UserEntities
                .AsNoTracking()
                .Include(u => u.Role)
                .Skip((page - 1) * 10)
                .Take(10)
                .Select(u => new UserDto
                {
                    Id = u.Id,
                    Email = u.Email,
                    UserName = u.UserName,
                    RoleId = u.Role.Id, // Предполагается, что у пользователя всегда есть хотя бы одна роль
                    RegDate = u.RegDate,
                }).ToListAsync();

            return (users, totalCount);
        }

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
                .Include(u => u.Role)
                .ThenInclude(r => r.Permissions)
                .SelectMany(u => u.Role.Permissions.Select(p => (Permission)p.Id))
                .ToListAsync();

            // 4. Возвращаем набор разрешений
            return [.. permissions];
        }

        public async Task<bool> UpdateUser(Guid id, string? userName, string? name, string? surName, string? email, string? passwordHash, string? avatar, string? dateBirth)
        {
            // Обновляем данные
            // Если значение отсутствует - присваиваем существующее значение
            // 1. Загружаем сущность из базы данных
            UserEntity? user = await _context.UserEntities.Where(u => u.Id == id).FirstOrDefaultAsync();

            if (user == null)
            {
                return false; // Пользователь не найден
            }

            // 2. Обновляем свойства, если они были предоставлены
            if (!string.IsNullOrEmpty(userName))
            {
                user.UserName = userName;
            }

            if (!string.IsNullOrEmpty(name))
            {
                user.Name = name;
            }

            if (!string.IsNullOrEmpty(surName))
            {
                user.SurName = surName;
            }

            if (!string.IsNullOrEmpty(email))
            {
                user.Email = email;
            }

            if (!string.IsNullOrEmpty(passwordHash))
            {
                user.PasswordHash = passwordHash;
            }

            if (!string.IsNullOrEmpty(dateBirth))
            {
                user.DateBirth = dateBirth;
            }

            if (!string.IsNullOrEmpty(avatar))
            {
                user.Avatar = avatar;
            }

            // 3. Сохраняем изменения в базе данных
            try
            {
                await _context.SaveChangesAsync();
                return true;
            }
            catch
            {
                return false;
            }
        }

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
                    userEntity.Email,
                    userEntity.PasswordHash,
                    userEntity.Name,
                    userEntity.SurName,
                    userEntity.Avatar,
                    userEntity.DateBirth,
                    userEntity.RegDate,
                    userEntity.Role.Id);

                return user;
            }
        }
    }
}