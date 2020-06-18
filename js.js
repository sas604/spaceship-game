let canvas = document.getElementById("canvas");
let stage = canvas.getContext("2d");

let speed = 0;
let speedY = 0;
let moveR = false;
let moveL = false;
let moveUp = false;
let moveDown = false;
let maxSpeed = 7;
let frameCount = 0;
let frameFactor = 3;
let speedFactor = 0.4;
let asteroidsRate = 0;
let level = 60;
let playing = false;
let scoreDisplay = document.getElementById("score");
let hScoreDisplay = document.getElementById("hScore").lastElementChild;
let hScore = 0;
let score = 0;
// check if high score in local storage
if (localStorage.highScore) {
    hScore = localStorage.highScore;
    hScoreDisplay.innerHTML = hScore;
}

// Sprite Object constructor
function Sprite(
    source,
    sourceX,
    sourceY,
    sourceWidth,
    sourceHeight,
    x,
    y,
    width,
    height
) {
    this.image = new Image();
    this.image.src = source;
    this.sourceX = sourceX;
    this.sourceY = sourceY;
    this.sourceWidth = sourceWidth;
    this.sourceHeight = sourceHeight;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
}

// space ship Object
let spaceShip = new Sprite(
    "images/ship-sprite.png",
    0,
    0,
    102,
    215,
    false,
    false,
    102 / 2,
    215 / 2
);

// asteroid object

let bg = new Sprite("images/bg.jpg", 0, 0, 640, 1280, 0, -640, 640, 1280);
bg.speedY = 1;
let sprites = [];
let asteroidsA = [];
sprites.push(bg);

let exp = new Sprite("images/exp1.png", 0, 0, 100, 100, 0, 0, 50, 50);
render();

