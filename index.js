// continue video @ https://youtu.be/vyqbNFMDRGQ?t=3723

const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.4;

class Sprite {
  constructor({ position, velocity, color = "red" }) {
    this.position = position;
    this.velocity = velocity;
    this.width = 50;
    this.height = 150;
    this.lastKey;
    this.attackBox = {
      position: this.position,
      width: 100,
      height: 50,
    };
    this.color = color;
    this.isAttacking;
  }

  draw() {
    c.fillStyle = this.color;
    c.fillRect(this.position.x, this.position.y, this.width, this.height);

    //attackBox drawn
    c.fillStyle = "green";
    c.fillRect(
      this.attackBox.position.x,
      this.attackBox.position.y,
      this.attackBox.width,
      this.attackBox.height
    );
  }

  update() {
    this.draw();

    this.position.x += this.velocity.x;
    // moves players along the x-axis by adding/subtracting velocity to the sprite's position (which is in a range of 0-1024)
    this.position.y += this.velocity.y;
    // moves players along the y-axis by adding/subtracting velocity to the sprite's position (which is in a range of 0-576)

    if (this.position.y + this.height + this.velocity.y >= canvas.height) {
      this.velocity.y = 0;
      //   stops players from going below canvas by limiting the y position in pixels to below or equal 576 pixels
    } else {
      this.velocity.y += gravity;
    }
  }

  attack() {
    this.isAttacking = true;
    setTimeout(() => {
      this.isAttacking = false;
    }, 100);
  }
}

const playerOne = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 0,
  },
});

const playerTwo = new Sprite({
  position: {
    x: 400,
    y: 100,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  color: "blue",
});

// console.log(playerOne);

const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  w: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
  ArrowUp: {
    pressed: false,
  },
};

function animate() {
  window.requestAnimationFrame(animate);
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);
  playerOne.update();
  playerTwo.update();

  playerOne.velocity.x = 0;
  playerTwo.velocity.x = 0;

  //playerOne movement
  if (keys.a.pressed && playerOne.lastKey === "a") {
    playerOne.velocity.x = -2.8;
  } else if (keys.d.pressed && playerOne.lastKey === "d") {
    playerOne.velocity.x = 2.8;
  }
  //playerTwo movement
  if (keys.ArrowLeft.pressed && playerTwo.lastKey === "ArrowLeft") {
    playerTwo.velocity.x = -2.8;
  } else if (keys.ArrowRight.pressed && playerTwo.lastKey === "ArrowRight") {
    playerTwo.velocity.x = 2.8;
  }

  //detect for collision
  if (
    playerOne.attackBox.position.x + playerOne.attackBox.width >=
      playerTwo.position.x &&
    playerOne.attackBox.position.x <= playerTwo.position.x + playerTwo.width &&
    playerOne.attackBox.position.y + playerOne.attackBox.height >=
      playerTwo.position.y &&
    playerOne.attackBox.position.y <= playerTwo.position.y + playerTwo.height &&
    playerOne.isAttacking
  ) {
    console.log("hit");
  }
}

animate();

window.addEventListener("keydown", (event) => {
  // console.log(event.key);
  switch (event.key) {
    //playerOne keys
    case "d":
      keys.d.pressed = true;
      playerOne.lastKey = "d";
      break;
    case "a":
      keys.a.pressed = true;
      playerOne.lastKey = "a";
      break;
    case "w":
      //jump height for playerOne
      playerOne.velocity.y = -13;
      break;
    case " ":
      playerOne.attack();
      break;

    //playerTwo keys
    case "ArrowRight":
      keys.ArrowRight.pressed = true;
      playerTwo.lastKey = "ArrowRight";
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = true;
      playerTwo.lastKey = "ArrowLeft";
      break;
    case "ArrowUp":
      playerTwo.velocity.y = -13;
      break;
  }
  // console.log(event.key);
});

window.addEventListener("keyup", (event) => {
  switch (event.key) {
    //playerOne keys
    case "d":
      keys.d.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;
    case "w":
      keys.w.pressed = false;
      lastKey = "w";
      break;
  }
  //playerTwo keys
  switch (event.key) {
    case "ArrowRight":
      keys.ArrowRight.pressed = false;
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = false;
      break;
  }

  // console.log(event.key);
});
