﻿namespace SeriesTracker.Core.Interfaces
{
    /// <summary>
    /// Расширяет интерфейс <see cref="IAnime"/>, добавляя новые свойства.
    /// </summary>
    public interface IShikimoriAnime : IAnime
    {
        /// <summary>
        /// Описание аниме.
        /// </summary>
        string? Description { get; set; }

        /// <summary>
        /// Продолжительность одного эпизода аниме в минутах.
        /// </summary>
        int Duration { get; set; }

        /// <summary>
        /// Общее количество эпизодов в аниме.
        /// </summary>
        int Episodes { get; set; }

        /// <summary>
        /// Количество вышедших эпизодов аниме.
        /// </summary>
        int EpisodesAired { get; set; }

        /// <summary>
        /// Рейтинг возрастного ограничения аниме (например, "PG-13", "R-17").
        /// </summary>
        string? Rating { get; set; }

        /// <summary>
        /// Рейтинг аниме на Shikimori.
        /// </summary>
        double Score { get; set; }

        /// <summary>
        /// Статус аниме (например, "Онгоинг", "Вышел").
        /// </summary>
        string? Status { get; set; }
    }
}