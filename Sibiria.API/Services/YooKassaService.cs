// Sibiria.API/Services/YooKassaService.cs

using System.Net.Http.Headers;
using System.Text;
using Newtonsoft.Json;

namespace Sibiria.API.Services
{
    public class YooKassaService
    {
        private readonly HttpClient _httpClient;
        private readonly string _shopId;
        private readonly string _secretKey;

        public YooKassaService(HttpClient httpClient, IConfiguration config)
        {
            _httpClient = httpClient;
            _shopId = config["YooKassa:ShopId"]!;
            _secretKey = config["YooKassa:SecretKey"]!;

            var byteArray = Encoding.ASCII.GetBytes($"{_shopId}:{_secretKey}");
            _httpClient.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("Basic", Convert.ToBase64String(byteArray));
        }

        /// <summary>
        /// Создаёт платёж в YooKassa (capture=false) и возвращает (confirmationUrl, paymentId).
        /// </summary>
        public async Task<(string confirmationUrl, Guid paymentId)> CreatePayment(
            decimal amount,
            string returnUrl,
            string description  // мы передаём сюда booking.Id.ToString()
        )
        {
            var requestBody = new
            {
                amount = new
                {
                    value = amount.ToString("F2", System.Globalization.CultureInfo.InvariantCulture),
                    currency = "RUB"
                },
                confirmation = new
                {
                    type = "redirect",
                    return_url = returnUrl
                },
                capture = false,       // НЕ списываем сразу, ждём ручного capture
                description = description, // здесь будет booking.Id
                metadata = new Dictionary<string, string>
                {
                    { "bookingId", description }
                }
            };

            var json = JsonConvert.SerializeObject(requestBody);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var request = new HttpRequestMessage(HttpMethod.Post, "https://api.yookassa.ru/v3/payments")
            {
                Content = content
            };
            request.Headers.Add("Idempotence-Key", Guid.NewGuid().ToString());

            var response = await _httpClient.SendAsync(request);
            var respJson = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
                throw new Exception($"YooKassa Error: {respJson}");

            dynamic result = JsonConvert.DeserializeObject(respJson)!;
            string confirmationUrl = (string)result.confirmation.confirmation_url;
            Guid paymentId = Guid.Parse((string)result.id);
            return (confirmationUrl, paymentId);
        }
    }
}
    