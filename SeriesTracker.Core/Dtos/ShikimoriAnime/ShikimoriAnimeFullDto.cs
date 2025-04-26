using Newtonsoft.Json;
using SeriesTracker.Core.Interfaces;
using SeriesTracker.Core.Models.Shikimori;

namespace SeriesTracker.Core.Dtos
{
    /// <summary>
    /// DTO, представляющий полную информацию об аниме, полученную из API Shikimori.
    /// Наследуется от <see cref="ShikimoriAnimeDto"/> и реализует интерфейс <see cref="IShikimoriAnimeFull"/>.
    /// </summary>
    public class ShikimoriAnimeFullDto : ShikimoriAnimeDto, IShikimoriAnimeFull
    {
        /// <summary>
        /// Массив жанров аниме.
        /// </summary>
        [JsonProperty("genres")]
        public Genre[]? Genres { get; set; }

        /// <summary>
        /// Массив скриншотов из аниме.
        /// </summary>
        [JsonProperty("screenshots")]
        public Screenshot[]? Screenshots { get; set; }

        /// <summary>
        /// Массив связанных аниме.
        /// </summary>
        [JsonProperty("related")]
        public Related[]? Relateds { get; set; }
    }
}