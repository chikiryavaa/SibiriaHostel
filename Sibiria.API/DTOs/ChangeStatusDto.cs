using System.ComponentModel.DataAnnotations;

namespace Sibiria.API.DTOs
{
    public class ChangeStatusDto
    {
        [Required] public string NewStatus { get; set; }
    }
}
