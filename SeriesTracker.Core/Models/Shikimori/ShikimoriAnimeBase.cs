﻿using Newtonsoft.Json;
using SeriesTracker.Core.Models;
using System.Text.RegularExpressions;

namespace SeriesTracker.Core.Models.Shikimori
{
    public class ShikimoriAnimeBase
    {
        public readonly Poster Poster = new();

        [JsonProperty("airedOn")] public readonly AiredDate AiredDate = new();
        [JsonProperty("genres")] public Genre[]? Genre { get; set; }
        [JsonProperty("id")] public int Id { get; set; }
        [JsonProperty("description")] private string? description { get; set; }
        [JsonProperty("duration")] public double Duration { get; set; }
        [JsonProperty("episodes")] public int EpisodesInfo { get; set; }
        [JsonProperty("episodesAired")] public int EpisodesAired { get; set; }
        [JsonProperty("kind")] private string? kindInfo { get; set; }
        [JsonProperty("status")] private string? StatuscInfo { get; set; }
        [JsonProperty("rating")] private string? RatingInfo { get; set; }


        [JsonIgnore] public string Genres => Genre != null ? string.Join(", ", Genre.Select(l => l.Russian)) : "";
        [JsonProperty("name")] public string? SubTitle { get; set; }
        [JsonProperty("russian")] public string? Title { get; set; }
        [JsonProperty("score")] public double Score { get; set; }
        [JsonIgnore] public int Episodes { get { return EpisodesInfo > 0 ? EpisodesInfo : 1; } set { } }
        [JsonIgnore] public string? Description { get { return string.IsNullOrEmpty(description) ? description : Regex.Replace(description, @" ?\[.*?\]", " "); } }
        [JsonIgnore] public string? PictureUrl { get { return Poster != null ? Poster.Url : null; } }
        [JsonIgnore] public string? StartDate => AiredDate.Date;
        [JsonIgnore] public string Rating => ConvertRatingToImageName(RatingInfo);
        [JsonIgnore] public string Kind => ConvertKindToRussian(kindInfo);
        [JsonIgnore] public string Status => ConvertStatusToDefault(StatuscInfo);


        private static string ConvertRatingToImageName(string? ratingName)
        {
            return ratingName switch
            {
                "pg_13" => "PG-13",
                "pg" => "PG",
                "g" => "G",
                "r" => "R-16",
                "r_plus" => "R+",
                null => "Неизвестно",
                _ => ratingName,
            };
        }

        private static string ConvertKindToRussian(string? kindName)
        {
            return kindName switch
            {
                "tv" => "TV-Сериал",
                "movie" => "Фильм",
                "special" => "Спешл",
                "tv_special" => "TV-Спешл",
                null => "Неизвестно",
                _ => kindName.ToUpper(),
            };
        }

        private static string ConvertStatusToDefault(string? statusName)
        {
            return statusName switch
            {
                "anons" => "Анонс",
                "ongoing" => "Онгоинг",
                "released" => "Вышло",
                null => "Неизвестно",
                _ => statusName,
            };
        }
    }
}