// -------------------------------
// JOGO DE NAVE VERTICAL COM FUNDO PARALLAX, NÍVEIS, VIDAS E RECORD
// -------------------------------

// Fonte Sci-Fi
let sciFiFont;

// -------------------------------
// VARIÁVEIS GLOBAIS
// -------------------------------
let estadoJogo = "menu"; // "menu", "jogando", "sobre", "gameover"
let jogador;
let inimigos = [];
let tiros = [];
let inimigosPorFase = 5;
let score = 0;
let nivel = 1;
let record = 0;
let vidas = 3;

// -------------------------------
// VARIÁVEIS DO FUNDO PARALLAX
// -------------------------------
let estrelasCamada1 = [];
let estrelasCamada2 = [];
let estrelasCamada3 = [];
let numEstrelas1 = 50;
let numEstrelas2 = 35;
let numEstrelas3 = 20;

// -------------------------------
// VARIÁVEIS DE IMAGEM E SOM
// -------------------------------
let playerImg, enemyImg, explosaoImg;
let explosoes = [];
let tiroSound, explosaoSound, musicaFundo;

// -------------------------------
// PRELOAD
// -------------------------------
function preload() {
  sciFiFont = loadFont('fonts/sci-fi-font.ttf');
  playerImg = loadImage('assets/player.png'); 
  enemyImg = loadImage('assets/enemy.png');   
  explosaoImg = loadImage('assets/explosao.png'); 

  tiroSound = loadSound('assets/tiro.mp3');
  explosaoSound = loadSound('assets/explosao.mp3');
  musicaFundo = loadSound('assets/musica.mp3');
}

// -------------------------------
// SETUP
// -------------------------------
function setup() {
  createCanvas(1024, 780);
  jogador = new Player();
  textAlign(CENTER, CENTER);
  textFont(sciFiFont);
  setupFundo(); 

  // Carregar recorde
  let rec = localStorage.getItem('record');
  if (rec) record = parseInt(rec);

  musicaFundo.setLoop(true);
  musicaFundo.setVolume(0.3);
  musicaFundo.play();
}

// -------------------------------
// DRAW
// -------------------------------
function draw() {
  background(0);
  desenharFundo();

  switch(estadoJogo){
    case "menu": desenharMenu(); break;
    case "sobre": desenharSobre(); break;
    case "jogando": jogar(); break;
    case "gameover": desenharGameOver(); break;
  }

  // explosões
  for (let i = explosoes.length - 1; i >= 0; i--) {
    explosoes[i].mostrar();
    if (explosoes[i].acabou()) explosoes.splice(i, 1);
  }
}

// -------------------------------
// CLASSES
// -------------------------------
class Player {
  constructor() {
    this.x = width / 2;
    this.y = height - 50;
    this.largura = 50;
    this.altura = 50;
    this.vel = 7;
  }
  mostrar() {
    imageMode(CENTER);
    image(playerImg, this.x, this.y, this.largura, this.altura);
  }
  mover() {
    if (keyIsDown(LEFT_ARROW) && this.x - this.largura/2 > 0) this.x -= this.vel;
    if (keyIsDown(RIGHT_ARROW) && this.x + this.largura/2 < width) this.x += this.vel;
    if (keyIsDown(UP_ARROW) && this.y - this.altura/2 > 0) this.y -= this.vel;
    if (keyIsDown(DOWN_ARROW) && this.y + this.altura/2 < height) this.y += this.vel;
  }
}

class Enemy {
  constructor() {
    this.x = random(30, width - 30);
    this.y = random(-200, -50);
    this.largura = 40; 
    this.altura = 40;
    this.vel = 1 + nivel*0.5;
  }
  mostrar() {
    imageMode(CENTER);
    image(enemyImg, this.x, this.y, this.largura, this.altura);
  }
  mover() {
    this.y += this.vel;
    if (this.y > height + this.altura) {
      this.y = random(-200, -50);
      this.x = random(30, width - 30);
    }
  }
}

class Tiro {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vel = 10;
    this.tamanho = 8;
  }
  mostrar() {
    fill(255, 255, 0);
    noStroke();
    ellipse(this.x, this.y, this.tamanho);
  }
  mover() {
    this.y -= this.vel;
  }
}

class Explosao {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.frame = 0;
    this.totalFrames = 10;
    this.tamanho = 50;
  }
  mostrar() {
    imageMode(CENTER);
    image(explosaoImg, this.x, this.y, this.tamanho, this.tamanho);
    this.frame++;
  }
  acabou() {
    return this.frame > this.totalFrames;
  }
}

// -------------------------------
// FUNDO PARALLAX
// -------------------------------
function setupFundo() {
  for (let i = 0; i < numEstrelas1; i++) estrelasCamada1.push({x: random(width), y: random(height)});
  for (let i = 0; i < numEstrelas2; i++) estrelasCamada2.push({x: random(width), y: random(height)});
  for (let i = 0; i < numEstrelas3; i++) estrelasCamada3.push({x: random(width), y: random(height)});
}

