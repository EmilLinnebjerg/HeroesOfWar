var singlePlayerMap = document.createElement("img");
singlePlayerMap.src = backImgAssets + "SinglePlayerMap.png";
singlePlayerMap.style.position = "absolute";
singlePlayerMap.style.width = windowWidth + "px";
singlePlayerMap.style.height = windowHeight + "px";
singlePlayerMap.style.top = 0 + "px";
singlePlayerMap.style.left = 0 + "px";

function loadSinglePlayer(){
    clearInterval(menuAnim);
    document.getElementById("bm");
    bm.loop = true;
    bm.play();
    document.getElementById('menuDiv').style.visibility = 'hidden';
    document.getElementById('mnuStart').style.visibility = 'hidden';
    document.getElementById('gameTitle').style.visibility = 'hidden';
    document.getElementById('background').style.visibility = 'hidden';
    document.getElementById('foreground').style.visibility = 'hidden';
    document.getElementById('instructions').style.visibility = 'hidden';

    alert("here");

    document.body.appendChild(singlePlayerMap);
}