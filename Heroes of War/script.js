
let counter = 0;
let pos = Math.floor(Math.random()*200);
class Character{
  constructor(strength){
    this.strength = strength;
    this.name="knight";
    this.productionCost = 1000;
    this.thumbnail = "";
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