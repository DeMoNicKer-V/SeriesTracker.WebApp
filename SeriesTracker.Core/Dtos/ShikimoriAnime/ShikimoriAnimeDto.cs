using Newtonsoft.Json;
using SeriesTracker.Core.Interfaces;

namespace SeriesTracker.Core.Dtos
{
    /// <summary>
    /// DTO, представляющий аниме, полученное из API Shikimori, с базовой информацией.
    /// Наследуется от <see cref="AnimeBaseDto"/> и реализует интерфейс <see cref="IShikimoriAnime"/>.
    /// </summary>
    public class ShikimoriAnimeDto : AnimeBaseDto, IShikimoriAnime
    {
        /// <summary>
        /// Рейтинг аниме на Shikimori.
        /// </summary>
        [JsonProperty("score")]
        public double Score { get; set; }

        /// <summary>
        /// Описание аниме.
        /// </summary>
        [JsonProperty("description")]
        public string? Description { get; set; }

        /// <summary>
        /// Продолжительность одного эпизода аниме в минутах.
        /// </summary>
        [JsonProperty("duration")]
        public int Duration { get; set; }

        /// <summary>
        /// Статус аниме (например, "Онгоинг", "Вышел").
        /// </summary>
        [JsonProperty("status")]
        public string? Status { get; set; }

        /// <summary>
        /// Рейтинг возрастного ограничения аниме (например, "PG-13", "R-17").
        /// </summary>
        [JsonProperty("rating")]
        public string? Rating { get; set; }

        /// <summary>
        /// Общее количество эпизодов в аниме.
        /// </summary>
        [JsonProperty("episodes")]
        public int Episodes { get; set; }

        /// <summary>
        /// Количество вышедших эпизодов аниме.
        /// </summary>
        [JsonProperty("episodesAired")]
        public int EpisodesAired { get; set; }
    }
}