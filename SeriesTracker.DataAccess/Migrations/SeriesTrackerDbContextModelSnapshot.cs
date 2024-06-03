﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;
using SeriesTracker.DataAccess;

#nullable disable

namespace SeriesTracker.DataAccess.Migrations
{
    [DbContext(typeof(SeriesTrackerDbContext))]
    partial class SeriesTrackerDbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.4")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("SeriesTracker.DataAccess.Entities.SeriesEntity", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<string>("AddedDate")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<int>("AnimeId")
                        .HasColumnType("integer");

                    b.Property<string>("ChangedDate")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Description")
                        .HasColumnType("text");

                    b.Property<int>("Duration")
                        .HasColumnType("integer");

                    b.Property<string>("HiddenTitle")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("ImagePath")
                        .HasColumnType("text");

                    b.Property<bool>("IsFavorite")
                        .HasColumnType("boolean");

                    b.Property<bool>("IsOver")
                        .HasColumnType("boolean");

                    b.Property<int>("LastEpisode")
                        .HasColumnType("integer");

                    b.Property<string>("OverDate")
                        .HasColumnType("text");

                    b.Property<float>("Rating")
                        .HasColumnType("real");

                    b.Property<string>("ReleaseDate")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<int>("WatchedEpisode")
                        .HasColumnType("integer");

                    b.HasKey("Id");

                    b.ToTable("SeriesEntities");
                });
#pragma warning restore 612, 618
        }
    }
}
