let counter = 0;
let pos = Math.floor(Math.random() * 200);
let maxUnitCount = 8;
var playerCharacters = [maxUnitCount];
var AICharacters = [maxUnitCount];
var maxMissleCount = 8;
var Missles = [maxMissleCount];
var queuedDMG = [];
var unitsToGiveShield = [];
var spectadedCharacter;
var healthDisplayTimer = false;
var AIHealthOffSet = windowHeight * 0.55;
var PlayerHealthOffSet = windowHeight * 0.55;

class missle{
    cutoff = (windowHeight * 0.21) + (windowHeight * 0.70) - 16;

    constructor(dmg, distance, isPlayers, isInAir, startX, startY, renderOffSetX, renderOffSetY, myIndex) {
        this.dmg = dmg;
        this.distance = distance;
        this.isPlayers = isPlayers;
        this.isInAir = isInAir;
        this.renderOffSetX = renderOffSetX;
        this.startX = startX;
        this.renderOffSetY = startY + renderOffSetY;
        this.missleSpeed = 5;
        this.missleCooldown = 0;
        this.myIndex = myIndex;

        this.projectile = document.createElement("img");
        this.projectile.src = "Arrow.png";
        this.projectile.width = 32;
        this.projectile.height = 16;
        this.projectile.style.left = startX + renderOffSetX + "px";
        if (!this.isPlayers) {
            this.projectile.style.left = startX + "px";
        }
        this.projectile.style.top = this.renderOffSetY + "px";
        this.projectile.style.position = "absolute";

        if (isPlayers == false) {
            this.projectile.style.transform = "scaleX(-1)";
        }

        document.body.appendChild(this.projectile);
        
    }

    updateMissleTrajectory() {
        if (this.cutoff < this.renderOffSetY) {
            document.body.removeChild(this.projectile);
            this.isInAir = false;
            return;
        }


        if (this.isPlayers) {
            if (this.missleCooldown == 0) {
                if (!colitionHandler((this.startX + this.renderOffSetX), 5, 16, this.myIndex, 0, false, false)) {
                    this.startX = this.startX + 5;
                    this.renderOffSetY = this.renderOffSetY + 0.6;
                    this.missleCooldown = this.missleSpeed;
                }
                else {
                    if (queuedDMG.length > 0 && queuedDMG[queuedDMG.length - 1].dealer == this.myIndex) {
                        queuedDMG[queuedDMG.length - 1].dmg = this.dmg;
                        document.body.removeChild(this.projectile);
                        this.isInAir = false;
                    }
                    else {
                        document.body.removeChild(this.projectile);
                        this.isInAir = false;
                    }
                }
            }
            else {
                this.missleCooldown--;
            }
        }

        if (!this.isPlayers) {
            if (this.missleCooldown == 0) {
                if (!colitionHandler(this.startX, -5, 60, this.myIndex, 0, false, false)) {//TODO use unit standard size or pass a hitbox
                    this.startX = this.startX - 5;
                    this.renderOffSetY = this.renderOffSetY + 0.6;
                    this.missleCooldown = this.missleSpeed;
                }
                else {
                    if (queuedDMG.length > 0 && queuedDMG[queuedDMG.length - 1].dealer == this.myIndex) {
                        queuedDMG[queuedDMG.length - 1].dmg = this.dmg;
                        document.body.removeChild(this.projectile);
                        this.isInAir = false;
                    }
                    else {
                        document.body.removeChild(this.projectile);
                        this.isInAir = false;
                    }
                }
            }
            else {
                this.missleCooldown--;
            }
        }

    }

    renderMissle() {
        this.projectile.style.top = this.renderOffSetY + "px";
        if (this.isPlayers) {
            this.projectile.style.left = this.startX + this.renderOffSetX + "px";
        }
        else {
            this.projectile.style.left = this.startX + "px";
        }
    }
}

class damageTemplate {
    constructor(dmg, dealer, reciver, isPlayers, baseDamage) {
        this.dmg = dmg;
        this.dealer = dealer;
        this.reciver = reciver;
        this.isPlayers = isPlayers;
        this.baseDamage = baseDamage;

    }

}

class CharacterTemplate {
    constructor(health, dmg, moveSpeed, animations, name, productionCost, thumbnail, range, isWizard) {
        this.health = health;
        this.dmg = dmg;
        this.moveSpeed = moveSpeed;
        this.range = range;
        this.isWizard = isWizard;

        this.name = name;
        this.productionCost = productionCost;
        this.thumbnail = thumbnail;
        this.animations = animations;
    }
}

class magicShield {

    cirkleShield = document.createElement("div");

