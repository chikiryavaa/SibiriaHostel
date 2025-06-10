using Microsoft.AspNetCore.Mvc;
using Sibiria.API.DTOs;
using Sibiria.API.Interfaces;
using System;
using System.Threading.Tasks;

namespace Sibiria.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ServiceController : ControllerBase
    {
        private readonly IServiceService _serviceService;

        public ServiceController(IServiceService serviceService)
        {
            _serviceService = serviceService;
        }

        // GET: api/Service
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var services = await _serviceService.GetAllAsync();
            return Ok(services);
        }

        // GET: api/Service/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var serviceDto = await _serviceService.GetByIdAsync(id);
            if (serviceDto == null)
                return NotFound();
            return Ok(serviceDto);
        }

        // POST: api/Service
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] ServiceDto serviceDto)
        {
            if (serviceDto == null)
                return BadRequest("Service data is required.");

            try
            {
                var created = await _serviceService.CreateAsync(serviceDto);
                return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
            }
            catch (ArgumentNullException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // PUT: api/Service/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] ServiceDto serviceDto)
        {
            if (serviceDto == null || serviceDto.Id != id)
                return BadRequest("Service ID mismatch or data is null.");

            try
            {
                await _serviceService.UpdateAsync(serviceDto);
                return NoContent();
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
            catch (ArgumentNullException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // DELETE: api/Service/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _serviceService.DeleteAsync(id);
            return NoContent();
        }
    }
}
