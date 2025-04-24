using Newtonsoft.Json;

namespace SeriesTracker.Core.Models.Shikimori
{
    public class AiredDate
    {
        public string? StartDate => DateInfo ?? YearInfo;

        [JsonProperty("date")]
        private string? DateInfo { get; set; }

        [JsonProperty("year")]
        private string? YearInfo { get; set; }
    }
}