    constructor(isPlayers, Swidth, Sheight, CharacterYOffSet, CharacterXOffSet, unitHeight, unitWidth) {
        this.isPlayers = isPlayers;
        this.lifeLeft = 2;
        this.Swidth = Swidth;
        this.unitHeight = unitHeight;
        this.unitWidth = unitWidth;

        this.cirkleShield.style.background = "blue";
        this.cirkleShield.style.width = Swidth + "px";
        this.cirkleShield.style.height = Sheight + "px";
        this.cirkleShield.style.top = CharacterYOffSet + "px";
        this.cirkleShield.style.left = CharacterXOffSet + (this.unitWidth / 2) - (this.Swidth / 3.5) + "px";
        this.cirkleShield.style.opacity = 50 + "%";
        this.cirkleShield.style.position = "absolute";
        this.cirkleShield.style.borderRadius = 250 + "px";

        document.body.appendChild(this.cirkleShield);
    }

    renderShield(CharacterXOffSet) {
        this.cirkleShield.style.left = CharacterXOffSet + (this.unitWidth / 2) - (this.Swidth / 3.5) + "px";
    }

    shieldRemoveLife() {
        this.lifeLeft--;
        if (this.lifeLeft == 0) {
            document.body.removeChild(this.cirkleShield);
            return true;
        }
        return false;
    }
}

class Character{
    unitIsAlive;
    isMakingAShield;

    cirkle = document.createElement("div");
    cirkleRadius;
    cirkleMax = 200;

    constructor(health, dmg, moveSpeed, animations, startPos, index, belongsToPlayer, range, isWizard) {
        this.unitWidth = (windowWidth * 0.12);
        this.unitHeight = (windowHeight * 0.17);
        this.CharacterYOffSet = (windowHeight * 0.70);
        var that = this;
        this.range = range;
        this.isWalking = true;
        this.isWizard = isWizard; //i swear this is such a poopy way of doing it but since we for now only have 3 types its kindaa ok
        this.rateOfFire = 6;//multiplies action rate so. Given action rate is 3 this will make the shooting rate 3*3=9tiks
        this.nextShot = 0;

        this.totalHealth = health;
        this.health = health;
        this.hasShield = false;
        this.shield;
        this.strength = dmg;
        this.speed = moveSpeed * animationStages;

        this.myAnimations = animations;
        this.idlePos = false;

        this.npc = document.createElement('img');
        this.npc.id = "wizard" + counter;
        this.npc.src = animations.walk1;
        this.npc.width = this.unitWidth;
        this.npc.height = this.unitHeight;
        if (belongsToPlayer == false) {
            this.npc.style.left = (startPos - this.unitWidth) + "px";
            this.npc.style.transform = "scaleX(-1)";
            this.CharacterXOffSet = startPos - this.unitWidth;
        }
        else {
            this.npc.style.left = startPos + "px";
            this.CharacterXOffSet = startPos;
        }
        this.npc.style.top = this.CharacterYOffSet + "px";
        this.npc.addEventListener("mouseover", function( event ) {spectadedCharacter = that; healthDisplayTimer = true;}, false);
        this.npc.addEventListener("mouseleave", function( event ) {healthDisplayTimer = false;}, false);

        this.cirkleRadius = 0;
        this.cirkle.style.background = "blue";
        this.cirkle.style.width = this.cirkleRadius + "px";
        this.cirkle.style.height = this.cirkleRadius + "px";
        this.cirkle.style.top = this.CharacterYOffSet + (this.unitHeight/2) + "px";
        this.cirkle.style.left = this.CharacterXOffSet + (this.unitWidth / 2) + "px";
        this.cirkle.style.opacity = 50 + "%";
        this.cirkle.style.position = "absolute";
        this.cirkle.style.borderRadius = 250 + "px";

        this.index = index;
        this.unitIsAlive = true;
        this.isMakingAShield = false;
        //this.CharacterXOffSet = startPos - this.unitWidth;
        this.BelongsToPlayer = belongsToPlayer;
        this.nextMove = 0;

        document.body.appendChild(this.npc);
    }

