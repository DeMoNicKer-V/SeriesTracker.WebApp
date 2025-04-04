namespace SeriesTracker.Core.Dtos.Series
{
    public class SeriesProfileDTO
    {
        public List<SeriesGroupDto> CategoryGroups { get; set; } = [];
        public string LastFiveSeries { get; set; } = string.Empty;
    }
}