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
        // chceme ošetřit chybu, když instanece nebude dostupná
        protected IMediator Mediator =>
            _mediator
            ??= HttpContext.RequestServices.GetService<IMediator>()
            ?? throw new InvalidOperationException("Imediator service is unavailable in base controller");
    }
}