    characterBehavior() {
        if (this.isMakingAShield) {
            if (this.cirkleRadius < this.cirkleMax) {
                this.cirkleRadius++;
            }
            else {
                this.cirkleRadius = 0;
                this.cirkle.style.width = this.cirkleRadius + "px";
                document.body.removeChild(this.cirkle);
                this.isMakingAShield = false;

                colitionHandler(this.CharacterXOffSet, this.cirkleMax / 2, this.unitWidth, this.index, this.range, true, false);
                colitionHandler(this.CharacterXOffSet, (this.cirkleMax / 2) * -1, this.unitWidth, this.index, this.range, true, false);

                if (unitsToGiveShield.length > 0) {
                    if (this.BelongsToPlayer) {
                        unitsToGiveShield.forEach((num) => {
                            if (!playerCharacters[num].hasShield) {
                                playerCharacters[num].hasShield = true;
                                playerCharacters[num].shield = new magicShield(playerCharacters[num].BelongsToPlayer, ((playerCharacters[num].unitHeight / 3) * 2) * 1.2, playerCharacters[num].unitHeight * 1.2, playerCharacters[num].CharacterYOffSet, playerCharacters[num].CharacterXOffSet, playerCharacters[num].unitWidth, playerCharacters[num].unitHeight);
                            }
                            unitsToGiveShield.pop();

                        })
                    }
                    else {
                        unitsToGiveShield.forEach((num) => {
                            if (!AICharacters[num].hasShield) {
                                AICharacters[num].hasShield = true;
                                AICharacters[num].shield = new magicShield(AICharacters[num].BelongsToPlayer, ((AICharacters[num].unitHeight / 3) * 2) * 1.2, AICharacters[num].unitHeight * 1.2, AICharacters[num].CharacterYOffSet, AICharacters[num].CharacterXOffSet, AICharacters[num].unitWidth, AICharacters[num].unitHeight);
                            }
                            unitsToGiveShield.pop();
                        })
                    }
                }
                if (!this.hasShield) {
                    this.hasShield = true;
                    this.shield = new magicShield(this.BelongsToPlayer, ((this.unitHeight / 3) * 2) * 1.2, this.unitHeight*1.2, this.CharacterYOffSet, this.CharacterXOffSet, this.unitWidth, this.unitHeight);
                }
                if (unitsToGiveShield.length > 0) {
                    console.log("failsafe on stack 'unitsToGiveShield' clearing stack...");
                    while (unitsToGiveShield.length > 0) { unitsToGiveShield.pop()}
                }
            }

            return;
        }

        var moveby;
        var renderOffSetXlocal;

        this.idlePos = false;

        if (this.nextMove == 0) {
            if (this.BelongsToPlayer) {
                moveby = 10;
                renderOffSetXlocal = 50;
            }
            if (!this.BelongsToPlayer) {
                moveby = -10;
                renderOffSetXlocal = 50;
            }

            if (colitionHandler(this.CharacterXOffSet, moveby, this.unitWidth, this.index, this.range, false, false) == false) {
                this.CharacterXOffSet = this.CharacterXOffSet + moveby;//RETURN ON THIS
                if (!this.isWalking) {
                    this.isWalking = true;
                }
            }
            else {
                if (this.isWizard) {
                    this.isMakingAShield = true;
                    document.body.appendChild(this.cirkle);
                }

                this.idlePos = true;
                if (queuedDMG.length > 0) {
                    if (this.BelongsToPlayer == queuedDMG[queuedDMG.length - 1].isPlayers && queuedDMG[queuedDMG.length - 1].dealer == this.index) {
                        if (this.range == 0 && !this.isWizard) {
                            queuedDMG[queuedDMG.length - 1].dmg = this.strength;
                        }
                        else if (this.isWizard) {
                            queuedDMG.pop();
                        }
                        else {
                            if (this.nextShot == 0 && !this.isWizard) {
                                for (i = 0; i < maxMissleCount; i++) {
                                    if (Missles[i] == null || Missles[i].isInAir != true) {
                                        Missles[i] = new missle(this.strength, this.range, this.BelongsToPlayer, true, this.CharacterXOffSet, this.CharacterYOffSet, this.unitWidth, renderOffSetXlocal, this.index);
                                        break;
                                    }
                                }
                                this.nextShot = this.rateOfFire;
                            }
                            else {
                                this.nextShot--;
                            }
                            queuedDMG.pop();
                        }
                    }
                }
                if (this.isWalking) {
                    this.isWalking = false;
                }
            }

            this.nextMove = this.speed;
        }
        else {
            this.nextMove--;
        }

        this.npc.src = this.myAnimations.getCurrentAnimation(this.isWalking, this.nextMove, this.speed, this.range, this.nextShot, this.rateOfFire, this.idlePos);
    }

    renderUpdate() {
        this.npc.style.left = this.CharacterXOffSet + "px";
        if (this.isMakingAShield) {
            this.cirkle.style.width = this.cirkleRadius + "px";
            this.cirkle.style.height = this.cirkleRadius + "px";
            this.cirkle.style.top = this.CharacterYOffSet + (this.unitHeight / 2) - (this.cirkleRadius / 2) + "px";
            this.cirkle.style.left = this.CharacterXOffSet + (this.unitWidth / 2) - (this.cirkleRadius/2) + "px";
        }
        if (this.hasShield) {
            this.shield.renderShield(this.CharacterXOffSet);
        }
    }

    reciveDamage(amount) {
        if (this.hasShield) {
            if (this.shield.shieldRemoveLife()) {
                this.hasShield == false;
            }
            return;
        }

        this.health -= amount;
        if (this.health <= 0) {
            this.unitIsAlive = false;
            document.body.removeChild(this.npc);

            if (this.isMakingAShield) {
                document.body.removeChild(this.cirkle);
            }
        }
    }
}

