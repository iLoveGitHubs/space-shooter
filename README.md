# Space Shooter

A HTML5 Canvas space shooter game written in a single `index.html` file with a lightweight Node.js static server.

## How to Run

### Node.js
```bash
node server.js
```
Then open http://localhost:8080 in your browser.

### Docker
```bash
docker build -t space-shooter .
docker run -p 8080:8080 space-shooter
```

## Controls
- **Move:** Arrow keys or WASD
- **Shoot:** Space
- **Restart:** R or Space (after game over)

## Health Check
`GET /health` returns `{"status":"healthy"}`.
