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

function drawLine(context, x1, y1, x2, y2) {
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

})