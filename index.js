// continue video @ https://youtu.be/vyqbNFMDRGQ?t=8588

const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;

const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: "./assets/background.png",
});

const shop = new Sprite({
  position: {
    x: 600,
    y: 128,
  },
  imageSrc: "./assets/shop.png",
  scale: 2.75,
  framesMax: 6,
});

const playerOne = new Fighter({
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

const playerTwo = new Fighter({
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

decreaseTimer();

function animate() {
  window.requestAnimationFrame(animate);
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);
  background.update();
  shop.update();
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

  // end game based on health
  if (playerTwo.health <= 0 || playerOne.health <= 0) {
    determineWinner({ playerOne, playerTwo, timerId });
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
