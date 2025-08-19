using Application.Activities.DTOs;
using Application.Core;
using AutoMapper;
using Domain;
using MediatR;
using Persistence;

namespace Application.Activities.Commands
{
    public class CreateActivity
    {
        // CQRS Mediator pattern:
        // command/query (MediatR.IRequest) -> MediatR.IMediator.Send -> MediatR.IMediatR.Handler

        // ve třídě budou dvě vlastnosti, resp. třídy (command a handler)

        // 1) Command (MediatR.IRequest) - vstupní data pro vytvoření aktivity (DTO, stačí i record))
        public class Command : IRequest<Result<string>> // výstupem je náš objekt Result s odpovědí jako string
        {
            public required CreateActivityDto CreateActivityDto { get; set; }
        }

        // 2) Handler (MediatR.IRequestHandler) - zpracování commandu
        public class Handler(AppDbContext context, IMapper mapper) : IRequestHandler<Command, Result<string>>
        {
            public async Task<Result<string>> Handle(Command request, CancellationToken cancellationToken)
            {
                var activity = mapper.Map<Activity>(request.CreateActivityDto);

                context.Activities.Add(activity); // přidáme aktivitu do DbSetu

                var result = await context.SaveChangesAsync() > 0; // uložení a kontrola

                if (!result)
                {
                    return Result<string>.Failure("Failed to create the activity", 400);
                }

                return Result<string>.Success(activity.Id);
            }
        }
    }
}
