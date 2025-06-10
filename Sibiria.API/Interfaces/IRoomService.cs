using Sibiria.API.DTOs;
using Sibiria.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sibiria.API.Interfaces
{
    public interface IRoomService
    {
        Task<IEnumerable<RoomDto>> GetAllAsync();
        Task<RoomDto> GetByIdAsync(int id);
        Task<RoomDto> CreateAsync(RoomDto roomDto);
        Task UpdateAsync(RoomDto roomDto);
        Task DeleteAsync(int id);
        Task<IEnumerable<RoomDto>> GetAvailableRoomsAsync(DateTime desiredCheckIn, DateTime desiredCheckOut);
        Task<IEnumerable<RoomDto>> GetAvailableAsync(
            DateTime checkIn,
            DateTime checkOut,
            int? roomTypeId,
            int guests);
    }
}

