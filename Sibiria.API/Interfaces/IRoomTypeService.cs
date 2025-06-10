using Sibiria.API.DTOs;
using Sibiria.API.Entities;
using Sibiria.Core.Entities;

namespace Sibiria.API.Interfaces
{
    public interface IRoomTypeService
    {
        Task<RoomType> AddRoomType(RoomTypeDto roomType);
        Task<List<RoomType>> GetAllRoomTypes();

    }
}
