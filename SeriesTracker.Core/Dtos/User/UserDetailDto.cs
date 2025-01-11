﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SeriesTracker.Core.Dtos.UserDtos
{
    public class UserDetailDto
    {
        public string? Avatar {  get; set; }
        public string? DateBirth { get; set; }
        public string Email { get; set; }
        public Guid Id { get; set; }
        public string? Name { get; set; }
        public string RegDate { get; set; }
        public int RoleId { get; set; }
        public string? Surname { get; set; }
        public string UserName { get; set; }
    }
}