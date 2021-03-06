var isInDev = true;
var backImgAssets = 'Data/Sprites/';

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
var awaitingDeployment = false;
let dispAnim;
let loopAnim;
let menuDiv = document.getElementById('menuDiv');
let menuAnim;

function skippableVideo(){
    let clickToStart = document.createElement('h2');
    clickToStart.style.position = 'absolute';
    clickToStart.style.top= 225+'px';
    clickToStart.style.left = 350 + 'px';
    clickToStart.style.zIndex = 7;
    clickToStart.style.color = 'green';
    clickToStart.style.opacity = 60+'%';
    clickToStart.innerText = 'Click to start';
    clickToStart.addEventListener("click", ()=>{document.body.removeChild(clickToStart); vid.play();});
    document.body.appendChild(clickToStart);
    let vidBlock = document.createElement('div');
    vidBlock.id = 'vidBlock';
    vidBlock.style.position = 'absolute';
    vidBlock.style.zIndex=5;
    document.body.appendChild(vidBlock);
    let vid = document.createElement('video');
    let vidSrc = document.createElement('source');
    vidSrc.src='Data/Sprites/mov_bbb.mp4';
    vidSrc.type='video/mp4';
    vid.appendChild(vidSrc);
    vid.height = 500;
    vid.width=850;
    vidBlock.appendChild(vid);
    vidBlock.addEventListener("click", ()=>{document.body.removeChild(clickToStart); vid.play()})
    vid.addEventListener("ended", videoEndHandler,false);

    window.addEventListener('keydown',(e)=>{if(e.code==='Space') videoEndHandler();});
    function videoEndHandler(){
        document.body.removeChild(vidBlock);
        window.removeEventListener("keydown", videoEndHandler, true);
        splashScreen();
    }
}

skippableVideo();
function instructions() {
    document.getElementById('instructions').removeEventListener('click', instructions);
    let bg = document.createElement('img');
    bg.src = 'Data/Sprites/instruct_back.png';
    document.body.appendChild(bg);
    bg.style.zIndex = 3;
    bg.style.opacity = 90 + '%';
    bg.style.width = 500 + 'px';
    bg.style.height = 500 + 'px';
    bg.style.left = 100 + 'px';
    insText = document.createElement('img');
    insText.setAttribute('id', 'instext');
    insText.style.position = 'absolute';
    insText.style.zIndex = 4;
    insText.src = 'Data/Sprites/insText.png';
    document.body.appendChild(insText);
    let keyEvent = window.addEventListener('keydown', closeIns);

    function closeIns(e) {
        if (e.keyCode === 27) {
            document.body.removeChild(bg);
            document.body.removeChild(insText)
        }
        document.getElementById('instructions').addEventListener('click', instructions);
        window.removeEventListener('keydown', closeIns);
    }
}

