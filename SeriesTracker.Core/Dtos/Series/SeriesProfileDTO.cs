namespace SeriesTracker.Core.Dtos
{
    public class SeriesProfileDTO
    {
        public List<SeriesGroupDto> CategoryGroups { get; set; } = [];
        public string LastFiveSeries { get; set; } = string.Empty;
    }
}