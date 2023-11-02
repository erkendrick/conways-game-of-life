const gameCanvas = document.getElementById("game").getContext("2d");
document.getElementById("game").width = window.innerWidth;
document.getElementById("game").height = window.innerHeight;
const width = document.getElementById("game").width;
const height = document.getElementById("game").height;
const pixelSize = 5;
const spawnProbability = 0;
const targetFPS = 24;

const draw = (x, y, c, s) => {
    gameCanvas.fillStyle = c;
    gameCanvas.fillRect(x, y, s, s);
}

let grid = [];
let temporaryGrid = [];

const cellValue = (x, y) => {
    x = (x + width / pixelSize) % (width / pixelSize);
    y = (y + height / pixelSize) % (height / pixelSize);

    return grid[x][y];
}

const countNeighbors = (x, y) => {
    let count = 0;

    for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
            if (dx === 0 && dy === 0) {
                continue;
            }
            count += cellValue(x + dx, y + dy);
        }
    }

    return count;
}


//Conway ruleset
const updateCell = (x, y) => {
    neighbor = countNeighbors(x, y);
    if (grid[x][y] == 1 && (neighbor == 2 || neighbor == 3)) {
        return 1;
    }
    if (grid[x][y] == 1 && (neighbor < 2 || neighbor > 3)) {
        return 0;
    }
    if (grid[x][y] == 0 && neighbor == 3) {
        return 1;
    }

    return 0;
}




const update = (timestamp) => {
    if (!update.lastTimestamp) {
        update.lastTimestamp = timestamp;
    }
    const deltaTime = timestamp - update.lastTimestamp;

    if (deltaTime >= 1000 / targetFPS) {
        gameCanvas.clearRect(0, 0, width, height);
        draw(0, 0, "black", width);
        temporaryGrid = initializeArray(width / pixelSize, height / pixelSize);

        for (let x = 0; x < width / pixelSize; x++) {
            for (let y = 0; y < height / pixelSize; y++) {
                temporaryGrid[x][y] = updateCell(x, y);
            }
        }

        grid = temporaryGrid;

        for (let x = 0; x < width / pixelSize; x++) {
            for (let y = 0; y < height / pixelSize; y++) {
                if (grid[x][y]) {
                    draw(x * pixelSize, y * pixelSize, `rgb(${x / 2}, ${y / 2}, 255)`, pixelSize)
                }
            }
        }

        update.lastTimestamp = timestamp;
    }

    animationHandle = requestAnimationFrame(update);
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

    for (let x = 0; x < width / pixelSize; x++) {
        for (let y = 0; y < height / pixelSize; y++) {
            if (Math.random() > spawnProbability) {
                grid[x][y] = 1;
            }
        }
    }

    requestAnimationFrame(update);
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
                draw(newX * pixelSize, newY * pixelSize, `rgb(${x}, ${y}, 0)`, pixelSize);
            }
        }
    }
});

initialize();

let animationHandle;

const cancelAnimation = () => {
    if (animationHandle) {
        cancelAnimationFrame(animationHandle);
        animationHandle = null;
    }
}

const resetButton = document.getElementById("reset");
resetButton.addEventListener("click", () => {
    cancelAnimation();
    initialize();
});
