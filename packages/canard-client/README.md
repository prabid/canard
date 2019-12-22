# `canard-client`

A deception-based multiplayer game - client component.

## Usage

```javascript
const canardClient = require("canard-client");
```

### Hosting

```javascript
async componentDidMount() {
  const canard = await canardClient("http://localhost:8080");
  const room = await canard.createRoom();
  this.setState(() => ({ room }));

  canard.onPlayerJoin(room => {
    this.setState(() => ({ room }));
  });
}
```

### Joining a Room

```javascript
const canard = await canardClient("http://localhost:8080");
const playerId = await canard.joinRoom(roomId, name);
```
