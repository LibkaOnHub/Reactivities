namespace Application.Core
{
    public class Result<T>
    {
        public bool IsSuccess { get; set; }

        public T? Value { get; set; }

        public string? Error { get; set; }

        public int Code { get; set; }

        // statická metoda Success bude vracet instanci třídy přednastavenou na chybu
        public static Result<T> Success(T value) => new()
        {
            IsSuccess = true,
            Value = value
        };

        // statická metoda Failure bude vracet instanci třídy přednastavenou na chybu
        public static Result<T> Failure(string error, int code) => new()
        {
            IsSuccess = false,
            Error = error,
            Code = code
        };
    }
}