function colitionHandler(currentPos, moveBy, imageWidth, myIndex, range, isWizard, noDMG) {
    if (moveBy > 0) {//handles players units colition
        if (currentPos + moveBy >= windowWidth - imageWidth - (windowWidth * 0.04)) {//check map colition
            if (!isWizard) {
                if (!noDMG) {
                    queuedDMG.push(new damageTemplate(0, myIndex, i, false, true));
                }
                return true;
            }
        }
        for (i = 0; i < maxUnitCount; i++) {
            if (AICharacters[i] != null && AICharacters[i].unitIsAlive == true) {//collision between player units and AI units
                if (AICharacters[i].CharacterXOffSet <= currentPos + moveBy + imageWidth + range) {
                    if (!isWizard) {
                        if (!noDMG) {
                            queuedDMG.push(new damageTemplate(0, myIndex, i, true, false));
                        }
                        return true;
                    }
                }
            }

            if (i == myIndex) {
                continue;
            }
            if (playerCharacters[i] != null && playerCharacters[i].unitIsAlive == true) {//collision between player units and player units
                if (playerCharacters[i].CharacterXOffSet > currentPos) {
                    if (playerCharacters[i].CharacterXOffSet <= currentPos + moveBy + imageWidth) {
                        if (isWizard) {
                            unitsToGiveShield.push(i);
                        }
                        else {
                            return true;
                        }
                    }
                }
            }
        }
    }
    else {//handles AI units colition
        if (currentPos + moveBy <= (windowWidth * 0.04)) {//check map colition
            if (!isWizard) {
                if (!noDMG) {
                    queuedDMG.push(new damageTemplate(0, myIndex, i, false, true));
                }
                return true;
            }
        }

        for (i = 0; i < maxUnitCount; i++) {
            if (playerCharacters[i] != null && playerCharacters[i].unitIsAlive == true) {//collision between AI units and player units
                if (playerCharacters[i].CharacterXOffSet + imageWidth >= currentPos + moveBy - range) {
                    if (!isWizard) {
                        if (!noDMG) {
                            queuedDMG.push(new damageTemplate(0, myIndex, i, false, false));
                        }
                        return true;
                    }
                }
            }

            if (i == myIndex) {
                continue;
            }
            if (AICharacters[i] != null && AICharacters[i].unitIsAlive == true) {//collision between player units and player units
                if (AICharacters[i].CharacterXOffSet < currentPos) {
                    if (AICharacters[i].CharacterXOffSet + imageWidth >= currentPos + moveBy) {
                        if (isWizard) {
                            unitsToGiveShield.push(i);
                        }
                        else {
                            return true;
                        }
                    }
                }
            }
        }
    }
    return false;
}

document.getElementById('mnuStart').addEventListener("mouseover", function (event) { event.target.style.opacity = "100%" });
document.getElementById('mnuStart').addEventListener("mouseleave", function (event) { event.target.style.opacity = "60%" });
function startGame() {
    menuDiv = document.getElementById('menuDiv');
    document.getElementById("bm");
    bm.loop = true;
    bm.play();
    menuDiv.style.visibility = "hidden";


    setInterval(displayLoop, 34);//starts game loop time is in ms
    setInterval(tick, 34);//starts game loop time is in ms

}

function ProductionElement(type, thumbnail, totalTime, overwrite) {
            this.type = type
            this.overwrite = overwrite;
            this.thumbnail = thumbnail;
            this.Character = null;
            this.timeLeft = totalTime;
            this.totalTime = totalTime;
        }
//alert("Starting");

var unitLongsword = new CharacterTemplate(100, 5, 10, new animation("arrow1.png", "arrow2.png", "arrow3.png", "arrow1.png", "arrow2.png", "arrow3.png", "arrow2.png"),
    "Knight", 100, "rome.png", 0, false);
var unitArcher = new CharacterTemplate(100, 50, 10, new animation("arrow1.png", "arrow2.png", "arrow3.png", "arrow1.png", "arrow2.png", "arrow3.png", "arrow2.png"),
    "Wizard", 100, "archer.png", 0, true);
var unitPolearm = new CharacterTemplate(100, 5, 10, new animation("arrow1.png", "arrow2.png", "arrow3.png", "arrow1.png", "arrow2.png", "arrow3.png", "arrow2.png"),
    "Archer", 100, "rome.png", 100, false);

var unitsAvailable = [unitLongsword, unitArcher, unitPolearm];
var productionQueue = [5];
var AIproduction;

var productionEndSpot = 0;//Watch this on game reset
var isProducing = 0;
var isProducingSmth = false;
var AIisProducingSmth = false;
var background1 = document.createElement("img");
background1.src = "foreground 1000x500.png";
background1.style.position = "absolute";
background1.style.width = windowWidth + "px";
background1.style.height = windowHeight + "px";
background1.style.top = 0 + "px";
background1.style.left = 0 + "px";
document.body.appendChild(background1);

