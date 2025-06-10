using System.Security.Cryptography;
using System.Text;

namespace Sibiria.API.Services
{
    public class HashingService
    {
        public string ComputeHash(string input)
        {
            using (SHA256 sha256 = SHA256.Create())
            {
                byte[] bytes = Encoding.UTF8.GetBytes(input);
                byte[] hashBytes = sha256.ComputeHash(bytes);

                return Convert.ToBase64String(hashBytes);
            }
        }

        public bool VerifyHash(string input, string hash)
        {
            string computedHash = ComputeHash(input);
            return computedHash == hash;
        }
    }
}