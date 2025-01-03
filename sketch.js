let fi=0;
let Igrac;
let okretanje=0;
let smerX=0,smerY=0;
let brzina;

const mat=[
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 1, 1, 2, 0, 0, 0, 0, 1],
    [1, 0, 0, 3, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
    [1, 0, 4, 0, 3, 0, 0, 0, 0, 0, 1],
    [1, 0, 4, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 5, 1, 5, 0, 0, 0, 4, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1] ];

let matDim=11;
let c;
let manjeOdPi=0;
let xEkrana,yEkrana;
let mestoUdarca;
let gustinaProjekcije=1;
let poljeVida;
let vIliH=0;
let i=0;
let trenutniFR=0;
let brojac=0;
let boost=1;

let joystick
let joystickVelicina=10;
let joystickTop
let telefon = false;
let joystick_poceo=false;

let boje=["#5F5F5F","rgb(50, 168, 82)","rgb(50, 140, 168)","rgb(109, 50, 168)","rgb(168, 50, 50)"];

function setup() {
	let h = min(windowWidth / 2, windowHeight);
  let w = h * 2;
  createCanvas(w, h);

  c=floor(height/matDim);
  textAlign(LEFT,TOP);
  textSize(c/2)
  xEkrana=yEkrana=c*matDim;
  Igrac=createVector(xEkrana/2+c/2,yEkrana/2+c/2);
  mestoUdarca=createVector(0,0,0);
  brzina=xEkrana/200;
  
  joystickVelicina=height/joystickVelicina;
  joystick= createVector(joystickVelicina+joystickVelicina/2,height-joystickVelicina-joystickVelicina/2);
  joystickTop = createVector(0,0)

  telefon=/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  telefon=true;

  fi=PI;
  poljeVida=75 * PI/180 
}

function keyPressed(){
  if (keyCode === 87) { smerY = 1; }
  else if (keyCode === 83) smerY = -1;
  if (keyCode === 68) { smerX = 1 }
  else if (keyCode === 65) smerX = -1;
  if (keyCode === 16) boost=2
  
}

function keyReleased() {                                      
  if (keyCode === 87 || keyCode === 83) smerY = 0; 
  if (keyCode === 68 || keyCode === 65) smerX = 0;
  if (keyCode === 16) boost=1;
}
function touchMoved(){
  if (telefon && touches.length > 0) joystickPomeren(touches[0].x, touches[0].y);
}
function touchStarted(){
  if (telefon && touches.length > 0) joystickPomeren(touches[0].x, touches[0].y);
}
function touchEnded(){
  //restartMovement()
}
function mousePressed(){
  if (!telefon) joystickPomeren(mouseX, mouseY);
}
function mouseReleased(){
  restartMovement()
}

function joystickPomeren(){
  if(dist(joystick.x,joystick.y,mouseX,mouseY)<=joystickVelicina || joystick_poceo){
    let ugao=atan2(mouseY-joystick.y,mouseX-joystick.x)
    smerX=sin(ugao+PI/2)
    smerY=cos(ugao+PI/2)
    joystickTop=p5.Vector.sub(joystick,createVector(mouseX,mouseY))
    joystick_poceo=true;
  }
  else{
    restartMovement()
  }
}
function restartMovement(){
  smerX=0
  smerY=0
  joystickTop.set(0,0)
  joystick_poceo=false;
}

function crtajJoystick(){
  fill(100,100)
  ellipse(joystick.x,joystick.y,joystickVelicina*2,joystickVelicina*2)
  fill(0,150)
  joystickTop.limit(joystickVelicina)
  ellipse(joystick.x - joystickTop.x, joystick.y - joystickTop.y, joystickVelicina/4*3, joystickVelicina/4*3);

}

function crtajMatricu(){
  stroke(255)
  for(let i=0;i<matDim;i++){
    for(let j=0;j<matDim;j++){
      if(mat[j][i]>0)fill(boje[mat[j][i]-1]);
      else fill(240);
      rect(i*c,j*c,c,c);
    }
  }
}

function crtajLevuStranu(){
  crtajMatricu();
  
  stroke(0)
  
  strokeWeight(10)
  point(Igrac.x,Igrac.y);
  strokeWeight(1)
  stroke("red")
  //line(Igrac.x,Igrac.y,Igrac.x+xEkrana*cos(fi),Igrac.y+yEkrana*sin(fi))
  stroke(0)
  
  strokeWeight(1)
  fill(0)
  stroke(255)
  rect(xEkrana,0,xEkrana,yEkrana/2);
}


function proveriDodir(x,y){
  if(x < 0 || x > xEkrana || y < 0 || y > yEkrana) return true;
  
  let i = floor(x / c);
  let j = floor(y / c);
  return mat[j][i] > 0;
}

function normalizujUgao(x){
  x %= TWO_PI;
    if (x < 0) {
      x += TWO_PI;
    }
    return x;
}

