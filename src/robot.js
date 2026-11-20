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

// hands back { state, success } so calls can tell
// if it worked. if it fails I just return the old state,
// that way a bad place can't mess up where the robot is
export function place(state, x, y, facing) {
  if (!isOnTable(x, y) || !DIRECTIONS.includes(facing)) {
    return { state, success: false }
  }

  return { state: { x, y, facing }, success: true }
}