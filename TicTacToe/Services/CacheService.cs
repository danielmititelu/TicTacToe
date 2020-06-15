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

        public async Task SaveAsync<T>(string key, T obj)
        {
            var playerEncoded = Encoding.UTF8.GetBytes(JsonConvert.SerializeObject(obj));
            await cache.SetAsync(key, playerEncoded);
        }

        public async Task<T> GetAsync<T>(string key)
        {
            var encodedBoard = await cache.GetAsync(key);
            if (encodedBoard == null) { return default; }
            return JsonConvert.DeserializeObject<T>(Encoding.UTF8.GetString(encodedBoard));
        }

        public async Task RemoveAsync(string key)
        {
            await cache.RemoveAsync(key);
        }
    }
}
