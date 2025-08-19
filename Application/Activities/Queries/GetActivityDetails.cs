using Application.Core;
using Domain;
using MediatR;
using Persistence;

namespace Application.Activities.Queries
{
    public class GetActivityDetails
    {
        // CQRS mediator pattern (MediatR Command/Query a jejich Handler)

        // ve třídě budou další dvě třídy (Query a Handler) implemetující MediatR

        // 1) Query (DTO s výstupním typem, může být i record)
        public class Query : IRequest<Result<Activity>> // výstupní typ
        {
            public required string Id { get; set; } // vstupní parametry
        }

        // 2) Handler se vstupním a výstuním typem
        public class Handler(AppDbContext context) : IRequestHandler<Query, Result<Activity>>
        {
            public async Task<Result<Activity>> Handle(Query request, CancellationToken cancellationToken)
            {
                // najdeme záznam podle PK
                var activity = await context.Activities.FindAsync([request.Id], cancellationToken);

                if (activity == null)
                {
                    return Result<Activity>.Failure("Activity not found", 404);
                }

                return Result<Activity>.Success(activity);
            }
        }
    }
}