var background2 = document.createElement("img");
background2.src = "foregroundBridgeOnly.png";
background2.style.position = "absolute";
background2.style.width = windowWidth + "px";
background2.style.height = windowHeight + "px";
background2.style.top = 0 + "px";
background2.style.left = 0 + "px";
document.body.appendChild(background2);

var healthBarAI = document.createElement("div");
var healthBarPlayer = document.createElement("div");

makeAHealthBar(0.95, healthBarAI);
makeAHealthBar(0.03, healthBarPlayer);

function makeAHealthBar(barLeft, barElement) {
    var barWidth = 0.02;
    var barHeight = 0.55;
    var barTop = 0.28;
    var edge = 4;

    var backHealthBar = document.createElement("div");
    backHealthBar.style.background = "black";
    backHealthBar.style.position = "absolute";
    backHealthBar.style.width = windowWidth * barWidth + edge + "px";
    backHealthBar.style.height = windowHeight * barHeight + edge + "px";
    backHealthBar.style.top = windowHeight * barTop - edge/2 + "px";
    backHealthBar.style.left = windowWidth * barLeft - edge/2 + "px";
    document.body.appendChild(backHealthBar);

    var edgeHealthBar = document.createElement("div");
    edgeHealthBar.style.background = "gray";
    edgeHealthBar.style.position = "absolute";
    edgeHealthBar.style.width = windowWidth * barWidth + "px";
    edgeHealthBar.style.height = windowHeight * barHeight + "px";
    edgeHealthBar.style.top = windowHeight * barTop + "px";
    edgeHealthBar.style.left = windowWidth * barLeft + "px";
    document.body.appendChild(edgeHealthBar);

    barElement.style.background = "lightblue";
    barElement.style.position = "absolute";
    barElement.style.width = windowWidth * barWidth + "px";
    barElement.style.height = windowHeight * barHeight + "px";
    barElement.style.top = windowHeight * barTop + "px";
    barElement.style.left = windowWidth * barLeft + "px";
    document.body.appendChild(barElement);
}

//background1.click;
//background1.addEventListener('click', function () {alert("now")});
document.getElementById("bm");
bm.loop = true;
bm.play();
var unit1 = document.createElement("img");
var unit2 = document.createElement("img");
var unit3 = document.createElement("img");
unit1.src = "rome.png";
unit2.src = "archer.png";
unit3.src = "rome.png";

createAUnitBuildElement(unit1, "unit1", 0.803, 1);
createAUnitBuildElement(unit2, "unit2", 0.703, 2);
createAUnitBuildElement(unit3, "unit3", 0.603, 3);

var productuinBarProgress = document.createElement('div');
productuinBarProgress.style.background = "white";
productuinBarProgress.style.width = (0.40 * windowWidth)/5 + "px";
productuinBarProgress.style.height = (0.10 * windowHeight) + "px";
productuinBarProgress.style.position = "absolute";
productuinBarProgress.style.top = 0 + "px";
productuinBarProgress.style.left = 0 + "px";
productuinBarProgress.style.opacity = "0.5";

var productuinMenuBack = document.createElement('div');
productuinMenuBack.style.background = "gray";
productuinMenuBack.style.width = (0.40 * windowWidth) + "px";
productuinMenuBack.style.height = (0.10 * windowHeight) + "px";
productuinMenuBack.style.position = "absolute";
productuinMenuBack.style.top = 0 + "px";
productuinMenuBack.style.left = 0 + "px";

var productuinMenuEdge = document.createElement('div');
productuinMenuEdge.style.background = "black";
productuinMenuEdge.style.width = (0.404 * windowWidth) + "px";
productuinMenuEdge.style.height = (0.105 * windowHeight) + "px";
productuinMenuEdge.style.position = "absolute";
productuinMenuEdge.style.top = 0 + "px";
productuinMenuEdge.style.left = 0 + "px";

let pBar = document.createElement('div');
pBar.classList.add ("w3-blue");
pBar.style.height = 10 + "px";
pBar.style.width = 40 + "px";
pBar.style.position = "absolute";

function displayHealth(){
    document.body.appendChild(pBar);
    pBar.style.width = (spectadedCharacter.health/spectadedCharacter.totalHealth)*0.10*windowWidth + "px";
    pBar.style.left = spectadedCharacter.CharacterXOffSet + "px";
    pBar.style.top = spectadedCharacter.npc.style.top;

    
}

document.body.appendChild(productuinMenuEdge);
document.body.appendChild(productuinMenuBack);
document.body.appendChild(unit1);
document.body.appendChild(unit2);
document.body.appendChild(unit3);

