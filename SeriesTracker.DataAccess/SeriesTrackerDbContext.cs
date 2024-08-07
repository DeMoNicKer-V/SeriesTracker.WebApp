﻿using Microsoft.EntityFrameworkCore;
using SeriesTracker.DataAccess.Configurations;
using SeriesTracker.DataAccess.Entities;
using System.Reflection.Metadata;

namespace SeriesTracker.DataAccess
{
    public class SeriesTrackerDbContext : DbContext
    {
        public SeriesTrackerDbContext(DbContextOptions<SeriesTrackerDbContext> options) 
            : base(options)
        {
            
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            new SeriesConfiguration().Configure(modelBuilder.Entity<SeriesEntity>());
            new CategoryConfiguration().Configure(modelBuilder.Entity<CategoryEntity>());
        }

        public DbSet<SeriesEntity> SeriesEntities { get; set; }
        public DbSet<CategoryEntity> CategoryEntities { get; set; }
    }
}
