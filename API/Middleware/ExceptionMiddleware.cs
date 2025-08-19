using Application.Core;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace API.Middleware
{
    public class ExceptionMiddleware(ILogger<ExceptionMiddleware> logger, IHostEnvironment env) : IMiddleware
    {
        public async Task InvokeAsync(HttpContext context, RequestDelegate next)
        {
            try
            {
                await next(context);
            }
            catch (ValidationException validationException) // FluentValidation.ValidationException
            {
                await HandleValidationException(context, validationException);
            }
            catch (Exception ex)
            {
                await HandleException(context, ex);
            }
        }

        private static async Task HandleValidationException(HttpContext context, ValidationException validationException)
        {
            // nejprve vytvoříme z FluentValidation.ValidationException kolekce obyčejný dictionary,
            // který budeme moci vložit do instance AspNet ValidationProblemDetails

            var errorDictionary = new Dictionary<string, string[]>();

            if (validationException.Errors != null)
            {
                foreach (var error in validationException.Errors)
                {
                    if (errorDictionary.TryGetValue(error.PropertyName, out var propertyErrors))
                    {
                        // pokud validace vrací název vlastnosti modelu
                        errorDictionary[error.PropertyName] = [.. propertyErrors, error.ErrorMessage]; // do pole přidáme novou položku
                    }
                    else
                    {
                        // pokud je vlastnost validovaného modelu prázdná
                        errorDictionary[error.PropertyName] = [error.ErrorMessage];
                    }
                }
            }

            context.Response.StatusCode = StatusCodes.Status400BadRequest;

            // nyní vytvoříme instanci ValidationProblemDetails a vložíme do ní náš obyčejný slovník, který akceptuje

            var validationProblemDetails = new ValidationProblemDetails
            {
                Status = StatusCodes.Status400BadRequest,
                Errors = errorDictionary, // náš slovník vyrobený z FluentValidation.ValidationException
                Type = "ValidationFailure",
                Title = "Validation error",
                Detail = "One or more validation errors has occured"
            };

            // vracíme vlastně odpověď ve tvaru, jakou dělá controller a anotace DTO pomocí [Required] (základní validace)

            await context.Response.WriteAsJsonAsync(validationProblemDetails);
        }

        private async Task HandleException(HttpContext context, Exception ex)
        {
            logger.LogError(ex, ex.Message);

            context.Response.ContentType = "application/jsonWithException";
            context.Response.StatusCode = StatusCodes.Status500InternalServerError;

            // vytvoříme a naplníme náš objekt AppException
            var appException = env.IsDevelopment()
                ? new AppException(context.Response.StatusCode, ex.Message, ex.StackTrace)
                : new AppException(context.Response.StatusCode, ex.Message, null);

            // vytvoříme z objektu JSON
            var jsonSerializerOptions = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            };

            var jsonWithException = JsonSerializer.Serialize(appException, jsonSerializerOptions);

            await context.Response.WriteAsync(jsonWithException);
        }
    }
}
