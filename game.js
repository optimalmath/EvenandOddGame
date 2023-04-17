    console.log("game.js loaded");

    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");

    const backgroundImage = new Image();
    backgroundImage.src = "assets/mars_background.jpg";
    const spaceshipImage = new Image();
    spaceshipImage.src = "assets/spaceship.png";
    const evenCloudImage = new Image();
    evenCloudImage.src = "assets/even_cloud.png";
    const oddCloudImage = new Image();
    oddCloudImage.src = "assets/odd_cloud.png";
    const explodedSpaceshipImage = new Image();
    explodedSpaceshipImage.src = "assets/exploded_spaceship.png";
    
    class Cloud {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.width = 80;
            this.height = 50;
            this.creationTime = Date.now();
    
            this.number = Math.floor(Math.random() * 100);
    
            if (Math.random() < 0.5) {
                this.image = evenCloudImage;
            } else {
                this.image = oddCloudImage;
            }
        }
    
        update() {
            this.y += 2;
        }
    
        draw() {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    
            ctx.fillStyle = "white";
            ctx.font = "24px Arial";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(this.number, this.x + this.width / 2, this.y + this.height / 2);
        }
    
    }
    



    class Spaceship {
        constructor() {
            this.x = canvas.width / 2;
            this.y = (canvas.height * 1) / 4;
            this.width = 75;
            this.height = 75;
            this.exploded = false;
        }

        draw() {
            ctx.drawImage(spaceshipImage, this.x, this.y, this.width, this.height);
            if (this.exploded) {
                ctx.drawImage(explodedSpaceshipImage, this.x, this.y, this.width, this.height);
            } else {
                ctx.drawImage(spaceshipImage, this.x, this.y, this.width, this.height);
            }
        }

        move(dx) {
            this.x += dx;

            if (this.x < 0) {
                this.x = 0;
            } else if (this.x > canvas.width - this.width) {
                this.x = canvas.width - this.width;
            }
        }

        moveVertical(dy) {
            this.y += dy;

            if (this.y < 0) {
                this.y = 0;
            } else if (this.y > canvas.height - this.height) {
                this.y = canvas.height - this.height;
            }
        }
    }


    let clouds = [];
    let spaceship = new Spaceship();
    let score = 0;

    let cloudGenerationCounter = 0;

    function generateClouds() {
        let cloudCount;
    
        if (score < 5) {
            cloudCount = 2;
        } else if (score < 10) {
            cloudCount = 3;
        } else {
            cloudCount = 5;
        }
    
        for (let i = 0; i < cloudCount; i++) {
            const x = Math.random() * (canvas.width - 80);
            const y = -Math.random() * (canvas.height); 
            clouds.push(new Cloud(x, y));
        }
    }
function cloudGenerationInterval() {
    let interval;

    if (score < 10) {
        interval = 5000;
    } else if (score < 20) {
        interval = 3500;
    } else {
        interval = 2000;
    }

    clearTimeout(cloudGenerationTimeout);
    cloudGenerationTimeout = setTimeout(() => {
        generateClouds();
        cloudGenerationInterval();
    }, interval);
}    

function updateClouds() {
    clouds.forEach((cloud, index) => {
        cloud.update();

        if (cloud.y > canvas.height) {
            clouds.splice(index, 1);
        }
    });
}


function gameLoop() {
    if (!gameStarted) {
        return;
    }
    
    console.log("Game loop");
    updateClouds();
    handleSpaceshipMovement();
    checkCollision();
    draw();

    let cloudGenerationFrequency;

    if (score < 5) {
        cloudGenerationFrequency = 300; 
    } else if (score < 10) {
        cloudGenerationFrequency = 210; 
    } else {
        cloudGenerationFrequency = 150; 
    }

    if (cloudGenerationCounter % cloudGenerationFrequency === 0) {
        generateClouds();
    }
    if (spaceship.exploded) {
        drawGameOver();
    } else {
        cloudGenerationCounter++;
        drawScore();
    }
}


function drawStartScreen() {
    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'white';
    ctx.font = '48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Even and Odd Number Practice', canvas.width / 2, canvas.height / 5);

    // Add the instruction text
    ctx.font = '16px Arial';
    ctx.fillStyle = 'white';
    const instructionText = "Cadets, we are approaching the Martian Surface. However, there is a problem with the polarity of the ship. There are two types of clouds in the atmosphere. Some contain postive charges and some contain negative charges. Positive Charges will be represented by Even Numbers and Negative charges will be represented by Odd Numbers on your display. Guide the ship through Even Numbered clouds and avoid Odd Number clouds at all cost. Use your arrow keys to guide the ship to a succesful landing.  Good luck Cadets!";
    const lineHeight = 20;
    const words = instructionText.split(' ');
    let line = '';
    let y = canvas.height / 3;

    for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i] + ' ';
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;
        if (testWidth > canvas.width * 0.8 && i > 0) {
            ctx.fillText(line, canvas.width / 2, y);
            line = words[i] + ' ';
            y += lineHeight;
        } else {
            line = testLine;
        }
    }
    ctx.fillText(line, canvas.width / 2, y);

    ctx.fillStyle = 'orange';
    ctx.fillRect(canvas.width / 2 - 75, y + 50, 150, 50);

    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText('Start Game', canvas.width / 2, y + 82);
    ctx.restore();

    canvas.addEventListener('click', startGameClickListener);
}



