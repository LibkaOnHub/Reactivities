using MediatR;
using Persistence;

namespace Application.Activities.Commands
{
    public class DeleteActivity
    {
        // CQRS Mediator pattern:
        // command/query (MediatR.IRequest) -> MediatR.IMediator.Send -> MediatR.IMediatR.Handler

        // ve třídě budou dvě vlastnosti, resp. třídy (command a handler)

        // 1) Command (MediatR.IRequest) - vstupní data pro editaci aktivity (DTO, stačí i record)
        public class Command : IRequest // bez výstupního typu
        {
            public required string Id { get; set; } // vstupní parametr - ID aktivity
        }

        // 2) Handler (MediatR.IRequestHandler) - zpracování commandu
        public class Handler(AppDbContext context) : IRequestHandler<Command>
        {
            public async Task Handle(Command request, CancellationToken cancellationToken)
            {
                var activity = await context.Activities.FindAsync([request.Id], cancellationToken) 
                    ?? throw new Exception("Cannot find activity");

                context.Activities.Remove(activity);

                await context.SaveChangesAsync(cancellationToken);
            }
        }
    }
}
