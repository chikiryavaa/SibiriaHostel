using Microsoft.EntityFrameworkCore;
using Sibiria.API.Data;
using Sibiria.API.DTOs;
using Sibiria.API.Interfaces;
using Sibiria.API.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Sibiria.API.Services
{
    public class ServiceService : IServiceService
    {
        private readonly SibiriaContext _context;

        public ServiceService(SibiriaContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<ServiceDto>> GetAllAsync()
        {
            return await _context.Services
                .AsNoTracking()
                .Select(s => new ServiceDto
                {
                    Id = s.Id,
                    Name = s.Name,
                    Description = s.Description,
                    Price = s.Price
                })
                .ToListAsync();
        }

        public async Task<ServiceDto> GetByIdAsync(int id)
        {
            var entity = await _context.Services
                .AsNoTracking()
                .FirstOrDefaultAsync(s => s.Id == id);

            if (entity == null)
                return null!;

            return new ServiceDto
            {
                Id = entity.Id,
                Name = entity.Name,
                Description = entity.Description,
                Price = entity.Price
            };
        }

        public async Task<ServiceDto> CreateAsync(ServiceDto serviceDto)
        {
            if (serviceDto == null)
                throw new ArgumentNullException(nameof(serviceDto));

            var entity = new Service
            {
                Name = serviceDto.Name,
                Description = serviceDto.Description,
                Price = serviceDto.Price
            };

            _context.Services.Add(entity);
            await _context.SaveChangesAsync();

            serviceDto.Id = entity.Id;
            return serviceDto;
        }

        public async Task UpdateAsync(ServiceDto serviceDto)
        {
            if (serviceDto == null)
                throw new ArgumentNullException(nameof(serviceDto));

            var entity = await _context.Services.FirstOrDefaultAsync(s => s.Id == serviceDto.Id);
            if (entity == null)
                throw new KeyNotFoundException($"Service with ID {serviceDto.Id} not found.");

            entity.Name = serviceDto.Name;
            entity.Description = serviceDto.Description;
            entity.Price = serviceDto.Price;

            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var entity = await _context.Services.FirstOrDefaultAsync(s => s.Id == id);
            if (entity == null)
                return;

            _context.Services.Remove(entity);
            await _context.SaveChangesAsync();
        }
    }
}