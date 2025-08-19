using Application.Core;
using MediatR;
using Persistence;

namespace Application.Activities.Commands
{
    public class DeleteActivity
    {
        // CQRS Mediator pattern:
        // command/query (MediatR.IRequest) -> MediatR.IMediator.Send -> MediatR.IMediatR.Handler

        // ve třídě budou dvě vlastnosti, resp. třídy (command a handler)

        // 1) Command (MediatR.IRequest) - vstupní data pro smazání aktivity (DTO, stačí i record)
        public class Command : IRequest<Result<Unit>> // bez výstupního typu (Unit je vlastně void)
        {
            public required string Id { get; set; } // vstupní parametr - ID aktivity
        }

        // 2) Handler (MediatR.IRequestHandler) - zpracování commandu stejného typu (DeleteActivity.Command)
        // na výstupu bude náš typ Result vracející zde void, resp. Unit
        public class Handler(AppDbContext context) : IRequestHandler<Command, Result<Unit>>
        {
            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                // metoda FindAsync najde záznam v tabulce podle PK
                var activity = await context.Activities.FindAsync([request.Id], cancellationToken);

                if (activity == null)
                {
                    // vytvoříme  a vrátíme instanci našeho objektu Result s nastavenou chybou
                    return Result<Unit>.Failure("Activity not found", 404);
                }

                // položku označíme ke smazání
                context.Activities.Remove(activity);

                // uložení všech změn do DB
                var result = await context.SaveChangesAsync(cancellationToken) > 0; // byly ovlivněny záznamy?

                if (!result)
                {
                    return Result<Unit>.Failure("Failed to delete the activity", 404);
                }

                // handler na mazání nevrací žádný výsledek (Unit je náhrada void)
                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}
