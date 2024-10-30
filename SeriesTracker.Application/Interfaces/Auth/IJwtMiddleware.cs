using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace SeriesTracker.Application.Interfaces.Auth
{
    internal interface IJwtMiddleware
    {
        Task Invoke(HttpContext context);
    }
}