function startGameClickListener(e) {
    const mouseX = e.clientX - canvas.getBoundingClientRect().left;
    const mouseY = e.clientY - canvas.getBoundingClientRect().top;
    const buttonX = canvas.width / 2 - 75;
    const buttonY = canvas.height / 2 + 50;
    const buttonWidth = 150;
    const buttonHeight = 50;

    if (
        mouseX >= buttonX &&
        mouseX <= buttonX + buttonWidth &&
        mouseY >= buttonY &&
        mouseY <= buttonY + buttonHeight
    ) {
        canvas.removeEventListener('click', startGameClickListener);
        startGame();
    }
}

let gameStarted = false;

function startGame() {
    console.log("Starting game");
    gameStarted = true;
    gameLoopInterval = setInterval(gameLoop, 1000 / 60);
    cloudGenerationInterval();
}


    function handleSpaceshipMovement() {
        if (keys.ArrowLeft) {
            spaceship.move(-10); // changed from -20
        }
        if (keys.ArrowRight) {
            spaceship.move(10); // changed from 20
        }
        if (keys.ArrowUp) {
            spaceship.moveVertical(-10); // changed from -20
        }
        if (keys.ArrowDown) {
            spaceship.moveVertical(10); // changed from 20
        }
    }
    

    function checkCollision() {
        clouds.forEach((cloud, index) => {
            if (
                spaceship.x < cloud.x + cloud.width &&
                spaceship.x + spaceship.width > cloud.x &&
                spaceship.y < cloud.y + cloud.height &&
                spaceship.y + spaceship.height > cloud.y
            ) {
                if (cloud.number % 2 === 0) {
                    score++;
                    clouds.splice(index, 1);
                } else {
                    // Set the exploded property to true and draw the exploded image
                    spaceship.exploded = true;
                    clearInterval(gameLoopInterval);
                    draw();
        
            
    
                    
                    
                }
            }
        });
    }


    function drawBackground() {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas before drawing the background
        ctx.drawImage(backgroundImage, 0, 0, backgroundImage.width, backgroundImage.height, 0, 0, canvas.width, canvas.height);
    }
    

    function draw() {
        ctx.save();
        drawBackground();
        clouds.forEach(cloud => cloud.draw());
        spaceship.draw();
        ctx.restore();
        drawScore();
    }
    function drawScore() {
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = "white";
        ctx.font = "24px Arial";
        ctx.fillText("Score: " + score, 10, 30);
    }



    function cloudGenerationInterval() {
        let interval;
    
        if (score < 10) {
            interval = 5000;
        } else if (score < 20) {
            interval = 3500;
        } else {
            interval = 2000;
        }
    
        clearTimeout(cloudGenerationTimeout); // Add this line
        cloudGenerationTimeout = setTimeout(() => { // Modify this line
            generateClouds();
            cloudGenerationInterval();
        }, interval);
    }
    function drawGameOver() {
        ctx.save();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    
        ctx.fillStyle = 'white';
        ctx.font = '48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Game Over', canvas.width / 2, canvas.height / 3);
    
        ctx.font = '24px Arial';
        ctx.fillText('Remember Cadet, even numbers are divisible evenly by 2!', canvas.width / 2, canvas.height / 2);
    
        ctx.fillStyle = 'orange';
        ctx.fillRect(canvas.width / 2 - 75, canvas.height / 2 + 50, 150, 50);
    
        ctx.fillStyle = 'white';
        ctx.font = '20px Arial';
        ctx.fillText('Restart', canvas.width / 2, canvas.height / 2 + 82);
        ctx.restore();
        canvas.addEventListener('click', restartGame);
    }
    
        
    function restartGame(e) {
        const mouseX = e.clientX - canvas.getBoundingClientRect().left;
        const mouseY = e.clientY - canvas.getBoundingClientRect().top;
        const buttonX = canvas.width / 2 - 75;
        const buttonY = canvas.height / 2 + 50;
        const buttonWidth = 150;
        const buttonHeight = 50;
    
        if (
            mouseX >= buttonX &&
            mouseX <= buttonX + buttonWidth &&
            mouseY >= buttonY &&
            mouseY <= buttonY + buttonHeight
        ) {
            canvas.removeEventListener('click', restartGame);
            score = 0;
            spaceship.exploded = false;
            clouds = [];
            startGame();
        }
    }
    

    let gameLoopInterval;
    let cloudGenerationTimeout;
    
    const keys = {
        ArrowLeft: false,
        ArrowRight: false,
        ArrowUp: false,
        ArrowDown: false,
    };
    
    window.addEventListener("keydown", (e) => {
        if (keys.hasOwnProperty(e.key)) {
            keys[e.key] = true;
        }
    });
    
    window.addEventListener("keyup", (e) => {
        if (keys.hasOwnProperty(e.key)) {
            keys[e.key] = false;
        }
       
    });
    drawStartScreen();
    