

let pos = Math.floor(Math.random()*200);
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
  let playDiv = document.getElementById('playboard');
  let wiz = document.createElement('img');
  wiz.src = "arrow.gif";
  wiz.style.zIndex = 40;
  wiz.style.top = 200 + "px";
  playDiv.appendChild(wiz);
  let container = document.createElement('div');
  container.style.width = 113 + "px";
  let pBar = document.createElement('div');
  pBar.id="myBar";
  pBar.classList.add ("w3-blue");
  pBar.style.height = 24 + "px";
  pBar.style.width = 100 + "%";
  container.style.position = 'absolute';
  container.style.left = pos + "px";
  container.style.top = 200 + "px";
  playDiv.style.zIndex = 40;
  container.appendChild(pBar);
  playDiv.appendChild(container);
  window.setInterval(()=>{wiz.style.left = pos + "px";
  container.style.left = pos+60 + "px";
  pos = Math.floor(Math.random()*200);}, 500);

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
//window.requestAnimationFrame(tryChange);
