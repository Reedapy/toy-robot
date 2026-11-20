import { useState } from 'react'
import { DIRECTIONS, INITIAL_STATE, place, move, left, right, report, isPlaced } from './robot'
import './App.css'

// y goes top to bottom as 4..0 so (0,0) ends up in the bottom left like the spec says
const ROWS = [4, 3, 2, 1, 0]
const COLUMNS = [0, 1, 2, 3, 4]

const ARROWS = { NORTH: '↑', EAST: '→', SOUTH: '↓', WEST: '←' }

function App() {
  const [robot, setRobot] = useState(INITIAL_STATE)

  // what's typed into the place inputs, kept as strings until PLACE is clicked
  const [x, setX] = useState('0')
  const [y, setY] = useState('0')
  const [facing, setFacing] = useState('NORTH')

  // every button sets a message so there's always feedback
  const [message, setMessage] = useState('Place the robot to start')
  const [success, setSuccess] = useState(true)

  function showResult(text, worked) {
    setMessage(text)
    setSuccess(worked)
  }

  function handlePlace() {
    // Number('') is 0, so an empty box would sneak through as 0.
    // turning it into NaN instead means place() rejects it
    const newX = x === '' ? NaN : Number(x)
    const newY = y === '' ? NaN : Number(y)

    const result = place(robot, newX, newY, facing)
    setRobot(result.state)

    if (result.success) {
      showResult('Placed at ' + report(result.state), true)
    } else {
      showResult('Can\'t place there, x and y need to be whole numbers from 0 to 4', false)
    }
  }

  function handleMove() {
    const result = move(robot)
    setRobot(result.state)

    if (result.success) {
      showResult('Moved to ' + report(result.state), true)
    } else if (!isPlaced(robot)) {
      showResult('Place the robot first', false)
    } else {
      showResult('Can\'t move, that would fall off the table', false)
    }
  }

  // left and right work the same way, so one handler takes whichever function was clicked
  function handleTurn(turnFunction, name) {
    const result = turnFunction(robot)
    setRobot(result.state)

    if (result.success) {
      showResult('Turned ' + name + ', now facing ' + result.state.facing, true)
    } else {
      showResult('Place the robot first', false)
    }
  }

  function handleReport() {
    const position = report(robot)

    if (position === null) {
      showResult('Nothing to report, the robot isn\'t placed yet', false)
    } else {
      showResult('Output: ' + position, true)
    }
  }

  return (
    <main>
      <h1>Toy Robot</h1>
      <p>Control a robot on a 5 x 5 table. (0,0) is the bottom left corner.</p>

      <div className="row">
        <label>
          X
          <input type="number" value={x} onChange={(e) => setX(e.target.value)} />
        </label>

        <label>
          Y
          <input type="number" value={y} onChange={(e) => setY(e.target.value)} />
        </label>

        <label>
          Facing
          <select value={facing} onChange={(e) => setFacing(e.target.value)}>
            {DIRECTIONS.map((direction) => (
              <option key={direction} value={direction}>
                {direction}
              </option>
            ))}
          </select>
        </label>

        <button onClick={handlePlace}>PLACE</button>
      </div>

      <div className="row">
        <button onClick={handleMove}>MOVE</button>
        <button onClick={() => handleTurn(left, 'left')}>LEFT</button>
        <button onClick={() => handleTurn(right, 'right')}>RIGHT</button>
        <button onClick={handleReport}>REPORT</button>
      </div>

      <p className={success ? 'message ok' : 'message error'}>{message}</p>

      <div className="grid">
        {ROWS.map((rowY) =>
          COLUMNS.map((colX) => (
            <div key={colX + ',' + rowY} className="cell">
              {robot.x === colX && robot.y === rowY ? ARROWS[robot.facing] : ''}
            </div>
          ))
        )}
      </div>
    </main>
  )
}

export default App