using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SeriesTracker.Contracts
{
    public class UserRequest
    {
        public record UserLoginRequest
        (string Email, string Password, string? surname);

        public record UserRegisterRequest(
     string Email,
     string Password,
     string UserName,
     string? Name,
     string? Surname,
     string? Avatar,
     string DateBirth
 );
    }
}
