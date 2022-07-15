using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace WhiteboardServer.Hubs
{
    public class WhiteboardServerHub : Hub
    {
    //    static Dictionary<string, List<string>> _users = new Dictionary<string, List<string>>();

        public Task SendDraw(string message)
        {
            return Clients.Others.SendAsync("RecieveDraw", message);
        }

        public Task SendDrawToGroup(string message, string group)
        {
            return Clients.Group(group).SendAsync("RecieveDraw", message);
        }

        public Task JoinGroup(string userName, string groupName)
        {
        //    _users[groupName].Add(userName);
            return Groups.AddToGroupAsync(Context.ConnectionId, groupName);
        }

        public Task LeaveGroup(string userName, string groupName)
        {
        //    _users[groupName].Remove(userName);
            return Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);
        }
        public async Task SendMessage(string user, string message)
        {
            await Clients.All.SendAsync("RecieveMessage", user, message);
        }

        public async Task SendGroup(string user, string group)
        {
            await Clients.All.SendAsync("RecieveGroup", user, group);
        }
    }
}


