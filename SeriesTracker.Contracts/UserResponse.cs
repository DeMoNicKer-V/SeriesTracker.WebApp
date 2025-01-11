using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SeriesTracker.Contracts
{
    public class UserResponse
    {
        public record UserRegisterResponse
     (Guid Id, string Username, string Email);
    }
}
