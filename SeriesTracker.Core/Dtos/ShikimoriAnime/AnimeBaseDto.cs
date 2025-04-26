using Newtonsoft.Json;
using SeriesTracker.Core.Interfaces;
using SeriesTracker.Core.Models.Shikimori;

namespace SeriesTracker.Core.Dtos
{
    /// <summary>
    /// Представляет базовую информацию об аниме.
    /// Реализует интерфейс <see cref="IAnime"/>.
    /// </summary>
    public class AnimeBaseDto : IAnime
    {
        /// <summary>
        /// Уникальный идентификатор аниме.
        /// </summary>
        [JsonProperty("id")]
        public int Id { get; set; }



        /// <summary>
        /// URL адрес изображения постера аниме.
        /// </summary>
        // Вычисляется на основе Poster?.Url.
        [JsonIgnore]
        public string? PictureUrl => Poster?.Url;

        /// <summary>
        /// Дата начала показа аниме.
        /// </summary>
        // Вычисляется на основе AiredOn.StartDate.
        [JsonIgnore]
        public string? StartDate => AiredOn.StartDate;

        /// <summary>
        /// Альтернативное название аниме.
        /// </summary>
        [JsonProperty("name")]
        public string? SubTitle { get; set; }

        /// <summary>
        /// Основное название аниме.
        /// </summary>
        [JsonProperty("russian")]
        public string? Title { get; set; }

        /// <summary>
        /// Информация о дате выхода аниме.
        /// </summary>
        [JsonProperty("airedOn")]
        private AiredDate AiredOn { get; set; } = new();

        /// <summary>
        /// Информация о типе аниме (например, ТВ, фильм, OVA).
        /// </summary>
        [JsonProperty("kind")]
        public string? Kind { get; set; }

        /// <summary>
        /// Информация о постере аниме.
        /// </summary>
        [JsonProperty("poster")]
        private Poster? Poster { get; set; } = new();
    }
}