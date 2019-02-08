/*Global vars and images*/
let forecan, midcan, backcan, forectx, midctx, backctx, forecanW = null, midcanW = null, backcanW = null, forecanH = null, midcanH = null, backcanH = null, player, background;

let backgroundImg = new Image();
let playerImg = new Image();
let bigTreeNightImg = new Image();
let bigTreeNightTopImg = new Image();
let bigTreeNightBottomImg = new Image();
let appleImg = new Image();
backgroundImg.src = "images/background.png";
playerImg.src = "images/paul.png";
bigTreeNightImg.src = "images/big_tree_night.png";
bigTreeNightTopImg.src = "images/big_tree_night_top.png";
bigTreeNightBottomImg.src = "images/big_tree_night_bottom.png";
appleImg.src = "images/apple.png"

let trees = [];

function initCanvas() {
    forecan = document.getElementById('foreground_canvas'); //stores the top canvas element
    forectx = document.getElementById('foreground_canvas').getContext('2d'); //stores the context of the top canvas element
    midcan = document.getElementById('midground_canvas'); //stores the middle canvas element
    midctx = document.getElementById('midground_canvas').getContext('2d'); //stores the context of the middle canvas element
    backcan = document.getElementById('background_canvas'); //stores the back canvas element
    backctx = document.getElementById('background_canvas').getContext('2d'); //stores the context of the back canvas element
    
    forecanW = forecan.width; //stores the width of the top canvas
    forecanH = forecan.height; //stores the height of the top canvas
    midcanW = midcan.width; //stores the width of the middle canvas
    midcanH = midcan.height; //stores the height of the middle canvas
    backcanW = backcan.width; //stores the width of the back canvas
    backcanH = backcan.height; //stores the height of the back canvas

    window.addEventListener('keydown', controller.keyPressedOrReleased); //adds an event listener to the window, listens for 'keydown', calls controller.keyPressedOrReleased
    window.addEventListener('keyup', controller.keyPressedOrReleased); //adds an event listener to the window, listens for 'keyup', calls controller.keyPressedOrReleased

    createAssets();
    requestAnimationFrame(updateFrame);
}

function createAssets() {
    background = new Background();
    player = new Player();
    trees[0] = new Obj(100, 100, false);
    trees[1] = new Obj(850, 100, true);
    trees[2] = new Obj(350, 400, false);
    trees[3] = new Obj(300, 100, false);
    trees[4] = new Obj(1100, 350, false);
}

function updateFrame() {
    background.update();
    controller.status();
    player.update();
    trees[0].update();
    trees[1].update();
    trees[2].update();
    trees[3].update();
    trees[4].update();
    requestAnimationFrame(updateFrame); //updateFrame will be called every frame.
}

//---------------------------------------------------------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------Background------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------

class Background {
    constructor() {
        this.xPos = 0;
        this.yPos = 0;
        this.width = backcanW;
        this.height = backcanH;
        this.imgOriginX = 1500;
        this.imgOriginY = 700; 
    }

    render() {
        backctx.drawImage(backgroundImg, this.imgOriginX, this.imgOriginY, this.width, this.height, this.xPos, this.yPos, this.width, this.height);
    }
    update() {
        this.render();
    }
}

//---------------------------------------------------------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------Object--------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------

class Obj {
    constructor(mapX, mapY, apple) {
        this.bigTreeNightOriginX = mapX;
        this.bigTreeNightOriginY = mapY;
        this.spritesW = bigTreeNightTopImg.width;
        this.topSpriteH = bigTreeNightTopImg.height;
        this.bottomSpriteH = bigTreeNightBottomImg.height;
        this.hitBoxXPos = mapX + 45;
        this.hitBoxYPos = mapY + 185;
        this.hitBoxW = 190;
        this.hitBoxH = 85;
        this.spriteOriginX = 0;
        this.spriteOriginY = 0;
        this.isColliding = false;
        this.hasApple = apple;
        this.appleW = appleImg.width;
        this.appleH = appleImg.height;
        this.alpha = 0;
    }

    get topSide() {return this.hitBoxYPos};
    get rightSide() {return this.hitBoxXPos + this.hitBoxW};
    get bottomSide() {return this.hitBoxYPos + this.hitBoxH};
    get leftSide() {return this.hitBoxXPos};
    get centerX() {return this.hitBoxXPos + (this.hitBoxW / 2)};
    get centerY() {return this.hitBoxYPos + (this.hitBoxH / 2)};

