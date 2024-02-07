// Connect to the server with Socket.IO
const socket = io();

// Select the Canvas element
const canvas = document.getElementById('myCanvas');
const context = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let drawing = false; // Drawing mode: true if drawing, false if not
let prevX = 0; // Previous mouse position X
let prevY = 0; // Previous mouse position Y

// When drawing starts
canvas.addEventListener('mousedown', (e) => {
    drawing = true; // Start drawing mode
    [prevX, prevY] = [e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop]; // Set the starting point
    context.beginPath(); // Start a new drawing path
    context.moveTo(prevX, prevY); // Move to the starting point
});

// When drawing continues
canvas.addEventListener('mousemove', (e) => {
    if (!drawing) return; // Exit if not in drawing mode

    const currentX = e.clientX - canvas.offsetLeft; // Current mouse position X
    const currentY = e.clientY - canvas.offsetTop; // Current mouse position Y

    // Draw a smooth line between the two points
    context.lineJoin = 'round'; // Round line joins
    context.lineCap = 'round'; // Round line ends
    context.lineWidth = 2; // Line thickness
    context.lineTo(currentX, currentY); // Draw up to the current position
    context.stroke(); // Apply the drawing

    // Emit more precise drawing information to the server
    socket.emit('draw', {
        x1: prevX,
        y1: prevY,
        x2: currentX,
        y2: currentY,
    });

    [prevX, prevY] = [currentX, currentY]; // Update the previous position to the current position
});

// When drawing ends
canvas.addEventListener('mouseup', () => {
    drawing = false; // End drawing mode
    context.closePath(); // Close the drawing path
});

// Receive drawing information from the server
socket.on('draw', (data) => {
    // Draw based on the received drawing information
    context.lineJoin = 'round';
    context.lineCap = 'round';
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(data.x1, data.y1);
    context.lineTo(data.x2, data.y2);
    context.stroke();
});
