﻿namespace SeriesTracker.API.Contracts
{
    public record ShikimoriRequest
 (
        string Title,
        string? Description,
        int WatchedEpisode,
        int LastEpisode,
        int Duration,
        float Rating,
        string? ImagePath,
        string ReleaseDate,
        string? AddedDate,
        string? OverDate,
        string? ChangedDate,
        bool IsOver,
        bool IsFavorite
    );
}
