using Microsoft.Extensions.Caching.Distributed;
using Newtonsoft.Json;
using System.Text;
using System.Threading.Tasks;
using TicTacToe.Models;

namespace TicTacToe.Services
{
    public class CacheService
    {
        private readonly IDistributedCache cache;

        public CacheService(IDistributedCache cache)
        {
            this.cache = cache;
        }

        public async Task SaveBoardAsync(string key, TicTacToeBoard board)
        {
            var boardEncoded = Encoding.UTF8.GetBytes(JsonConvert.SerializeObject(board));
            await cache.SetAsync(key, boardEncoded);
        }

        public async Task<TicTacToeBoard> GetBoardAsync(string key)
        {
            var encodedBoard = await cache.GetAsync(key);
            if(encodedBoard == null) { return null; }
            return JsonConvert.DeserializeObject<TicTacToeBoard>(Encoding.UTF8.GetString(encodedBoard));
        }
    }
}