function startGame() {

    dispAnim = setInterval(displayLoop, 34);//starts game loop time is in ms
    loopAnim = setInterval(tick, 34);//starts game loop time is in ms

}

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
        this.projectile.src = "Data/Sprites/Arrow.png";
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

        var startPosU = (this.startX + this.renderOffSetX);
        var arrowMove = -5;

        if (this.isPlayers) {
            startPosU = (this.startX + this.renderOffSetX);
            arrowMove = 10;
        }

        if (!this.isPlayers) {
            startPosU = this.startX;
            arrowMove = -10;
        }

        if (this.missleCooldown == 0) {
            if (!colitionHandler(startPosU, arrowMove, 16, this.myIndex, 0, false, false)) {
                this.startX = this.startX + arrowMove;
                this.renderOffSetY = this.renderOffSetY + 0.4;
                this.missleCooldown = this.missleSpeed;
            }
            else {
                if (queuedDMG.length > 0 && queuedDMG[queuedDMG.length - 1].dealer == this.myIndex) {
                    queuedDMG[queuedDMG.length - 1].dmg = this.dmg;
                    document.body.removeChild(this.projectile);
                    this.isInAir = false;
                }
                else {
                    this.startX = this.startX + arrowMove;
                    this.renderOffSetY = this.renderOffSetY + 0.4;
                    this.missleCooldown = this.missleSpeed;
                }
            }
        }
        else {
            this.missleCooldown--;
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

    constructor(isPlayers, Swidth, Sheight, CharacterYOffSet, CharacterXOffSet, unitHeight, unitWidth, owner) {
        this.isPlayers = isPlayers;
        this.lifeLeft = 2;
        this.Swidth = Swidth;
        this.unitHeight = unitHeight;
        this.unitWidth = unitWidth;
        var owner = owner;

        this.cirkleShield.style.background = "blue";
        this.cirkleShield.style.width = Swidth + "px";
        this.cirkleShield.style.height = Sheight + "px";
        this.cirkleShield.style.top = CharacterYOffSet + "px";
        this.cirkleShield.style.left = CharacterXOffSet + (this.unitWidth / 2) - (this.Swidth / 3.5) + "px";
        this.cirkleShield.style.opacity = 50 + "%";
        this.cirkleShield.style.position = "absolute";
        this.cirkleShield.style.borderRadius = 250 + "px";
        this.cirkleShield.addEventListener("mouseover", function (event) { spectadedCharacter = owner; healthDisplayTimer = true; }, false);
        this.cirkleShield.addEventListener("mouseleave", function (event) { healthDisplayTimer = false; }, false);

        document.body.appendChild(this.cirkleShield);
    }

    renderShield(CharacterXOffSet) {
        this.cirkleShield.style.left = CharacterXOffSet + (this.unitWidth / 2) - (this.Swidth / 3.5) + "px";
    }

    shieldRemoveLife() {
        this.lifeLeft--;
        this.cirkleShield.style.opacity = 40 + "%";
        if (this.lifeLeft == 0) {
            document.body.removeChild(this.cirkleShield);
            return true;
        }
        return false;
    }
}

var deathSmokeAI = document.createElement('img');
deathSmokeAI.src = "Data/Sprites/smoke.gif";
deathSmokeAI.style.position = "absolute";
deathSmokeAI.style.top = (windowHeight * 0.60) + "px";

var deathSmoke = document.createElement('img');
deathSmoke.src = "Data/Sprites/smoke.gif";
deathSmoke.style.position = "absolute";
deathSmoke.style.top = (windowHeight * 0.60) + "px";

class Character{
    unitIsAlive;
    isMakingAShield;

    cirkle = document.createElement("div");
    cirkleRadius;
    cirkleMax = 220;
    wizardPowerDecay;

    dyingTimer = 20;

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

        this.wizardPowerDecay = 10;
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
        var moveby;
        var renderOffSetXlocal;
        var wizardDoingDmg = false;
        var direction = 1;

        if (this.BelongsToPlayer) {
            moveby = 10;
            renderOffSetXlocal = 25;
        }
        if (!this.BelongsToPlayer) {
            moveby = -10;
            renderOffSetXlocal = 25;
            direction = -1;
        }

