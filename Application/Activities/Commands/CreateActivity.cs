using MediatR;
using Persistence;
using Domain;

namespace Application.Activities.Commands
{
    public class CreateActivity
    {
        // CQRS Mediator pattern:
        // command/query (MediatR.IRequest) -> MediatR.IMediator.Send -> MediatR.IMediatR.Handler

        // ve třídě budou dvě vlastnosti, resp. třídy (command a handler)

        // 1) Command (MediatR.IRequest) - vstupní data pro vytvoření aktivity (DTO, stačí i record))
        public class Command : IRequest<string>
        {
            public required Activity Activity { get; set; }
        }

        // 2) Handler (MediatR.IRequestHandler) - zpracování commandu
        public class Handler(AppDbContext context) : IRequestHandler<Command, string>
        {
            async Task<string> IRequestHandler<Command, string>.Handle(Command request, CancellationToken cancellationToken)
            {
                context.Activities.Add(request.Activity); // přidáme aktivitu do DbSetu

                await context.SaveChangesAsync();

                return request.Activity.Id;
            }
        }
    }
}
