const windowWidth = 850;
const windowHeight = 500;
let counter = 0;
let pos = Math.floor(Math.random() * 200);
let maxUnitCount = 8;
var playerCharacters = [maxUnitCount];
var AICharacters = [maxUnitCount];

class CharacterTemplate {
    constructor(name, productionCost, thumbnail) {
        this.name = name;
        this.productionCost = productionCost;
        this.thumbnail = thumbnail;
    }
}

class Character{

    constructor(strength, startPos, index, belongsToPlayer) {
        this.unitWidth = (windowWidth * 0.17);
        this.unitHeight = (windowHeight * 0.21);

        this.npc = document.createElement('img');
        this.npc.id = "wizard" + counter;
        this.npc.src = "arrow.gif";
        this.npc.width = this.unitWidth;
        this.npc.height = this.unitHeight;
        if (belongsToPlayer == false) {
            this.npc.style.left = (startPos - this.unitWidth) + "px";
        }
        else {
            this.npc.style.left = startPos + "px";
        }
        this.npc.style.top = (windowHeight*0.70) + "px";

        this.index = index;
        this.unitIsAlive = true;
        this.strength = strength;
        this.CharacterXOffSet = startPos - this.unitWidth;
        this.BelongsToPlayer = belongsToPlayer;
        this.speed = 10;
        this.nextMove = 0;
        document.body.appendChild(this.npc);
    }

    moveCharacter() {
        if (this.nextMove == 0) {
            if (this.BelongsToPlayer) {
                if (colitionHandler(this.CharacterXOffSet, 10, this.unitWidth, this.index) == false) {
                    this.CharacterXOffSet = this.CharacterXOffSet + 10;
                }
            }
            if (!this.BelongsToPlayer) {
                if (colitionHandler(this.CharacterXOffSet, -10, this.unitWidth, this.index) == false) {
                    this.CharacterXOffSet = this.CharacterXOffSet - 10;
                }
            }

            this.nextMove = this.speed;
        }
        else {
            this.nextMove--;
        }
    }

    renderUpdate() {
        this.npc.style.left = this.CharacterXOffSet + "px";
    }
}

setInterval(displayLoop, 34);//starts game loop time is in ms
setInterval(tick, 34);//starts game loop time is in ms

function colitionHandler(currentPos, moveBy, imageWidth, myIndex) {
    if (moveBy > 0) {//handles players units colition
        if (currentPos + moveBy >= windowWidth - imageWidth) {//check map colition
            return true;
        }
        for (i = 0; i < maxUnitCount; i++) {
            if (AICharacters[i] != null && AICharacters[i].unitIsAlive == true) {//collision between player units and AI units
                if (AICharacters[i].CharacterXOffSet <= currentPos + moveBy + imageWidth) {
                    return true;
                }
            }

            if (i == myIndex) {
                continue;
            }
            if (playerCharacters[i] != null && playerCharacters[i].unitIsAlive == true) {//collision between player units and player units
                if (playerCharacters[i].CharacterXOffSet > currentPos) {
                    if (playerCharacters[i].CharacterXOffSet <= currentPos + moveBy + imageWidth) {
                        return true;
                    }
                }
            }
        }
    }
    else {//handles AI units colition
        if (currentPos + moveBy <= 0) {//check map colition
            return true;
        }

        for (i = 0; i < maxUnitCount; i++) {
            if (playerCharacters[i] != null && playerCharacters[i].unitIsAlive == true) {//collision between AI units and player units
                if (playerCharacters[i].CharacterXOffSet + imageWidth >= currentPos + moveBy) {
                    return true;
                }
            }

            if (i == myIndex) {
                continue;
            }
            if (AICharacters[i] != null && AICharacters[i].unitIsAlive == true) {//collision between player units and player units
                if (AICharacters[i].CharacterXOffSet < currentPos) {
                    if (AICharacters[i].CharacterXOffSet + imageWidth >= currentPos + moveBy) {
                        return true;
                    }
                }
            }
        }
    }
    return false;
}

function ProductionElement(type, thumbnail, totalTime) {
            this.type = type
            this.thumbnail = thumbnail;
            this.Character = null;
            this.timeLeft = totalTime;
            this.totalTime = totalTime;
        }
//alert("Starting");

var unitLongsword = new CharacterTemplate("Longsword Knight", 100, "3c242eb786d1eae1ac53ed1713794e30--sci-fi-fantasy-fantasy-world.jpg");
var unitArcher = new CharacterTemplate("Archer", 100, "3c242eb786d1eae1ac53ed1713794e30--sci-fi-fantasy-fantasy-world.jpg");
var unitPolearm = new CharacterTemplate("Polearm Knight", 100, "3c242eb786d1eae1ac53ed1713794e30--sci-fi-fantasy-fantasy-world.jpg");

var unitsAvailable = [unitLongsword, unitArcher, unitPolearm];
var productionQueue = [5];
var AIproduction;

