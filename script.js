// ===== AVIATOR DEMO GAME =====

// Canvas
const canvas = document.getElementById("graph");
const ctx = canvas.getContext("2d");

// UI
const multiplierText = document.getElementById("multiplier");
const statusText = document.getElementById("status");
const balanceText = document.getElementById("balance");
const history = document.getElementById("history");

const betBtn = document.getElementById("betBtn");
const cashBtn = document.getElementById("cashBtn");
const betInput = document.getElementById("bet");

// Canvas Size
canvas.width = 1000;
canvas.height = 520;

// Game State
let balance = 10000;
let bet = 0;

let multiplier = 1;
let crashPoint = 0;

let gameRunning = false;
let playerPlaying = false;
let playerCashedOut = false;

// Plane Position
let planeX = 70;
let planeY = 430;

// Graph
let graph = [];

// Speed
let animation;

// Draw Background Grid
function drawGrid(){

    ctx.clearRect(0,0,canvas.width,canvas.height);

    ctx.strokeStyle="#222";
    ctx.lineWidth=1;

    for(let x=0;x<canvas.width;x+=50){

        ctx.beginPath();
        ctx.moveTo(x,0);
        ctx.lineTo(x,canvas.height);
        ctx.stroke();

    }

    for(let y=0;y<canvas.height;y+=50){

        ctx.beginPath();
        ctx.moveTo(0,y);
        ctx.lineTo(canvas.width,y);
        ctx.stroke();

    }

}

// Update Balance
function updateBalance(){

    balanceText.innerHTML="$"+balance.toFixed(2);

}

// Add History
function addHistory(value){

    const item=document.createElement("span");

    item.innerHTML=value.toFixed(2)+"x";

    if(value>=2){

        item.className="green";

    }else{

        item.className="red";

    }

    history.prepend(item);

    while(history.children.length>12){

        history.removeChild(history.lastChild);

    }

}

updateBalance();
drawGrid();
// Draw Flight Graph
function drawGraph(){

    drawGrid();

    // Draw Curve
    ctx.beginPath();
    ctx.strokeStyle="#ff3b3b";
    ctx.lineWidth=4;

    for(let i=0;i<graph.length;i++){

        if(i===0){
            ctx.moveTo(graph[i].x,graph[i].y);
        }else{
            ctx.lineTo(graph[i].x,graph[i].y);
        }

    }

    ctx.stroke();

    // Draw Plane
    ctx.font="34px Arial";
    ctx.fillText("✈️",planeX,planeY);

}

// Animate
function animate(){

    if(!gameRunning) return;

    multiplier += 0.02;

    multiplierText.innerHTML =
        multiplier.toFixed(2)+"x";

    planeX += 2.8;
    planeY -= 1.4;

    graph.push({
        x:planeX+15,
        y:planeY+15
    });

    drawGraph();

   if(multiplier >= crashPoint){

    endRound();

    return;

}

    animation=requestAnimationFrame(animate);

}
// ===== BET BUTTON =====

betBtn.onclick = function () {

    if(gameRunning) return;

    bet = Number(betInput.value);

    if(bet <= 0){
        alert("Enter a valid bet.");
        return;
    }

    if(bet > balance){
        alert("Not enough balance.");
        return;
    }

    balance -= bet;
    updateBalance();

    playerPlaying = true;
    playerCashedOut = false;

    multiplier = 1;
    planeX = 70;
    planeY = 430;

    graph = [];

    crashPoint = (Math.random() * 8) + 1.5;

    statusText.innerHTML = "Flying...";

    gameRunning = true;

    betBtn.disabled = true;
    cashBtn.disabled = false;

    animate();

};


// ===== CASH OUT BUTTON =====

cashBtn.onclick = function(){

    if(!gameRunning) return;

    if(playerCashedOut) return;

    playerCashedOut = true;

    let win = bet * multiplier;

    balance += win;

    updateBalance();

    statusText.innerHTML =
        "Cashed Out @ " +
        multiplier.toFixed(2) + "x";

    cashBtn.disabled = true;

};
// ===== AUTO RESTART =====

function resetRound(){

    multiplier = 1;

    planeX = 70;
    planeY = 430;

    graph = [];

    drawGrid();

    multiplierText.innerHTML = "1.00x";

    statusText.innerHTML = "Waiting for Bet";

    gameRunning = false;

    playerPlaying = false;
    playerCashedOut = false;

    betBtn.disabled = false;
    cashBtn.disabled = true;

}

function endRound(){

    cancelAnimationFrame(animation);

    gameRunning = false;

    addHistory(crashPoint);

    multiplierText.innerHTML =
        "💥 " + crashPoint.toFixed(2) + "x";

    statusText.innerHTML = "Round Finished";

    betBtn.disabled = true;
    cashBtn.disabled = true;

    setTimeout(resetRound,3000);

}

// Disable Cash Out on page load
cashBtn.disabled = true;

// Draw initial screen
drawGrid();

statusText.innerHTML = "Waiting for Bet";
