import test from 'node:test'
import assert from 'node:assert/strict'
import { INITIAL_STATE, place, move, left, right, report } from './robot.js'

// 
function placedAt(x, y, facing) {
  return place(INITIAL_STATE, x, y, facing).state
}

test('places the robot on a valid square', () => {
  const result = place(INITIAL_STATE, 0, 0, 'NORTH')
  assert.equal(result.success, true)
  assert.equal(report(result.state), '0, 0, NORTH')
})

test('rejects placing off the table', () => {
  assert.equal(place(INITIAL_STATE, 5, 0, 'NORTH').success, false)
  assert.equal(place(INITIAL_STATE, 0, -1, 'NORTH').success, false)
})

test('rejects decimals, NaN and made up directions', () => {
  assert.equal(place(INITIAL_STATE, 1.5, 0, 'NORTH').success, false)
  assert.equal(place(INITIAL_STATE, NaN, 0, 'NORTH').success, false)
  assert.equal(place(INITIAL_STATE, 0, 0, 'UP').success, false)
})

test('a bad place keeps the robot where it was', () => {
  const robot = placedAt(1, 2, 'EAST')
  const result = place(robot, 9, 9, 'WEST')
  assert.equal(result.success, false)
  assert.equal(report(result.state), '1, 2, EAST')
})

test('ignores everything before the first place', () => {
  assert.equal(move(INITIAL_STATE).success, false)
  assert.equal(left(INITIAL_STATE).success, false)
  assert.equal(right(INITIAL_STATE).success, false)
  assert.equal(report(INITIAL_STATE), null)
})

test('moves one square in the direction it faces', () => {
  assert.equal(report(move(placedAt(2, 2, 'NORTH')).state), '2, 3, NORTH')
  assert.equal(report(move(placedAt(2, 2, 'EAST')).state), '3, 2, EAST')
  assert.equal(report(move(placedAt(2, 2, 'SOUTH')).state), '2, 1, SOUTH')
  assert.equal(report(move(placedAt(2, 2, 'WEST')).state), '1, 2, WEST')
})

test('wont move off any edge', () => {
  assert.equal(move(placedAt(4, 4, 'NORTH')).success, false)
  assert.equal(move(placedAt(4, 0, 'EAST')).success, false)
  assert.equal(move(placedAt(0, 0, 'SOUTH')).success, false)
  assert.equal(move(placedAt(0, 0, 'WEST')).success, false)
})

test('left and right wrap around', () => {
  // left from NORTH is the one that needs the + DIRECTIONS.length bit,
  // right from WEST checks it goes back to the start of the array
  assert.equal(left(placedAt(0, 0, 'NORTH')).state.facing, 'WEST')
  assert.equal(right(placedAt(0, 0, 'WEST')).state.facing, 'NORTH')
})

test('turning doesnt move the robot', () => {
  assert.equal(report(right(placedAt(3, 1, 'NORTH')).state), '3, 1, EAST')
})

// the three examples from the challenge page
test('example a', () => {
  let robot = placedAt(0, 0, 'NORTH')
  robot = move(robot).state
  assert.equal(report(robot), '0, 1, NORTH')
})

test('example b', () => {
  let robot = placedAt(0, 0, 'NORTH')
  robot = left(robot).state
  assert.equal(report(robot), '0, 0, WEST')
})

test('example c', () => {
  let robot = placedAt(1, 2, 'EAST')
  robot = move(robot).state
  robot = move(robot).state
  robot = left(robot).state
  robot = move(robot).state
  assert.equal(report(robot), '3, 3, NORTH')
})