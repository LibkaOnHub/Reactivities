using MediatR;
using Persistence;
using Domain;
using AutoMapper;

namespace Application.Activities.Commands
{
    public class EditActivity
    {
        // CQRS Mediator pattern:
        // command/query (MediatR.IRequest) -> MediatR.IMediator.Send -> MediatR.IMediatR.Handler

        // ve třídě budou dvě vlastnosti, resp. třídy (command a handler)

        // 1) Command (MediatR.IRequest) - vstupní data pro editaci aktivity (DTO, stačí i record)
        public class Command : IRequest // bez výstupního typu
        {
            public required Activity Activity { get; set; }
        }

        // 2) Handler (MediatR.IRequestHandler) - zpracování commandu
        public class Handler(AppDbContext context, IMapper mapper) : IRequestHandler<Command> // bez výstupního typu
        {
            // task bez výstupního typu
            async Task IRequestHandler<Command>.Handle(Command request, CancellationToken cancellationToken)
            {
                // nejprve získáme existující aktivitu
                var existingActivity = await context.Activities.FindAsync([request.Activity.Id], cancellationToken)
                     ?? throw new Exception("Cannot find activity");

                mapper.Map(request.Activity, existingActivity); // mapování z requestu do existující aktivity

                // EF nepotřebuje Update, protože po FindAsync již její zmeny sleduje (je z DbSetu)

                await context.SaveChangesAsync(); // uložíme změny v tabulkách do DB
            }
        }
    }
}
