using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SeriesTracker.Core.Models
{
    public class UserSeries
    {
        public Guid Id { get; set; }

        public int AnimeId { get; set; }

        public Guid UserId { get; set; } // ID пользователя

        public int CategoryId { get; set; } // ID категории

        public string AddedDate
        {
            get; set;
        } = string.Empty;

        public string ChangedDate
        {
            get; set;
        } = string.Empty;

        public int WatchedEpisode { get; set; } = 0;

        public bool IsFavorite { get; set; } = false;
    }
}
