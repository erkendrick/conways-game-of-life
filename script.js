
const gameCanvas = document.getElementById("game").getContext("2d");
document.getElementById("game").width = window.innerWidth;
document.getElementById("game").height = window.innerHeight;
const width = document.getElementById("game").width;
const height = document.getElementById("game").height;
const pixelSize = 5;
const timeoutInterval = 40;
let animationTimeoutId = null;

const draw = (x, y, c, s) => {
    gameCanvas.fillStyle = c;
    gameCanvas.fillRect(x, y, s, s);
}

let grid = [];
let temporaryGrid = [];

const cellValue = (x, y) => {
    try {
        return grid[x][y];
    } catch {
        return 0;
    }
}

const countNeighbors = (x, y) => {
    let count = 0;
    if (cellValue(x - 1, y)) {
        count++;
    }
    if (cellValue(x + 1, y)) {
        count++;
    }
    if (cellValue(x, y - 1)) {
        count++;
    }
    if (cellValue(x, y + 1)) {
        count++;
    }
    if (cellValue(x - 1, y - 1)) {
        count++;
    }
    if (cellValue(x + 1, y - 1)) {
        count++;
    }
    if (cellValue(x - 1, y + 1)) {
        count++;
    }
    if (cellValue(x + 1, y + 1)) {
        count++;
    }
    return count;
}

const updateCell = (x, y) => {
    neighbor = countNeighbors(x, y);
    if (neighbor > 4 || neighbor < 3) {
        return 0;
    }
    if (grid[x][y] == 0 && neighbor == 3) {
        return 1;
    }
    return grid[x][y];
}

const update = () => {
    gameCanvas.clearRect(0, 0, width, height);
    draw(0, 0, "black", width);
    for (let x = 0; x < width / pixelSize; x++) {
        for (let y = 0; y < height / pixelSize; y++) {
            temporaryGrid[x][y] = updateCell(x, y);
        }
    }
    grid = temporaryGrid;
    //let cnt = 0;
    for (let x = 0; x < width / pixelSize; x++) {
        for (let y = 0; y < height / pixelSize; y++) {
            if (grid[x][y]) {
                draw(x * pixelSize, y * pixelSize, `rgb(${x}, ${y}, 100)`, pixelSize)
                //cnt += 1;
            }
        }
    }

    // use cnt and condition below to auto-initialize when percentage of dead cells is > 95
    // if (((width / pixelSize) * (height / pixelSize)) / cnt > 95) {
    //     initialize();
    // }
        animationTimeoutId = setTimeout(update, timeoutInterval);
}

const initializeArray = (w, h) => {
    let arr = [];
    for (let x = 0; x < w; x++) {
        arr[x] = [];
        for (let y = 0; y < h; y++) {
            arr[x][y] = 0;
        }
    }
    return arr;
}

const initialize = () => {
    
    grid = initializeArray(width / pixelSize, height / pixelSize);
    temporaryGrid = initializeArray(width / pixelSize, height / pixelSize);
    for (let x = 0; x < width / pixelSize; x++) {
        for (let y = 0; y < height / pixelSize; y++) {
            if (Math.random() > 0.55) {
                grid[x][y] = 1;
            }
        }
    }
    animationTimeoutId = setTimeout(update, timeoutInterval);
}

document.getElementById("game").addEventListener("click", (e) => {
    const mouseX = e.clientX - gameCanvas.canvas.offsetLeft;
    const mouseY = e.clientY - gameCanvas.canvas.offsetTop;
    const x = Math.floor(mouseX / pixelSize);
    const y = Math.floor(mouseY / pixelSize);

     // set a cluster of live cells
     for (let i = -2; i <= 2; i++) {
        for (let j = -2; j <= 2; j++) {
            const newX = x + i;
            const newY = y + j;
            
            if (newX >= 0 && newX < grid.length && newY >= 0 && newY < grid[0].length) {
                grid[newX][newY] = 1;
                draw(newX * pixelSize, newY * pixelSize, `rgb(${x}, ${y}, 100)`, pixelSize);
            }
        }
    }
});

initialize();

const cancelAnimation = () => {
    if (animationTimeoutId) {
        clearTimeout(animationTimeoutId);
    }
}

const resetButton = document.getElementById("reset");
resetButton.addEventListener("click", () => {
    cancelAnimation();
    initialize();
});