function createAUnitBuildElement(btn, name, xOffSetBtn, index) {
    widthBtn = (0.09 * windowWidth);
    heightBtn = (0.10 * windowHeight);
            margin = 5;
            yOffSetBtn = 0.01;

            btn.className = name;
    btn.style.width = widthBtn + "px";
    btn.style.height = heightBtn + "px";
    btn.style.position = "absolute";
    btn.style.top = (yOffSetBtn * windowHeight) + margin  + "px";
    btn.style.left = (xOffSetBtn * windowWidth) + widthBtn + margin  + "px";
            btn.click;
            btn.addEventListener('click', function () { document.getElementById("click"); click.play(); selectProduction(1, index) });

            var namef = name + "back";
            var front = document.createElement('div');
            front.className = namef;
            front.style.background = "gray";
    front.style.width = widthBtn + "px";
    front.style.height = heightBtn + "px";
            front.style.position = "absolute";
    front.style.top = (yOffSetBtn * windowHeight) + margin  + "px";
    front.style.left = (xOffSetBtn * windowWidth) + widthBtn + margin + "px";

            var nameb = name + "back";
            var back = document.createElement('div');
            back.className = nameb;
            back.style.background = "black";
    back.style.width = widthBtn + margin + "px";
    back.style.height = heightBtn + margin + "px";
            back.style.position = "absolute";
    back.style.top = (yOffSetBtn * windowHeight) + margin / 2 + "px";
    back.style.left = (xOffSetBtn * windowWidth) + widthBtn + margin / 2 + "px";

            document.body.appendChild(back);
            document.body.appendChild(front);

            var souce = "3c242eb786d1eae1ac53ed1713794e30--sci-fi-fantasy-fantasy-world.jpg";
    makeUpgradeElement("icon_speed3.png", xOffSetBtn, yOffSetBtn + 0.12, 2, index)
    makeUpgradeElement("icon_damage3.png", xOffSetBtn, yOffSetBtn + 0.18, 3, index)
        }

function makeUpgradeElement(imgSrc, xOffSetBtn, yOffSetBtn, type, index) {
    widthBtn = (0.09 * windowWidth);
    heightBtn = (0.05 * windowHeight);
            margin = 5;

            var UpgradeImg = document.createElement("img");
            UpgradeImg.src = imgSrc;
    UpgradeImg.style.width = heightBtn + "px";
    UpgradeImg.style.height = heightBtn + "px";
            UpgradeImg.style.position = "absolute";
    UpgradeImg.style.top = (yOffSetBtn * windowHeight) + margin / 2 + "px";
    UpgradeImg.style.left = (xOffSetBtn * windowWidth) + widthBtn + margin + (widthBtn / 2 - heightBtn/2) +"px";
            UpgradeImg.click;
            UpgradeImg.addEventListener('click', function () { selectProduction(type, index) });

            var front = document.createElement('div');
            front.style.background = "gray";
    front.style.width = widthBtn + "px";
    front.style.height = heightBtn + "px";
            front.style.position = "absolute";
    front.style.top = (yOffSetBtn * windowHeight) + margin / 2 + "px";
    front.style.left = (xOffSetBtn * windowWidth) + widthBtn + margin + "px";

            var back = document.createElement('div');
            back.style.background = "black";
    back.style.width = widthBtn + margin + "px";
    back.style.height = heightBtn + margin + "px";
            back.style.position = "absolute";
    back.style.top = (yOffSetBtn * windowHeight) + "px";
    back.style.left = (xOffSetBtn * windowWidth) + widthBtn + margin / 2 + "px";

            document.body.appendChild(back);
            document.body.appendChild(front);
            document.body.appendChild(UpgradeImg);
        }

function selectProduction(type, index) {
    var upgradeReletivePrice = 100;
            //note that types are:
            //1 = unit, 2 = speedUpgrade, 3 = dmgUpgrade
            if (productionEndSpot == isProducing && isProducingSmth == true) {
                //alert("tell player no more queue");

                return;
            }

            isProducingSmth = true;
            document.body.style = "cursor: url(cursor_sword.png), pointer";
            switch (type)
            {
                case 1://unit
                    {
                        productionQueue[productionEndSpot] = new ProductionElement(1, unitsAvailable[index - 1].thumbnail, unitsAvailable[index - 1].productionCost, index-1);
                        productionQueue[productionEndSpot].Character = unitsAvailable[index - 1];
                        addToProduction(productionEndSpot);
                        break;
                    }
                case 2://speed
                    {
                        productionQueue[productionEndSpot] = new ProductionElement(2, "icon_speed3.png", upgradeReletivePrice, index - 1);
                        var upgrade = new CharacterTemplate(unitsAvailable[index - 1].health, unitsAvailable[index - 1].dmg, unitsAvailable[index - 1].moveSpeed, unitsAvailable[index - 1].walking_anim, unitsAvailable[index - 1].attack_anim, unitsAvailable[index - 1].name, unitsAvailable[index - 1].productionCost, unitsAvailable[index - 1].thumbnail, unitsAvailable[index - 1].range);
                        upgrade.moveSpeed -= 190;
                        if(upgrade.moveSpeed <= 10){
                            upgrade.moveSpeed = 10;
                            //TODO deny upgrades ================================================================================
                        }

                        productionQueue[productionEndSpot].Character = upgrade;
                        addToProduction(productionEndSpot);
                        break;
                    }
                case 3://dmg
                    {
                        productionQueue[productionEndSpot] = new ProductionElement(2, "icon_damage3.png", upgradeReletivePrice, index - 1);
                        var upgrade = new CharacterTemplate(unitsAvailable[index - 1].health, unitsAvailable[index - 1].dmg, unitsAvailable[index - 1].moveSpeed, unitsAvailable[index - 1].walking_anim, unitsAvailable[index - 1].attack_anim, unitsAvailable[index - 1].name, unitsAvailable[index - 1].productionCost, unitsAvailable[index - 1].thumbnail, unitsAvailable[index - 1].range);
                        upgrade.dmg += 100;

                        productionQueue[productionEndSpot].Character = upgrade;
                        addToProduction(productionEndSpot);
                        break;
                    }
            }
            if (productionEndSpot == 4) {
                productionEndSpot = 0;
            }
            else {
                productionEndSpot++;
            }
        }

