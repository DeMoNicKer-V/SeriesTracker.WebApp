﻿using Newtonsoft.Json;
using System.Text.RegularExpressions;


namespace SeriesTracker.Core.Models.Shikimori
{
    public class ShikimoriAnime: AnimeBase
    {
        [JsonProperty("airedOn")] public AiredDate airedOne = new();
        [JsonProperty("poster")] public Poster poster = new(); 
        [JsonProperty("genres")] public Genre[]? Genre { get; set; }

        [JsonIgnore]
        public override string Genres
        {
            get
            { return Genre != null ?  string.Join(", ", Genre.Select(l => l.Russian)) :""; }
            set { }
        }

        [JsonProperty("id")] public override int Id { get; set; }
        [JsonIgnore] public override string Description { get { return string.IsNullOrEmpty(description) ? description : Regex.Replace(description, @" ?\[.*?\]", " "); } set { } }
        [JsonProperty("duration")] public override double Duration { get; set; }
        [JsonProperty("episodes")] public int EpisodesInfo { get; set; }
        [JsonIgnore] public override int Episodes { get { return EpisodesInfo > 0 ? EpisodesInfo : 1; } set { } }

        [JsonIgnore] public override string Kind { get { return kindInfo != null ? kindInfo.ToUpper() : ""; } set { } }

        [JsonProperty("kind")] private string? kindInfo { get; set; }
        [JsonProperty("status")] public string? StatuscInfo { get; set; }

        [JsonIgnore]
        public override string Status
        {
            get { return ConvertStatusToDefault(StatuscInfo); }
            set { }
        }

        [JsonIgnore] public override string PictureUrl { get { return poster.MainUrl != null? poster.MainUrl: ""; } }

        [JsonIgnore]
        public override string Rating
        {
            get { return ConvertRatingToImageName(RatingInfo); }
            set { }
        }

        [JsonProperty("rating")] public string? RatingInfo { get; set; }
        [JsonProperty("score")] public override double Score { get; set; }

        [JsonIgnore]
        public override string StartDate
        {
            get
            {
                return airedOne.Date;
            }
            set { }
        }

        [JsonProperty("name")] public override string SubTitle { get; set; }
        [JsonProperty("russian")] public override string Title { get; set; }
        [JsonProperty("description")] private string description { get; set; }

        protected override string ConvertRatingToImageName(string ratingName)
        {
            switch (ratingName)
            {
                case "pg_13":
                    return "PG-13";

                case "pg":
                    return "PG";

                case "g":
                    return "G";

                case "r":
                    return "R-16";

                case "r_plus":
                    return "R+";

                case null: return "None";
                default:
                    return ratingName;
            }
        }

        protected override string ConvertStatusToDefault(string statusName)
        {
            switch (statusName)
            {
                case "anons":
                    return "Анонс";

                case "ongoing":
                    return "Онгоинг";

                case "released":
                    return "Вышло";

                case null: return "Неизвестно";
                default:
                    return statusName;
            }
        }
    }
}
