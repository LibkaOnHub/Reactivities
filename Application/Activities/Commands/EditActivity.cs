using MediatR;
using Persistence;
using AutoMapper;
using Application.Core;
using Application.Activities.DTOs;

namespace Application.Activities.Commands
{
    public class EditActivity
    {
        // CQRS Mediator pattern:
        // command/query (MediatR.IRequest) -> MediatR.IMediator.Send -> MediatR.IMediatR.Handler

        // ve třídě budou dvě vlastnosti, resp. třídy (command a handler)

        // 1) Command (MediatR.IRequest) - vstupní data pro editaci aktivity (DTO, stačí i record)
        public class Command : IRequest<Result<Unit>> // bez výstupního typu, resp. náš typ Result vracející Unit (void)
        {
            public required EditActivityDto EditActivityDto { get; set; }
        }

        // 2) Handler (MediatR.IRequestHandler) - zpracování commandu
        public class Handler(AppDbContext context, IMapper mapper) : IRequestHandler<Command, Result<Unit>> // výstupní typ na náš typ Result s návratovou hodnotou Unit (void)
        {
            // task s výstupním typem Result
            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                // nejprve získáme existující aktivitu
                var existingActivity = await context.Activities.FindAsync([request.EditActivityDto.Id], cancellationToken);

                if (existingActivity == null)
                {
                    return Result<Unit>.Failure("Activity not found", 404);
                }

                mapper.Map(request.EditActivityDto, existingActivity); // mapování z requestu do existující aktivity

                // EF nepotřebuje Update, protože po EF FindAsync již její změny sleduje (je z DbSetu)

                var rowsAffected = await context.SaveChangesAsync() > 0; // uložíme změny v tabulkách do DB a porovnáme počet ovlivněných záznamů

                if (!rowsAffected)
                {
                    return Result<Unit>.Failure("Failed to update the activity", 400);
                }

                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}