function zraci(ugaoZraka){
  ugaoZraka=normalizujUgao(ugaoZraka);
  let JugSever = (ugaoZraka> 0 && ugaoZraka<PI);
  let IstokZapad = (ugaoZraka>3*PI/2 || ugaoZraka<PI/2);
  let horizontalnoFinalno = createVector(Infinity, Infinity, Infinity);
  let vertikalnoFinalno = createVector(Infinity, Infinity, Infinity);
  let x0,y0,x1,y1,x,y;
  let imaV=false,imaH=false;
  
  // Horizontalni zraci
  y = JugSever ?  floor(Igrac.y / c) * c + c : floor(Igrac.y / c) * c;
  x = Igrac.x + (y-Igrac.y)/tan(ugaoZraka)

  y1 = !JugSever ? -c : c;
  x1 = c/tan(ugaoZraka);
  
  if(!JugSever )
    x1*=-1;
  
  while(x>=0 && x<=xEkrana && y>=0 && y<=yEkrana){
    let yGoreDole = !JugSever ? y - 1 : y;
    
    if(proveriDodir(x,yGoreDole)){
      imaH=true;
      horizontalnoFinalno = createVector(x,yGoreDole);
      break;
    }
    x+=x1;y+=y1;
  }
  
  // Vertikalni zraci
  x = IstokZapad ? floor(Igrac.x/c) * c + c: floor(Igrac.x/c) * c;
  y = Igrac.y + (x - Igrac.x) * tan(ugaoZraka);
  
  x1 = !IstokZapad ? -c : c;
  y1 = -c*tan(ugaoZraka);
  
  if((!JugSever && y1>0)||(JugSever && y1<0))
    y1*=-1
  
  while(x>=0 && x<=xEkrana && y>=0 && y<=yEkrana){
    
    let xGoreDole = !IstokZapad ? x - 1 : x;
     
    if(proveriDodir(xGoreDole,y)){
      imaV=true;
      vertikalnoFinalno = createVector(xGoreDole,y);
      break;
    }
    x+=x1;y+=y1;
  }
  let hUdaljenost = imaH ? Igrac.dist(horizontalnoFinalno) : Infinity;
  let vUdaljenost = imaV ? Igrac.dist(vertikalnoFinalno) : Infinity;
  let returnV=createVector(Infinity, Infinity, Infinity);
    
  
  if(hUdaljenost<vUdaljenost){
    returnV=horizontalnoFinalno;
    returnV.z=hUdaljenost;
    vIliH=0;
  }
  else {
    returnV=vertikalnoFinalno;
    returnV.z=vUdaljenost;
    vIliH=1;
  }
  return returnV; 
}
function crtajZrake2D(x0,y0,x1,y){
  push()
    translate(-xEkrana,0)
    stroke(0,50)
    
    line(x0,y0,x1,y)
  pop()
}

function draw() {
  i++;
  let sledecaLok=createVector()
  sledecaLok.x = Igrac.x + cos(fi) * smerY * brzina * boost;
  sledecaLok.y = Igrac.y + sin(fi) * smerY * brzina * boost;
  if(!proveriDodir(sledecaLok.x,sledecaLok.y)){
    Igrac=sledecaLok;
  }
  
  fi += smerX*PI/90;
  fi = normalizujUgao(fi);
  noStroke()
  fill(240)
  crtajLevuStranu();
  
  
  rect(xEkrana,yEkrana/4*3,xEkrana,yEkrana/4*3)
  fill(0)
  rect(xEkrana,0,xEkrana,yEkrana/2);
  
  push();
    translate(xEkrana,0)
    noStroke();
    fill(240)
    rect(0,xEkrana/2,xEkrana,yEkrana/2) 
    let ugaoZraka = fi - poljeVida/2;
    for(let i=0;i<xEkrana/gustinaProjekcije;i++){
      mestoUdarca=zraci(ugaoZraka);
      crtajZrake2D(Igrac.x,Igrac.y,mestoUdarca.x,mestoUdarca.y);

      let udaljenostLinije = (xEkrana/2) / tan(poljeVida/2);

      mestoUdarca.z*=cos(ugaoZraka-fi);

      let visinaLinije=(c/mestoUdarca.z) * udaljenostLinije;
      
      let a=floor(mestoUdarca.x/c)
      let j=floor(mestoUdarca.y/c)
      fill(boje[mat[j][a]-1])
      //fill(100-vIliH*30)
      rect( i * gustinaProjekcije, (height / 2) - (visinaLinije / 2), gustinaProjekcije, visinaLinije);

      ugaoZraka += poljeVida/(xEkrana/gustinaProjekcije);
    }
    if(i%15==0){
        let fr=nf(floor(frameRate()))
        trenutniFR=fr;
      }
  fill(boje[1])
    text(trenutniFR,c/5,c/5)
  pop();

  if (telefon) {
    crtajJoystick();
  }
  
  //saveCanvas('animacija'+brojac+'.jpg');
  brojac++;
}