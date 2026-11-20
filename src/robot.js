// 5 x 5 table, so anything from 0 to 4 is fine
const TABLE_SIZE = 5

// the four directions the robot can face
export const DIRECTIONS = ['NORTH', 'EAST', 'SOUTH', 'WEST']

// robot isn't on the table yet, so is null until it is placed
export const INITIAL_STATE = {
  x: null,
  y: null,
  facing: null,
}

// if it has a direction, it's been placed
export function isPlaced(state) {
  return state.facing !== null
}

// Number.isInteger also catches NaN and decimals like 1.5,
// so I don't need separate checks for those
function isOnTable(x, y) {
  return (
    Number.isInteger(x) &&
    Number.isInteger(y) &&
    x >= 0 &&
    x < TABLE_SIZE &&
    y >= 0 &&
    y < TABLE_SIZE
  )
}

// hands back { state, success } so the caller can tell
// if it worked. if it fails I just return the old state,
// that way a bad place can't mess up where the robot is
export function place(state, x, y, facing) {
  if (!isOnTable(x, y) || !DIRECTIONS.includes(facing)) {
    return { state, success: false }
  }

  return { state: { x, y, facing }, success: true }
}

// how much x and y change for one step in each direction.
// (0,0) is bottom left, so north is y + 1 and east is x + 1
const MOVES = {
  NORTH: { dx: 0, dy: 1 },
  EAST: { dx: 1, dy: 0 },
  SOUTH: { dx: 0, dy: -1 },
  WEST: { dx: -1, dy: 0 },
}

export function move(state) {
  if (!isPlaced(state)) {
    return { state, success: false }
  }

  // work out where it would end up first, then decide if that's allowed
  const step = MOVES[state.facing]
  const newX = state.x + step.dx
  const newY = state.y + step.dy

  // would fall off the edge, so just ignore the move
  if (!isOnTable(newX, newY)) {
    return { state, success: false }
  }

  // new object instead of changing the old one, React likes that
  return { state: { x: newX, y: newY, facing: state.facing }, success: true }
}

export function left(state) {
  return turn(state, -1)
}

export function right(state) {
  return turn(state, 1)
}

// directions are in clockwise order, so turning is just stepping
// forwards/backwards through the array.
// -1 for left, 1 for right. had to add DIRECTIONS.length because
// in JS -1 % 4 gives -1 not 3, so turning left from NORTH would break
function turn(state, steps) {
  if (!isPlaced(state)) {
    return { state, success: false }
  }

  const index = DIRECTIONS.indexOf(state.facing)
  const newIndex = (index + steps + DIRECTIONS.length) % DIRECTIONS.length

  return { state: { x: state.x, y: state.y, facing: DIRECTIONS[newIndex] }, success: true }
}

// null when there's nothing to report, so the caller can tell it's not placed
export function report(state) {
  if (!isPlaced(state)) {
    return null
  }

  return state.x + ', ' + state.y + ', ' + state.facing
}