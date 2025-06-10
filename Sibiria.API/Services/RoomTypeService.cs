using Microsoft.EntityFrameworkCore;
using Sibiria.API.Data;
using Sibiria.API.DTOs;
using Sibiria.API.Entities;
using Sibiria.API.Interfaces;
using Sibiria.Core.Entities;

namespace Sibiria.API.Services
{
    public class RoomTypeService : IRoomTypeService
    {
        private readonly SibiriaContext _context;
        public RoomTypeService(SibiriaContext sibiriaContext)
        {
            _context = sibiriaContext;
        }
        public async Task<RoomType> AddRoomType(RoomTypeDto roomType)
        {
            RoomType type = new() { Description =roomType.Description, Name =roomType.Name };
            _context.RoomTypes.Add(type);
            await _context.SaveChangesAsync();
            return type;
        }

        public async Task<List<RoomType>> GetAllRoomTypes()
        {
            return await _context.RoomTypes.ToListAsync();
        }
    }
}
