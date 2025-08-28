using Application.Activities.Commands;
using Application.Activities.DTOs;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class ActivitiesController : BaseApiController
    {
        [AllowAnonymous]
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
            // odpověď z handleru vrátí aplikační logika v našem objektu Result, který obsahuje odpověď, případnou chybu atd.
            var result = await Mediator.Send(query); // pro CQRS pattern

            return HandleResult(result);
        }

        [HttpPost]
        public async Task<ActionResult<string>> CreateActivity(CreateActivityDto createActivityDto)
        {
            // CQRS mediator pattern: command/query (MediatR.IRequest) -> IMediator.Send -> IMediatR.Handler

            // CQRS command
            var command = new CreateActivity.Command
            {
                CreateActivityDto = createActivityDto
            };

            // CQRS command zpracuje Mediator.Send (zvolí handler podle vstupního a výstupního typu)
            var result = await Mediator.Send(command);

            return HandleResult(result);
        }

        [HttpPut]
        public async Task<ActionResult> EditActivity(EditActivityDto editActivityDto) // nevracíme žádný typ
        {
            // CQRS mediator pattern: command/query (MediatR.IRequest) -> IMediator.Send -> IMediatR.Handler

            // CQRS command
            var command = new EditActivity.Command
            {
                EditActivityDto = editActivityDto
            };

            // CQRS command zpracuje Mediator.Send (zvolí handler podle vstupního a výstupního typu)
            var result = await Mediator.Send(command); // pro CQRS pattern, ale bez await, protože nečekáme na výsledek

            return HandleResult(result);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteActivity(string id)
        {
            var command = new DeleteActivity.Command
            {
                Id = id
            };

            var result = await Mediator.Send(command);

            return HandleResult(result);
        }
    }
}