using System.Security.Claims;

namespace API.Extensions;

public static class CLaimsPrincipleExtensions
{
    public static string GetMemberId(this ClaimsPrincipal user)
    {
        return user.FindFirstValue(ClaimTypes.NameIdentifier) ?? throw new Exception("ICBA");
    }
}