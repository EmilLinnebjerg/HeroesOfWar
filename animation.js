const animationStages = 3;
const windowWidth = 850;
const windowHeight = 500;
var shift1 = 0;
var shift2 = 0-windowWidth;

var cloudHider = document.createElement("div");
cloudHider.style.background = "white";
cloudHider.style.position = "absolute";
cloudHider.style.width = windowWidth + "px";
cloudHider.style.height = windowHeight + "px";
cloudHider.style.top = 0 + "px";
cloudHider.style.left = windowWidth + "px";
cloudHider.style.zIndex = 1;
document.body.appendChild(cloudHider);

var cloudHider2 = document.createElement("div");
cloudHider2.style.background = "white";
cloudHider2.style.position = "absolute";
cloudHider2.style.width = windowWidth + "px";
cloudHider2.style.height = windowHeight + "px";
cloudHider2.style.top = windowHeight + "px";
cloudHider2.style.left = 0 + "px";
cloudHider2.style.zIndex = 1;
document.body.appendChild(cloudHider2);

var clouds1 = document.createElement("img");
clouds1.src = "Clouds.png";
clouds1.style.position = "absolute";
clouds1.style.width = windowWidth + "px";
clouds1.style.height = windowHeight + "px";
clouds1.style.top = 0 + "px";
clouds1.style.left = 0 + "px";
document.body.appendChild(clouds1);

var clouds2 = document.createElement("img");
clouds2.src = "Clouds.png";
clouds2.style.position = "absolute";
clouds2.style.width = windowWidth + "px";
clouds2.style.height = windowHeight + "px";
clouds2.style.top = 0 + "px";
clouds2.style.left = 0 + "px";
document.body.appendChild(clouds2);

class animation {
    constructor(walk1, walk2, walk3, attack1, attack2, attack3, idle) {
        this.walk1 = walk1;
        this.walk2 = walk2;
        this.walk3 = walk3;

        this.attack1 = attack1;
        this.attack2 = attack2;
        this.attack3 = attack3;

        this.idle = idle;
    }

    getCurrentAnimation(isWalking, nextmove, speed, ranged, nextAtk, atkSpeed, isIdle) {

        if (isWalking) {
            if (isIdle) {
                return this.idle;
            }

            if (nextmove < speed / 3) {
                return this.walk3;
            }
            if ((nextmove < (speed / 3)*2)&&(nextmove > speed / 3)) {
                return this.walk2;
            }
            return this.walk1;
        }
        else {
            if (ranged > 0) {
                if (nextAtk < atkSpeed / 3) {
                    return this.attack3;
                }
                if ((nextAtk < (atkSpeed / 3) * 2) && (nextAtk > atkSpeed / 3)) {
                    return this.attack2;
                }
                return this.attack1;
            }

            if (nextmove < speed / 3) {
                return this.attack3;
            }
            if ((nextmove < (speed / 3) * 2) && (nextmove > speed / 3)) {
                return this.attack2;
            }
            return this.attack1;
        }
    }
}

function animateClouds() {

    shift1 += 1 /5;
    shift2 += 1 /5;
    clouds1.style.left = shift1 + "px";

    clouds2.style.left = shift2 + "px";

    if (shift1 >= windowWidth) {
        shift1 = 0 - windowWidth;
    }
    if (shift2 >= windowWidth) {
        shift2 = 0 - windowWidth;
    }

}