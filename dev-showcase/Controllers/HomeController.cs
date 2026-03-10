using dev_showcase.Models;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;

namespace dev_showcase.Controllers
{
    public class HomeController : Controller
    {
        private static readonly HashSet<string> ValidProfiles = new()
        {
            "dataScience",
            "webDev",
            "dataAnalyst"
        };

        public IActionResult Profile(string profile)
        {
            if (!ValidProfiles.Contains(profile))
                return NotFound();

            ViewData["Profile"] = profile;
            return View("HomePage");
        }

        [HttpPost]
        public IActionResult SetLanguage(string lang)
        {
            Response.Cookies.Append("lang", lang ?? "es", new CookieOptions
            {
                Expires = DateTimeOffset.UtcNow.AddYears(1),
                IsEssential = true
            });
            return Ok();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}