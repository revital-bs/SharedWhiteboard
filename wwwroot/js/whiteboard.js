"use strict";

var connection = new signalR.HubConnectionBuilder().withUrl("/whiteboard").build();

var app = {};
var contexts = {};

// Hide canvas until connection is established
// document.getElementById("maincanv").hidden = true;

function genContext() {
    let canv = document.createElement("canvas");
    canv.className = "canva";
    canv.height = 360;
    canv.width = 560;
    document.getElementById("canvframe").appendChild(canv);
    let context =  canv.getContext('2d');
//    context.clearRect(0, 0, canv.width, canv.height);
    return context;
}

connection.on("RecieveDraw", (message) => {
    let msg = JSON.parse(message);
    if (msg.user != app.userName)
    {
        if (!contexts.user)
        {
            contexts.user = genContext();
        }
    }
    drawLineInternal(contexts.user, msg.x1, msg.y1, msg.x2, msg.y2, msg.color, msg.stroke);
});

connection.on("RecieveMessage", function (user, message) {
    var msg = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    var encodedMsg = user + " says " + msg;
    var li = document.createElement("li");
    li.textContent = encodedMsg;
    document.getElementById("messagesList").appendChild(li);
});

connection.on("RecieveGroup", function (user, group) {
    var msg = user + " joined " + group;
    var li = document.createElement("li");
    li.textContent = msg;
    document.getElementById("messagesList").appendChild(li);
});

connection.start().catch(function (err) {
    return console.error(err.toString());
});

document.getElementById("joinButton").addEventListener("click", function (event) {
    var user = document.getElementById("userName").value;
    app.userName = user;
    var group = document.getElementById("groupName").value;
    app.groupName = group;
    connection.invoke("JoinGroup", user, group).catch(function (err) {
        return console.error(err.toString());
    });
    connection.invoke("sendGroup", user, group).catch(function (err) {
        return console.error(err.toString());
    });
    event.preventDefault();
});

document.getElementById("sendButton").addEventListener("click", function (event) {
    var user = document.getElementById("userName").value;
    app.userName = user;
    var message = document.getElementById("messageInput").value;
    connection.invoke("sendMessage", user, message).catch(function (err) {
        return console.error(err.toString());
    });
    event.preventDefault();
});

window.addEventListener("load", (z) => {
    let isDrawing = false;
    let x = 0;
    let y = 0;

    const currCanvas = document.getElementById('maincanv');
    const context = currCanvas.getContext('2d');

    currCanvas.addEventListener('mousedown', e => {
        x = e.offsetX;
        y = e.offsetY;
        isDrawing = true;
      });
      
      currCanvas.addEventListener('mousemove', e => {
        if (isDrawing === true) {
          drawLine(context, x, y, e.offsetX, e.offsetY);
          x = e.offsetX;
          y = e.offsetY;
        }
      });
      
      window.addEventListener('mouseup', e => {
        if (isDrawing === true) {
          drawLine(context, x, y, e.offsetX, e.offsetY);
          x = 0;
          y = 0;
          isDrawing = false;
        }
      });
});

function drawLine(context, x1, y1, x2, y2) {
    drawLineInternal(context, x1, y1, x2, y2, color, stroke);
    let msg = { user: app.userName, x1: x1, y1: y1, x2: x2, y2: y2, color: color, stroke: stroke };
    connection.invoke("SendDraw", JSON.stringify(msg));
}

function drawLineInternal(context, x1, y1, x2, y2, color, stroke) {
    context.beginPath();
    context.strokeStyle = color;
    context.lineWidth = stroke;
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.stroke();
    context.closePath();
}

let color = "#336699";
let stroke = 5;

const colorbar = document.getElementById('bar');
colorbar.onclick = (e) => {
    if (e.target.className == "color")
    {
        color = e.target.style.backgroundColor;
    }
}


/* <script src="main.js"></script>
<link rel="stylesheet" href="main.css">
<link rel="shortcut icon" href="#"> */

/* connection.on("JoinGroup", function (userName) {
    var li = document.createElement("li");
    li.textContent = userName;
    document.getElementById("memebersList").appendChild(li); // show list of _clients from cs dataController
    document.getElementById("maincanv").hidden = false; // show canvas to all in group
}); */

//Disable send button until connection is established
/* document.getElementById("sendButton").disabled = true;

.then(function () { })

connection.on("ReceiveMessage", function (user, group, message) {
    var msg = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    var encodedMsg = user + " in group no. " + group + " says " + msg;
    var li = document.createElement("li");
    li.textContent = encodedMsg;
    document.getElementById("messagesList").appendChild(li);
});

connection.start().then(function () {
    document.getElementById("sendButton").disabled = false;
}).catch(function (err) {
    return console.error(err.toString());
});

document.getElementById("sendButton").addEventListener("click", function (event) {
    var user = document.getElementById("userInput").value;
    var group = document.getElementById("groupName").value;
    var message = document.getElementById("messageInput").value;
    connection.invoke("SendMessage", user, group, message).catch(function (err) {
        return console.error(err.toString());
    });
    event.preventDefault();
}); */



/* in react:

const connection = new signalR.HubConnectionBuilder()
  .withUrl("connectionUrl")
  .build();
connection.start().then(res => {
    connection.invoke("JoinGroup", "groupName")  //JoinGroup is C# method name
        .catch(err => {
            console.log(err);
        });
}).catch(err => {
            console.log(err);
        });; */




/* currCanvas.addEventListener("mousemove", (e) => {

    if (isDrawing == true && e.buttons == 1) // on moving mouse
    {
        drawLine(context, x, y, e.offsetX, e.offsetY);
        x = e.offsetX;
        y = e.offsetY;
    }

    else if (e.buttons == 1) // on first pushing mouse
    {
        isDrawing = true;
        x = e.offsetX;
        y = e.offsetY;
    }

    else // when stopping to push mouse
    {
        isDrawing = false;
    }
}) */