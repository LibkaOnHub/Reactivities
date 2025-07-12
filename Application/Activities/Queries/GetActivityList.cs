using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities.Queries
{
    public class GetActivityList
    {
        // CQRS mediator pattern (MediatR Command/Query a jejich Handler)

        // ve třídě budou další dvě třídy (Query a Handler) implemetující MediatR

        // 1) Query (DTO s výstupním typem, může být i record)
        //public class Query : MediatR.IRequest<List<Activity>> { }
        public record Query : IRequest<List<Activity>> { }

        // 2) Handler se vstupním a výstuním typem
        public class Handler(AppDbContext context) : IRequestHandler<Query, List<Activity>>
        {
            public async Task<List<Activity>> Handle(Query request, CancellationToken cancellationToken)
            {
                return await context.Activities.ToListAsync(cancellationToken);
            }
        }
    }
}