
let counter = 0;
let pos = Math.floor(Math.random()*200);
class Character{
  constructor(name, productionCost, thumbnail, strength){
    this.strength = strength;
    this.name=name;
    this.productionCost = productionCost;
    this.thumbnail = thumbnail;
  }
}
/*function progressBar(pos){
  let playDiv = document.getElementById('playboard');
  let container = document.createElement('div');
  container.style.width = 80 + "px";
  let pBar = document.createElement('div');
  pBar.id="myBar";
  pBar.classList.add ("w3-blue");
  pBar.style.height = 24 + "px";
  pBar.style.width = 100 + "%";
  container.style.position = 'relative';
  container.style.left = pos + "px";
  container.style.top = 150 + "px";
  playDiv.style.zIndex = 80;
  container.appendChild(pBar);
  playDiv.appendChild(container);
}*/

const windowWidth = 850;
        const windowHeight = 500;

        function ProductionElement(type, thumbnail, totalTime) {
            this.type = type
            this.thumbnail = thumbnail;
            this.Character = null;
            this.timeLeft = totalTime;
            this.totalTime = totalTime;
        }
        //alert("Starting");

        var unitLongsword = new Character("Longsword Knight", 10, "3c242eb786d1eae1ac53ed1713794e30--sci-fi-fantasy-fantasy-world.jpg", 100);
        var unitArcher = new Character("Archer", 100, "3c242eb786d1eae1ac53ed1713794e30--sci-fi-fantasy-fantasy-world.jpg", 100);
        var unitPolearm = new Character("Polearm Knight", 100, "3c242eb786d1eae1ac53ed1713794e30--sci-fi-fantasy-fantasy-world.jpg", 100);

        var unitsAvailable = [unitLongsword, unitArcher, unitPolearm];
        var productionQueue = [5];

        var productionEndSpot = 0;//Watch this on game reset
        var isProducing = 0;
        var isProducingSmth = false;

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

        createAUnitBuildElement(unit1, "unit1", 80, 1);
        createAUnitBuildElement(unit2, "unit2", 72, 2);
        createAUnitBuildElement(unit3, "unit3", 64, 3);

        var productuinBarProgress = document.createElement('div');
        productuinBarProgress.style.background = "white";
        productuinBarProgress.style.width = 6 + "%";
        productuinBarProgress.style.height = 6 + "%";
        productuinBarProgress.style.position = "absolute";
        productuinBarProgress.style.top = 0 + "%";
        productuinBarProgress.style.left = 0 + "%";
        productuinBarProgress.style.opacity = "0.5";

        var productuinMenuBack = document.createElement('div');
        productuinMenuBack.style.background = "gray";
        productuinMenuBack.style.width = 30 + "%";
        productuinMenuBack.style.height = 6 + "%";
        productuinMenuBack.style.position = "absolute";
        productuinMenuBack.style.top = 0 + "%";
        productuinMenuBack.style.left = 0 + "%";

        var productuinMenuEdge = document.createElement('div');
        productuinMenuEdge.style.background = "black";
        productuinMenuEdge.style.width = 30.2 + "%";
        productuinMenuEdge.style.height = 6.2 + "%";
        productuinMenuEdge.style.position = "absolute";
        productuinMenuEdge.style.top = 0 + "%";
        productuinMenuEdge.style.left = 0 + "%";

        document.body.appendChild(productuinMenuEdge);
        document.body.appendChild(productuinMenuBack);

        document.body.appendChild(unit1);
        document.body.appendChild(unit2);
        document.body.appendChild(unit3);

        function createAUnitBuildElement(btn, name, xOffSetBtn, index) {
            widthBtn = 7;
            heightBtn = 7;
            margin = 0.4;
            yOffSetBtn = 1;

            btn.className = name;
            btn.style.width = widthBtn + "%";
            btn.style.height = heightBtn + "%";
            btn.style.position = "absolute";
            btn.style.top = yOffSetBtn + margin / 2 + "%";
            btn.style.left = xOffSetBtn + margin / 2 + "%";
            btn.click;
            btn.addEventListener('click', function () { selectProduction(1, index) });

            var namef = name + "back";
            var front = document.createElement('div');
            front.className = namef;
            front.style.background = "red";
            front.style.width = widthBtn + "%";
            front.style.height = heightBtn + "%";
            front.style.position = "absolute";
            front.style.top = yOffSetBtn + margin/2 + "%";
            front.style.left = xOffSetBtn + margin/2 + "%";

            var nameb = name + "back";
            var back = document.createElement('div');
            back.className = nameb;
            back.style.background = "black";
            back.style.width = widthBtn + margin + "%";
            back.style.height = heightBtn + margin + "%";
            back.style.position = "absolute";
            back.style.top = yOffSetBtn + "%";
            back.style.left = xOffSetBtn + "%";

            document.body.appendChild(back);
            document.body.appendChild(front);

            var souce = "3c242eb786d1eae1ac53ed1713794e30--sci-fi-fantasy-fantasy-world.jpg";
            makeUpgradeElement(souce, xOffSetBtn, yOffSetBtn + 7.6, 2, index)
            makeUpgradeElement(souce, xOffSetBtn, yOffSetBtn + 10.3, 3, index)
        }

        function makeUpgradeElement(imgSrc, xOffSetBtn, yOffSetBtn, type, index) {
            widthBtn = 7;
            heightBtn = 2;
            margin = 0.4;

            var UpgradeImg = document.createElement("img");
            UpgradeImg.src = imgSrc;
            UpgradeImg.style.width = widthBtn + "%";
            UpgradeImg.style.height = heightBtn + "%";
            UpgradeImg.style.position = "absolute";
            UpgradeImg.style.top = yOffSetBtn + margin / 2 + "%";
            UpgradeImg.style.left = xOffSetBtn + margin / 2 + "%";
            UpgradeImg.click;
            UpgradeImg.addEventListener('click', function () { selectProduction(type, index) });

            var front = document.createElement('div');
            front.style.background = "red";
            front.style.width = widthBtn + "%";
            front.style.height = heightBtn + "%";
            front.style.position = "absolute";
            front.style.top = yOffSetBtn + margin / 2 + "%";
            front.style.left = xOffSetBtn + margin / 2 + "%";

            var back = document.createElement('div');
            back.style.background = "black";
            back.style.width = widthBtn + margin + "%";
            back.style.height = heightBtn + margin + "%";
            back.style.position = "absolute";
            back.style.top = yOffSetBtn + "%";
            back.style.left = xOffSetBtn + "%";

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
            xQueueOffSet = getMyPositionInQueue(num) * 6;

            var productuinMenuBack = document.createElement('img');
            productuinMenuBack.src = productionQueue[num].thumbnail;
            productuinMenuBack.style.width = 6 + "%";
            productuinMenuBack.style.height = 6 + "%";
            productuinMenuBack.style.position = "absolute";
            productuinMenuBack.style.top = 0 + "%";
            productuinMenuBack.style.left = 0 + xQueueOffSet + "%";

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
            productuinBarProgress.style.width = 6 * (productionQueue[isProducing].timeLeft / productionQueue[isProducing].totalTime) + "%";
            productionQueue[isProducing].timeLeft = productionQueue[isProducing].timeLeft - 1;
            if ((productionQueue[isProducing].timeLeft / productionQueue[isProducing].totalTime) == 0) {
                productuinBarProgress.style.width = "0%";
                add_mem();
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
        }

        function tick() {
            manageProduction();
        }

        setInterval(tick, 1000);//starts game loop time is in ms
        setInterval(displayLoop, 34);//starts game loop time is in ms


function add_mem(){
  var character = [];
  character[counter] = new Character(100);
  //console.log(character[counter]);
  let playDiv = document.getElementById('playboard');
  let wiz = document.createElement('img');
  wiz.id = "wizard" + counter;
  wiz.src = "arrow.gif";
  wiz.style.zIndex = 40;
  wiz.style.top = 200 + "px";
  playDiv.appendChild(wiz);
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
  window.setInterval(()=>{wiz.style.left = pos + "px";
  container.style.left = pos+60 + "px";
  pos = Math.floor(Math.random()*200);}, 500);
  decay(counter);
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