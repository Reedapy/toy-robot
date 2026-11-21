# Toy Robot

My take on the toy robot challenge (https://zone.github.io/frontend/toy-robot), built with React + Vite.

## Run

```bash
npm install
npm run dev     # then open http://localhost:5173
npm test        
```

## Assumptions

- 5 x 5 table, (0, 0) is bottom left
- everything's ignored until a valid PLACE
- bad PLACEs and moves off the edge are ignored, the robot stays where it was
- you can PLACE again any time
- commands are buttons instead of typed text, felt more natural

## How it works

- `robot.js` has all the logic. Each command takes the current state and returns `{ state, success }`. If it fails, the old state comes back untouched
- `App.jsx` is just the UI. It calls those functions and shows a green or red message and has the grid with the robot and arrows on it
- directions are in clockwise order, so turning just steps through the list.
- moves are worked out first and only kept if they're still on the table.