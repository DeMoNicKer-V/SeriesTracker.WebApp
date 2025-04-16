using Microsoft.AspNetCore.Mvc;
using SeriesTracker.API.Contracts;
using SeriesTracker.API.Extensions;
using SeriesTracker.Core.Abstractions;
using SeriesTracker.Core.Dtos.UserDtos;
using SeriesTracker.Core.Enums;
using SeriesTracker.Infrastructure.Authentication;

namespace SeriesTracker.API.Controllers
{
    // <summary>
    /// Контроллер для работы с пользователями.
    /// Предоставляет методы для работы с пользователями (CRUD).
    /// </summary>
    [ApiController]
    [Route("user")] // Атрибут, определяющий маршрут для контроллера
    public class UserController : ControllerBase
    {
        private readonly ILogger<UserController> _logger;
        private readonly IUserService _userService;

        /// <summary>
        /// Конструктор класса UserController.
        /// </summary>
        /// <param name="userService">Сервис для работы с пользователями.</param>
        /// <param name="logger">Логгер для записи информации о работе контроллера.</param>
        public UserController(IUserService userService, ILogger<UserController> logger)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger)); // Добавлена проверка на null
            _userService = userService ?? throw new ArgumentNullException(nameof(userService)); // Добавлена проверка на null
        }

        /// <summary>
        /// Изменяет роль пользователя.
        /// </summary>
        /// <param name="id">Идентификатор пользователя, роль которого необходимо изменить.</param>
        /// <param name="roleId">Идентификатор новой роли пользователя.</param>
        /// <returns>Результат выполнения операции.</returns>
        [RequirePermission(Permission.Create)] // Атрибут, указывающий, что для доступа к методу требуется разрешение 'Create'
        [HttpPut("changeRole/{id}")]
        public async Task<IResult> ChangeUserRole(Guid id, [FromBody] int roleId)
        {
            try
            {
                // Обновляем информацию о пользователе через сервис
                bool isUpdated = await _userService.ChangeUserRole(id, roleId);

                // Если обновление не произошло - логируем ошибку и возвращаем 400 Bad Request
                if (isUpdated == false)
                {
                    return _logger.BadResponse( 
                        logMessage: $"Failed to update user with Id: {id} to role ({roleId}).",
                        resultMessage: "Failed to update user role. Possible reasons: invalid roleId or user not found.");
                }

                // Логируем информацию об успешном обновлении серии и возвращаем 204 No Content
                return _logger.NoContentResponse(
                    loggerMessage: $"The role of user with ID:{id} has updated to: {roleId}.");
            }
            catch (Exception ex)
            {
                // Логируем ошибку и возвращаем 500 Internal Server Error
                return _logger.InternalServerError(ex, "An unexpected error occurred while updating user's role.");
            }
        }

        /// <summary>
        /// Удаляет аккаунт пользователя.
        /// </summary>
        /// <param name="userName">Имя пользователя, аккаунт которого необходимо удалить.</param>
        /// <returns>Результат выполнения операции.</returns>
        [RequirePermission(Permission.Update)] // Атрибут, указывающий, что для доступа к методу требуется разрешение 'Update'
        [HttpDelete("{userName}/deleteSelf")]
        public async Task<IResult> DeleteSelfAccount(string userName)
        {
            try
            {
                // Получаем информацию о пользователе по имени пользователя через сервис
                UserDetailDto? user = await _userService.GetUserByUserName(userName);

                // Если пользователь не найден - логируем предупреждение и возвращаем 404 Not Found
                if (user == null)
                {
                   return _logger.NotFoundResponse($"The user ({userName}) not found.");
                }

                // Удаляем пользователя через сервис
                bool isDeleted = await _userService.DeleteUser(user.Id);

                // Если удаления не произошло - логируем ошибку и выбрасываем исключение
                if (isDeleted == false)
                {
                    throw new Exception($"Failed to delete seft account of user ({userName}).");
                }

                Response.Cookies.Delete("secretCookie"); // удаляем куки

                // Логируем информацию об успешном удалении аккаунта и возвращаем 204 No Content
                return _logger.NoContentResponse(
                    loggerMessage: $"The user ({userName}) deleted his account.");
            }
            catch (Exception ex)
            {
                // Логируем ошибку и возвращаем 500 Internal Server Error
                return _logger.InternalServerError(ex, "An unexpected error occurred while deleting self account.");
            }
        }

        /// <summary>
        /// Удаляет аккаунт пользователя по имени пользователя.
        /// </summary>
        /// <param name="userName">Имя пользователя, аккаунт которого необходимо удалить.</param>
        /// <returns>Результат выполнения операции.</returns>
        [RequirePermission(Permission.Delete)] // Атрибут, указывающий, что для доступа к методу требуется разрешение 'Delete'
        [HttpDelete("{userName}/delete")]
        public async Task<IResult> DeleteUserByUserName(string userName)
        {
            try
            {
                // Получаем информацию о пользователе по имени пользователя через сервис
                UserDetailDto? user = await _userService.GetUserByUserName(userName);

                // Если пользователь не найден - логируем предупреждение и возвращаем 404 Not Found
                if (user == null)
                {
                    return _logger.NotFoundResponse($"The user ({userName}) not found.");
                }

                // Удаляем пользователя через сервис
                bool isDeleted = await _userService.DeleteUser(user.Id);

                // Если удаления не произошло - логируем ошибку и выбрасываем исключение
                if (isDeleted == false)
                {
                    throw new Exception($"Failed to delete user ({userName}).");
                }
                Response.Cookies.Delete("secretCookie"); // Удаляем куки

                // Логируем информацию об успешном удалении аккаунта и возвращаем 204 No Content
                return _logger.NoContentResponse(
                    loggerMessage: $"The user ({userName}) deleted his account.");
            }
            catch (Exception ex)
            {
                // Логируем ошибку и возвращаем 500 Internal Server Error
                return _logger.InternalServerError(ex, "An unexpected error occurred while deleting user account."); // Исправлена опечатка
            }
        }

        /// <summary>
        /// Получает информацию о пользователе по его идентификатору.
        /// </summary>
        /// <param name="id">Идентификатор пользователя.</param>
        /// <returns>Результат выполнения операции.</returns>
        [HttpGet("id/{id:guid}")]
        public async Task<IResult> GetUserById(Guid id)
        {
            try
            {
                // Получаем информацию о пользователе по идентификатору через сервис
                UserDetailDto? user = await _userService.GetUserById(id);

                // Если пользователь не найден - логируем предупреждение и возвращаем 404 Not Found
                if (user == null)
                {
                    return _logger.NotFoundResponse($"The user with Id: {id} not found.");
                }

                // Возвращаем информацию о пользователе с кодом 200 OK
                return Results.Ok(user);
            }
            catch (Exception ex)
            {
                // Логируем ошибку и возвращаем 500 Internal Server Error
                return _logger.InternalServerError(ex, "An unexpected error occurred while getting user by ID."); // Исправлено сообщение об ошибке
            }
        }

        [HttpGet("{page:int}")]
        public async Task<IResult> GetUsersList(int page = 1)
        {
            try
            {
                var (userList, totalCount) = await _userService.GetUserList(page);
                return Results.Ok(new { users = userList, totalCount });
            }
            catch (Exception ex)
            {
                // Логируем ошибку и возвращаем 500 Internal Server Error
                return _logger.InternalServerError(ex, "An unexpected error while getting user.");
            }
        }

        /// <summary>
        /// Обновляет информацию о пользователе.
        /// </summary>
        /// <param name="userName">Имя пользователя, информацию о котором необходимо обновить.</param>
        /// <param name="request">Запрос, содержащий данные для обновления пользователя.</param>
        /// <returns>Результат выполнения операции.</returns>
        [RequirePermission(Permission.Update)] // Атрибут, указывающий, что для доступа к методу требуется разрешение 'Update'
        [HttpPut("update/{userName}")]
        public async Task<IResult> UpdateUser(string userName, [FromBody] UserRequest request)
        {
            try
            {
                // Получаем информацию о пользователе по имени пользователя через сервис
                UserDetailDto? user = await _userService.GetUserByUserName(userName);

                // Если пользователь не найден - логируем предупреждение и возвращаем 404 Not Found
                if (user == null)
                {
                    return _logger.NotFoundResponse($"The user ({userName}) not found.");
                }

                // Обновляем информацию о пользователе через сервис
                bool isUpdated = await _userService.UpdateUser(
                    user.Id,
                    request.UserName,
                    request.Name,
                    request.SurName,
                    request.Email,
                    request.Password,
                    request.Avatar,
                    request.DateBirth);

                // Если обновление не произошло - логируем ошибку и выбрасываем исключение
                if (!isUpdated) // Инвертирована логика, т.к. isUpdated == false означает, что обновление не удалось
                {
                    _logger.LogError($"Failed to update user ({userName})."); // Логируем ошибку перед выбрасыванием исключения
                    throw new Exception($"Failed to update user ({userName}).");
                }

                // Если имя пользователя было изменено, генерируем новый токен и обновляем куки
                if (!string.IsNullOrEmpty(request.UserName))
                {
                    string token = await _userService.GenerateNewUserToken(request.UserName);
                    Response.Cookies.Append("secretCookie", token, new CookieOptions { HttpOnly = true, Secure = true }); // Обновляем куки
                }

                // Логируем информацию об успешном обновлении пользователя и возвращаем 204 No Content
                return _logger.NoContentResponse($"The User: ({userName}) has been updated.");
            }
            catch (Exception ex)
            {
                // Логируем ошибку и возвращаем 500 Internal Server Error
                return _logger.InternalServerError(ex, "An unexpected error occurred while updating user.");
            }
        }
    }
}