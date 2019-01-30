let can;
let ctx;
let canW = 1500;
let canH = 700;
let charImg = new Image();
let player;
charImg.src = "images/paul2.png";

function initCanvas() {
    can = document.getElementById('game_canvas');
    ctx = document.getElementById('game_canvas').getContext('2d');
    window.addEventListener('keydown', controller.keyPressedOrReleased);
    window.addEventListener('keyup', controller.keyPressedOrReleased);

    player = new Player();
    requestAnimationFrame(frameUpdate);
}

function frameUpdate() {
    player.update();
    controller.status();
    requestAnimationFrame(frameUpdate);
}

class Player {
    constructor() {
        this.xPos = 895;
        this.yPos = 175;
        this.spriteSheetW = charImg.width;
        this.spriteSheetH = charImg.height;
        this.spritesPerRow = 2;
        this.spritesPerCol = 8;
        this.spritesInASet = 2;
        this.spriteW = this.spriteSheetW / this.spritesPerRow; //17,85
        this.spriteH = this.spriteSheetH / this.spritesPerCol; //26,130
        this.rowIndex = 0; //0 to 7
        this.columnIndex = 0; // 0 to 1
        this.spriteXOrigin = this.spriteW * this.columnIndex;
        this.spriteYOrigin = this.spriteH * this.rowIndex;
        this.isMoving = false;
        this.isMovingDiagonally = false;
        this.movementSpeed; //defined in controller.status
        this.animationCounter = 0;
    }

    render() {
        this.animate();
        ctx.save();
        ctx.clearRect(0, 0, canW, canH);
        ctx.drawImage(charImg, this.spriteXOrigin, this.spriteYOrigin, this.spriteW, this.spriteH, this.xPos, this.yPos, this.spriteW, this.spriteH); //(image, startX, startY, clipW, clipH, canvasX, canvasY, imageStretchW, imageStretchH)
        ctx.restore();
    }

    animate() {
        let spriteIndex = Math.floor(this.animationCounter) % this.spritesInASet;

        if(controller.dDownIsActive) {
            this.rowIndex = 0;
            this.columnIndex = spriteIndex;
            this.spriteXOrigin = this.spriteW * this.columnIndex;
            this.spriteYOrigin = this.spriteH * this.rowIndex;
        }
        if(controller.dUpIsActive) {
            this.rowIndex = 1;
            this.columnIndex = spriteIndex;
            this.spriteXOrigin = this.spriteW * this.columnIndex;
            this.spriteYOrigin = this.spriteH * this.rowIndex;
        }
        if(controller.dLeftIsActive) {
            this.rowIndex = 2;
            this.columnIndex = spriteIndex;
            this.spriteXOrigin = this.spriteW * this.columnIndex;
            this.spriteYOrigin = this.spriteH * this.rowIndex;
        }
        if(controller.dRightIsActive) {
            this.rowIndex = 3;
            this.columnIndex = spriteIndex;
            this.spriteXOrigin = this.spriteW * this.columnIndex;
            this.spriteYOrigin = this.spriteH * this.rowIndex;
        }
        if(controller.dDownIsActive && controller.dLeftIsActive) {
            this.rowIndex = 4;
            this.columnIndex = spriteIndex;
            this.spriteXOrigin = this.spriteW * this.columnIndex;
            this.spriteYOrigin = this.spriteH * this.rowIndex;
        }
        if(controller.dRightIsActive && controller.dDownIsActive) {
            this.rowIndex = 5;
            this.columnIndex = spriteIndex;
            this.spriteXOrigin = this.spriteW * this.columnIndex;
            this.spriteYOrigin = this.spriteH * this.rowIndex;
        }
        if(controller.dLeftIsActive && controller.dUpIsActive) {
            this.rowIndex = 6;
            this.columnIndex = spriteIndex;
            this.spriteXOrigin = this.spriteW * this.columnIndex;
            this.spriteYOrigin = this.spriteH * this.rowIndex;
        }
        if(controller.dUpIsActive && controller.dRightIsActive) {
            this.rowIndex = 7;
            this.columnIndex = spriteIndex;
            this.spriteXOrigin = this.spriteW * this.columnIndex;
            this.spriteYOrigin = this.spriteH * this.rowIndex;
        }
    }

    update() {
        this.render();
        if(this.isMoving = true) {
            this.animationCounter += 0.1;
        }
    }
}

let controller = {
    dLeftIsActive: false,
    dRightIsActive: false,
    dUpIsActive: false,
    dDownIsActive: false,
    runIsActive: false,
    keyPressedOrReleased: function(event) {
        let keyStatus;

        if (event.type == "keydown") {
            keyStatus = true;
        } else {
            keyStatus = false;
        }
      
        switch(event.keyCode) {
            case 37:
            controller.dLeftIsActive = keyStatus;
            //console.log(player.spriteXOrigin + "||" + player.spriteYOrigin);
            //console.log(player.rowIndex + "||" + player.columnIndex);
            //console.log("dLeftIsActive: " + controller.dLeftIsActive);
            break;
            case 39:
            controller.dRightIsActive = keyStatus;
            //console.log(player.spriteXOrigin + "||" + player.spriteYOrigin);
            //console.log(player.rowIndex + "||" + player.columnIndex);
            //console.log("dRightIsActive: " + controller.dRightIsActive);
            break;
            case 38:
            controller.dUpIsActive = keyStatus;
            //console.log(player.spriteXOrigin + "||" + player.spriteYOrigin);
            //console.log(player.rowIndex + "||" + player.columnIndex);
            //console.log("dUpIsActive: " + controller.dUpIsActive);
            break;
            case 40:
            controller.dDownIsActive = keyStatus
            //console.log(player.spriteXOrigin + "||" + player.spriteYOrigin);
            //console.log(player.rowIndex + "||" + player.columnIndex);
            //console.log("dDownIsActive: " + controller.dDownIsActive);
            break;
            case 70:
            controller.runIsActive = keyStatus
            //console.log("runIsActive: " + controller.runIsActive);
            break;
        }
    },
    status: function() {
        player.isMoving = false;

        if (controller.dLeftIsActive) {
            player.xPos -= player.movementSpeed;
            player.isMoving = true;
        }
        if (controller.dRightIsActive) {
            player.xPos += player.movementSpeed;
            player.isMoving = true;
        }
        if (controller.dUpIsActive) {
            player.yPos -= player.movementSpeed;
            player.isMoving = true;
        }
        if (controller.dDownIsActive) {
            player.yPos += player.movementSpeed;
            player.isMoving = true;
        }
        if (controller.runIsActive) {
            player.movementSpeed = 4.5;
        } else {
            player.movementSpeed = 3;
        }
    }
};

window.addEventListener("load", initCanvas);
