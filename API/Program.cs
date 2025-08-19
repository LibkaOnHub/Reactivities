using Application.Activities.Queries;
using Application.Core;
using Microsoft.EntityFrameworkCore;
using Persistence;
using FluentValidation;
using Application.Activities.Validators;
using API.Middleware;

var builder = WebApplication.CreateBuilder(args);

// 1) přidáme nastavení DI do ServiceColletion

// builder.Services.Add přidává typy do DI kontejneru

builder.Services.AddControllers();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")
    )
);

builder.Services.AddMediatR(cfg =>
{
    cfg.RegisterServicesFromAssemblyContaining<GetActivityList.Handler>(); // MediatR bude hledat handlery v naší třídě
    cfg.AddOpenBehavior(typeof(ValidationBehavior<,>)); // MediatR bude volat validátory podle typu
});

builder.Services.AddSwaggerGen(); // Required for Swagger

builder.Services.AddAutoMapper(cfg => cfg.AddProfile<MappingProfiles>()); // profil k auto mapperu

builder.Services.AddValidatorsFromAssemblyContaining<CreateActivityValidator>(); // zapnutí FluentValidation

builder.Services.AddTransient<ExceptionMiddleware>(); // přidání middleware pro zpracování requestu, resp. validace

var app = builder.Build();

// 2) nakonfigurujeme HTTP request pipeline

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseMiddleware<ExceptionMiddleware>();

app.MapControllers();

// 3) činnosti po spuštění aplikace mimo HTTP request

// nastavení CORS (Cross-Origin Resource Sharing), tj oprávnění k API z jiných domén
app.UseCors(option =>
    option.AllowAnyHeader()
    .AllowAnyMethod() // všechny HTTP metody (GET, POST, PUT, DELETE atd.)
    .WithOrigins("http://localhost:3000", "https://localhost:3000") // povolené domény pro přístup k API
);

// protože jsme mimo scope HTTP requestu (nejsme v controlleru), tak musíme vytvořit nový scope pro získání DbContext
// abychom mohli pracovat s databází (automatické dot net ef database update, naplnění úvodních dat)

// nový DI scope (jsme mimo HTTP request scope)
using var serviceScope = app.Services.CreateScope();

// získání service provideru z našeho scope (service provider vrací instance přidané před spuštěním do  service collection)
var serviceProviderInScope = serviceScope.ServiceProvider;

try
{
    // získání instance z DI, resp. ServiceProvider, kde je po spuštění připravená
    var appDbContext = serviceProviderInScope.GetRequiredService<AppDbContext>();

    // provede "dotnet ef database update"
    await appDbContext.Database.MigrateAsync();

    // naplní prázdnou databázi testovacími daty
    await DbInitializer.SeedData(appDbContext);

}
catch (Exception)
{
    // získáme instanci logger (required = exception při neúspěchu)
    var logger = serviceProviderInScope.GetRequiredService<ILogger<Program>>();
    logger.LogError("An error occurred during migration or seeding the database");
}

app.Run();