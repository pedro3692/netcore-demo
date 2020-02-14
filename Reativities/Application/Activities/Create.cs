using Domain;
using MediatR;
using Persistence;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Activities
{
    public class Create
    {
        public class Command : IRequest<Guid>
        {
            public Guid Id { get; set; }
            public string Title { get; set; }
            public string Description { get; set; }
            public string Category { get; set; }
            public DateTime Date { get; set; }
            public string City { get; set; }
            public string Venue { get; set; }
        }

        public class Handler : IRequestHandler<Command, Guid>
        {
            private readonly DataContext _context;

            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<Guid> Handle(Command request, CancellationToken cancellationToken)
            {

                var activity = new Activity
                {
                    Title = request.Title,
                    Description = request.Description,
                    Category = request.Category,
                    Date = request.Date,
                    Venue = request.Venue
                };


                _context.Activities.Add(activity);
                var success = await _context.SaveChangesAsync() > 0;

                if (success)
                {
                    return activity.Id;
                }

                throw new Exception("Problem saving changes");         
            }
        }
    }
}
