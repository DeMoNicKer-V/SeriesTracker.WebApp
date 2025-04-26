using Newtonsoft.Json;
using SeriesTracker.Core.Dtos;

namespace SeriesTracker.Core.Models.Shikimori
{
    /// <summary>
    /// Представляет информацию о связанном аниме.
    /// </summary>
    public class Related
    {
        /// <summary>
        /// Информация об аниме.
        /// </summary>
        [JsonProperty("anime")]
        public AnimeBaseDto? Anime { get; set; }

        /// <summary>
        /// Текст, описывающий связь между аниме.
        /// </summary>
        [JsonProperty("relationText")]
        public string? RelationText { get; set; }
    }
}