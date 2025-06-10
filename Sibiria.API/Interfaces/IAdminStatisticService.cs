using Sibiria.API.DTOs;
using Sibiria.API.Entities;
using Sibiria.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sibiria.API.Interfaces
{
    public interface IAdminStatisticService
    {
        Task<AdminStatistic> CalculateMonthlyStatisticAsync(int year, int month);
        Task<List<AdminStatistic>> GetAllStatisticsAsync();
    }
}