function addToProduction(num) {
    xQueueOffSet = getMyPositionInQueue(num) * (0.40 * windowWidth) / 5;

            var productuinMenuBack = document.createElement('img');
            productuinMenuBack.src = productionQueue[num].thumbnail;
    productuinMenuBack.style.width = (0.40 * windowWidth) / 5 + "px";
    productuinMenuBack.style.height = (0.10 * windowHeight) + "px";
            productuinMenuBack.style.position = "absolute";
    productuinMenuBack.style.top = 0 + "px";
    productuinMenuBack.style.left = 0 + xQueueOffSet + "px";

            document.body.appendChild(productuinMenuBack);

        }

function getMyPositionInQueue(num) {
            if (isProducing < productionEndSpot) {
                return num - isProducing;
            }
            else {
                if (num >= isProducing) {
                    return num - isProducing;
                }
                else {
                    return (5 - isProducing) + num;
                }
            }
        }

function manageProduction() {
    if (AIisProducingSmth) {
        AIproduction.timeLeft--;
        if (AIproduction.timeLeft == 0) {
            if (!colitionHandler(windowWidth - (windowWidth * 0.12), (-10), (windowWidth * 0.12), maxUnitCount + 1, 0, false, true)) {//TODO the image width here is not great, also the index is ok but no amazing
                add_mem(AIproduction.Character, windowWidth, false);
                AIisProducingSmth = false;
            }
            else {
                AIproduction.timeLeft = 10;
                return;
            }
        }
    }
    if (!isProducingSmth) { return;}
    productuinBarProgress.style.width = ((0.40 * windowWidth) / 5) * (productionQueue[isProducing].timeLeft / productionQueue[isProducing].totalTime) + "px";
            productionQueue[isProducing].timeLeft = productionQueue[isProducing].timeLeft - 1;
            if ((productionQueue[isProducing].timeLeft / productionQueue[isProducing].totalTime) == 0) {
                productuinBarProgress.style.width = "0%";
                //manage the different things that could be produced
                if (productionQueue[isProducing].type == 1) {
                    if (!colitionHandler(0, 10, (windowWidth * 0.12), maxUnitCount+1, 0, false, true)) {//TODO the image width here is not great, also the index is ok but no amazing
                        add_mem(unitsAvailable[productionQueue[isProducing].overwrite], 0, true);
                    }
                    else {
                        productionQueue[isProducing].timeLeft = 10;
                        return;
                    }
                }
                else if (productionQueue[isProducing].type == 2) {
                    //add_mem(productionQueue[isProducing].Character, 0, true);
                    
                    unitsAvailable[productionQueue[isProducing].overwrite] = productionQueue[isProducing].Character;
                }
                
                
                if (isProducing == 4) { isProducing = 0; } else { isProducing++; }//so loops around instead of ordering by array placement
                if (isProducing == productionEndSpot) {//are there more things in queue?
                    isProducingSmth = false;
                }

                document.body.appendChild(productuinMenuBack);
                for (var i = isProducing; i != productionEndSpot;) {
                    addToProduction(i);

                    if (i == 4) {
                        i = 0
                    }
                    else {
                        i++;
                    }
                }

            }
        }

function updateTheUnits(unitList) {
    unitList.forEach((character) => {
        if (character != null && character.unitIsAlive == true) {
            character.renderUpdate();
        }
    })
}

function updateTheUnitsBehavior(unitList) {
    unitList.forEach((character) => {
        if (character != null && character.unitIsAlive == true) {
            character.characterBehavior();
        }
    })
}

