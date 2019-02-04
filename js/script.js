let can, ctx, canW = null, canH = null, player, obj;
let playerImg = new Image();
let bigTreeNight = new Image();
playerImg.src = "images/paul2.png";
bigTreeNight.src = "images/big_tree_night.png"

function initCanvas() {
    can = document.getElementById('game_canvas'); //stores the canvas element
    ctx = document.getElementById('game_canvas').getContext('2d'); //stores the context of the canvas element
    canW = can.width; //stores the width of the canvas
    canH = can.height; //stores the height of the canvas

    window.addEventListener('keydown', controller.keyPressedOrReleased); //adds an event listener to the window, listens for 'keydown', calls controller.keyPressedOrReleased
    window.addEventListener('keyup', controller.keyPressedOrReleased); //adds an event listener to the window, listens for 'keyup', calls controller.keyPressedOrReleased

    createAssets();
    requestAnimationFrame(updateFrame);
}

function createAssets() {
    player = new Player();
    obj = new GameAsset();
}

function updateFrame() {
    controller.status();
    player.update();
    obj.update();
    requestAnimationFrame(updateFrame); //updateFrame will be called every frame.
}

//--------------------------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------Object------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------------

class GameAsset {
    constructor() {
        this.xPos = 245;
        this.yPos = 395;
        this.bigTreeNightOriginX = 200;
        this.bigTreeNightOriginY = 200;
        this.width = 190;
        this.height = 75;
        this.spriteOriginX = 0;
        this.spriteOriginY = 0;
        this.spriteW = bigTreeNight.width;
        this.spriteH = bigTreeNight.height;
        this.isbeingTouched = false;
    }

    get topSide() {return this.yPos};
    get rightSide() {return this.xPos + this.width};
    get bottomSide() {return this.yPos + this.height};
    get leftSide() {return this.xPos};
    get centerX() {return this.xPos + (this.width / 2)};
    get centerY() {return this.yPos + (this.height / 2)};

    render() {
        /*if (this.isbeingTouched) {
            this.color = "blue";
            ctx.fillStyle = this.color;
            ctx.fillRect(this.xPos, this.yPos, this.width, this.height);
        } else {
            this.color = "rgba(0, 0, 0, 0.5)";
            ctx.fillStyle = this.color;
            ctx.fillRect(this.xPos, this.yPos, this.width, this.height);
        }*/

        ctx.drawImage(bigTreeNight, this.spriteOriginX, this.spriteOriginY, this.spriteW, this.spriteH, this.bigTreeNightOriginX, this.bigTreeNightOriginY, this.spriteW, this.spriteH);
        
    }

    collisionDetection() {
        (this.topSide > player.bottomSide || this.rightSide < player.leftSide || this.bottomSide < player.topSide || this.leftSide > player.rightSide) ? this.isbeingTouched = false : this.isbeingTouched = true;
    }

    update() {
        this.render();
        this.collisionDetection();
    }
}

//--------------------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------Player----------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------------

class Player {
    constructor() {
        this.xPos = canW / 2; //player position on the canvas, also where the players starts the game
        this.yPos = canH / 2; //player position on the canvas, also where the players starts the game
        this.spriteSheetW = playerImg.width; //the width of my player's full sprite sheet
        this.spriteSheetH = playerImg.height; //the height of my player's full sprite sheet
        this.spritesPerRow = 2;
        this.spritesPerCol = 8;
        this.spritesInASet = 2; // each row is a set, and a different animation. there are 2 images per animation
        this.individualSpriteW = this.spriteSheetW / this.spritesPerRow; //85px
        this.individualSpriteH = this.spriteSheetH / this.spritesPerCol; //130px
        this.rowIndex = 0; //0 to 7
        this.columnIndex = 0; // 0 to 1
        this.spriteOriginX = this.individualSpriteW * this.columnIndex; //the origin of each sprite in a row
        this.spriteOriginY = this.individualSpriteH * this.rowIndex; //the origin of each sprite in a column
        this.isMoving = false; //the player starts the game not moving
        this.isMovingDiagonally = false; //the player starts the game not moving in a diagonal 
        this.movementSpeed; //defined in controller.status, how quickly the player moves across the canvas
        this.animationCounter = 0; //in the player.update method, determines how quickly the animation switches between each image in the sprite set
        this.isColliding = false; //if the player is touching another object or not
        this.topCollide = false;
        this.rightCollide = false;
        this.bottomCollide = false;
        this.leftCollide = false;
    }

    get topSide() {return this.yPos}; //the top most coordinate of the player
    get rightSide() {return this.xPos + this.individualSpriteW}; //the right most coordinate of the player
    get bottomSide() {return this.yPos + this.individualSpriteH}; //the bottom most coordinate of the player
    get leftSide() {return this.xPos}; //the left most coordinate of the player
    get centerX() {return this.xPos + (this.individualSpriteW / 2)};
    get centerY() {return this.yPos + (this.individualSpriteH / 2)};

    render() {
        this.animate();
        ctx.save();
        ctx.clearRect(0, 0, canW, canH);
        ctx.drawImage(playerImg, this.spriteOriginX, this.spriteOriginY, this.individualSpriteW, this.individualSpriteH, this.xPos, this.yPos, this.individualSpriteW, this.individualSpriteH); //(image, imgOriginX, imgOriginY, howMuchWidthToShow, howMuchHeightToShow, whereToDisplayOnCanvasX, whereToDisplayOnCanvasX, imageStretchW, imageStretchH)
        ctx.restore();
    }