        if (this.isMakingAShield) {
            if (this.cirkleRadius < this.cirkleMax) {
                this.cirkleRadius += 25/this.wizardPowerDecay;
            }
            else {
                this.wizardPowerDecay++;
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
                                playerCharacters[num].shield = new magicShield(playerCharacters[num].BelongsToPlayer, ((playerCharacters[num].unitHeight / 3) * 2) * 1.2, playerCharacters[num].unitHeight * 1.2, playerCharacters[num].CharacterYOffSet, playerCharacters[num].CharacterXOffSet, playerCharacters[num].unitWidth, playerCharacters[num].unitHeight, playerCharacters[num]);
                            }
                            unitsToGiveShield.pop();

                        })
                    }
                    else {
                        unitsToGiveShield.forEach((num) => {
                            if (!AICharacters[num].hasShield) {
                                AICharacters[num].hasShield = true;
                                AICharacters[num].shield = new magicShield(AICharacters[num].BelongsToPlayer, ((AICharacters[num].unitHeight / 3) * 2) * 1.2, AICharacters[num].unitHeight * 1.2, AICharacters[num].CharacterYOffSet, AICharacters[num].CharacterXOffSet, AICharacters[num].unitWidth, AICharacters[num].unitHeight, AICharacters[num]);
                            }
                            unitsToGiveShield.pop();
                        })
                    }
                }

                if (unitsToGiveShield.length > 0) {
                    console.log("failsafe on stack 'unitsToGiveShield' clearing stack...");
                    while (unitsToGiveShield.length > 0) { unitsToGiveShield.pop()}
                }
            }

            return;
        }

        this.idlePos = false;

        if (this.nextMove == 0) {

            if (colitionHandler(this.CharacterXOffSet, moveby, this.unitWidth, this.index, this.range, false, false) == false) {
                this.CharacterXOffSet = this.CharacterXOffSet + moveby;//RETURN ON THIS
                if (!this.isWalking) {
                    this.isWalking = true;
                }
            }
            else {
                if (this.isWizard) {
                    colitionHandler(this.CharacterXOffSet, (this.cirkleMax / 2)*direction, this.unitWidth, this.index, this.range, true, false);
                    
                    if (unitsToGiveShield.length == 0) {
                        if (queuedDMG.length > 0) {
                            if (this.BelongsToPlayer == queuedDMG[queuedDMG.length - 1].isPlayers && queuedDMG[queuedDMG.length - 1].dealer == this.index) {
                                queuedDMG[queuedDMG.length - 1].dmg = this.strength;
                            }
                        }

                    }
                    else {
                        this.isMakingAShield = true;
                        document.body.appendChild(this.cirkle);
                    }
                    while (unitsToGiveShield.length > 0) { unitsToGiveShield.pop(); }
                    wizardDoingDmg = true;
                }

                this.idlePos = true;
                if (queuedDMG.length > 0 && !wizardDoingDmg) {
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
        if (!this.unitIsAlive) {
            this.dyingTimer--;
            if (this.dyingTimer == 0) {
                if (this.isPlayers) {
                    document.body.removeChild(deathSmoke);
                }
                else {
                    document.body.removeChild(deathSmokeAI);
                }
            }

            return;
        }

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
                this.hasShield = false;
            }
            return;
        }

        this.health -= amount;
        if (this.health <= 0) {
            this.unitIsAlive = false;
            if (this.isPlayers) {
                document.body.appendChild(deathSmoke);
                deathSmoke.style.left = this.CharacterXOffSet - 10 + "px";
            }
            else {
                document.body.appendChild(deathSmokeAI);
                deathSmokeAI.style.left = this.CharacterXOffSet - 30 + "px";
            }
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
                    queuedDMG.push(new damageTemplate(0, myIndex, i, true, true));
                    return true;
                }
            }
        }
        for (i = 0; i < maxUnitCount; i++) {
            if (AICharacters[i] != null && AICharacters[i].unitIsAlive == true) {//collision between player units and AI units
                if (AICharacters[i].CharacterXOffSet <= currentPos + moveBy + imageWidth + range) {
                    if (!isWizard) {
                        if (!noDMG) {
                            queuedDMG.push(new damageTemplate(0, myIndex, i, true, false));
                            return true;
                        }
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
                    return true;
                }
            }
        }

        for (i = 0; i < maxUnitCount; i++) {
            if (playerCharacters[i] != null && playerCharacters[i].unitIsAlive == true) {//collision between AI units and player units
                if (playerCharacters[i].CharacterXOffSet + imageWidth >= currentPos + moveBy - range) {
                    if (!isWizard) {
                        if (!noDMG) {
                            queuedDMG.push(new damageTemplate(0, myIndex, i, false, false));
                            return true;
                        }
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

function ProductionElement(type, thumbnail, totalTime, overwrite) {
            this.type = type
            this.overwrite = overwrite;
            this.thumbnail = thumbnail;
            this.Character = null;
            this.timeLeft = totalTime;
            this.totalTime = totalTime;
        }
//alert("Starting");

var unitLongsword = new CharacterTemplate(120, 5, 5, new animation("Data/Sprites/unit_knight_fight1.png", "Data/Sprites/unit_knight_fight2.png", "Data/Sprites/unit_knight_fight3.png", "Data/Sprites/unit_knight_fight1.png", "Data/Sprites/unit_knight_fight2.png", "Data/Sprites/unit_knight_fight3.png", "Data/Sprites/unit_knight_fight1.png"),
    "Knight", 100, "Data/Sprites/unit_knight_fight1.png", 0, false);
var unitArcher = new CharacterTemplate(100, 3, 3, new animation("Data/Sprites/unit_mage_fight1.png", "Data/Sprites/unit_mage_fight2.png", "Data/Sprites/unit_mage_fight3.png", "Data/Sprites/unit_mage_fight1.png", "Data/Sprites/unit_mage_fight2.png", "Data/Sprites/unit_mage_fight3.png", "Data/Sprites/unit_mage_fight1.png"),
    "Wizard", 100, "Data/Sprites/unit_mage_fight1.png", 0, true);
var unitPolearm = new CharacterTemplate(100, 18, 4, new animation("Data/Sprites/unit_archer_fight1.png", "Data/Sprites/unit_archer_fight2.png", "Data/Sprites/unit_archer_fight3.png", "Data/Sprites/unit_archer_fight3.png", "Data/Sprites/unit_archer_fight1.png", "Data/Sprites/unit_archer_fight2.png", "Data/Sprites/unit_archer_fight1.png"),
    "Archer", 100, "Data/Sprites/unit_archer_fight1.png", 150, false);

var AIunitLongsword = new CharacterTemplate(120, 5, 5, new animation("Data/Sprites/unit_knight_fight1.png", "Data/Sprites/unit_knight_fight2.png", "Data/Sprites/unit_knight_fight3.png", "Data/Sprites/unit_knight_fight1.png", "Data/Sprites/unit_knight_fight2.png", "Data/Sprites/unit_knight_fight3.png", "Data/Sprites/unit_knight_fight1.png"),
    "Knight", 100, "Data/Sprites/unit_knight_fight1.png", 0, false);
var AIunitArcher = new CharacterTemplate(100, 3, 3, new animation("Data/Sprites/unit_mage_fight1.png", "Data/Sprites/unit_mage_fight2.png", "Data/Sprites/unit_mage_fight3.png", "Data/Sprites/unit_mage_fight1.png", "Data/Sprites/unit_mage_fight2.png", "Data/Sprites/unit_mage_fight3.png", "Data/Sprites/unit_mage_fight1.png"),
    "Wizard", 100, "Data/Sprites/unit_mage_fight1.png", 0, true);
var AIunitPolearm = new CharacterTemplate(100, 18, 4, new animation("Data/Sprites/unit_archer_fight1.png", "Data/Sprites/unit_archer_fight2.png", "Data/Sprites/unit_archer_fight3.png", "Data/Sprites/unit_archer_fight3.png", "Data/Sprites/unit_archer_fight1.png", "Data/Sprites/unit_archer_fight2.png", "Data/Sprites/unit_archer_fight1.png"),
    "Archer", 100, "Data/Sprites/unit_archer_fight1.png", 150, false);

var unitsAvailable = [unitLongsword, unitArcher, unitPolearm];
var AIunitsAvailable = [AIunitLongsword, AIunitArcher, AIunitPolearm];
var productionQueue = [5];
var AIproduction;

var productionEndSpot = 0;//Watch this on game reset
var isProducing = 0;
var isProducingSmth = false;
var AIisProducingSmth = false;
var background1 = document.createElement("img");
background1.src = "Data/Sprites/foreground 1000x500.png";
background1.style.position = "absolute";
background1.style.width = windowWidth + "px";
background1.style.height = windowHeight + "px";
background1.style.top = 0 + "px";
background1.style.left = 0 + "px";
document.body.appendChild(background1);

var background2 = document.createElement("img");
background2.src = "Data/Sprites/foregroundBridgeOnly.png";
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

var unitName = document.createElement('div');
var unitHealth = document.createElement('div');
var unitDMG = document.createElement('div');
var unitSpeed = document.createElement('div');

var unitHealthIMG = document.createElement('img');
var unitDMGIMG = document.createElement('img');
var unitSpeedIMG = document.createElement('img');

function updateUnitInfoPanel(unit) {
    unitName.innerHTML = unit.name.bold();
    unitHealth.textContent = "Health: " + unit.health;
    unitDMG.textContent = "Damage: " + unit.dmg;
    unitSpeed.textContent = "Speed: " + unit.moveSpeed;
    unitDMGIMG.src = "Data/Sprites/icon_damage2.png";
    unitSpeedIMG.src = "Data/Sprites/icon_speed2.png";
    unitHealthIMG.src = "Data/Sprites/icon_health.png";

    unitHealth.style.color = "black";
    unitDMG.style.color = "black";
    unitSpeed.style.color = "black";
    unitOverview.appendChild(unitName);
    setUpInfoSection(unitHealth, unitHealthIMG, 18);
    setUpInfoSection(unitDMG, unitDMGIMG, 18*2);
    setUpInfoSection(unitSpeed, unitSpeedIMG, 18*3);
}

function setUpInfoSection(element, elementImg, YLocation){
    element.style.position = "absolute";
    element.style.top = YLocation + "px";
    element.style.left = 18 + "px";

    elementImg.style.position = "absolute";
    elementImg.style.top = YLocation + 5 + "px";
    elementImg.style.width = 14 + "px";
    elementImg.style.height = 14 + "px";

    unitOverview.appendChild(element);
    unitOverview.appendChild(elementImg);
}

function highlightUpgrade(element, text) {
    element.style.color = "blue";
    element.textContent += text;
}

//background1.click;
//background1.addEventListener('click', function () {alert("now")});
var unit1 = document.createElement("img");
var unit2 = document.createElement("img");
var unit3 = document.createElement("img");
unit1.src = "Data/Sprites/unit_knight_fight1.png";
unit2.src = "Data/Sprites/unit_mage_fight1.png";
unit3.src = "Data/Sprites/unit_archer_fight1.png";

createAUnitBuildElement(unit1, "unit1", 0.803, 1);
createAUnitBuildElement(unit2, "unit2", 0.703, 2);
createAUnitBuildElement(unit3, "unit3", 0.603, 3);

var unitOverview = document.createElement('div');
unitOverview.style.background = "gray";
unitOverview.style.width = (0.24 * windowWidth) + "px";
unitOverview.style.height = (0.24 * windowHeight) + "px";
unitOverview.style.position = "absolute";
unitOverview.style.top = 0 + "px";
unitOverview.style.left = (0.43 * windowWidth) + "px";

var unitOverviewBack = document.createElement('div');
unitOverviewBack.style.background = "black";
unitOverviewBack.style.width = (0.24 * windowWidth) + 4 + "px";
unitOverviewBack.style.height = (0.24 * windowHeight) + 2 + "px";
unitOverviewBack.style.position = "absolute";
unitOverviewBack.style.top = 0 + "px";
unitOverviewBack.style.left = (0.43 * windowWidth) - 2 + "px";

document.body.appendChild(unitOverviewBack);
document.body.appendChild(unitOverview);

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
    heightBtn = (0.10 * windowHeight);
    widthBtn = (0.09 * windowWidth);
            margin = 5;
            yOffSetBtn = 0.01;

            btn.className = name;
    btn.style.width = heightBtn + "px";
    btn.style.height = heightBtn + "px";
    btn.style.position = "absolute";
    btn.style.top = (yOffSetBtn * windowHeight) + margin  + "px";
    btn.style.left = (xOffSetBtn * windowWidth) + widthBtn + margin  + "px";
            btn.click;
    btn.addEventListener('click', function () { document.getElementById("click"); click.play(); selectProduction(1, index) });
    btn.addEventListener('mouseover', function () { updateUnitInfoPanel(unitsAvailable[index-1]); });

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
    makeUpgradeElement("Data/Sprites/icon_health.png", xOffSetBtn, yOffSetBtn + 0.12, 2, index, unitHealth)
    makeUpgradeElement("Data/Sprites/icon_damage3.png", xOffSetBtn, yOffSetBtn + 0.18, 3, index, unitDMG)
        }

function makeUpgradeElement(imgSrc, xOffSetBtn, yOffSetBtn, type, index, element) {
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
    UpgradeImg.addEventListener('mouseover', function () { updateUnitInfoPanel(unitsAvailable[index - 1]); highlightUpgrade(element, " + 5"); });

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
            document.body.style = "cursor: url(Data/Sprites/cursor_sword.png), pointer";
            switch (type)
            {
                case 1://unit
                    {
                        productionQueue[productionEndSpot] = new ProductionElement(1, unitsAvailable[index - 1].thumbnail, unitsAvailable[index - 1].productionCost, index-1);
                        productionQueue[productionEndSpot].Character = unitsAvailable[index - 1];
                        addToProduction(productionEndSpot);
                        break;
                    }
                case 2://health
                    {
                        productionQueue[productionEndSpot] = new ProductionElement(2, "Data/Sprites/icon_health.png", upgradeReletivePrice, index - 1);
                        var upgrade = new CharacterTemplate(unitsAvailable[index - 1].health, unitsAvailable[index - 1].dmg, unitsAvailable[index - 1].moveSpeed, unitsAvailable[index - 1].animations, unitsAvailable[index - 1].name, unitsAvailable[index - 1].productionCost, unitsAvailable[index - 1].thumbnail, unitsAvailable[index - 1].range, unitsAvailable[index - 1].isWizard);
                        upgrade.health += 5;
                        /*if(upgrade.moveSpeed <= 10){
                            upgrade.moveSpeed = 10;
                            //TODO deny upgrades ================================================================================
                        }*/

                        productionQueue[productionEndSpot].Character = upgrade;
                        addToProduction(productionEndSpot);
                        break;
                    }
                case 3://dmg
                    {
                        productionQueue[productionEndSpot] = new ProductionElement(2, "Data/Sprites/icon_damage3.png", upgradeReletivePrice, index - 1);
                        var upgrade = new CharacterTemplate(unitsAvailable[index - 1].health, unitsAvailable[index - 1].dmg, unitsAvailable[index - 1].moveSpeed, unitsAvailable[index - 1].animations, unitsAvailable[index - 1].name, unitsAvailable[index - 1].productionCost, unitsAvailable[index - 1].thumbnail, unitsAvailable[index - 1].range, unitsAvailable[index - 1].isWizard);
                        upgrade.dmg += 5;

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
            if(AIproduction.type == 1){
                if (!colitionHandler(windowWidth - (windowWidth * 0.12), (-10), (windowWidth * 0.12), maxUnitCount + 1, 0, false, true)) {//TODO the image width here is not great, also the index is ok but no amazing
                    add_mem(AIproduction.Character, windowWidth, false);
                    AIisProducingSmth = false;
                }
                else {
                    AIproduction.timeLeft = 10;
                    return;
                }
            }
            else{
                AIisProducingSmth = false;
            }

        }
    }
    if (!isProducingSmth) { return;}
    if (!awaitingDeployment) {
        productuinBarProgress.style.width = ((0.40 * windowWidth) / 5) * (productionQueue[isProducing].timeLeft / productionQueue[isProducing].totalTime) + "px";
    }
    else {
        productuinBarProgress.style.width = (0.40 * windowWidth) / 5 + "px";
    }
            productionQueue[isProducing].timeLeft = productionQueue[isProducing].timeLeft - 1;
    if ((productionQueue[isProducing].timeLeft / productionQueue[isProducing].totalTime) == 0) {
        if (!awaitingDeployment) {
            productuinBarProgress.style.width = "0%";
        }
                
                //manage the different things that could be produced
                if (productionQueue[isProducing].type == 1) {
                    if (!colitionHandler(0, 10, (windowWidth * 0.12), maxUnitCount + 1, 0, false, true)) {//TODO the image width here is not great, also the index is ok but no amazing
                        awaitingDeployment = false;
                        productuinBarProgress.style.background = "white";
                        add_mem(unitsAvailable[productionQueue[isProducing].overwrite], 0, true);
                    }
                    else {
                        productionQueue[isProducing].timeLeft = 10;
                        productuinBarProgress.style.background = "yellow";
                        awaitingDeployment = true;
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
        if (character != null && (character.unitIsAlive == true || character.dyingTimer > 0)) {
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
        unit1.style.cursor = "url(Data/Sprites/cursor_sword.png), pointer";
        unit2.style.cursor = "url(Data/Sprites/cursor_sword.png), pointer";
        unit3.style.cursor = "url(Data/Sprites/cursor_sword.png), pointer";
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
//var stop2 = 0;

function manageAITurn() {
    if (AIisProducingSmth == false) {// && stop2 != 2) {
        /*AIisProducingSmth = true;
        if(stop2 == 0){
            unitSelector = 0;
        }
        else{
            unitSelector = 0;
        }
        stop2++;

        AIproduction = new ProductionElement(1, AIunitsAvailable[unitSelector].thumbnail, AIunitsAvailable[unitSelector].productionCost, 0);
        AIproduction.Character = AIunitsAvailable[unitSelector];*/

        AIisProducingSmth = true;
        unitSelector = Math.floor(Math.random()*3);
        if(colitionHandler(windowWidth - (windowWidth * 0.12), (-10), (windowWidth * 0.12), maxUnitCount + 1, 0, false, true)){
            AIproduction = new ProductionElement(2, "Data/Sprites/icon_speed3.png", 100, unitSelector);
            var upgrade = new CharacterTemplate(AIunitsAvailable[unitSelector].health, AIunitsAvailable[unitSelector].dmg, AIunitsAvailable[unitSelector].moveSpeed, AIunitsAvailable[unitSelector].animations, AIunitsAvailable[unitSelector].name, AIunitsAvailable[unitSelector].productionCost, AIunitsAvailable[unitSelector].thumbnail, AIunitsAvailable[unitSelector].range, AIunitsAvailable[unitSelector].isWizard);

            if(unitSelector = Math.floor(Math.random()*1)){
                upgrade.dmg += 5;
            }
            else{
                upgrade.health += 5;
            }

            AIproduction.Character = upgrade;

        }
        else{
            AIproduction = new ProductionElement(1, AIunitsAvailable[unitSelector].thumbnail, AIunitsAvailable[unitSelector].productionCost, 0);
            AIproduction.Character = AIunitsAvailable[unitSelector];
        }


        /*if(colitionHandler(windowWidth - (windowWidth * 0.12),-10,(windowWidth * 0.12),maxUnitCount+1,0,false,true)){//TODO this aint great
            
            return;
        }
        else{
            
        }*/
        
    }
}

function manageDamage() {
    while (queuedDMG.length > 0) {
        var damageHandled = queuedDMG.pop();

        if (damageHandled.isPlayers) {
            if (damageHandled.baseDamage) {
                AIHealthOffSet -= damageHandled.dmg;
                if (AIHealthOffSet < windowHeight * 0.10) {
                    healthBarAI.style.background = "red";
                }
                if (AIHealthOffSet < 0) {
                    healthBarAI.style.height = 0 + "px";
                    gameOver(true);
                }
                continue;
            }
            AICharacters[damageHandled.reciver].reciveDamage(damageHandled.dmg);
        }
        if (!damageHandled.isPlayers) {
            if (damageHandled.baseDamage) {
                PlayerHealthOffSet -= damageHandled.dmg;
                if (PlayerHealthOffSet < windowHeight * 0.10) {
                    healthBarPlayer.style.background = "red";
                }
                if (PlayerHealthOffSet < 0) {
                    healthBarPlayer.style.height = 0 + "px";
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
  wiz.src = "Data/Sprites/.gif";
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

    clearInterval(dispAnim);
    clearInterval(loopAnim);
    let wonImage = document.createElement("img");
    wonImage.style.zIndex = 7;
    document.body.appendChild(wonImage);
    wonImage.style.left = 250 + 'px';
    wonImage.style.top = 0 + 'px';
    if (PlayerHealthOffSet <= 0)
        wonImage.src = "Data/Sprites/computerWon.png"
    if (AIHealthOffSet <= 0)
        wonImage.src = "Data/Sprites/youWon.png"
    let endImage = document.createElement('img');
    document.body.appendChild(endImage);
    endImage.src = 'Data/Sprites/playAgain.png';
    endImage.style.zIndex = 7;
    endImage.style.left = 280 + 'px';
    endImage.style.top = -50 + 'px';
    endImage.style.opacity = 60 + '%';
    endImage.addEventListener('mouseover', (e) => { e.target.style.opacity = 100 + '%'; });
    endImage.addEventListener('mouseleave', (e) => { e.target.style.opacity = 60 + '%'; });
    let pos = -100;
    let winpos = 0;
    endImage.addEventListener('click', () => { location.reload() });
    setInterval(() => {
        endImage.style.top = pos + 'px';
        wonImage.style.top = winpos + 'px';
        if (pos < 80)
            pos++;
        if (winpos < 130)
            winpos++;
    }, 30);

    document.getElementById("bm");
    bm.pause();
    tick();
    displayLoop();
}