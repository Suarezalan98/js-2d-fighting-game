// continue video @ https://youtu.be/vyqbNFMDRGQ?t=5542

const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;

class Sprite {
  constructor({ position, velocity, color = "red", offset }) {
    this.position = position;
    this.velocity = velocity;
    this.width = 50;
    this.height = 150;
    this.lastKey;
    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      offset,
      width: 100,
      height: 50,
    };
    this.color = color;
    this.isAttacking;
    this.health = 100;
  }

  draw() {
    c.fillStyle = this.color;
    c.fillRect(this.position.x, this.position.y, this.width, this.height);

    //attack box
    if (this.isAttacking) {
      c.fillStyle = "green";
      c.fillRect(
        this.attackBox.position.x,
        this.attackBox.position.y,
        this.attackBox.width,
        this.attackBox.height
      );
    }
  }

  update() {
    this.draw();
    this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
    this.attackBox.position.y = this.position.y;

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
  offset: {
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
  offset: {
    x: -50,
    y: 0,
  },
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

function rectangularCollision({ rectangle1, rectangle2 }) {
  return (
    rectangle1.attackBox.position.x + rectangle1.attackBox.width >=
      rectangle2.position.x &&
    rectangle1.attackBox.position.x <=
      rectangle2.position.x + rectangle2.width &&
    rectangle1.attackBox.position.y + rectangle1.attackBox.height >=
      rectangle2.position.y &&
    rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
  );
}

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
    playerOne.velocity.x = -5;
  } else if (keys.d.pressed && playerOne.lastKey === "d") {
    playerOne.velocity.x = 5;
  }
  //playerTwo movement
  if (keys.ArrowLeft.pressed && playerTwo.lastKey === "ArrowLeft") {
    playerTwo.velocity.x = -5;
  } else if (keys.ArrowRight.pressed && playerTwo.lastKey === "ArrowRight") {
    playerTwo.velocity.x = 5;
  }

  //detect collision for playerOne
  if (
    rectangularCollision({
      rectangle1: playerOne,
      rectangle2: playerTwo,
    }) &&
    playerOne.isAttacking
  ) {
    playerOne.isAttacking = false;
    playerTwo.health -= 20;
    document.querySelector("#playerTwoHealth").style.width =
      playerTwo.health + "%";
  }
  //detect collision for playerTwo
  if (
    rectangularCollision({
      rectangle1: playerTwo,
      rectangle2: playerOne,
    }) &&
    playerTwo.isAttacking
  ) {
    playerTwo.isAttacking = false;
    playerOne.health -= 20;
    document.querySelector("#playerOneHealth").style.width =
      playerOne.health + "%";
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
    case "ArrowDown":
      playerTwo.isAttacking = true;
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
    // case "w":
    //   keys.w.pressed = false;
    //   lastKey = "w";
    //   break;
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
