using SeriesTracker.Core.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;

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


        public virtual UserEntity User { get; set; }
        public virtual CategoryEntity? Category { get; set; }


    }
}