    animate() {
        let spriteIndex = Math.floor(this.animationCounter) % this.spritesInASet;

        if (controller.dDownIsActive) {
            this.rowIndex = 0;
            this.columnIndex = spriteIndex;
            this.spriteOriginX = this.individualSpriteW * this.columnIndex;
            this.spriteOriginY = this.individualSpriteH * this.rowIndex;
        } 
        if (controller.dUpIsActive) {
            this.rowIndex = 1;
            this.columnIndex = spriteIndex;
            this.spriteOriginX = this.individualSpriteW * this.columnIndex;
            this.spriteOriginY = this.individualSpriteH * this.rowIndex;
        }
        if (controller.dLeftIsActive) {
            this.rowIndex = 2;
            this.columnIndex = spriteIndex;
            this.spriteOriginX = this.individualSpriteW * this.columnIndex;
            this.spriteOriginY = this.individualSpriteH * this.rowIndex;
        }
        if (controller.dRightIsActive) {
            this.rowIndex = 3;
            this.columnIndex = spriteIndex;
            this.spriteOriginX = this.individualSpriteW * this.columnIndex;
            this.spriteOriginY = this.individualSpriteH * this.rowIndex;
        }
        if (controller.dDownIsActive && controller.dLeftIsActive) {
            this.rowIndex = 4;
            this.columnIndex = spriteIndex;
            this.spriteOriginX = this.individualSpriteW * this.columnIndex;
            this.spriteOriginY = this.individualSpriteH * this.rowIndex;
        }
        if (controller.dRightIsActive && controller.dDownIsActive) {
            this.rowIndex = 5;
            this.columnIndex = spriteIndex;
            this.spriteOriginX = this.individualSpriteW * this.columnIndex;
            this.spriteOriginY = this.individualSpriteH * this.rowIndex;
        }
        if (controller.dLeftIsActive && controller.dUpIsActive) {
            this.rowIndex = 6;
            this.columnIndex = spriteIndex;
            this.spriteOriginX = this.individualSpriteW * this.columnIndex;
            this.spriteOriginY = this.individualSpriteH * this.rowIndex;
        }
        if (controller.dUpIsActive && controller.dRightIsActive) {
            this.rowIndex = 7;
            this.columnIndex = spriteIndex;
            this.spriteOriginX = this.individualSpriteW * this.columnIndex;
            this.spriteOriginY = this.individualSpriteH * this.rowIndex;
        }
    }

    moveUp() {
        this.yPos -= this.movementSpeed; 
        this.isMoving = true;
    }

    moveRight() {
        this.xPos += this.movementSpeed;
        this.isMoving = true;
    }

    moveDown() {
        this.yPos += this.movementSpeed;
        this.isMoving = true;
    }

    moveLeft() {
        this.xPos -= this.movementSpeed;
        this.isMoving = true;
    }

    collisionDetection() {
        this.topCollide = false;
        this.rightCollide = false;
        this.bottomCollide = false;
        this.leftCollide = false;

        (this.topSide > obj.bottomSide || this.rightSide < obj.leftSide || this.bottomSide < obj.topSide || this.leftSide > obj.rightSide) ? this.isColliding = false : this.isColliding = true;

        if (this.isColliding) {
            let dX = this.centerX - obj.centerX;
            let dY = this.centerY - obj.centerY;

            if (Math.abs(dX) > Math.abs(dY)) {
                if (dX > 0) {
                    this.xPos = obj.xPos + obj.width;
                    this.leftCollide = true;
                } else {
                    this.xPos = obj.xPos - this.individualSpriteW;
                    this.rightCollide = true;
                }
            } else {
                if (dY > 0) {
                    this.yPos = obj.yPos + obj.height;
                    this.topCollide = true;
                } else {
                    this.yPos = obj.yPos - this.individualSpriteH;
                    this.bottomCollide = true;
                }
            }
        }
    }

    update() {
        this.render();
        this.collisionDetection();
        if(this.isMoving) {
            this.animationCounter += 0.1;
        }
    }
}

//--------------------------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------Controller---------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------------

let controller = {
    dLeftIsActive: false,
    dRightIsActive: false,
    dUpIsActive: false,
    dDownIsActive: false,
    runIsActive: false,
    keyPressedOrReleased: function(event) {
        let keyStatus;

        (event.type == "keydown") ? keyStatus = true : keyStatus = false;

        switch(event.keyCode) {
            case 37:
            controller.dLeftIsActive = keyStatus;
            break;
            case 39:
            controller.dRightIsActive = keyStatus;
            break;
            case 38:
            controller.dUpIsActive = keyStatus;
            break;
            case 40:
            controller.dDownIsActive = keyStatus
            break;
            case 70:
            controller.runIsActive = keyStatus
            break;
        }
    },
    status: function() {
        player.isMoving = false;

        if (controller.dLeftIsActive) {
            player.moveLeft();
        }
        if (controller.dRightIsActive) {
            player.moveRight();
        }
        if (controller.dUpIsActive) {
            player.moveUp();
        }
        if (controller.dDownIsActive) {
            player.moveDown();
        }

        (controller.runIsActive) ? (player.movementSpeed = 5, player.animationCounter += 0.15) : player.movementSpeed = 3;
    }
};

window.addEventListener("load", initCanvas);