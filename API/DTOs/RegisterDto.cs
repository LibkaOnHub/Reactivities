using System.ComponentModel.DataAnnotations;

namespace API.DTOs
{
    public class RegisterDto
    {
        [Required]
        public string DisplayName { get; set; } = "";

        [Required]
        [EmailAddress]
        public string Email { get; set; } = ""; // e-mail se požívá jako přihlašovací jméno

        // nemusí být Required, protože ASP.NET kontroluje komplexitu hesla
        public string Password { get; set; } = "";
    }
}