using Newtonsoft.Json;
using SeriesTracker.Core.Models;
using System.Text.RegularExpressions;

namespace SeriesTracker.Core.Models.Shikimori
{
    public partial class ShikimoriAnimeBase
    {
        [JsonProperty("poster")] public Poster Poster { get; set; } = new();
        [JsonProperty("airedOn")] public AiredDate AiredDate { get; set; } = new();
        [JsonProperty("genres")] public Genre[]? Genre { get; set; }
        [JsonProperty("id")] public int Id { get; set; }
        [JsonProperty("name")] public string? SubTitle { get; set; }
        [JsonProperty("russian")] public string? Title { get; set; }
        [JsonProperty("score")] public double Score { get; set; }
        [JsonProperty("description")] private string? DescriptionInfo { get; set; }
        [JsonProperty("duration")] public int Duration { get; set; }
        [JsonProperty("episodes")] public int EpisodesInfo { get; set; }
        [JsonProperty("episodesAired")] public int EpisodesAired { get; set; }
        [JsonProperty("kind")] private string? kindInfo { get; set; }
        [JsonProperty("status")] private string? StatuscInfo { get; set; }
        [JsonProperty("rating")] private string? RatingInfo { get; set; }


        [JsonIgnore] public string Genres => Genre != null ? string.Join(", ", Genre.Select(l => l.Russian)) : "";
        [JsonIgnore] public int Episodes { get { return StatuscInfo == "ongoing" ? EpisodesAired : EpisodesInfo; } set { } }
        [JsonIgnore] public string? Description { get { return string.IsNullOrEmpty(DescriptionInfo) ? null : AnimeConverter.ConvertDescriptionWithRegex(DescriptionInfo); } }
        [JsonIgnore] public string? PictureUrl { get { return Poster?.Url; } }
        [JsonIgnore] public string? StartDate => AiredDate.Date;
        [JsonIgnore] public string Rating => AnimeConverter.ConvertRatingToImageName(RatingInfo);
        [JsonIgnore] public string Kind => AnimeConverter.ConvertKindToRussian(kindInfo);
        [JsonIgnore] public string Status => AnimeConverter.ConvertStatusToDefault(StatuscInfo);

    }
}