using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Sibiria.API.Data;
using Sibiria.API.Interfaces;
using Sibiria.API.Services;
using Sibiria.API.Services.Sibiria.API.Services;


var builder = WebApplication.CreateBuilder(args);

// ──────────────────────────────────────────────────────────────────────────────
// 1. Читаем настройки из appsettings.json
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
var jwtSettingsSection = builder.Configuration.GetSection("JwtSettings");
builder.Services.Configure<JwtSettings>(jwtSettingsSection);
var jwtSettings = jwtSettingsSection.Get<JwtSettings>();

// ──────────────────────────────────────────────────────────────────────────────
// 2. Регистрируем DbContext для PostgreSQL
builder.Services.AddDbContext<SibiriaContext>(options =>
    options.UseNpgsql(connectionString)
);
builder.Services.AddScoped<JwtService>();

// ──────────────────────────────────────────────────────────────────────────────
// 3. Настраиваем JWT-аутентификацию
builder.Services
    .AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.RequireHttpsMetadata = false; // в проде лучше true
        options.SaveToken = true;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = jwtSettings.Issuer,

            ValidateAudience = true,
            ValidAudience = jwtSettings.Audience,

            ValidateLifetime = true,

            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(
                                          Encoding.UTF8.GetBytes(jwtSettings.Key)),

            ClockSkew = TimeSpan.Zero
        };
    });

// ──────────────────────────────────────────────────────────────────────────────
// 4. Регистрируем CORS (разрешаем любые домены, методы, заголовки)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy
            .AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
});

// ──────────────────────────────────────────────────────────────────────────────
// 5. Регистрируем сервисы прикладного уровня (IUserService → UserService)
//    (При необходимости добавьте регистрацию UnitOfWork и репозиториев)
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IRoomService, RoomService>();
builder.Services.AddScoped<IRoomTypeService,RoomTypeService>();
builder.Services.AddScoped<IBookingService, BookingService>();
builder.Services.AddScoped<IAdminStatisticService, AdminStatisticService>();
builder.Services.AddScoped<BookingService>();
builder.Services.AddScoped<HashingService>();
builder.Services.AddScoped<EmailService>();
builder.Services.AddScoped<IServiceService, ServiceService>();


builder.Services.AddHttpClient<YooKassaService>();

// ──────────────────────────────────────────────────────────────────────────────
// 6. Добавляем контроллеры и Swagger с поддержкой JWT
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Sibiria API", Version = "v1" });

    var jwtSecurityScheme = new OpenApiSecurityScheme
    {
        Scheme = "bearer",
        BearerFormat = "JWT",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Description = "Введите «Bearer {token}»",

        Reference = new OpenApiReference
        {
            Id = JwtBearerDefaults.AuthenticationScheme,
            Type = ReferenceType.SecurityScheme
        }
    };

    c.AddSecurityDefinition(jwtSecurityScheme.Reference.Id, jwtSecurityScheme);
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        { jwtSecurityScheme, Array.Empty<string>() }
    });
});

// ──────────────────────────────────────────────────────────────────────────────
// 7. Строим приложение
var app = builder.Build();

// ──────────────────────────────────────────────────────────────────────────────
// 8. Включаем CORS
app.UseCors("AllowAll");

// ──────────────────────────────────────────────────────────────────────────────
// 9. Swagger (только в Development)
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Sibiria API v1");
    });
}

// ──────────────────────────────────────────────────────────────────────────────
// 10. Аутентификация и Авторизация
app.UseHttpsRedirection();
app.UseAuthentication(); // сначала аутентификация
app.UseAuthorization();  // затем авторизация

// ──────────────────────────────────────────────────────────────────────────────
// 11. Маршрутизация контроллеров
app.MapControllers();

app.Run();

