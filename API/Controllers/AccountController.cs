using API.DTOs;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    // injektujeme SignInManager pomcí primary ctor
    public class AccountController(SignInManager<User> signInManager) : BaseApiController
    {
        // POST: api/Account/register
        [AllowAnonymous] // máme zapnutou autentikační politku v useControllers, takže zde musíme udělat výjimku
        [HttpPost("register")]
        public async Task<ActionResult> Register(RegisterDto registerDto)
        {
            var user = new User
            {
                UserName = registerDto.Email, // e-mail se používá jako přihlašovací jméno
                Email = registerDto.Email,
                DisplayName = registerDto.DisplayName
            };

            // vytvoření uživatele pomocí SignInManager.UserManager
            var result = await signInManager.UserManager.CreateAsync(user, registerDto.Password);

            if (result.Succeeded)
            {
                return Ok(); // vrátíme 200 OK
            }

            foreach (var error in result.Errors)
            {
                ModelState.AddModelError(error.Code, error.Description);
            }

            return ValidationProblem(); // vrátíme 400 Bad Request s chybami validace
        }

        // GET: api/Account/user-info
        // povolíme přístup i bez autentizace, abychom mohli zjistit, zda je uživatel přihlášený
        // nevrátí se tak 401 - Unauthorized, ale 204 - NoContent
        [AllowAnonymous]
        [HttpGet("user-info")]
        public async Task<ActionResult> GetUserInfo()
        {
            // ControllerBase má vlastnost User typu ClaimsPrincipal (získá se z HttpContext)
            if (User.Identity?.IsAuthenticated == false)
            {
                return NoContent();
            }

            // získáme náš model napojený na ASP.NET Identity z identity v requestu (BaseController.User typu ClaimsPrincipal)
            var user = await signInManager.UserManager.GetUserAsync(User);

            if (user == null) return Unauthorized();

            return Ok(new
            {
                user.DisplayName,
                user.Email,
                user.Id,
                user.ImageUrl
            });
        }

        // POST: api/Account/logout
        // metoda vyžaduje přihlášeného uživatele, resp.autentikaci
        // (je již nastavena jako výchozí v UseController, resp. politice)
        [HttpPost("logout")]
        public async Task<ActionResult> Logout()
        {
            await signInManager.SignOutAsync(); // smaže i cookie
            return NoContent();
        }

    }
}