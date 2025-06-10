using Sibiria.API.DTOs;
using Sibiria.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sibiria.API.Interfaces
{
    public interface IServiceService
    {
        Task<IEnumerable<ServiceDto>> GetAllAsync();
        Task<ServiceDto> GetByIdAsync(int id);
        Task<ServiceDto> CreateAsync(ServiceDto serviceDto);
        Task UpdateAsync(ServiceDto serviceDto);
        Task DeleteAsync(int id);
    }
}
