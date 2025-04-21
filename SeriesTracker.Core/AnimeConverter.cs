using System.Text.RegularExpressions;

namespace SeriesTracker.Core
{
    /// <summary>
    /// Статический класс-конвертер для преобразования данных аниме.
    /// Предоставляет методы для форматирования описаний, статусов, рейтингов и типов аниме.
    /// </summary>
    public static partial class AnimeConverter
    {
        /// <summary>
        /// Регулярное выражение для поиска тегов форматирования в описании.
        /// </summary>
        [GeneratedRegex(@"\[.*?\]")]
        private static partial Regex DescriptionFormatRegex();

        /// <summary>
        /// Регулярное выражение для удаления множественных пробелов.
        /// </summary>
        [GeneratedRegex(@"\s+")]
        private static partial Regex MultipleSpacesFormatRegex();

        /// <summary>
        /// Преобразует описание аниме, удаляя теги форматирования и множественные пробелы.
        /// </summary>
        /// <param name="description">Описание аниме, которое необходимо преобразовать.</param>
        /// <returns>Преобразованное описание аниме.</returns>
        public static string ConvertDescriptionWithRegex(string description)
        {
            if (string.IsNullOrEmpty(description)) return description;

            var matches = DescriptionFormatRegex().Matches(description);
            string result = description;

            foreach (Match match in matches.Cast<Match>().Reverse())
            {
                string matchedString = match.Value;

                // Извлекаем текст внутри скобок
                var insideBrackets = Regex.Match(matchedString, @"\=(.*?)\/").Groups[1].Value;

                // Заменяем весь тег на текст внутри
                result = result.Replace(matchedString, insideBrackets);

            }

            // Удаляем множественные пробелы и обрезаем лишние пробелы в начале и конце строки
            return MultipleSpacesFormatRegex().Replace(result, " ").Trim();
        }

        /// <summary>
        /// Преобразует статус аниме из английского в русский.
        /// </summary>
        /// <param name="statusName">Статус аниме на английском языке.</param>
        /// <returns>Статус аниме на русском языке или "Неизвестно", если статус не распознан.</returns>
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

        /// <summary>
        /// Преобразует рейтинг аниме в название файла изображения рейтинга.
        /// </summary>
        /// <param name="ratingName">Рейтинг аниме на английском языке.</param>
        /// <returns>Название файла изображения рейтинга или "Неизвестно", если рейтинг не распознан.</returns>
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

        /// <summary>
        /// Преобразует тип аниме из английского в русский.
        /// </summary>
        /// <param name="kindName">Тип аниме на английском языке.</param>
        /// <returns>Тип аниме на русском языке или в верхнем регистре, если тип не распознан.</returns>
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
