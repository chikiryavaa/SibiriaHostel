using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Sibiria.API.Migrations
{
    /// <inheritdoc />
    public partial class initial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AdminStatistics",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Date = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    OccupancyRate = table.Column<decimal>(type: "numeric(5,2)", nullable: false),
                    TotalVisitors = table.Column<int>(type: "integer", nullable: false),
                    Performance = table.Column<decimal>(type: "numeric(5,2)", nullable: false),
                    TotalBookings = table.Column<int>(type: "integer", nullable: false),
                    AvailableRooms = table.Column<int>(type: "integer", nullable: false),
                    TotalRevenue = table.Column<decimal>(type: "numeric(10,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AdminStatistics", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "RoomTypes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RoomTypes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Services",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false),
                    Price = table.Column<decimal>(type: "numeric(10,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Services", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    FullName = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    Email = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    Phone = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    Password = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    Role = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    PasswordResetToken = table.Column<string>(type: "character varying(6)", maxLength: 6, nullable: true),
                    PasswordResetTokenExpires = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Rooms",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    RoomTypeId = table.Column<int>(type: "integer", nullable: false),
                    Title = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false),
                    Price = table.Column<decimal>(type: "numeric(10,2)", nullable: false),
                    Capacity = table.Column<int>(type: "integer", nullable: false),
                    Amenities = table.Column<string>(type: "jsonb", nullable: false),
                    ImageUrls = table.Column<string>(type: "jsonb", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Rooms", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Rooms_RoomTypes_RoomTypeId",
                        column: x => x.RoomTypeId,
                        principalTable: "RoomTypes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Bookings",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    GuestFirstName = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    GuestLastName = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    ContactType = table.Column<int>(type: "integer", nullable: false),
                    ContactValue = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    RoomId = table.Column<int>(type: "integer", nullable: false),
                    CheckIn = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CheckOut = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    TotalPrice = table.Column<decimal>(type: "numeric(10,2)", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UserId = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Bookings", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Bookings_Rooms_RoomId",
                        column: x => x.RoomId,
                        principalTable: "Rooms",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Bookings_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "BookingServices",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    BookingId = table.Column<int>(type: "integer", nullable: false),
                    ServiceId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BookingServices", x => x.Id);
                    table.ForeignKey(
                        name: "FK_BookingServices_Bookings_BookingId",
                        column: x => x.BookingId,
                        principalTable: "Bookings",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_BookingServices_Services_ServiceId",
                        column: x => x.ServiceId,
                        principalTable: "Services",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Payments",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false),
                    BookingId = table.Column<int>(type: "integer", nullable: false),
                    Amount = table.Column<decimal>(type: "numeric(10,2)", nullable: false),
                    PaymentMethod = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Payments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Payments_Bookings_BookingId",
                        column: x => x.BookingId,
                        principalTable: "Bookings",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "RoomTypes",
                columns: new[] { "Id", "Description", "Name" },
                values: new object[,]
                {
                    { 1, "Небольшой номер для одного гостя.", "Single" },
                    { 2, "Уютный номер для двоих.", "Double" },
                    { 3, "Просторный люкс с отдельной гостиной.", "Suite" },
                    { 4, "Премиум-номер повышенной комфортности.", "Deluxe" },
                    { 5, "Номер для семьи: большая площадь и дополнительные кровати.", "Family" }
                });

            migrationBuilder.InsertData(
                table: "Services",
                columns: new[] { "Id", "Description", "Name", "Price" },
                values: new object[,]
                {
                    { 1, "Шведский стол с разнообразными блюдами.", "Breakfast", 10.00m },
                    { 2, "Трансфер из аэропорта.", "Airport Pickup", 25.00m },
                    { 3, "Абонемент в спа-зону отеля.", "Spa Access", 40.00m },
                    { 4, "Дополнительная кровать в номер.", "Extra Bed", 15.00m },
                    { 5, "Ужин в ресторане отеля.", "Dinner", 20.00m }
                });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "CreatedAt", "Email", "FullName", "Password", "PasswordResetToken", "PasswordResetTokenExpires", "Phone", "Role" },
                values: new object[,]
                {
                    { 1, new DateTime(2024, 1, 5, 0, 0, 0, 0, DateTimeKind.Utc), "ivan.ivanov@example.com", "Иван Иванов", "10000.OSkGP6En/+y1ok8Nh/uRaQ==.z9XFaHQdjGyHh/SxkwMCLPjjw3WCOJrwOHjwbqS5OD8=", null, null, "+7-915-123-4567", 0 },
                    { 2, new DateTime(2024, 2, 10, 0, 0, 0, 0, DateTimeKind.Utc), "maria.petrova@example.com", "Мария Петрова", "10000.xKsOIRl0TiKHgzqXTanQuw==.jn3shdL8A6CnA7IPMoMyOh9KOi9YKn1B8QboNEJMS4g=", null, null, "+7-916-234-5678", 0 },
                    { 3, new DateTime(2024, 3, 15, 0, 0, 0, 0, DateTimeKind.Utc), "alexey.smirнов@example.com", "Алексей Смирнов", "10000.4zsNtW2YJ2uZCbcfsCr62A==.7wAn/dKYtQWwcHS39xCbCOhWzFjOtBt1rA3+sExlp/k=", null, null, "+7-917-345-6789", 0 },
                    { 4, new DateTime(2024, 4, 20, 0, 0, 0, 0, DateTimeKind.Utc), "ekaterina.кuzнецова@example.com", "Екатерина Кузнецова", "10000.MBd0wCDNQPKEQElEsLB9vA==.68xO4YtAt6cgiIIX45PatVLS2Qwt70N1Ay5k4oru1Ek=", null, null, "+7-918-456-7890", 0 },
                    { 5, new DateTime(2024, 5, 25, 0, 0, 0, 0, DateTimeKind.Utc), "dmitry.соколов@example.com", "Дмитрий Соколов", "10000.LQn8uOrJqT+Pi3mJuLK4GQ==.a0u2a0/1Mc69zXIoJ4uspoo0MWojYpUufdrXtrG8HzQ=", null, null, "+7-919-567-8901", 0 },
                    { 6, new DateTime(2024, 6, 1, 0, 0, 0, 0, DateTimeKind.Utc), "olga.морозова@example.com", "Ольга Морозова", "10000.RYTLrFWKyCLorHdvP+CSBQ==.DKwM3EJglJg4yyM57zQm1EX8D3VJhm72W+aocb3FIgM=", null, null, "+7-920-678-9012", 0 },
                    { 7, new DateTime(2024, 7, 5, 0, 0, 0, 0, DateTimeKind.Utc), "sergey.волков@example.com", "Сергей Волков", "10000.1GHtvZ7cpvhCAdjUHY0BLg==.+s8b8jALBLwDrLzTMNrdCH/6QC+I2LkdhydrgrzXYqY=", null, null, "+7-921-789-0123", 0 },
                    { 8, new DateTime(2024, 8, 10, 0, 0, 0, 0, DateTimeKind.Utc), "anna.павлова@example.com", "Анна Павлова", "10000.XTT5bagFxR1/1VxbYOuGgg==./UEfBb/0y4BX/mrgIp08/p+fFoHU5sRdmlXSw5z7CK8=", null, null, "+7-922-890-1234", 0 },
                    { 9, new DateTime(2024, 9, 15, 0, 0, 0, 0, DateTimeKind.Utc), "pavel.sидоров@example.com", "Павел Сидоров", "10000.1qzLHhpc+UnLIC/Wk7DOZw==.bQv6mF+41wysw+fTvPxys7xOhBvcZggwtkmkV6eme7Y=", null, null, "+7-923-901-2345", 0 },
                    { 10, new DateTime(2024, 10, 20, 0, 0, 0, 0, DateTimeKind.Utc), "elena.федорова@example.com", "Елена Федорова", "10000.XJ0V3DQatKkwE5p4WnKKEA==.5YxX4UzNhRIujhAUPda/5wu3hNA3fNnQhWt2nzc0ZLU=", null, null, "+7-924-012-3456", 0 },
                    { 11, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "admin.алексей@example.com", "Админ Алексей", "10000.tbW5mo/x3yX1yZ1Rw5eHUw==.WRMObtPOpV4Lp51RcVdgWK4lX3x+BQu0FzbCc1FI4iU=", null, null, "+7-925-123-4567", 1 },
                    { 12, new DateTime(2024, 1, 2, 0, 0, 0, 0, DateTimeKind.Utc), "admin.ольга@example.com", "Админ Ольга", "10000.7wZ9hj2pCP//AxGeLecLqg==.e/kviSPPhl3xr2pMeCpaXMud3QciV83G29/EqRaYklQ=", null, null, "+7-926-234-5678", 1 }
                });

            migrationBuilder.InsertData(
                table: "Rooms",
                columns: new[] { "Id", "Amenities", "Capacity", "Description", "ImageUrls", "Price", "RoomTypeId", "Status", "Title" },
                values: new object[,]
                {
                    { 1, "[\"WiFi\",\"TV\",\"Кондиционер\"]", 1, "Уютный одноместный номер с всем необходимым.", "[\"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSr3BoV0X-5Hg3wOj21AtdKFibIBg_vD8JuKg&s\"]", 45.00m, 1, 0, "Single Comfort" },
                    { 2, "[\"WiFi\",\"TV\",\"Мини-бар\"]", 2, "Двухместный номер со стандартными удобствами.", "[\"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgJiWc32GaiEhLhMfCimFBWZVdkJaF3ybdXA&s\"]", 75.00m, 2, 0, "Double Standard" },
                    { 3, "[\"WiFi\",\"TV\",\"Балкон\"]", 2, "Номер с видом на озеро, двухместный.", "[\"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSy1kei7aaGkOjC0oYr8-LvqdAmvLCHHD4trg&s\"]", 95.00m, 2, 0, "Double Lake View" },
                    { 4, "[\"WiFi\",\"TV\",\"Мини-бар\",\"Кофемашина\"]", 2, "Люкс с отдельной гостиной и рабочей зоной.", "[\"https://cf.bstatic.com/xdata/images/hotel/max1024x768/682995190.jpg?k=38f0614e45e5fda8be0bd485a17fff76f0c2a093af5b6b170f6a0049925be47d&o=&hp=1\"]", 150.00m, 3, 0, "Suite Executive" },
                    { 5, "[\"WiFi\",\"TV\",\"Мини-бар\",\"Кухня\",\"Балкон\"]", 3, "Престижный президентский люкс с панорамными окнами.", "[\"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQus7yNdjl9HkVT2D1PWklw6GFMqYEnXw2bsw&s\"]", 300.00m, 3, 0, "Suite Presidential" },
                    { 6, "[\"WiFi\",\"TV\",\"Мини-бар\",\"Сейф\"]", 2, "Номер класса Deluxe с видом на сад.", "[\"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzAziFmkAqz2IJX1E_VIe5zAfUqL9oOS8tpg&s\"]", 120.00m, 4, 0, "Deluxe Garden View" },
                    { 7, "[\"WiFi\",\"TV\",\"Мини-бар\",\"Джакузи\"]", 2, "Deluxe-номер около бассейна.", "[\"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUHGV8PaGLEcj0MCo-fvkpmhTvEWct4iGwYw&s\"]", 130.00m, 4, 0, "Deluxe Poolside" },
                    { 8, "[\"WiFi\",\"TV\",\"Мини-бар\",\"Кухня\",\"Игровая зона\"]", 4, "Просторный семейный номер, 2 спальни и гостиная.", "[\"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR01RMWuGbIPd5tPaSWZD3l7b-bTcU-dPBUAw&s\", \"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGwxdbJGlFITHDxHbVeAAtI07W7vUsF5Exlw&s\"]", 200.00m, 5, 0, "Family Suite" },
                    { 9, "[\"WiFi\",\"TV\"]", 1, "Бюджетный одноместный номер.", "[\"https://webbox.imgix.net/images/zeezklhuxgyflgtp/b7436443-c036-49ed-97d4-6c665ac95a4b.jpg?auto=format,compress&fit=crop&crop=entropy&w=600&h=450\"]", 35.00m, 1, 0, "Single Economy" },
                    { 10, "[\"WiFi\",\"TV\",\"Мини-бар\"]", 2, "Удобный двухместный номер для двоих гостей.", "[\"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLh2TWp_a2H1NIFI_qOzcO3MX3_-tIRvxrfQ&s\"]", 85.00m, 2, 0, "Double Comfort" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Bookings_RoomId",
                table: "Bookings",
                column: "RoomId");

            migrationBuilder.CreateIndex(
                name: "IX_Bookings_UserId",
                table: "Bookings",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_BookingServices_BookingId",
                table: "BookingServices",
                column: "BookingId");

            migrationBuilder.CreateIndex(
                name: "IX_BookingServices_ServiceId",
                table: "BookingServices",
                column: "ServiceId");

            migrationBuilder.CreateIndex(
                name: "IX_Payments_BookingId",
                table: "Payments",
                column: "BookingId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Rooms_RoomTypeId",
                table: "Rooms",
                column: "RoomTypeId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AdminStatistics");

            migrationBuilder.DropTable(
                name: "BookingServices");

            migrationBuilder.DropTable(
                name: "Payments");

            migrationBuilder.DropTable(
                name: "Services");

            migrationBuilder.DropTable(
                name: "Bookings");

            migrationBuilder.DropTable(
                name: "Rooms");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropTable(
                name: "RoomTypes");
        }
    }
}
