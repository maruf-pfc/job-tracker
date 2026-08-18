namespace JobTracker.API.Exceptions;

public class ForbiddenException : Exception
{
    public ForbiddenException(string message = "Forbidden access.") : base(message) { }
}
