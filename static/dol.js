let canvas;
let context;

let request_id;
let fpsInterval = 1000 / 30;
let now;
let then = Date.now();

let main_element;
let xhttp;

let score=0;
let gameOver = false;


//images
let dolman = new Image();

let tileone = new Image();
let tilethree = new Image();
let tilefour = new Image();
let tilezero = new Image();

//dolman
let player = {
    x : 0,
    y : 0,
    xChange : 0,
    yChange : 0,
    xInput : 0,
    yInput : 0,
}

//users movement
let moveLeft = false;
let moveRight = false;
let moveUp = false;
let moveDown = false;

//ghost stuff
const ghosturls = ["apple.png","bird.png","crusader.png","pharo.png"]
const ghosts = [];

const GHOST_SPEED = 6;
const GHOST_SPEED_FINAL = 7;


//grid layout
const layout = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,],
    [1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1,],
    [1,3,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,3,1,],
    [1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1,],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,],
    [1,0,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,0,1,],
    [1,0,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,0,1,],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,],
    [1,1,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,1,1,],
    [1,1,1,1,1,1,0,1,1,4,4,4,4,4,4,4,4,4,4,1,1,0,1,1,1,1,1,1,],
    [1,1,1,1,1,1,0,1,1,4,1,1,1,2,2,1,1,1,4,1,1,0,1,1,1,1,1,1,],
    [1,1,1,1,1,1,0,1,1,4,1,2,2,2,2,2,2,1,4,1,1,0,1,1,1,1,1,1,],
    [4,4,4,4,4,4,0,0,0,4,1,2,2,2,2,2,2,1,4,0,0,0,4,4,4,4,4,4,],
    [1,1,1,1,1,1,0,1,1,4,1,2,2,2,2,2,2,1,4,1,1,0,1,1,1,1,1,1,],
    [1,1,1,1,1,1,0,1,1,4,1,1,1,1,1,1,1,1,4,1,1,0,1,1,1,1,1,1,],
    [1,1,1,1,1,1,0,1,1,4,1,1,1,1,1,1,1,1,4,1,1,0,1,1,1,1,1,1,],
    [1,0,0,0,0,0,0,0,0,4,4,4,4,4,4,4,4,4,4,0,0,0,0,0,0,0,0,1,],
    [1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1,],
    [1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1,],
    [1,3,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,3,1,],
    [1,1,1,0,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,0,1,1,1,],
    [1,1,1,0,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,0,1,1,1,],
    [1,0,0,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,0,0,1,],
    [1,0,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,0,1,],
    [1,0,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,0,1,],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
]

let pelletsLeft = 0;
for(let i = 0; i < layout.length; i++) {
    for(let j = 0; j < layout[i].length; j++) {
        if(layout[i][j] == 0 || layout[i][j] == 3) pelletsLeft++;
    }
}

const maxPellets = pelletsLeft;

const GHOST_SPEED_MULT = (20-6)/200;


document.addEventListener("DOMContentLoaded", init, false);

function init() {

    main_element = document.querySelector("main");
    let button_elements = document.querySelectorAll("nav button");
    for (let b of button_elements) {
        b.addEventListener("click", fetch_content, false);
    }
    fetch_content(null);
}

function initgame() {
    canvas = document.querySelector("canvas");
    context = canvas.getContext("2d");

    tileone.src = "../static/tileone.png";
    tilezero.src = "../static/tilezero.png";
    tilethree.src = "../static/tilethree.jpg";
    tilefour.src = "../static/tilefour.png";

    dolman.src = "../static/dolman.png"

    
    for (let url of ghosturls) {
        const img= new Image()
        img.src = "../static/" + url
        const theta = Math.random() * Math.PI * 2;
        ghosts.push({
            img,
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            velX: Math.sin(theta),
            velY: Math.cos(theta)
        })

    }


    window.addEventListener("keydown",activate,false);
    window.addEventListener("keyup",deactivate,false);

    //start player
    player.x = (canvas.width/28)*14
    player.y = (canvas.height/28)*17

    draw();   
}

const drawCentered = (ctx, txt, y) => {
    const bounds = ctx.measureText(txt);
    ctx.fillText(txt, canvas.width/2 - bounds.width/2, y);
}

