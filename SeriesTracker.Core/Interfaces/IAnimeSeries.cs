namespace SeriesTracker.Core.Interfaces
{
    /// <summary>
    /// Определяет контракт для объектов, представляющих аниме с информацией о категориях.
    /// </summary>
    public interface IAnimeSeries
    {
        /// <summary>
        /// Идентификатор категории, к которой относится аниме.
        /// </summary>
        int CategoryId { get; set; }

        /// <summary>
        /// Название категории, к которой относится аниме.
        /// </summary>
        string CategoryName { get; set; }

        /// <summary>
        /// Цвет категории, к которой относится аниме.
        /// </summary>
        string CategoryColor { get; set; }
    }
}
