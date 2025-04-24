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

        [JsonProperty("kind")]
        private string? KindInfo { get; set; }

        [JsonProperty("id")]
        public int Id { get; set; }

        [JsonProperty("name")]
        public string? SubTitle { get; set; }

        [JsonProperty("russian")]
        public string? Title { get; set; }

        [JsonIgnore]
        public string Kind => AnimeConverter.ConvertKindToRussian(KindInfo); // Вычисляемое свойство

        [JsonIgnore]
        public string? PictureUrl => Poster?.Url; // Вычисляемое свойство

        [JsonIgnore]
        public string? StartDate => AiredOn.StartDate ?? "Неизвестно"; // Вычисляемое свойство
    }
}