function updateMissles() {
    Missles.forEach((Missle) => {
        if (Missle != null && Missle.isInAir == true) {
            Missle.renderMissle();
        }
    })
}

function updateMissleBehavior() {
    Missles.forEach((Missle) => {
        if (Missle != null && Missle.isInAir == true) {
            Missle.updateMissleTrajectory();
        }
    })
}

function displayLoop() {

    if (productionEndSpot == isProducing && isProducingSmth == true) {
        //alert("tell player no more queue");
        unit1.style.cursor ='not-allowed';
        unit2.style.cursor ='not-allowed';
        unit3.style.cursor ='not-allowed';
        return;
    }
    else{
        unit1.style.cursor = "url(cursor_sword.png), pointer";
        unit2.style.cursor = "url(cursor_sword.png), pointer";
        unit3.style.cursor = "url(cursor_sword.png), pointer";
    }
    if (isProducingSmth) {
        document.body.appendChild(productuinBarProgress)
    }

    if(healthDisplayTimer){
        displayHealth();
    }
    else{
        pBar.style.width = 0;
    }
    
    updateTheUnits(playerCharacters);
    updateTheUnits(AICharacters);
    updateMissles();

    healthBarAI.style.height = AIHealthOffSet + "px";
    healthBarAI.style.top = (windowHeight * 0.28) + ((windowHeight * 0.55) - AIHealthOffSet) + "px";
    healthBarPlayer.style.height = PlayerHealthOffSet + "px";
    healthBarPlayer.style.top = (windowHeight * 0.28) + ((windowHeight * 0.55) - PlayerHealthOffSet) + "px";
}

function tick() {
    manageProduction();

    updateTheUnitsBehavior(playerCharacters);
    updateTheUnitsBehavior(AICharacters);

    manageAITurn();
    manageDamage();

    updateMissleBehavior();
    animateClouds();
}

function manageAITurn() {
    if (AIisProducingSmth == false) {
        AIisProducingSmth = true;
        unitSelector = Math.floor(Math.random()*3);
        AIproduction = new ProductionElement(1, unitsAvailable[unitSelector].thumbnail, unitsAvailable[unitSelector].productionCost, 0);
        AIproduction.Character = unitsAvailable[unitSelector];
    }
}

function manageDamage() {
    while (queuedDMG.length > 0) {
        var damageHandled = queuedDMG.pop();

        if (damageHandled.isPlayers) {
            if (damageHandled.baseDamage) {
                AIHealthOffSet -= damageHandled.dmg;
                if (AIHealthOffSet < 0) {
                    gameOver(true);
                }
                continue;
            }
            AICharacters[damageHandled.reciver].reciveDamage(damageHandled.dmg);
        }
        if (!damageHandled.isPlayers) {
            if (damageHandled.baseDamage) {
                PlayerHealthOffSet -= damageHandled.dmg;
                if (PlayerHealthOffSet < 0) {
                    gameOver(false);
                }
                continue;
            }
            playerCharacters[damageHandled.reciver].reciveDamage(damageHandled.dmg);
        }
        
    }
}

function add_mem(unit, position, isPlayers) {

    if (isPlayers) {
        for (i = 0; i < maxUnitCount; i++) {
            if (playerCharacters[i] == null || playerCharacters[i].unitIsAlive != true) {
                playerCharacters[i] = new Character(unit.health, unit.dmg, unit.moveSpeed, unit.animations, position, i, true, unit.range, unit.isWizard);
                break;
            }
        }
    }
    else {
        for (i = 0; i < maxUnitCount; i++) {
            if (AICharacters[i] == null || AICharacters[i].unitIsAlive != true) {
                AICharacters[i] = new Character(unit.health, unit.dmg, unit.moveSpeed, unit.animations, position, i, false, unit.range, unit.isWizard);
                break;
            }
        }
    }
}

function add_wiz(){
  let playDiv = document.getElementById('playboard');
  let wiz = document.createElement('img');
  wiz.src = "archer.gif";
  wiz.style.zIndex = 50;
  wiz.style.top = 200 + "px";
  playDiv.appendChild(wiz);
  window.setInterval(()=>{wiz.style.left = pos + "px";
  pos = Math.floor(Math.random()*200);}, 500)
}

function decay(x){
  let progress =  document.getElementById('myBar' + x);
  let i=100;
  let aliveFlag = true;
  window.setInterval(()=>{ 
  progress.style.width = i +"%";  
  if(aliveFlag==false) 
  {
    //document.getElementById("wizard"+x).src=''; 
    let playDiv = document.getElementById('playboard');
    wiz = document.getElementById('wizard'+x);
    playDiv.removeChild(wiz);
  }
  else{
    if(i>=0)
  i = i-10;
else
aliveFlag = false;} 
},800);
wiz = document.getElementById('wizard'+x);
console.log(wiz);
}

function gameOver(playerWon) {
    alert("game done implement something");
}
