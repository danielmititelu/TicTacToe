using Microsoft.AspNetCore.SignalR;
using System;
using System.Threading.Tasks;
using TicTacToe.Models;
using TicTacToe.Services;

namespace TicTacToe.Hubs
{
    public class GameHub : Hub
    {
        private readonly CacheService cache;

        public GameHub(CacheService cache)
        {
            this.cache = cache;
        }

        public async Task GetPlayerUuid()
        {
            //todo: consider encoding this in a jwt token
            var uuid = Guid.NewGuid().ToString();
            await Clients.Caller.SendAsync("playerUuid", uuid);
        }

        public async Task CreateRoom(Player player)
        {
            var roomUuid = player.Uuid;
            player.ConnectionId = Context.ConnectionId;
            player.ConnectedGameUuid = roomUuid;
            var board = TicTacToeEngine.InitializeBoard(player);
            await cache.SaveAsync(roomUuid, board);
            await cache.SaveAsync(player.ConnectionId, player);
            await Clients.Caller.SendAsync("board", board);
        }

        public async Task JoinRoom(Player player, string roomUuid)
        {
            var board = await cache.GetAsync<TicTacToeBoard>(roomUuid);
            if (board == null)
            {
                await Clients.Caller.SendAsync("error", "room not found");
            }
            player.ConnectionId = Context.ConnectionId;
            player.ConnectedGameUuid = roomUuid;
            var newBoard = TicTacToeEngine.AddSecondPlayer(player, board);
            await cache.SaveAsync(player.ConnectionId, player);
            await cache.SaveAsync(roomUuid, newBoard);
            await Clients.Client(newBoard.FirstPlayer.ConnectionId).SendAsync("board", newBoard);
            await Clients.Client(newBoard.SecondPlayer.ConnectionId).SendAsync("board", newBoard);
        }

        public async Task GetBoard(string roomUuid)
        {
            var board = await cache.GetAsync<TicTacToeBoard>(roomUuid);
            await Clients.Caller.SendAsync("board", board);
        }

        public async Task StartGame(string roomUuid)
        {
            var board = await cache.GetAsync<TicTacToeBoard>(roomUuid);
            await Clients.Client(board.FirstPlayer.ConnectionId).SendAsync("startGame");
            await Clients.Client(board.SecondPlayer.ConnectionId).SendAsync("startGame");
        }

        public async Task SendMark(int i, int j, string roomUuid, Player player)
        {
            var board = await cache.GetAsync<TicTacToeBoard>(roomUuid);

            board = TicTacToeEngine.AddMark(player.Uuid, i, j, board);

            await cache.SaveAsync(roomUuid, board);
            await Clients.Client(board.FirstPlayer.ConnectionId).SendAsync("board", board);
            await Clients.Client(board.SecondPlayer.ConnectionId).SendAsync("board", board);
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            var player = await cache.GetAsync<Player>(Context.ConnectionId);
            if (player != null)
            {
                var roomUuid = player.ConnectedGameUuid;
                var board = await cache.GetAsync<TicTacToeBoard>(roomUuid);
                if (board != null)
                {
                    if (board.FirstPlayer == null || board.SecondPlayer == null)
                    {
                        await cache.RemoveAsync(roomUuid);
                    }
                    else if (board.FirstPlayer.ConnectionId == Context.ConnectionId)
                    {
                        board.FirstPlayer = null;
                        await Clients.Client(board.SecondPlayer.ConnectionId).SendAsync("board", board);
                    }
                    else if (board.SecondPlayer.ConnectionId == Context.ConnectionId)
                    {
                        board.SecondPlayer = null;
                        await Clients.Client(board.FirstPlayer.ConnectionId).SendAsync("board", board);
                    }
                }
                await cache.SaveAsync(roomUuid, board);
                await cache.RemoveAsync(player.ConnectionId);
            }
            await base.OnDisconnectedAsync(exception);
        }
    }
}
