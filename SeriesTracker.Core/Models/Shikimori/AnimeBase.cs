using Newtonsoft.Json;
using SeriesTracker.Core.Interfaces;

namespace SeriesTracker.Core.Models.Shikimori
{
    public abstract class AnimeBase : IAnime
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