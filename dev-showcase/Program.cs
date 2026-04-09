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

app.MapControllerRoute(
    name: "root",
    pattern: "",
    defaults: new { controller = "Home", action = "Profile", profile = "itEngineer" });

app.MapControllerRoute(
    name: "langRoot",
    pattern: "{lang}",
    defaults: new { controller = "Home", action = "Profile", profile = "itEngineer" },
    constraints: new { lang = "^(es|en)$" });

app.MapControllerRoute(
    name: "profilesWithLang",
    pattern: "{lang}/{profile}",
    defaults: new { controller = "Home", action = "Profile" },
    constraints: new
    {
        lang = "^(es|en)$",
        profile = @"^(dataScience|webDev|dataAnalyst|DataAnalysis|DataEngineer|PyDev|JavaDev|CDev|fullStack|erpDev|itEngineer)$"
    });

app.MapControllerRoute(
    name: "profiles",
    pattern: "{profile}",
    defaults: new { controller = "Home", action = "Profile" },
    constraints: new { profile = @"^(dataScience|webDev|dataAnalyst|DataAnalysis|DataEngineer|PyDev|JavaDev|CDev|fullStack|erpDev|itEngineer)$" });

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=HomePage}/{id?}")
    .WithStaticAssets();

app.Run();