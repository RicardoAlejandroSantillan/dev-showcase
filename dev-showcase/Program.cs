var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllersWithViews();
var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseStatusCodePagesWithReExecute("/Home/NotFoundPage");
app.UseRouting();
app.UseAuthorization();
app.MapStaticAssets();

app.MapGet("/", context =>
{
    context.Response.Redirect("/dataScience", permanent: false);
    return Task.CompletedTask;
});

app.MapGet("/{lang:regex(^(es|en)$)}", (string lang, HttpContext context) =>
{
    context.Response.Redirect($"/{lang}/dataScience", permanent: false);
    return Task.CompletedTask;
});

app.MapControllerRoute(
    name: "profilesWithLang",
    pattern: "{lang}/{profile}",
    defaults: new { controller = "Home", action = "Profile" },
    constraints: new
    {
        lang = "^(es|en)$",
        profile = @"^(dataScience|webDev|dataAnalyst|DataAnalysis|DataEngineer|PyDev|JavaDev|CDev)$"
    });

app.MapControllerRoute(
    name: "profiles",
    pattern: "{profile}",
    defaults: new { controller = "Home", action = "Profile" },
    constraints: new { profile = @"^(dataScience|webDev|dataAnalyst|DataAnalysis|DataEngineer|PyDev|JavaDev|CDev)$" });

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=HomePage}/{id?}")
    .WithStaticAssets();

app.Run();