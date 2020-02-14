using Application.Activities;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ActivitiesController : ControllerBase
    {
        private readonly IMediator _mediator;

        public ActivitiesController(IMediator mediator)
        {
            _mediator = mediator;
        }

        // GET api/values
        [HttpGet]
        public async Task<ActionResult<IEnumerable<List<Activity>>>> List(CancellationToken cancellationToken)
        {
            var values = await _mediator.Send(new List.Query(), cancellationToken);
            return Ok(values);
        }

        // GET api/activities/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Activity>> Details(Guid id)
        {
            var activity = await _mediator.Send(new Details.Query { Id = id });

            if (activity != null)
            {
                return Ok(activity);
            }
            else
            {
                return NotFound();
            }
        }

        // POST api/activities
        [HttpPost]
        public async Task<ActionResult<Activity>> Create(Create.Command command)
        {
            var Id = await _mediator.Send(command);

            return Ok(Id);
        }

        // PUT api/activities/5
        [HttpPut("{id}")]
        public async Task<ActionResult<Unit>> Edit(Guid id, Edit.Command command)
        {
            command.Id = id;

            return Ok(await _mediator.Send(command));
        }

        // DELETE api/activities/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Unit>> Delete(Guid id)
        {
            return Ok(await _mediator.Send(new Delete.Command { Id = id }));
        }
    }
}
