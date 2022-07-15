using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;

public class DataController: ControllerBase
{
    static Dictionary<string, List<(int,int)>> _dic = new();
    static Dictionary<string, List<TaskCompletionSource>> _clients = new();

[HttpPost]
public ActionResult Post(string roomName, List<(int, int)> x)
{
    _dic[roomName].AddRange(x);
    _clients[roomName].ForEach(x=>x.SetResult());
    return Ok();
}

[HttpGet]
public async Task <IEnumerable<(int, int)>> Get(string roomName, int lastRecord)
{
    if (_dic[roomName].Count > lastRecord)
    {
        return _dic[roomName].Skip(lastRecord);
    }

    else
    {
        System.Threading.Tasks.TaskCompletionSource taskCompletionSource = new();
        _clients[roomName].Add(taskCompletionSource);

        await taskCompletionSource.Task;

        return _dic[roomName].Skip(lastRecord);
    }
}

}
