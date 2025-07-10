using Domain;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace API.Controllers
{
    public class  ActivitiesController(AppDbContext appDbContext) : BaseApiController
    {
        [HttpGet]
        public async Task<ActionResult<List<Activity>>> GetActivities()
        {
            return await appDbContext.Activities.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Activity>> GetActivityDetail(string id)
        {
            // metoda FindAsync najde záznam podle PK
            var activity = await appDbContext.Activities.FindAsync(id); 

            if (activity == null) return NotFound(); // 404 Not Found

            return activity; // 200 OK
        }
   
    }
}