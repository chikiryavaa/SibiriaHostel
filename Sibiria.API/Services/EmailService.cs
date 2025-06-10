namespace Sibiria.API.Services
{
    using System.Net;
    using System.Net.Mail;
    using System.Threading.Tasks;
    using Microsoft.Extensions.Configuration;

    namespace Sibiria.API.Services
    {
        public class EmailService
        {
            private readonly IConfiguration _configuration;

            public EmailService(IConfiguration configuration)
            {
                _configuration = configuration;
            }

            public async Task SendPasswordResetCodeAsync(string toEmail, string code)
            {
                // Предполагается, что в appsettings.json у вас прописаны параметры SMTP, например:
                //"Smtp": {
                //    "Host": "smtp.gmail.com",
                //   "Port": 587,
                //   "Username": "your@gmail.com",
                //   "Password": "app_password"
                // }

                var smtpSection = _configuration.GetSection("Smtp");
                var host = smtpSection.GetValue<string>("Host");
                var port = smtpSection.GetValue<int>("Port");
                var username = smtpSection.GetValue<string>("Username");
                var password = smtpSection.GetValue<string>("Password");

                using var client = new SmtpClient(host, port)
                {
                    Credentials = new NetworkCredential(username, password),
                    EnableSsl = true
                };

                var message = new MailMessage
                {
                    From = new MailAddress(username, "Отель Сибирь"),
                    Subject = "Код для сброса пароля",
                    Body = $"Здравствуйте!\n\nВаш код для сброса пароля: {code}\n\n" +
                           "Если вы не запрашивали сброс, просто проигнорируйте это письмо.\n\n" +
                           "С уважением,\nКоманда Отеля «Сибирь»",
                    IsBodyHtml = false
                };
                message.To.Add(toEmail);

                await client.SendMailAsync(message);
            }
        }
    }
}
