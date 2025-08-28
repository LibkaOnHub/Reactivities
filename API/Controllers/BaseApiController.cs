using Application.Core;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")] // placeholder na jméno podle metody bez "Controller"
    [ApiController]
    public class BaseApiController : ControllerBase
    {
        private IMediator? _mediator;

        // získání IMediator nebude v ctor, ale v této vlastnosti
        // chceme ošetřit chybu, když instance nebude dostupná
        protected IMediator Mediator =>
            _mediator
            ??= HttpContext.RequestServices.GetService<IMediator>()
            ?? throw new InvalidOperationException("Imediator service is unavailable in base controller");

        public ActionResult HandleResult<T>(Result<T> result)
        {
            if (!result.IsSuccess && result.Code == 404) return NotFound();

            if (result.IsSuccess && result.Value != null) return Ok(result.Value);

            return BadRequest(result.Error);
        }
    }
}