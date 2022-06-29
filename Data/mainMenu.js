document.getElementById('mnuStartSing').addEventListener("mouseover", function (event) { event.target.style.opacity = "100%" });
document.getElementById('mnuStartSing').addEventListener("mouseleave", function (event) { event.target.style.opacity = "60%" });
document.getElementById('mnuStartSkir').addEventListener("mouseover", function (event) { event.target.style.opacity = "100%" });
document.getElementById('mnuStartSkir').addEventListener("mouseleave", function (event) { event.target.style.opacity = "60%" });
document.getElementById('instructions').addEventListener("mouseover", function (event) { event.target.style.opacity = "100%" });
document.getElementById('instructions').addEventListener("mouseleave", function (event) { event.target.style.opacity = "60%" });

function splashScreen() {
    let opct = 0;
    let startLoad = false;
    let splashBackground = document.createElement('img');
    splashBackground.src = 'Data/Sprites/logo.png';
    splashBackground.style.left = 90 + 'px';
    splashBackground.style.top = 50 + 'px';
    document.body.appendChild(splashBackground);
    splashBackground.style.zIndex = 5;
    splashBackground.style.opacity = 0 + '%';
    if(!isInDev){
        let splash = setInterval(() => { splashBackground.style.opacity = opct + '%'; opct += 5; if (opct == 100) { startLoad = true; clearInterval(splash); } }, 100);
        setTimeout(() => { document.body.removeChild(splashBackground); loadAnim() }, 3000)
    }
    else{
        setTimeout(() => { document.body.removeChild(splashBackground); loadAnim() }, 0)
    }
}

function loadAnim() {
    let gameTitle = document.createElement('img');
    document.body.appendChild(gameTitle);
    gameTitle.setAttribute('id', 'gameTitle');
    gameTitle.src = 'Data/Sprites/heroesofwar_logo.png';
    gameTitle.style.width = 500 + "px";
    gameTitle.style.height = 150 + 'px';
    gameTitle.style.zIndex = 3;
    gameTitle.style.left = 190 + 'px';
    gameTitle.style.top = 0 + 'px';
    document.getElementById('mnuStartSing').style.visibility = 'visible';
    document.getElementById('mnuStartSkir').style.visibility = 'visible';
    document.getElementById('instructions').style.visibility = 'visible';
    document.getElementById('instructions').addEventListener('click', instructions);
    let pos = 0;
    menuAnim = setInterval(() => {
        gameTitle.style.top = pos + 'px';
        if (pos < 48)
            pos++;
        else {
            clearInterval(menuAnim);
        }
    }, 30);
    document.addEventListener('contextmenu', (event => event.preventDefault()));
}

function leaveMainMenu(){
    clearInterval(menuAnim);
    document.getElementById("bm");
    bm.loop = true;
    bm.play();
    document.getElementById('menuDiv').style.visibility = 'hidden';
    document.getElementById('mnuStartSing').style.visibility = 'hidden';
    document.getElementById('mnuStartSkir').style.visibility = 'hidden';
    document.getElementById('gameTitle').style.visibility = 'hidden';
    document.getElementById('background').style.visibility = 'hidden';
    document.getElementById('foreground').style.visibility = 'hidden';
    document.getElementById('instructions').style.visibility = 'hidden';
}