function desenharFundo() {
  noStroke();
  fill(150); estrelasCamada3.forEach(s => { ellipse(s.x,s.y,1.5); s.y+=1; if(s.y>height)s.y=0; });
  fill(200); estrelasCamada2.forEach(s => { ellipse(s.x,s.y,2); s.y+=2; if(s.y>height)s.y=0; });
  fill(255); estrelasCamada1.forEach(s => { ellipse(s.x,s.y,3); s.y+=4; if(s.y>height)s.y=0; });
}

// -------------------------------
// DESENHO TELAS
// -------------------------------
function desenharMenu() {
  fill(0,255,255);
  textSize(60); text("SPACE GAME", width/2, height/3);
  textSize(30); fill(200);
  text("Pressione ENTER para jogar", width/2, height/2);
  text("Pressione S para Sobre", width/2, height/2 + 50);
  text("Record: " + record, width/2, height - 50);
}

function desenharSobre() {
  fill(0,255,255);
  textSize(50); text("Sobre o jogo", width/2, 80);
  textSize(25); fill(200);
  text("Feito por:\n- Isaque\n ", width/2, height/2);
  text("Pressione ESC para voltar", width/2, height - 60);
}

function desenharGameOver() {
  fill(255,0,0);
  textSize(60); text("GAME OVER", width/2, height/3);
  textSize(30); fill(200);
  text("Score: " + score, width/2, height/2);
  text("Record: " + record, width/2, height/2 + 60);
  text("Pressione ENTER para voltar ao menu", width/2, height/2 + 120);
}

// -------------------------------
// JOGO PRINCIPAL
// -------------------------------
function gerarInimigos() {
  while (inimigos.length < inimigosPorFase) inimigos.push(new Enemy());
}

function atualizarInimigos() {
  inimigos.forEach(inimigo => {
    inimigo.vel = 1 + nivel*0.5;
    inimigo.mover();
    inimigo.mostrar();
  });
}

function checarColisoes() {
  for (let i = inimigos.length - 1; i >= 0; i--) {
    let e = inimigos[i];
    // colisão player
    if(dist(jogador.x,jogador.y,e.x,e.y) < (jogador.largura/2 + e.largura/2)) {
      explosoes.push(new Explosao(jogador.x,jogador.y));
      if(explosaoSound.isLoaded()) explosaoSound.play();
      vidas--;
      if(vidas <= 0) estadoJogo = "gameover";
      inimigos.splice(i,1);
      continue;
    }

    // colisão tiros
    for(let j=tiros.length-1;j>=0;j--){
      let t = tiros[j];
      if(dist(t.x,t.y,e.x,e.y)<20){
        explosoes.push(new Explosao(e.x,e.y));
        if(explosaoSound.isLoaded()) explosaoSound.play();
        inimigos.splice(i,1);
        tiros.splice(j,1);
        score += 10;

        // aumenta dificuldade
        if(score % 50 === 0){
          nivel++;
          inimigosPorFase += 1;
        }

        // record
        if(score > record){
          record = score;
          localStorage.setItem('record', record);
        }

        break;
      }
    }
  }
}

function moverTiros() {
  for(let i=tiros.length-1;i>=0;i--){
    tiros[i].mover();
    tiros[i].mostrar();
    if(tiros[i].y < 0) tiros.splice(i,1);
  }
}

function mostrarHUD() {
  fill(0,255,255);
  textSize(25);
  text("Score: "+score,80,30);
  text("Nivel: "+nivel,width-80,30);
  text("Vidas: "+vidas,width-80,60);
  text("Record: "+record,width/2,30);
}

function jogar() {
  jogador.mover();
  jogador.mostrar();

  gerarInimigos();
  atualizarInimigos();
  checarColisoes();
  moverTiros();
  mostrarHUD();
}

// -------------------------------
// CONTROLES
// -------------------------------
function keyPressed() {
  if(estadoJogo==="menu"){
    if(keyCode===ENTER){estadoJogo="jogando"; score=0; nivel=1; inimigos=[]; tiros=[]; inimigosPorFase=5; vidas=3;}
    if(key==="s"||key==="S") estadoJogo="sobre";
  } else if(estadoJogo==="sobre"){
    if(keyCode===ESCAPE) estadoJogo="menu";
  } else if(estadoJogo==="gameover"){
    if(keyCode===ENTER) estadoJogo="menu";
  }

  if(estadoJogo==="jogando" && keyCode===32){
    tiros.push(new Tiro(jogador.x, jogador.y - jogador.altura/2));
    if(tiroSound.isLoaded()) tiroSound.play();
  }
}