function render() {
    window.requestAnimationFrame(render, canvas);
    stage.clearRect(0, 0, 640, 640);

    //loop trough asteroid array
    asteroidsA.forEach(function (rock) {
        rock.x += rock.speedX;
        rock.y += rock.speedY;
        // spin the asteroid
        if (frameCount % frameFactor === 0) {
            rock.sourceX += 104;

            if (rock.sourceX > 240) {
                rock.sourceX = 0;
            }
        }
        // hit test
        if (hitTest(rock) && playing) {
            sprites.splice(sprites.indexOf(spaceShip), 1);
            sprites.splice(sprites.indexOf(rock), 1);
            asteroidsA.splice(asteroidsA.indexOf(rock), 1);
            exp.x = rock.x;
            exp.y = rock.y;
            sprites.push(exp);
            playing = false;

            playBtn.innerHTML = "Play Again";
        }
        // remove asteroid when of the screen
        if (rock.y > 700) {
            sprites.splice(sprites.indexOf(rock), 1);
            asteroidsA.splice(asteroidsA.indexOf(rock), 1);
        }
    });
    // palay button
    if (!playing) {
        exp.height += 1;
        exp.width += 1;
        if (exp.height > 200) {
            exp.height = 200;
            exp.width = 200;
            playBtn.style.display = "block";
        }
    }
    sprites.forEach((spr) =>
        stage.drawImage(
            spr.image,
            spr.sourceX,
            spr.sourceY,
            spr.sourceWidth,
            spr.sourceHeight,
            spr.x,
            spr.y,
            spr.width,
            spr.height
        )
    );
    // count frames;
    frameCount++;
    //speed set
    spaceShip.x += speed;
    spaceShip.y += speedY;
    bg.y += bg.speedY;

    // background move
    if (bg.y > 0) {
        bg.y = -640;
    }

    // spaceShip move
    if (moveR) {
        spaceShip.sourceY = 215.5;
        speed += speedFactor;
        if (speed > maxSpeed) {
            speed = maxSpeed;
        }
    } else if (moveL) {
        speed += -speedFactor;
        if (speed < -maxSpeed) {
            speed = -maxSpeed;
        }
        spaceShip.sourceY = 431;
    } else {
        if (speed > 0) {
            speed = speed - speedFactor;
            if (speed < 0) {
                speed = 0;
            }
        } else if (speed < 0) {
            speed += speedFactor;
            if (speed > 0) {
                speed = 0;
            }
        }
        spaceShip.sourceY = 0;
    }

    if (moveUp) {
        speedY += -speedFactor;
        if (speedY < -maxSpeed) {
            speedY = -maxSpeed;
        }
    } else if (moveDown) {
        speedY += speedFactor;
        if (speedY < maxSpeed) {
            speedY = maxSpeed;
        }
    } else {
        speedY = speedFactor;
    }

    if (speed === 0 && speedY === speedFactor) {
        spaceShip.sourceX = 0;
    }
    /// call asteroids
    if (frameCount % level === 0) {
        asteroids();
    }
    //inc level
    if (frameCount % 600 === 0) {
        if (level > 20) {
            level = Math.floor(level * 0.8);
        }
    }
    if (frameCount % frameFactor === 0) {
        spaceShip.sourceX += 102;
        //score update
        if (playing) {
            score++;
            scoreDisplay.innerHTML = score;
        }

        if (spaceShip.sourceX > 1320) {
            spaceShip.sourceX = 0;
        }
    }

    // prevent Spaceship from go outside the canvas

    if (spaceShip.x + spaceShip.width > 640 + spaceShip.width + 1) {
        spaceShip.x = 0 - spaceShip.width;
    }

    if (spaceShip.x < 0 - spaceShip.width - 1) {
        spaceShip.x = 640;
    }

    if (spaceShip.y < 150) {
        spaceShip.y = 150;
    }
    if (spaceShip.y > 640 - spaceShip.height) {
        spaceShip.y = 640 - spaceShip.height;
    }

    function asteroids() {
        let randomN = 1; //Math.floor(Math.random() * 10 + 1);
        for (let i = 0; i < randomN; i++) {
            let asteroidSize = Math.floor(Math.random() * 94) + 10;
            let asteroid = new Sprite(
                "images/asteroid.png",
                0,
                0,
                104,
                104,
                Math.floor(Math.random() * 640),
                -10,
                asteroidSize,
                asteroidSize
            );
            asteroid.speedX = Math.floor(
                Math.random() * (maxSpeed * 2) - maxSpeed
            );
            asteroid.speedY = Math.floor(Math.random() * 8) + 2;
            sprites.push(asteroid);
            asteroidsA.push(asteroid);
        }
    }
    if (score > hScore && !playing) {
        hScore = score;
        localStorage.highScore = hScore;
        hScoreDisplay.innerHTML = hScore;
    }
}

function hitTest(currentObject) {
    if (
        currentObject.x + currentObject.width > spaceShip.x &&
        currentObject.x < spaceShip.x + spaceShip.width &&
        currentObject.y + currentObject.height > spaceShip.y &&
        currentObject.y < spaceShip.y + spaceShip.height
    ) {
        return true;
    } else {
        return false;
    }
}

function play() {
    score = 0;
    level = 120;
    frameCount = 0;
    playing = true;
    sprites = [];
    asteroidsA = [];
    spaceShip.x = 300;
    spaceShip.y = 240;
    //score = 0000;
    exp.width = 50;
    exp.height = 50;
    sprites.push(bg);
    sprites.push(spaceShip);
    playBtn.style.display = "none";
}
let playBtn = document.getElementById("play");
playBtn.addEventListener("click", play);
window.addEventListener("keydown", onKey);
function onKey(e) {
    // left 37 right 39 up38 down 40
    if (e.which === 37) {
        moveL = true;
    } else if (e.which === 39) {
        moveR = true;
    } else if (e.which === 38) {
        moveUp = true;
    } else if (e.which === 40) {
        moveDown = true;
    }
}
window.addEventListener("keyup", onKeyUp);
function onKeyUp(e) {
    // left 37 right 39 up38 down 40
    if (e.which === 37) {
        moveL = false;
    } else if (e.which === 39) {
        moveR = false;
    } else if (e.which === 38) {
        moveUp = false;
    } else if (e.which === 40) {
        moveDown = false;
    }
}
