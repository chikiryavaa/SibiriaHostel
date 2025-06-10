namespace Sibiria.API.DTOs
{
    public class ConfirmPasswordResetDto
    {
        public string Email { get; set; }
        public string Code { get; set; }
        public string NewPassword { get; set; }
    }
}
