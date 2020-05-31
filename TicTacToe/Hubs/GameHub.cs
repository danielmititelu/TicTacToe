using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace TicTacToe.Hubs
{
    public class GameHub : Hub
    {
        public async Task Send(int i, int j)
        {
            await Clients.All.SendAsync("broadcastMessage", i, j);
        }
    }
}
