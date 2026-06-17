const DIRECTIONS = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

const OPPOSITE = {
  up: "down",
  down: "up",
  left: "right",
  right: "left",
};

export function createInitialState(size = 20) {
  const mid = Math.floor(size / 2);
  const snake = [
    { x: mid, y: mid },
    { x: mid - 1, y: mid },
    { x: mid - 2, y: mid },
  ];
  return {
    size,
    snake,
    direction: "right",
    pendingDirection: "right",
    food: placeFood(snake, size, Math.random),
    score: 0,
    isGameOver: false,
    isPaused: false,
  };
}

export function queueDirection(state, nextDirection) {
  if (!DIRECTIONS[nextDirection]) return state;
  if (OPPOSITE[state.direction] === nextDirection) return state;
  return { ...state, pendingDirection: nextDirection };
}

export function togglePause(state) {
  if (state.isGameOver) return state;
  return { ...state, isPaused: !state.isPaused };
}

export function restart(state) {
  return createInitialState(state.size);
}

export function step(state, randomFn = Math.random) {
  if (state.isGameOver || state.isPaused) return state;

  const direction = state.pendingDirection;
  const delta = DIRECTIONS[direction];
  const head = state.snake[0];
  const nextHead = { x: head.x + delta.x, y: head.y + delta.y };
  const ateFood = samePos(nextHead, state.food);
  const bodyToCheck = ateFood ? state.snake : state.snake.slice(0, -1);

  if (hitsWall(nextHead, state.size) || hitsSelf(nextHead, bodyToCheck)) {
    return { ...state, direction, isGameOver: true };
  }

  const nextSnake = [nextHead, ...state.snake];
  if (!ateFood) nextSnake.pop();

  return {
    ...state,
    snake: nextSnake,
    direction,
    food: ateFood ? placeFood(nextSnake, state.size, randomFn) : state.food,
    score: ateFood ? state.score + 1 : state.score,
  };
}

export function placeFood(snake, size, randomFn) {
  const occupied = new Set(snake.map((p) => `${p.x},${p.y}`));
  const free = [];
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const key = `${x},${y}`;
      if (!occupied.has(key)) free.push({ x, y });
    }
  }
  if (free.length === 0) return snake[0];
  const idx = Math.floor(randomFn() * free.length);
  return free[idx];
}

function hitsWall(point, size) {
  return point.x < 0 || point.y < 0 || point.x >= size || point.y >= size;
}

function hitsSelf(head, snake) {
  return snake.some((segment) => samePos(segment, head));
}

function samePos(a, b) {
  return a.x === b.x && a.y === b.y;
}
