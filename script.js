let multiplier = 1.00;
let gameRunning = false;
let interval;

const multiplierText = document.getElementById("multiplier");
const plane = document.querySelector(".plane");
const betBtn = document.getElementById("betBtn");
const cashBtn = document.getElementById("cashBtn");
const historyList = document.getElementById("historyList");

let planeX = 30;
let planeY = 40;

betBtn.onclick = startGame;
cashBtn.onclick = cashOut;

function startGame() {

    if (gameRunning) return;

    gameRunning = true;
    multiplier = 1.00;

    planeX = 30;
    planeY = 40;

    betBtn.disabled = true;
    cashBtn.disabled = false;

    const crashPoint = (Math.random() * 8 + 1.5).toFixed(2);

    interval = setInterval(() => {

        multiplier += 0.02;

        multiplierText.innerHTML = multiplier.toFixed(2) + "x";

        planeX += 3;
        planeY += 2;

        plane.style.left = planeX + "px";
        plane.style.bottom = planeY + "px";

        if (multiplier >= crashPoint) {

            clearInterval(interval);

            multiplierText.innerHTML = "💥 CRASH @ " + crashPoint + "x";

            historyList.innerHTML =
                crashPoint + "x<br>" + historyList.innerHTML;

            gameRunning = false;

            betBtn.disabled = false;
            cashBtn.disabled = true;

        }

    }, 80);

}

function cashOut() {

    if (!gameRunning) return;

    clearInterval(interval);

    alert(
        "You cashed out at " +
        multiplier.toFixed(2) +
        "x"
    );

    historyList.innerHTML =
        multiplier.toFixed(2) + "x (Cash Out)<br>" +
        historyList.innerHTML;

    gameRunning = false;

    betBtn.disabled = false;
    cashBtn.disabled = true;

}
