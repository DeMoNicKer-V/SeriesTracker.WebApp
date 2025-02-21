using System.Text.RegularExpressions;

namespace SeriesTracker.Core
{
    public static partial class AnimeConverter
    {
        [GeneratedRegex(@"\[.*?\]")]
        private static partial Regex DescriptionFormatRegex();

        [GeneratedRegex(@"\s+")]
        private static partial Regex MultipleSpacesFormatRegex();

        public static string ConvertDescriptionWithRegex(string description)
        {
            if (string.IsNullOrEmpty(description)) return description;

            var matches = DescriptionFormatRegex().Matches(description);
            string result = description;

            foreach (Match match in matches.Cast<Match>().Reverse())
            {
                string matchedString = match.Value;

                //Извлекаем текст внутри скобок
                var insideBrackets = Regex.Match(matchedString, @"\=(.*?)\/").Groups[1].Value;

                //Заменяем весь тег на текст внутри
                result = result.Replace(matchedString, insideBrackets);

            }

            return MultipleSpacesFormatRegex().Replace(result, " ").Trim();
        }


        public static string ConvertStatusToDefault(string? statusName)
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

        public static string ConvertRatingToImageName(string? ratingName)
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

        public static string ConvertKindToRussian(string? kindName)
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


    }
}
