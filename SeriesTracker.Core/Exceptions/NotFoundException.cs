namespace SeriesTracker.Core.Exceptions
{
    /// <summary>
    /// Исключение, которое выбрасывается, когда запрошенный ресурс не найден.
    /// </summary>
    public class NotFoundException : Exception
    {
        /// <summary>
        /// Инициализирует новый экземпляр класса <see cref="NotFoundException"/>.
        /// </summary>
        public NotFoundException()
        {
        }

        /// <summary>
        /// Инициализирует новый экземпляр класса <see cref="NotFoundException"/> с указанным сообщением об ошибке.
        /// </summary>
        /// <param name="message">Сообщение об ошибке, описывающее причину исключения.</param>
        public NotFoundException(string message)
            : base(message)
        {
        }

        /// <summary>
        /// Инициализи.</param>
        /// <param name="innerException">Внутреннее исключение, которое является причиной данного исключения.</param>
        public NotFoundException(string message, Exception innerException)
            : base(message, innerException)
        {
        }
    }
}