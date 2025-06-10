using Microsoft.EntityFrameworkCore;
using Sibiria.API.Entities;
using Sibiria.API.Enums;
using Sibiria.Core.Entities;
using System;
using System.Collections.Generic;

namespace Sibiria.API.Data
{
    public class SibiriaContext : DbContext
    {
        public SibiriaContext(DbContextOptions<SibiriaContext> options)
            : base(options)
        {
        }

        public DbSet<AdminStatistic> AdminStatistics { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<RoomType> RoomTypes { get; set; }
        public DbSet<Room> Rooms { get; set; }
        public DbSet<Service> Services { get; set; }
        public DbSet<Booking> Bookings { get; set; }
        public DbSet<BookingService> BookingServices { get; set; }
        public DbSet<Payment> Payments { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Seed RoomTypes
            modelBuilder.Entity<RoomType>().HasData(
                new RoomType { Id = 1, Name = "Single", Description = "Небольшой номер для одного гостя." },
                new RoomType { Id = 2, Name = "Double", Description = "Уютный номер для двоих." },
                new RoomType { Id = 3, Name = "Suite", Description = "Просторный люкс с отдельной гостиной." },
                new RoomType { Id = 4, Name = "Deluxe", Description = "Премиум-номер повышенной комфортности." },
                new RoomType { Id = 5, Name = "Family", Description = "Номер для семьи: большая площадь и дополнительные кровати." }
            );

            // Seed Rooms
            modelBuilder.Entity<Room>().HasData(
                new Room
                {
                    Id = 1,
                    RoomTypeId = 1,
                    Title = "Single Comfort",
                    Description = "Уютный одноместный номер с всем необходимым.",
                    Price = 45.00m,
                    Capacity = 1,
                    Amenities = "[\"WiFi\",\"TV\",\"Кондиционер\"]",
                    ImageUrls = "[\"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSr3BoV0X-5Hg3wOj21AtdKFibIBg_vD8JuKg&s\"]",
                    Status = RoomStatus.Available
                },
                new Room
                {
                    Id = 2,
                    RoomTypeId = 2,
                    Title = "Double Standard",
                    Description = "Двухместный номер со стандартными удобствами.",
                    Price = 75.00m,
                    Capacity = 2,
                    Amenities = "[\"WiFi\",\"TV\",\"Мини-бар\"]",
                    ImageUrls = "[\"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgJiWc32GaiEhLhMfCimFBWZVdkJaF3ybdXA&s\"]",
                    Status = RoomStatus.Available
                },
                new Room
                {
                    Id = 3,
                    RoomTypeId = 2,
                    Title = "Double Lake View",
                    Description = "Номер с видом на озеро, двухместный.",
                    Price = 95.00m,
                    Capacity = 2,
                    Amenities = "[\"WiFi\",\"TV\",\"Балкон\"]",
                    ImageUrls = "[\"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSy1kei7aaGkOjC0oYr8-LvqdAmvLCHHD4trg&s\"]",
                    Status = RoomStatus.Available
                },
                new Room
                {
                    Id = 4,
                    RoomTypeId = 3,
                    Title = "Suite Executive",
                    Description = "Люкс с отдельной гостиной и рабочей зоной.",
                    Price = 150.00m,
                    Capacity = 2,
                    Amenities = "[\"WiFi\",\"TV\",\"Мини-бар\",\"Кофемашина\"]",
                    ImageUrls = "[\"https://cf.bstatic.com/xdata/images/hotel/max1024x768/682995190.jpg?k=38f0614e45e5fda8be0bd485a17fff76f0c2a093af5b6b170f6a0049925be47d&o=&hp=1\"]",
                    Status = RoomStatus.Available
                },
                new Room
                {
                    Id = 5,
                    RoomTypeId = 3,
                    Title = "Suite Presidential",
                    Description = "Престижный президентский люкс с панорамными окнами.",
                    Price = 300.00m,
                    Capacity = 3,
                    Amenities = "[\"WiFi\",\"TV\",\"Мини-бар\",\"Кухня\",\"Балкон\"]",
                    ImageUrls = "[\"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQus7yNdjl9HkVT2D1PWklw6GFMqYEnXw2bsw&s\"]",
                    Status = RoomStatus.Available
                },
                new Room
                {
                    Id = 6,
                    RoomTypeId = 4,
                    Title = "Deluxe Garden View",
                    Description = "Номер класса Deluxe с видом на сад.",
                    Price = 120.00m,
                    Capacity = 2,
                    Amenities = "[\"WiFi\",\"TV\",\"Мини-бар\",\"Сейф\"]",
                    ImageUrls = "[\"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzAziFmkAqz2IJX1E_VIe5zAfUqL9oOS8tpg&s\"]",
                    Status = RoomStatus.Available
                },
                new Room
                {
                    Id = 7,
                    RoomTypeId = 4,
                    Title = "Deluxe Poolside",
                    Description = "Deluxe-номер около бассейна.",
                    Price = 130.00m,
                    Capacity = 2,
                    Amenities = "[\"WiFi\",\"TV\",\"Мини-бар\",\"Джакузи\"]",
                    ImageUrls = "[\"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUHGV8PaGLEcj0MCo-fvkpmhTvEWct4iGwYw&s\"]",
                    Status = RoomStatus.Available
                },
                new Room
                {
                    Id = 8,
                    RoomTypeId = 5,
                    Title = "Family Suite",
                    Description = "Просторный семейный номер, 2 спальни и гостиная.",
                    Price = 200.00m,
                    Capacity = 4,
                    Amenities = "[\"WiFi\",\"TV\",\"Мини-бар\",\"Кухня\",\"Игровая зона\"]",
                    ImageUrls = "[\"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR01RMWuGbIPd5tPaSWZD3l7b-bTcU-dPBUAw&s\", \"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGwxdbJGlFITHDxHbVeAAtI07W7vUsF5Exlw&s\"]",
                    Status = RoomStatus.Available
                },
                new Room
                {
                    Id = 9,
                    RoomTypeId = 1,
                    Title = "Single Economy",
                    Description = "Бюджетный одноместный номер.",
                    Price = 35.00m,
                    Capacity = 1,
                    Amenities = "[\"WiFi\",\"TV\"]",
                    ImageUrls = "[\"https://webbox.imgix.net/images/zeezklhuxgyflgtp/b7436443-c036-49ed-97d4-6c665ac95a4b.jpg?auto=format,compress&fit=crop&crop=entropy&w=600&h=450\"]",
                    Status = RoomStatus.Available
                },
                new Room
                {
                    Id = 10,
                    RoomTypeId = 2,
                    Title = "Double Comfort",
                    Description = "Удобный двухместный номер для двоих гостей.",
                    Price = 85.00m,
                    Capacity = 2,
                    Amenities = "[\"WiFi\",\"TV\",\"Мини-бар\"]",
                    ImageUrls = "[\"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLh2TWp_a2H1NIFI_qOzcO3MX3_-tIRvxrfQ&s\"]",
                    Status = RoomStatus.Available
                }
            );

            // Seed Services
            modelBuilder.Entity<Service>().HasData(
                new Service { Id = 1, Name = "Breakfast", Description = "Шведский стол с разнообразными блюдами.", Price = 10.00m },
                new Service { Id = 2, Name = "Airport Pickup", Description = "Трансфер из аэропорта.", Price = 25.00m },
                new Service { Id = 3, Name = "Spa Access", Description = "Абонемент в спа-зону отеля.", Price = 40.00m },
                new Service { Id = 4, Name = "Extra Bed", Description = "Дополнительная кровать в номер.", Price = 15.00m },
                new Service { Id = 5, Name = "Dinner", Description = "Ужин в ресторане отеля.", Price = 20.00m }
            );

            modelBuilder.Entity<User>().HasData(
       new User
       {
           Id = 1,
           FullName = "Иван Иванов",
           Email = "ivan.ivanov@example.com",
           Phone = "+7-915-123-4567",
           // Захешированный пароль, например, формат "{iterations}.{salt}.{hash}"
           Password = "10000.OSkGP6En/+y1ok8Nh/uRaQ==.z9XFaHQdjGyHh/SxkwMCLPjjw3WCOJrwOHjwbqS5OD8=",
           Role = UserRole.User,
           CreatedAt = new DateTime(2024, 1, 5, 0, 0, 0, DateTimeKind.Utc),
           PasswordResetToken = null,
           PasswordResetTokenExpires = null
       },
       new User
       {
           Id = 2,
           FullName = "Мария Петрова",
           Email = "maria.petrova@example.com",
           Phone = "+7-916-234-5678",
           Password = "10000.xKsOIRl0TiKHgzqXTanQuw==.jn3shdL8A6CnA7IPMoMyOh9KOi9YKn1B8QboNEJMS4g=",
           Role = UserRole.User,
           CreatedAt = new DateTime(2024, 2, 10, 0, 0, 0, DateTimeKind.Utc),
           PasswordResetToken = null,
           PasswordResetTokenExpires = null
       },
       new User
       {
           Id = 3,
           FullName = "Алексей Смирнов",
           Email = "alexey.smirнов@example.com",
           Phone = "+7-917-345-6789",
           Password = "10000.4zsNtW2YJ2uZCbcfsCr62A==.7wAn/dKYtQWwcHS39xCbCOhWzFjOtBt1rA3+sExlp/k=",
           Role = UserRole.User,
           CreatedAt = new DateTime(2024, 3, 15, 0, 0, 0, DateTimeKind.Utc),
           PasswordResetToken = null,
           PasswordResetTokenExpires = null
       },
       new User
       {
           Id = 4,
           FullName = "Екатерина Кузнецова",
           Email = "ekaterina.кuzнецова@example.com",
           Phone = "+7-918-456-7890",
           Password = "10000.MBd0wCDNQPKEQElEsLB9vA==.68xO4YtAt6cgiIIX45PatVLS2Qwt70N1Ay5k4oru1Ek=",
           Role = UserRole.User,
           CreatedAt = new DateTime(2024, 4, 20, 0, 0, 0, DateTimeKind.Utc),
           PasswordResetToken = null,
           PasswordResetTokenExpires = null
       },
       new User
       {
           Id = 5,
           FullName = "Дмитрий Соколов",
           Email = "dmitry.соколов@example.com",
           Phone = "+7-919-567-8901",
           Password = "10000.LQn8uOrJqT+Pi3mJuLK4GQ==.a0u2a0/1Mc69zXIoJ4uspoo0MWojYpUufdrXtrG8HzQ=",
           Role = UserRole.User,
           CreatedAt = new DateTime(2024, 5, 25, 0, 0, 0, DateTimeKind.Utc),
           PasswordResetToken = null,
           PasswordResetTokenExpires = null
       },
       new User
       {
           Id = 6,
           FullName = "Ольга Морозова",
           Email = "olga.морозова@example.com",
           Phone = "+7-920-678-9012",
           Password = "10000.RYTLrFWKyCLorHdvP+CSBQ==.DKwM3EJglJg4yyM57zQm1EX8D3VJhm72W+aocb3FIgM=",
           Role = UserRole.User,
           CreatedAt = new DateTime(2024, 6, 1, 0, 0, 0, DateTimeKind.Utc),
           PasswordResetToken = null,
           PasswordResetTokenExpires = null
       },
       new User
       {
           Id = 7,
           FullName = "Сергей Волков",
           Email = "sergey.волков@example.com",
           Phone = "+7-921-789-0123",
           Password = "10000.1GHtvZ7cpvhCAdjUHY0BLg==.+s8b8jALBLwDrLzTMNrdCH/6QC+I2LkdhydrgrzXYqY=",
           Role = UserRole.User,
           CreatedAt = new DateTime(2024, 7, 5, 0, 0, 0, DateTimeKind.Utc),
           PasswordResetToken = null,
           PasswordResetTokenExpires = null
       },
       new User
       {
           Id = 8,
           FullName = "Анна Павлова",
           Email = "anna.павлова@example.com",
           Phone = "+7-922-890-1234",
           Password = "10000.XTT5bagFxR1/1VxbYOuGgg==./UEfBb/0y4BX/mrgIp08/p+fFoHU5sRdmlXSw5z7CK8=",
           Role = UserRole.User,
           CreatedAt = new DateTime(2024, 8, 10, 0, 0, 0, DateTimeKind.Utc),
           PasswordResetToken = null,
           PasswordResetTokenExpires = null
       },
       new User
       {
           Id = 9,
           FullName = "Павел Сидоров",
           Email = "pavel.sидоров@example.com",
           Phone = "+7-923-901-2345",
           Password = "10000.1qzLHhpc+UnLIC/Wk7DOZw==.bQv6mF+41wysw+fTvPxys7xOhBvcZggwtkmkV6eme7Y=",
           Role = UserRole.User,
           CreatedAt = new DateTime(2024, 9, 15, 0, 0, 0, DateTimeKind.Utc),
           PasswordResetToken = null,
           PasswordResetTokenExpires = null
       },
       new User
       {
           Id = 10,
           FullName = "Елена Федорова",
           Email = "elena.федорова@example.com",
           Phone = "+7-924-012-3456",
           Password = "10000.XJ0V3DQatKkwE5p4WnKKEA==.5YxX4UzNhRIujhAUPda/5wu3hNA3fNnQhWt2nzc0ZLU=",
           Role = UserRole.User,
           CreatedAt = new DateTime(2024, 10, 20, 0, 0, 0, DateTimeKind.Utc),
           PasswordResetToken = null,
           PasswordResetTokenExpires = null
       },
       // Администраторы
       new User
       {
           Id = 11,
           FullName = "Админ Алексей",
           Email = "admin.алексей@example.com",
           Phone = "+7-925-123-4567",
           Password = "10000.tbW5mo/x3yX1yZ1Rw5eHUw==.WRMObtPOpV4Lp51RcVdgWK4lX3x+BQu0FzbCc1FI4iU=",
           Role = UserRole.Admin,
           CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc),
           PasswordResetToken = null,
           PasswordResetTokenExpires = null
       },
       new User
       {
           Id = 12,
           FullName = "Админ Ольга",
           Email = "admin.ольга@example.com",
           Phone = "+7-926-234-5678",
           Password = "10000.7wZ9hj2pCP//AxGeLecLqg==.e/kviSPPhl3xr2pMeCpaXMud3QciV83G29/EqRaYklQ=",
           Role = UserRole.Admin,
           CreatedAt = new DateTime(2024, 1, 2, 0, 0, 0, DateTimeKind.Utc),
           PasswordResetToken = null,
           PasswordResetTokenExpires = null
       }
   );


            
            

           
          
        }
    }
}
