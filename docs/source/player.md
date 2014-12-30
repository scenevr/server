---
title: Player
primary_navigation: true
---

# Player

Each player that connects to the scene is represented by a player object. Player elements should not be created or removed directly, you should instead use the methods on the player object. A player is simulated by the client, so changing their attributes in your script will not affect the player. All players are shown with the same representation, a 1.5 unit high pegman.

## Screenshot

<img src="/images/player.png" class="screenshot" />

## Attributes

### uuid

You can use this to keep track of unique players in the game. This uuid is not stable between sessions, if a player reconnects to the scene, their uuid will change.

### position

The players position. This is updated by the client at approximately 5hz. Player positions are not interpolated by the server.

## Methods

### respawn(reason)

Sends the player back to their spawn position. If a `reason` string is specified, this will be displayed to the user to explain why they were respawned.

```javascript
  document.getElementById("deadly-box").addEventListener("collide", function(e){
    e.player.respawn("you touched the deadly box");
  });
```

## Physics

The player is simulated on the client as a 1.0m diameter sphere that has its base at the base of the player. This means that the player will roll down some slopers, will 'slide' off the edge of boxes, and can push their head into geometry when under a low ceiling. Over time the players physics body will hopefully be replaced with a capsule. The players maximum speed is constant in each world at approximately 1m/s. Players motion is damped so they will coast to a stop when not actively moving.