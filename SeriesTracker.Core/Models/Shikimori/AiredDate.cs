using Newtonsoft.Json;

namespace SeriesTracker.Core.Models.Shikimori
{
    /// <summary>
    /// Представляет информацию о дате выхода аниме.
    /// </summary>
    public class AiredDate
    {
        /// <summary>
        /// Возвращает дату начала показа аниме.
        /// </summary>
        public string? StartDate => DateInfo ?? YearInfo;

        /// <summary>
        /// Полная дата начала показа аниме (например, "2023-10-27").
        /// </summary>
        [JsonProperty("date")]
        private string? DateInfo { get; set; }

        /// <summary>
        /// Год начала показа аниме (например, "2023").
        /// </summary>
        [JsonProperty("year")]
        private string? YearInfo { get; set; }
    }
}