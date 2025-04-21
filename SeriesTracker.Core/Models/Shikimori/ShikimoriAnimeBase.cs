using Newtonsoft.Json;
using System.Collections.ObjectModel;

namespace SeriesTracker.Core.Models.Shikimori
{

    public partial class ShikimoriAnimeBase : AnimeBase
    {
        private static readonly ReadOnlyCollection<string> sourceArray = new ReadOnlyCollection<string>(new string[] { "MUSIC", "PV", "CM" });

        [JsonProperty("airedOn")]
        public AiredDate AiredDate { get; set; } = new();

        [JsonProperty("genres")]
        public Genre[]? Genre { get; set; }

        [JsonProperty("score")]
        public double Score { get; set; }

        [JsonProperty("description")]
        private string? DescriptionInfo { get; set; }

        [JsonProperty("duration")]
        public int Duration { get; set; }

        [JsonProperty("episodes")]
        public int EpisodesInfo { get; set; }

        [JsonProperty("episodesAired")]
        public int EpisodesAired { get; set; }

        [JsonProperty("kind")]
        private string? kindInfo { get; set; }

        [JsonProperty("status")]
        private string? StatuscInfo { get; set; }

        [JsonProperty("rating")]
        private string? RatingInfo { get; set; }

        [JsonProperty("screenshots")]
        public Screenshot[]? Screenshots { get; set; }

        [JsonProperty("related")]
        private Related[]? RelatedData { get; set; }

        [JsonIgnore]
        public string Genres => Genre != null ? string.Join(", ", Genre.Select(l => l.Russian)) : "";

        [JsonIgnore]
        public int Episodes => EpisodesInfo == 0 ? EpisodesAired : EpisodesInfo;

        [JsonIgnore]
        public string? StartDate => AiredDate.Date ?? AiredDate.Year;

        [JsonIgnore]
        public string? Description => ConvertDescription(DescriptionInfo);

        [JsonIgnore]
        public string Rating => ConvertRating(RatingInfo);

        [JsonIgnore]
        public string Kind => ConvertKind(kindInfo);

        [JsonIgnore]
        public string Status => ConvertStatus(StatuscInfo);

        [JsonIgnore]
        public IEnumerable<Related>? Relateds => GetRelateds(RelatedData);

        private string? ConvertDescription(string? descriptionInfo)
        {
            return string.IsNullOrEmpty(descriptionInfo) ? null : AnimeConverter.ConvertDescriptionWithRegex(descriptionInfo);
        }

        private string ConvertRating(string? ratingInfo)
        {
            return AnimeConverter.ConvertRatingToImageName(ratingInfo);
        }

        private string ConvertKind(string? kindInfo)
        {
            return AnimeConverter.ConvertKindToRussian(kindInfo);
        }

        private string ConvertStatus(string? statuscInfo)
        {
            return AnimeConverter.ConvertStatusToDefault(statuscInfo);
        }

        private IEnumerable<Related>? GetRelateds(Related[]? relatedData)
        {
            if (relatedData == null) return null;

            return relatedData.Where(a => a.Anime != null && !sourceArray.Any(c => a.Anime.Kind?.Contains(c) == true));
        }
    }
}