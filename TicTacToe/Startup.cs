using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using TicTacToe.Hubs;

namespace TicTacToe
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddHealthChecks();
            services.AddSignalR();
            services.AddCors();
            services.AddControllers();
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseRouting();

            // app.UseAuthorization();

            app.UseCors(
                options => options.WithOrigins("http://localhost:3000")
                    .AllowAnyMethod().AllowAnyHeader().AllowCredentials()
            );

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapHealthChecks("/health");
                endpoints.MapControllers();
                endpoints.MapHub<GameHub>("/game");
            });
        }
    }
}
