import {
  createInitialState,
  queueDirection,
  restart,
  step,
  togglePause,
} from "./gameLogic.js";

const TICK_MS = 140;
let state = createInitialState(20);

const boardEl = document.getElementById("board");
const scoreEl = document.getElementById("score");
const statusEl = document.getElementById("status");
const restartBtn = document.getElementById("restartBtn");
const pauseBtn = document.getElementById("pauseBtn");

function initBoard(size) {
  boardEl.innerHTML = "";
  for (let i = 0; i < size * size; i += 1) {
    const cell = document.createElement("div");
    cell.className = "cell";
    boardEl.appendChild(cell);
  }
}

function render() {
  const cells = boardEl.children;
  for (let i = 0; i < cells.length; i += 1) {
    cells[i].className = "cell";
  }

  state.snake.forEach(({ x, y }) => {
    const idx = y * state.size + x;
    cells[idx].classList.add("snake");
  });

  const foodIdx = state.food.y * state.size + state.food.x;
  cells[foodIdx].classList.add("food");

  scoreEl.textContent = String(state.score);

  if (state.isGameOver) {
    statusEl.textContent = "Game Over";
  } else if (state.isPaused) {
    statusEl.textContent = "Paused";
  } else {
    statusEl.textContent = "Running";
  }

  pauseBtn.textContent = state.isPaused ? "Resume" : "Pause";
}

function setDirectionFromKey(key) {
  const map = {
    ArrowUp: "up",
    ArrowDown: "down",
    ArrowLeft: "left",
    ArrowRight: "right",
    w: "up",
    s: "down",
    a: "left",
    d: "right",
  };
  const dir = map[key];
  if (dir) state = queueDirection(state, dir);
}

document.addEventListener("keydown", (event) => {
  if (event.key === " ") {
    event.preventDefault();
    state = togglePause(state);
    render();
    return;
  }
  setDirectionFromKey(event.key);
});

document.querySelectorAll("[data-dir]").forEach((button) => {
  button.addEventListener("click", () => {
    const dir = button.getAttribute("data-dir");
    state = queueDirection(state, dir);
  });
});

restartBtn.addEventListener("click", () => {
  state = restart(state);
  render();
});

pauseBtn.addEventListener("click", () => {
  state = togglePause(state);
  render();
});

initBoard(state.size);
render();

setInterval(() => {
  state = step(state);
  render();
}, TICK_MS);
