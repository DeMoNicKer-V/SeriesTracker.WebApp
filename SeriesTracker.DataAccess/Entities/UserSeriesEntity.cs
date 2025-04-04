using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SeriesTracker.DataAccess.Entities
{
    public class UserSeriesEntity
    {
        [Key]
        public Guid Id { get; set; }

        public int AnimeId { get; set; }

        [ForeignKey("User")]
        public Guid UserId { get; set; }

        [ForeignKey("Category")]
        public int CategoryId { get; set; }

        public int WatchedEpisode
        {
            get; set;
        } = 0;

        public string AddedDate
        {
            get; set;
        } = string.Empty;

        public string ChangedDate
        {
            get; set;
        } = string.Empty;

        public bool IsFavorite
        {
            get; set;
        } = false;

        [Required]
        public virtual UserEntity User { get; set; }

        [Required]
        public virtual CategoryEntity Category { get; set; }
    }
}