    render() {
        forectx.drawImage(bigTreeNightTopImg, this.spriteOriginX, this.spriteOriginY, this.spritesW, this.topSpriteH, this.bigTreeNightOriginX, this.bigTreeNightOriginY, this.spritesW, this.topSpriteH);
        if (this.hasApple) {
            forectx.globalAlpha = this.alpha;
            forectx.drawImage(appleImg, this.spriteOriginX, this.spriteOriginY, this.appleW, this.appleH, this.bigTreeNightOriginX + 100, this.bigTreeNightOriginY + 70, this.appleW, this.appleH);
            forectx.globalAlpha = 1;
        }
        midctx.drawImage(bigTreeNightBottomImg, this.spriteOriginX, this.spriteOriginY, this.spritesW, this.bottomSpriteH, this.bigTreeNightOriginX, this.bigTreeNightOriginY + this.topSpriteH, this.spritesW, this.bottomSpriteH);
        //forectx.strokeStyle = "black";
        //forectx.strokeRect(this.hitBoxXPos, this.hitBoxYPos, this.hitBoxW, this.hitBoxH);
        this.collisionDetection();
    }
    collisionDetection() {
        let disX = Math.abs(this.centerX - player.centerX);
        let disY = Math.abs(this.centerY - player.centerY);

        if (disX > ((this.hitBoxW / 2) + (player.hitBoxW / 2)) || disY > ((this.hitBoxH / 2) + (player.hitBoxH / 2))) {
            this.isColliding = false;
            player.isColliding = false;
        } else {
            this.isColliding = true;
            player.isColliding = true;
        }

        if (this.isColliding) {
            let dirX = player.centerX - this.centerX;
            let dirY = player.centerY - this.centerY;

            if (Math.abs(dirX / (this.hitBoxW / 2)) > Math.abs(dirY / (this.hitBoxH / 2))) {
                if (dirX > 0) {
                    player.hitBoxXPos = this.hitBoxXPos + this.hitBoxW;
                } else {
                    player.hitBoxXPos = this.hitBoxXPos - player.individualSpriteW;
                }
            } else {
                if (dirY > 0) {
                    player.hitBoxYPos = this.hitBoxYPos + this.hitBoxH;
                } else {
                    player.hitBoxYPos = this.hitBoxYPos - player.hitBoxH;
                }
            }
        }
    }
    showApple() {
        if (this.isColliding) {
            if (this.hasApple) {
                this.alpha = 1;
            }
        }
    }
    update() {
        this.render();
    }
}

//-------------------------------------------------------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------Player------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------

class Player {
    constructor() {
        this.hitBoxXPos = forecanW / 2; //player hitbox is smaller than sprite, so a different xPos is needed
        this.hitBoxYPos = forecanH / 2; //player hitbox is smaller than sprite, so a different yPos is needed
        this.spriteSheetW = playerImg.width; //the width of my player's full sprite sheet
        this.spriteSheetH = playerImg.height; //the height of my player's full sprite sheet
        this.spritesPerRow = 2; //sprites per row on sprite sheet
        this.spritesPerCol = 8; //sprites per column on sprite sheet
        this.individualSpriteW = this.spriteSheetW / this.spritesPerRow; //player width: 85px
        this.individualSpriteH = this.spriteSheetH / this.spritesPerCol; //player height: 130px
        this.hitBoxW = this.individualSpriteW; //hitbox width
        this.hitBoxH = this.individualSpriteH - 75; //hitbox height
        this.spritesInASet = 2; // each row is a set, and a different animation. there are 2 images per animation
        this.rowIndex = 0; //0 to 7
        this.columnIndex = 0; // 0 to 1
        this.spriteOriginX = this.individualSpriteW * this.columnIndex; //the origin of each sprite in a row
        this.spriteOriginY = this.individualSpriteH * this.rowIndex; //the origin of each sprite in a column
        this.isMoving = false; //the player starts the game not moving
        this.isMovingDiagonally = false; //the player starts the game not moving in a diagonal 
        this.movementSpeed; //defined in controller.status, how quickly the player moves across the top canvas
        this.animationCounter = 0; //in the player.update method, determines how quickly the animation switches between each image in the sprite set
        this.isColliding = false; //if the player is touching another object or not
    }

    get topSide() {return this.hitBoxYPos}; //the top most coordinate of the player
    get rightSide() {return this.hitBoxXPos + this.hitBoxW}; //the right most coordinate of the player
    get bottomSide() {return this.hitBoxYPos + this.hitBoxH}; //the bottom most coordinate of the player
    get leftSide() {return this.hitBoxXPos}; //the left most coordinate of the player
    get centerX() {return this.hitBoxXPos + (this.hitBoxW / 2)};
    get centerY() {return this.hitBoxYPos + (this.hitBoxH / 2)};
    get paulXPos() {return this.hitBoxXPos}; //where the img is drawn relative to the hitbox
    get paulYPos() {return this.hitBoxYPos - 80}; //where the img is drawn relative to the hitbox

    render() {
        this.animate();
        forectx.save();
        forectx.clearRect(0, 0, forecanW, forecanH);
        forectx.drawImage(playerImg, this.spriteOriginX, this.spriteOriginY, this.individualSpriteW, this.individualSpriteH, this.paulXPos, this.paulYPos, this.individualSpriteW, this.individualSpriteH); //(image, imgOriginX, imgOriginY, howMuchWidthToShow, howMuchHeightToShow, whereToDisplayOnTopCanvasX, whereToDisplayOnTopCanvasY, imageStretchW, imageStretchH)
        //forectx.strokeStyle = "black";
        //forectx.strokeRect(this.hitBoxXPos, this.hitBoxYPos, this.hitBoxW, this.hitBoxH);
        forectx.restore();
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
        this.hitBoxYPos -= this.movementSpeed
        this.isMoving = true;
    }
    moveRight() {
        this.hitBoxXPos += this.movementSpeed;
        this.isMoving = true;
    }
    moveDown() {
        this.hitBoxYPos += this.movementSpeed;
        this.isMoving = true;
    }
    moveLeft() {
        this.hitBoxXPos -= this.movementSpeed;
        this.isMoving = true;
    }
    update() {
        this.render();
        if(this.isMoving) {
            this.animationCounter += 0.1;
        }
    }
}

//----------------------------------------------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------Controller-----------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------------------------------------

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
            controller.dDownIsActive = keyStatus;
            break;
            case 68:
            controller.actionIsActive = keyStatus;
            break;
            case 70:
            controller.runIsActive = keyStatus;
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
        if (controller.actionIsActive) {
            for (let i = 0; i < trees.length; i++) {
                trees[i].showApple();
            }
        }

        (controller.runIsActive) ? (player.movementSpeed = 5, player.animationCounter += 0.15) : player.movementSpeed = 3;
    }
};

window.addEventListener("load", initCanvas);