function draw() {
    request_id = window.requestAnimationFrame(draw);
    let now = Date.now();
    let elapsed = now - then;
    if (elapsed <= fpsInterval) {
        return;
    }
    then = now - (elapsed % fpsInterval);


    // Draw background on canvas.
    // context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "black";
    context.fillRect(0, 0, canvas.width, canvas.height);

    if(gameOver) {
        context.fillStyle = "white";
        let y = canvas.height/2 - 1.5*50;
        drawCentered(context, "Game over!", y);
        y+=30;
        drawCentered(context, `Your score was: ${score}`, y);
        y+=30;
        drawCentered(context, "Refresh to play again", y);
        return;
    }

    for (let r = 0; r < 28; r += 1) {
        for (let c = 0; c < 28; c += 1) {
            let tile = layout[r][c];
            if (tile === 1) {
                context.drawImage(tileone, c*tileone.width, r*tileone.height);
            }
            //else if (tile === 2) {
                //ontext.drawImage(tileone, c*tileone.width, r*tileone.height);
            else if (tile === 0) {
                context.drawImage(tilezero, c*tilezero.width, r*tilezero.height);
            }   
            else if (tile === 3) {
                context.drawImage(tilethree, c*tilethree.width, r*tilethree.height);
            }
            else if (tile === 4) {
                context.drawImage(tilefour, c*tilefour.width, r*tilefour.height);
            }
            
        }
    }

    context.drawImage(dolman, player.x, player.y)

    for (let ghost of ghosts) {
        ghost.x += ghost.velX * GHOST_SPEED + (GHOST_SPEED_MULT * (maxPellets-pelletsLeft));
        ghost.y += ghost.velY * GHOST_SPEED + (GHOST_SPEED_MULT * (maxPellets-pelletsLeft));
        if(ghost.x <= 0) {
            ghost.x = 0;
            ghost.velX *= -1;
        } else if (ghost.x >= canvas.width - ghost.img.width) {
            ghost.x = canvas.width - ghost.img.width;
            ghost.velX *= -1;
        }

        if(ghost.y <= 0) {
            ghost.y = 0;
            ghost.velY *= -1;
        } else if(ghost.y >= canvas.height - ghost.img.height) {
            ghost.y = canvas.height - ghost.img.height;
            ghost.velY *= -1;
        }

        const d = Math.sqrt(Math.pow(ghost.y - player.y,2) + Math.pow(ghost.x - player.x, 2));
        if(d <= (ghost.img.height/2) + (dolman.height/2)) { // we are touching the player
            gameOver = true;
        }

        context.drawImage(ghost.img, ghost.x, ghost.y);
    }

    

    // Update the player.
    let xPoint = (player.x / tilezero.width) + 0.5;
    let yPoint = (player.y / tilezero.width) + 0.5;
    let xGrid = Math.floor(xPoint);
    let yGrid = Math.floor(yPoint);
    let xOff = xPoint - xGrid; // fractional component of x
    let yOff = yPoint - yGrid; // fractional component of y

    if(Math.abs(0.5 - yOff) <= 0.1 && player.yChange != player.yInput) {
        player.yChange = player.yInput;
        player.xChange = 0;
        player.x = (xGrid) * tilezero.width;
    }
    
    if(Math.abs(0.5 - xOff) <= 0.1 && player.xChange != player.xInput) {
        player.xChange = player.xInput;
        player.yChange = 0;
        player.y = (yGrid) * tilezero.width;
    }


    let xTar = Math.floor(xPoint + player.xChange);
    let yTar = Math.floor(yPoint + player.yChange);
    if (layout[yTar][xTar] == 1) {
        if(player.yChange > 0 && yOff >= 0.5)
            player.yChange = player.yInput = 0;
        else if(player.yChange < 0 && yOff <= 0.5)
            player.yChange = player.yInput = 0;
        else if(player.xChange > 0 && xOff >= 0.5)
            player.xChange = player.xInput = 0;
        else if(player.xChange < 0 && xOff <= 0.5)
            player.xChange = player.xInput = 0;
    }

    //eat pellet
    if (layout[yGrid][xGrid] == 0) {
        layout[yGrid][xGrid] = 4
        score += 10;
        pelletsLeft--;
    }

    //drink beer
    if (layout[yGrid][xGrid] == 3) {
        layout[yGrid][xGrid] = 4
        score += 50;
        pelletsLeft--;
    }

    if(pelletsLeft <= 0 && layout[yGrid][xGrid] == 2) gameOver = true;


    if (player.x >= canvas.width && player.xInput == 1) {
        player.x = - tilezero.width
    }

    if ( player.x <= -tilezero.width && player.xInput == -1 ) {
        player.x = canvas.width 
    }

    player.x = player.x + player.xChange*6; 
    player.y = player.y + player.yChange*6;

    context.font = "20px 'Comic Sans MS'";
    context.fillText(`Score: ${score}`, 10, 25);
    if(pelletsLeft <= 0) {
    }

    // context.fillStyle = "rgba(0,255,0,0.5)";
    // context.fillRect(xGrid*tilezero.width, yGrid*tilezero.width, tilezero.width, tilezero.width);
    // context.fillStyle = "rgba(255,255,0,0.5)";
    // context.fillRect(xTar*tilezero.width, yTar*tilezero.width, tilezero.width, tilezero.width);

}

function fetch_content(event) {
    let button_id;
    if (event == null) {
        button_id = "rules";
    } 
    else {
        button_id = event.target.id;
    }
    xhttp = new XMLHttpRequest()
    xhttp.addEventListener("readystatechange", function () {
        handle_response(xhttp);
        if(button_id == "play" && xhttp.readyState == 4 && xhttp.status == 200) initgame();
    }, false);
    xhttp.open("GET", button_id, true);
    xhttp.send(null);
}

function handle_response(req) {
    if ( req.readyState === 4 ) {
        if ( req.status === 200 ) {
            main_element.innerHTML = req.responseText;
        }
    }
}


function activate(event) {
    let key = event.keyCode;
    if (key === 37 || key === 65) { // left
        player.xInput = -1;
        player.yInput = 0;
    } else if (key === 39 || key === 68) { // right
        player.xInput = 1;
        player.yInput = 0;
    } else if (key === 38 || key === 87) { // up
        player.xInput = 0;
        player.yInput = -1;
    } else if (key === 40 || key === 83) { // down
        player.xInput = 0;
        player.yInput = 1;
    }
    event.preventDefault()
}

function deactivate(event) {
    let key = event.key;
}