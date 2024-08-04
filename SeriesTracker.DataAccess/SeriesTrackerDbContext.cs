using Microsoft.EntityFrameworkCore;
using SeriesTracker.DataAccess.Entities;

namespace SeriesTracker.DataAccess
{
    public class SeriesTrackerDbContext : DbContext
    {
        public SeriesTrackerDbContext(DbContextOptions<SeriesTrackerDbContext> options) 
            : base(options)
        {
            
        }

        public DbSet<SeriesEntity> SeriesEntities { get; set; }
        public DbSet<CategoryEntity> CategoryEntities { get; set; }
    }
}
