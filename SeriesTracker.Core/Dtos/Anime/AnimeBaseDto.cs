using Newtonsoft.Json;
using SeriesTracker.Core.Interfaces;
using SeriesTracker.Core.Models.Shikimori;

namespace SeriesTracker.Core.Dtos
{
    public class AnimeBaseDto : IAnime
    {
        [JsonProperty("airedOn")]
        private AiredDate AiredOn { get; set; } = new();

        [JsonProperty("poster")]
        private Poster? Poster { get; set; } = new();

        [JsonProperty("id")]
        public int Id { get; set; }

        [JsonProperty("name")]
        public string? SubTitle { get; set; }

        [JsonProperty("russian")]
        public string? Title { get; set; }

        [JsonProperty("episodes")]
        public int Episodes { get; set; }

        [JsonProperty("episodesAired")]
        public int EpisodesAired { get; set; }

        [JsonIgnore]
        public string? PictureUrl => Poster?.Url; // Вычисляемое свойство

        [JsonIgnore]
        public string? StartDate => AiredOn.Date ?? AiredOn.Year; // Вычисляемое свойство
    }
}
