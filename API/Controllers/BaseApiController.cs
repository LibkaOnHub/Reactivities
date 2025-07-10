using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")] // placeholder na jméno podle metody bez "Controller"
    [ApiController]
    public class BaseApiController : ControllerBase
    {
    }
}
