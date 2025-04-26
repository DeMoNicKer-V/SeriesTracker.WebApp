using SeriesTracker.Core.Interfaces;

namespace SeriesTracker.Core.Models.Shikimori
{
    /// <summary>
    /// Реализует интерфейс <see cref="IShikimoriAnime"/>.
    /// Наследуется от <see cref="AnimeBase"/>, чтобы унаследовать общие свойства.
    /// </summary>
    public partial class ShikimoriAnime : AnimeBase, IShikimoriAnime
    {
        /// <summary>
        /// Описание аниме.
        /// </summary>
        public string? Description { get; set; }

        /// <summary>
        /// Продолжительность одного эпизода аниме в минутах.
        /// </summary>
        public int Duration { get; set; }

        /// <summary>
        /// Общее количество эпизодов в аниме.
        /// </summary>
        public int Episodes { get; set; }

        /// <summary>
        /// Количество вышедших в эфир эпизодов аниме.
        /// </summary>
        public int EpisodesAired { get; set; }

        /// <summary>
        /// Рейтинг возрастного ограничения аниме (например, "PG-13", "R-17").
        /// </summary>
        public string? Rating { get; set; }

        /// <summary>
        /// Рейтинг аниме на Shikimori.
        /// </summary>
        public double Score { get; set; }

        /// <summary>
        /// Статус аниме (например, "Онгоинг", "Вышел").
        /// </summary>
        public string? Status { get; set; }
    }
}