using Sibiria.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sibiria.API.Interfaces
{
    public interface IPaymentService
    {
        Task<IEnumerable<PaymentDto>> GetAllAsync();
        Task<PaymentDto> GetByIdAsync(int id);
        Task<PaymentDto> CreateAsync(PaymentDto paymentDto);
    }
}
