using Domain;
using Microsoft.AspNetCore.Identity;

namespace Persistence
{
    public class DbInitializer
    {
        // statická metoda stačí - není třeba vytvářet instanci
        // injektujeme AppDbContext (nyní IdentityContext) a UserManager (v aplikaci je přidaná ASP.NET Identity)
        public static async Task SeedData(AppDbContext context, UserManager<User> userManager)
        {
            // 1) vložení uživatelů (ASP.NET Identity je uloží do AspNetUsers)
            if (!userManager.Users.Any()) // pokud nejsou v DB žádní uživatelé
            {
                var users = new List<User>
                {
                    new() {
                        DisplayName = "Bob",
                        UserName = "bob@test.com", // nějaká chyba v ASP.NET Identity (do UserName se dává stejně e-mail), aby prošla autentikace
                        Email = "bob@test.com"
                    },
                    new() {
                        DisplayName = "Tom",
                        UserName = "tom@test.com",
                        Email = "tom@test.com"
                    },
                    new() {
                        DisplayName = "Jane",
                        UserName = "jane@test.com",
                        Email = "jane@test.com"
                    }
                };

                foreach (var user in users)
                {
                    // přidáme uživatele pomocí ASP.NET Identity UserManager
                    // pozor, heslo musí být komplexní a mít aspoň 6 znaků
                    await userManager.CreateAsync(user, "Password*1");

                    // není třeba volat SaveChanges (ASP.NET Identity UserManager již udělá)
                }
            }

            // 2) vložení aktivit (tabulka Activities)
            if (context.Activities.Any()) return; // tabulka je již naplněna

            // připravíme kolekci aktivit k vložení do tabulky
            var activities = new List<Activity>
            {
                new() {
                    Title = "Past Activity 1",
                    Date = DateTime.Now.AddMonths(-2),
                    Description = "Activity 2 months ago",
                    Category = "drinks",
                    City = "London",
                    Venue = "The Lamb and Flag, 33, Rose Street, Seven Dials, Covent Garden, London, Greater London, England, WC2E 9EB, United Kingdom",
                    Latitude = 51.51171665,
                    Longitude = -0.1256611057818921,
                },
                new() {
                    Title = "Past Activity 2",
                    Date = DateTime.Now.AddMonths(-1),
                    Description = "Activity 1 month ago",
                    Category = "culture",
                    City = "Paris",
                    Venue = "Louvre Museum, Rue Saint-Honoré, Quartier du Palais Royal, 1st Arrondissement, Paris, Ile-de-France, Metropolitan France, 75001, France",
                    Latitude = 48.8611473,
                    Longitude = 2.33802768704666
                },
                new() {
                    Title = "Future Activity 1",
                    Date = DateTime.Now.AddMonths(1),
                    Description = "Activity 1 month in future",
                    Category = "culture",
                    City = "London",
                    Venue = "Natural History Museum",
                    Latitude = 51.496510900000004,
                    Longitude = -0.17600190725447445
                },
                new() {
                    Title = "Future Activity 2",
                    Date = DateTime.Now.AddMonths(2),
                    Description = "Activity 2 months in future",
                    Category = "music",
                    City = "London",
                    Venue = "The O2",
                    Latitude = 51.502936649999995,
                    Longitude = 0.0032029278126681844
                },
                new()
                {
                    Title = "Future Activity 3",
                    Date = DateTime.Now.AddMonths(3),
                    Description = "Activity 3 months in future",
                    Category = "drinks",
                    City = "London",
                    Venue = "The Mayflower",
                    Latitude = 51.501778,
                    Longitude = -0.053577
                },
                new()
                {
                    Title = "Future Activity 4",
                    Date = DateTime.Now.AddMonths(4),
                    Description = "Activity 4 months in future",
                    Category = "drinks",
                    City = "London",
                    Venue = "The Blackfriar",
                    Latitude = 51.512146650000005,
                    Longitude = -0.10364680647106028
                },
                new()
                {
                    Title = "Future Activity 5",
                    Date = DateTime.Now.AddMonths(5),
                    Description = "Activity 5 months in future",
                    Category = "culture",
                    City = "London",
                    Venue = "Sherlock Holmes Museum, 221b, Baker Street, Marylebone, London, Greater London, England, NW1 6XE, United Kingdom",
                    Latitude = 51.5237629,
                    Longitude = -0.1584743
                },
                new()
                {
                    Title = "Future Activity 6",
                    Date = DateTime.Now.AddMonths(6),
                    Description = "Activity 6 months in future",
                    Category = "music",
                    City = "London",
                    Venue = "Roundhouse, Chalk Farm Road, Maitland Park, Chalk Farm, London Borough of Camden, London, Greater London, England, NW1 8EH, United Kingdom",
                    Latitude = 51.5432505,
                    Longitude = -0.15197608174931165
                },
                new()
                {
                    Title = "Future Activity 7",
                    Date = DateTime.Now.AddMonths(7),
                    Description = "Activity 2 months ago",
                    Category = "travel",
                    City = "London",
                    Venue = "River Thames, England, United Kingdom",
                    Latitude = 51.5575525,
                    Longitude = -0.781404
                },
                new()
                {
                    Title = "Future Activity 8",
                    Date = DateTime.Now.AddMonths(8),
                    Description = "Activity 8 months in future",
                    Category = "film",
                    City = "London",
                    Venue = "River Thames, England, United Kingdom",
                    Latitude = 51.5575525,
                    Longitude = -0.781404
                }
            };

            await context.Activities.AddRangeAsync(activities); // přidáme aktivity do DbSetu (tabulky)

            var saveResult = await context.SaveChangesAsync(); // uložíme všechny změny do DB
        }
    }
}