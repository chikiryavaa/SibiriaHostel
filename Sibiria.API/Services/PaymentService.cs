using Sibiria.API.Data;
using Sibiria.API.Interfaces;
using Sibiria.Application.DTOs;
using Sibiria.Core.Entities;

namespace Sibiria.API.Services
{
    public class PaymentService : IPaymentService
    {
        private readonly SibiriaContext _context;
        public PaymentService(SibiriaContext sibiriaContext)
        {
            _context = sibiriaContext;
        }
        public Task<PaymentDto> CreateAsync(PaymentDto paymentDto)
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<PaymentDto>> GetAllAsync()
        {
            throw new NotImplementedException();
        }

        public Task<PaymentDto> GetByIdAsync(int id)
        {
            throw new NotImplementedException();
        }
    }
}
