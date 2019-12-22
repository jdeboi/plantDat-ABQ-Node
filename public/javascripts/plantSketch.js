let canvas;

let spanwed = false;

let plantCode;
let plantObj;
let plantTypes;

let plantImg;
let shovelImg;

function preload() {
  plantCode = select("#code").html();
  plantObj = loadJSON("../../api/plant/" + plantCode);
}

function setup() {
  canvas = createCanvas(400, 400);
  canvas.parent("plantCanvas")
  // if (plantTypes != null) console.log(plantTypes);

  spawned = plantObj.plant.spawned;
  if (spawned) plantImg = loadImage("../images/" + plantObj.type.img_path);
  else shovelImg = loadImage("../images/shovel.png");


}

function draw() {
  background(255);
  if (spawned) {
    displayPlant();
  }
  else {
    displayShovel();
  }
}

function displayPlant() {
  let factor = height/plantImg.height;
  if (plantImg != null) image(plantImg, 0, 0, plantImg.width*factor, plantImg.height*factor);
}

function displayShovel() {
  let factor = height/shovelImg.height*.5;
  imageMode(CENTER);
  image(shovelImg, mouseX, mouseY, shovelImg.width*factor, shovelImg.height*factor);
}

function mousePressed() {
  if(!spawned) {
    if (shovelOnConcrete()) {
      httpPost("http://localhost:3000/api/spawnplant/" + plantCode, ()=> { window.location = location}, ()=> { console.log(" didn't worked")})
    }
  }
}

function shovelOnConcrete() {
  return mouseX >0 && mouseX < width && mouseY > 300 && mouseY < height;
}