var productionEndSpot = 0;//Watch this on game reset
var isProducing = 0;
var isProducingSmth = false;
var AIisProducingSmth = false;

        var background1 = document.createElement("img");
        background1.src = "3c242eb786d1eae1ac53ed1713794e30--sci-fi-fantasy-fantasy-world.jpg";
        background1.style.position = "absolute";
        background1.style.width = windowWidth + "px";
        background1.style.height = windowHeight + "px";
        background1.style.top = 0 + "px";
        background1.style.left = 0 + "px";
        document.body.appendChild(background1);
        //background1.click;
        //background1.addEventListener('click', function () {alert("now")});

        var unit1 = document.createElement("img");
        var unit2 = document.createElement("img");
        var unit3 = document.createElement("img");
        unit1.src = "3c242eb786d1eae1ac53ed1713794e30--sci-fi-fantasy-fantasy-world.jpg";
        unit2.src = "3c242eb786d1eae1ac53ed1713794e30--sci-fi-fantasy-fantasy-world.jpg";
        unit3.src = "3c242eb786d1eae1ac53ed1713794e30--sci-fi-fantasy-fantasy-world.jpg";

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
            btn.addEventListener('click', function () { selectProduction(1, index) });

            var namef = name + "back";
            var front = document.createElement('div');
            front.className = namef;
            front.style.background = "red";
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
    makeUpgradeElement(souce, xOffSetBtn, yOffSetBtn + 0.12, 2, index)
    makeUpgradeElement(souce, xOffSetBtn, yOffSetBtn + 0.18, 3, index)
        }

function makeUpgradeElement(imgSrc, xOffSetBtn, yOffSetBtn, type, index) {
    widthBtn = (0.09 * windowWidth);
    heightBtn = (0.04 * windowHeight);
            margin = 5;

            var UpgradeImg = document.createElement("img");
            UpgradeImg.src = imgSrc;
    UpgradeImg.style.width = widthBtn + "px";
    UpgradeImg.style.height = heightBtn + "px";
            UpgradeImg.style.position = "absolute";
    UpgradeImg.style.top = (yOffSetBtn * windowHeight) + margin / 2 + "px";
    UpgradeImg.style.left = (xOffSetBtn * windowWidth) + widthBtn + margin + "px";
            UpgradeImg.click;
            UpgradeImg.addEventListener('click', function () { selectProduction(type, index) });

            var front = document.createElement('div');
            front.style.background = "red";
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
            //note that types are:
            //1 = unit, 2 = speedUpgrade, 3 = dmgUpgrade
            if (productionEndSpot == isProducing && isProducingSmth == true) {
                alert("tell player no more queue");
                return;
            }

            isProducingSmth = true;
            switch (type)
            {
                case 1://unit
                    {
                        productionQueue[productionEndSpot] = new ProductionElement(1, unitsAvailable[index - 1].thumbnail, unitsAvailable[index - 1].productionCost);
                        productionQueue[productionEndSpot].Unit = unitsAvailable[index - 1].thumbnail;
                        addToProduction(productionEndSpot);
                        break;
                    }
                case 2://speed
                    {
                        alert("upgrade speed for unit:" + index);
                        break;
                    }
                case 3://dmg
                    {
                        alert("upgrade damage for unit:" + index);
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
            add_mem(windowWidth, false);
            AIisProducingSmth = false;
        }
    }
    if (!isProducingSmth) { return;}
    productuinBarProgress.style.width = ((0.0203 * windowWidth) / 5) * (productionQueue[isProducing].timeLeft / productionQueue[isProducing].totalTime) + "%";
            productionQueue[isProducing].timeLeft = productionQueue[isProducing].timeLeft - 1;
            if ((productionQueue[isProducing].timeLeft / productionQueue[isProducing].totalTime) == 0) {
                productuinBarProgress.style.width = "0%";
                add_mem(0, true);
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

function displayLoop() {
            if (isProducingSmth) {
                document.body.appendChild(productuinBarProgress)
            }

            for (i = 0; i <= maxUnitCount; i++) {
                if (playerCharacters[i] != null && playerCharacters[i].unitIsAlive == true) {
                    playerCharacters[i].renderUpdate();
                }
                if (AICharacters[i] != null && AICharacters[i].unitIsAlive == true) {
                    AICharacters[i].renderUpdate();
                }
            }
        }

function tick() {
            manageProduction();
            for (i = 0; i <= maxUnitCount; i++) {
                if (playerCharacters[i] != null && playerCharacters[i].unitIsAlive == true) {
                    playerCharacters[i].moveCharacter();
                }
                if (AICharacters[i] != null && AICharacters[i].unitIsAlive == true) {
                    AICharacters[i].moveCharacter();
                }
            }

            manageAITurn();
        }

function manageAITurn() {
    if (AIisProducingSmth == false) {
        AIisProducingSmth = true;
        AIproduction = new ProductionElement(1, unitsAvailable[0].thumbnail, unitsAvailable[0].productionCost);
    }
}

function add_mem(position, isPlayers) {
    //character[counter] = new Character(100, 0);

    if (isPlayers) {
        for (i = 0; i < maxUnitCount; i++) {
            if (playerCharacters[i] == null || playerCharacters[i].unitIsAlive != true) {
                playerCharacters[i] = new Character(100, position, i, true);
                break;
            }
        }
    }
    else {
        for (i = 0; i < maxUnitCount; i++) {
            if (AICharacters[i] == null || AICharacters[i].unitIsAlive != true) {
                AICharacters[i] = new Character(100, position, i, false);
                break;
            }
        }
    }


  /*let playDiv = document.getElementById('playboard');
  playDiv.appendChild(character[counter].wiz);
  let container = document.createElement('div');
  container.style.width = 113 + "px";
  let pBar = document.createElement('div');
  pBar.id="myBar"+counter;
  pBar.classList.add ("w3-blue");
  pBar.style.height = 24 + "px";
  pBar.style.width = character[counter].strength + "%";
  container.style.position = 'relative';
  container.style.left = pos + 60 + "px";
  container.style.top = 200 + "px";
  playDiv.style.zIndex = 40;
  container.appendChild(pBar);
  playDiv.appendChild(container);


  decay(counter);*/
  counter++;
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