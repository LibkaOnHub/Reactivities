using Application.Activities.Commands;
using Domain;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class ActivitiesController : BaseApiController
    {
        [HttpGet]
        public async Task<ActionResult<List<Activity>>> GetActivities()
        {
            // CQRS mediator pattern: command/query (MediatR.IRequest) -> IMediator.Send -> IMediatR.Handler

            // CQRS query (MediatR.IRquest) s daným vstupním a výstupním typem
            var query = new Application.Activities.Queries.GetActivityList.Query();

            // CQRS query zpracuje IMediator.Send (zvolí handler podle vstupního a výstupního typu)
            return await Mediator.Send(query); // pro CQRS pattern
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Activity>> GetActivityDetail(string id)
        {
            // CQRS mediator pattern: command/query (MediatR.IRequest) -> IMediator.Send -> IMediatR.Handler

            // CQRS query (MediatR.IRqueest) s daným vstupním a výstupním typem
            var query = new Application.Activities.Queries.GetActivityDetails.Query { Id = id };

            // CQRS query zpracuje IMediator.Send (zvolí handler podle vstupního a výstupního typu)
            return await Mediator.Send(query); // pro CQRS pattern
        }

        [HttpPost]
        public async Task<ActionResult<string>> CreateActivity(Activity activity)
        {
            // CQRS mediator pattern: command/query (MediatR.IRequest) -> IMediator.Send -> IMediatR.Handler

            // CQRS command
            var command = new CreateActivity.Command
            {
                Activity = activity
            };

            // CQRS command zpracuje Mediator.Send (zvolí handler podle vstupního a výstupního typu)
            return await Mediator.Send(command);
        }

        [HttpPut]
        public async Task<ActionResult> UpdateActivity(Activity activity) // nevracíme žádný typ
        {
            // CQRS mediator pattern: command/query (MediatR.IRequest) -> IMediator.Send -> IMediatR.Handler

            // CQRS command
            var command = new EditActivity.Command
            {
                Activity = activity
            };

            // CQRS command zpracuje Mediator.Send (zvolí handler podle vstupního a výstupního typu)
            await Mediator.Send(command); // pro CQRS pattern, ale bez await, protože nečekáme na výsledek

            return NoContent(); // vrátíme 204 No Content
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteActivity(string id)
        {
            var command = new DeleteActivity.Command { 
                Id = id
            };

            await Mediator.Send(command);

            return Ok();
        }
    }
}