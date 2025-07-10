using Domain;
using Microsoft.EntityFrameworkCore;

namespace Persistence
{
    public class AppDbContext : DbContext
    {
        // DbContext je spojení na DB

        // třídu pak přidáme do Program.cs pomocí Services.AddDbContext<AppDbContext>...

        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {

        }

        // DbSet vlastnosti jsou tabulky v DB

        public required DbSet<Activity> Activities { get; set; } // pozor, Activity je rezervovaný název
    }
}
