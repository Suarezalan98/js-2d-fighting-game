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
  imageSrc: "./assets/samuraiMack/Idle.png",
  framesMax: 8,
  scale: 2.5,
  offset: {
    x: 215,
    y: 157,
  },
  sprites: {
    idle: {
      imageSrc: "./assets/samuraiMack/Idle.png",
      framesMax: 8,
    },
    run: {
      imageSrc: "./assets/samuraiMack/Run.png",
      framesMax: 8,
    },
    jump: {
      imageSrc: "./assets/samuraiMack/Jump.png",
      framesMax: 2,
    },
    fall: {
      imageSrc: "./assets/samuraiMack/Fall.png",
      framesMax: 2,
    },
    attack1: {
      imageSrc: "./assets/samuraiMack/Attack1.png",
      framesMax: 6,
    },
    takeHit: {
      imageSrc: "./assets/samuraiMack/Take Hit - white silhouette.png",
      framesMax: 4,
    },
    death: {
      imageSrc: "./assets/samuraiMack/Death.png",
      framesMax: 6,
    },
  },
  attackBox: {
    offset: {
      x: 100,
      y: 50,
    },
    width: 160,
    height: 50,
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
  imageSrc: "./assets/kenji/Idle.png",
  framesMax: 4,
  scale: 2.5,
  offset: {
    x: 215,
    y: 167,
  },
  sprites: {
    idle: {
      imageSrc: "./assets/kenji/Idle.png",
      framesMax: 4,
    },
    run: {
      imageSrc: "./assets/kenji/Run.png",
      framesMax: 8,
    },
    jump: {
      imageSrc: "./assets/kenji/Jump.png",
      framesMax: 2,
    },
    fall: {
      imageSrc: "./assets/kenji/Fall.png",
      framesMax: 2,
    },
    attack1: {
      imageSrc: "./assets/kenji/Attack1.png",
      framesMax: 4,
    },
    takeHit: {
      imageSrc: "./assets/kenji/Take hit.png",
      framesMax: 3,
    },
    death: {
      imageSrc: "./assets/kenji/Death.png",
      framesMax: 7,
    },
  },
  attackBox: {
    offset: {
      x: -170,
      y: 50,
    },
    width: 170,
    height: 50,
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
  c.fillStyle = "rgba(255, 255, 255, 0.15)";
  c.fillRect(0, 0, canvas.width, canvas.height);
  playerOne.update();
  playerTwo.update();

  playerOne.velocity.x = 0;
  playerTwo.velocity.x = 0;

  //playerOne movement
  if (keys.a.pressed && playerOne.lastKey === "a") {
    playerOne.velocity.x = -5;
    playerOne.switchSprite("run");
  } else if (keys.d.pressed && playerOne.lastKey === "d") {
    playerOne.velocity.x = 5;
    playerOne.switchSprite("run");
  } else {
    playerOne.switchSprite("idle");
  }

  //playerOne jump
  if (playerOne.velocity.y < 0) {
    playerOne.switchSprite("jump");
  } else if (playerOne.velocity.y > 0) {
    playerOne.switchSprite("fall");
  }

  //playerTwo movement
  if (keys.ArrowLeft.pressed && playerTwo.lastKey === "ArrowLeft") {
    playerTwo.velocity.x = -5;
    playerTwo.switchSprite("run");
  } else if (keys.ArrowRight.pressed && playerTwo.lastKey === "ArrowRight") {
    playerTwo.velocity.x = 5;
    playerTwo.switchSprite("run");
  } else {
    playerTwo.switchSprite("idle");
  }

  //playerTwo jump
  if (playerTwo.velocity.y < 0) {
    playerTwo.switchSprite("jump");
  } else if (playerTwo.velocity.y > 0) {
    playerTwo.switchSprite("fall");
  }

  //detect collision for playerOne & playerTwo gets hit
  if (
    rectangularCollision({
      rectangle1: playerOne,
      rectangle2: playerTwo,
    }) &&
    playerOne.isAttacking &&
    playerOne.framesCurrent === 4
  ) {
    playerTwo.takeHit();
    playerOne.isAttacking = false;

    gsap.to("#playerTwoHealth", {
      width: playerTwo.health + "%",
    });
  }

  // if playerOne misses
  if (playerOne.isAttacking && playerOne.framesCurrent === 4) {
    playerOne.isAttacking = false;
  }

  //detect collision for playerTwo
  if (
    rectangularCollision({
      rectangle1: playerTwo,
      rectangle2: playerOne,
    }) &&
    playerTwo.isAttacking &&
    playerTwo.framesCurrent === 2
  ) {
    playerOne.takeHit();
    playerTwo.isAttacking = false;

    gsap.to("#playerOneHealth", {
      width: playerOne.health + "%",
    });
  }

  // if playerTwo misses
  if (playerTwo.isAttacking && playerTwo.framesCurrent === 2) {
    playerTwo.isAttacking = false;
  }

  // end game based on health
  if (playerTwo.health <= 0 || playerOne.health <= 0) {
    determineWinner({ playerOne, playerTwo, timerId });
  }
}

animate();

window.addEventListener("keydown", (event) => {
  if (!playerOne.dead) {
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
    }
  }
  if (!playerTwo.dead) {
    switch (event.key) {
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
        playerTwo.attack();
        break;
    }
  }
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
