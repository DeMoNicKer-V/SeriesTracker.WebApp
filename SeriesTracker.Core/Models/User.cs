namespace SeriesTracker.Core.Models
{
    /// <summary>
    /// Представляет модель пользователя в системе.
    /// </summary>
    public class User
    {
        /// <summary>
        /// Конструктор для создания экземпляра класса <see cref="User"/>.
        /// </summary>
        /// <param name="id">Уникальный идентификатор пользователя.</param>
        /// <param name="userName">Имя пользователя (логин).</param>
        /// <param name="email">Адрес электронной почты пользователя.</param>
        /// <param name="passwordHash">Хеш пароля пользователя.</param>
        /// <param name="name">Имя пользователя.</param>
        /// <param name="surName">Фамилия пользователя.</param>
        /// <param name="avatar">URL аватара пользователя.</param>
        /// <param name="dateBirth">Дата рождения пользователя.</param>
        /// <param name="regDate">Дата регистрации пользователя.</param>
        /// <param name="roleId">Идентификатор роли пользователя.</param>
        private User(Guid id, string userName, string email, string passwordHash, string? name, string? surName,  string? avatar, string? dateBirth, string regDate, int roleId)
        {
            this.Id = id;
            this.UserName = userName;
            this.Email = email;
            this.PasswordHash = passwordHash;
            this.Name = name;
            this.SurName = surName;
            this.Avatar = avatar;
            this.DateBirth = dateBirth;
            this.RegDate = regDate;
            this.RoleId = roleId;
        }

        /// <summary>
        /// URL аватара пользователя.
        /// </summary>
        public string? Avatar
        {
            get; private set;
        }

        /// <summary>
        /// Дата рождения пользователя.
        /// </summary>
        public string? DateBirth
        {
            get; private set;
        }

        /// <summary>
        /// Адрес электронной почты пользователя.
        /// </summary>
        public string Email
        {
            get; private set;
        }

        /// <summary>
        /// Уникальный идентификатор пользователя.
        /// </summary>
        public Guid Id
        {
            get; private set;
        }
        /// <summary>
        /// Имя пользователя.
        /// </summary>
        public string? Name
        {
            get; private set;
        }

        /// <summary>
        /// Хеш пароля пользователя.
        /// </summary>
        public string PasswordHash
        {
            get; private set;
        }

        /// <summary>
        /// Дата регистрации пользователя.
        /// </summary>
        public string RegDate
        {
            get; private set;
        }

        /// <summary>
        /// Идентификатор роли пользователя.
        /// </summary>
        public int RoleId
        {
            get; private set;
        }

        /// <summary>
        /// Фамилия пользователя.
        /// </summary>
        public string? SurName
        {
            get; private set;
        }

        /// <summary>
        /// Имя пользователя (логин).
        /// </summary>
        public string UserName
        {
            get; private set;
        }
        /// <summary>
        /// Фабричный метод для создания экземпляра класса <see cref="User"/>.
        /// </summary>
        /// <param name="id">Уникальный идентификатор пользователя.</param>
        /// <param name="userName">Имя пользователя (логин).</param>
        /// <param name="email">Адрес электронной почты пользователя.</param>
        /// <param name="passwordHash">Хеш пароля пользователя.</param>
        /// <param name="name">Имя пользователя.</param>
        /// <param name="surName">Фамилия пользователя.</param>
        /// <param name="avatar">URL аватара пользователя.</param>
        /// <param name="dateBirth">Дата рождения пользователя.</param>
        /// <param name="regDate">Дата регистрации пользователя.</param>
        /// <param name="roleId">Идентификатор роли пользователя.</param>
        /// <returns>Новый экземпляр класса <see cref="User"/>.</returns>
        public static User Create(Guid id, string userName, string email, string passwordHash, string? name, string? surName, string? avatar, string? dateBirth, string regDate, int roleId = 3)
        {
            return new User(id, userName, email, passwordHash, name, surName, avatar, dateBirth, regDate, roleId);
        }
    }
}