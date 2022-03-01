const animationStages = 3;

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