var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllersWithViews();
var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseRouting();
app.UseAuthorization();
app.MapStaticAssets();

app.MapGet("/", context =>
{
    context.Response.Redirect("/dataScience", permanent: false);
    return Task.CompletedTask;
});

app.MapControllerRoute(
    name: "profiles",
    pattern: "{profile}",
    defaults: new { controller = "Home", action = "Profile" },
    constraints: new { profile = @"^(dataScience|webDev|dataAnalyst)$" });

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=HomePage}/{id?}")
    .WithStaticAssets();

app.Run();