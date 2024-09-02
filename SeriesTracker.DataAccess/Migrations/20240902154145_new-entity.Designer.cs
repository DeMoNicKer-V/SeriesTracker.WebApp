﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;
using SeriesTracker.DataAccess;

#nullable disable

namespace SeriesTracker.DataAccess.Migrations
{
    [DbContext(typeof(SeriesTrackerDbContext))]
    [Migration("20240902154145_new-entity")]
    partial class newentity
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.4")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("SeriesTracker.DataAccess.Entities.AccessLevelEntity", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.ToTable("AccessLevelEntities");

                    b.HasData(
                        new
                        {
                            Id = 1,
                            Description = "Полный доступ ко всем функциям приложения",
                            Name = "Полный"
                        },
                        new
                        {
                            Id = 2,
                            Description = "Ограниченный доступ ко всем функциям приложения",
                            Name = "Ограниченный"
                        },
                        new
                        {
                            Id = 3,
                            Description = "Доступ к базовым функциям приложения. Доступен всем по умолчанию",
                            Name = "Пользовательский"
                        });
                });

            modelBuilder.Entity("SeriesTracker.DataAccess.Entities.CategoryEntity", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<string>("Color")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Date")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("PrevColor")
                        .HasColumnType("text");

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.ToTable("CategoryEntities");

                    b.HasData(
                        new
                        {
                            Id = 1,
                            Color = "#6DBA91",
                            Date = "2024-09-02T18:41:45",
                            Title = "Запланировано"
                        },
                        new
                        {
                            Id = 2,
                            Color = "#4DA8DA",
                            Date = "2024-09-02T18:41:45",
                            Title = "Смотрю"
                        },
                        new
                        {
                            Id = 3,
                            Color = "#F9A602",
                            Date = "2024-09-02T18:41:45",
                            Title = "Просмотрено"
                        },
                        new
                        {
                            Id = 4,
                            Color = "#999999",
                            Date = "2024-09-02T18:41:45",
                            Title = "Отложено"
                        },
                        new
                        {
                            Id = 5,
                            Color = "#E74C3C",
                            Date = "2024-09-02T18:41:45",
                            Title = "Брошено"
                        });
                });

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

                    b.Property<int>("CategoryId")
                        .HasColumnType("integer");

                    b.Property<string>("ChangedDate")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<bool>("IsFavorite")
                        .HasColumnType("boolean");

                    b.Property<int>("WatchedEpisode")
                        .HasColumnType("integer");

                    b.HasKey("Id");

                    b.ToTable("SeriesEntities");
                });

            modelBuilder.Entity("SeriesTracker.DataAccess.Entities.UserEntity", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<string>("Avatar")
                        .HasColumnType("text");

                    b.Property<string>("DateOfBirth")
                        .HasColumnType("text");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Name")
                        .HasColumnType("text");

                    b.Property<string>("PasswordHash")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("RegistrationDate")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Surname")
                        .HasColumnType("text");

                    b.Property<string>("UserName")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<int>("UserRoleId")
                        .HasColumnType("integer");

                    b.HasKey("Id");

                    b.ToTable("UserEntities");
                });

            modelBuilder.Entity("SeriesTracker.DataAccess.Entities.UserRoleEntity", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<int>("AccessLevelId")
                        .HasColumnType("integer");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.ToTable("UserRoleEntities");

                    b.HasData(
                        new
                        {
                            Id = 1,
                            AccessLevelId = 1,
                            Name = "Администратор"
                        },
                        new
                        {
                            Id = 2,
                            AccessLevelId = 2,
                            Name = "Модератор"
                        },
                        new
                        {
                            Id = 3,
                            AccessLevelId = 3,
                            Name = "Пользователь"
                        });
                });
#pragma warning restore 612, 618
        }
    }
}
