using GraphQL;
using SeriesTracker.Core.Models.Shikimori;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace SeriesTracker.Core.Abstractions
{
    internal interface IShikimoriService
    {
        Task<GraphQLResponse<ShikimoriAnimeList>> GetAnimes();
        Task<GraphQLResponse<ShikimoriAnimeList>> GetAnimesByName();
    }
}
