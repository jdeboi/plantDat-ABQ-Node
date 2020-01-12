// git push -f heroku working:master
// issue created with npm audit fix
// maybe just merge these together
let ip = "129.81.187.108";
let port = 8888;
let ws;
var x = 0, y = 0, sendx, sendy;
let canvas;
let shovelImg;
let arrow;
let div;
let plantName = "";
let shovelC = 0;

function preload() {
  shovelImg = loadImage("../../images/shovel.svg");
  arrow = loadImage("../../images/arrow.png");
  div = select("#digdiv");
  plantName = select("#namediv").html();
}

function setup() {
  canvas = createCanvas(div.width-2, div.height-2); //, WEBGL);
  canvas.parent("digdiv");

  shovelC = floor(random(100));
  x = width/2;
  y = height/2;
  sendx = 50;
  sendy = 50;
  if (!"WebSocket" in window) {
    // The browser doesn't support WebSocket
    alert("So sorry! Websocket is supported by your Browser!");
  }
  else {
    // get this number in preferences > network > advanced > TCIP > ipv4 address
    // also in ifconfig en0 inet
    // NOT from google "what is my ip address" (184.189.154.10)
    // NOT from other website that claims "here's your external ip"
    createWebsocket();
  }
}

function draw() {
  background(255);

  push();
  imageMode(CENTER);
  translate(width/2, height/2);
  image(arrow, 0, 0, width/2, width/2);
  pop();

  fill(0);
  stroke(0);

  imageMode(CORNER);
  // ellipse(x, y, 30, 30);

  push();

  // translate(x-shovelImg.width*1.8, -shovelImg.height*.2, y-shovelImg.height*.7)

  let factor = map(y, 0, height, .1, .6);
  let shovelW = shovelImg.width*factor;
  let shovelH = shovelImg.height*factor;
  translate((x-shovelW*.54), y-shovelH*.9)
  // rotate(radians(-35));

  fill(getShovelC());

  beginShape();
  vertex(shovelW*.40, shovelH*.2);
  vertex(shovelW*.58, shovelH*.2);
  vertex(shovelW*.58, shovelH*.6);
  vertex(shovelW*.40, shovelH*.6);
  endShape();
  image(shovelImg, 0, 0, shovelW, shovelH);
  // texture(shovelImg);
  // stroke(0);
  // plane(shovelImg.width, shovelImg.height);
  pop();
  // text(mouseX + " " + floor(mouseY), mouseX, mouseY);

}

function getShovelC() {
  colorMode(HSB, 100);
  // let colors = [color(255, 0, 0), color(255, 255, 0), color(0, 0, 255), color(0, 255, 255), color(255, 0, 255)];
  let c = color(shovelC, 100, 100);
  colorMode(RGB, 255);
  return c; //colors[shovelC%colors.length];
}

function touchStarted() {
  if (inBounds()) {
    setXY();
    sendXY();
    return false;
  }

}

function touchMoved() {
  if (inBounds()) {
    //if (frameCount % 2 == 0) {
      setXY();
      sendXY();
    //}
    return false;
  }

}

function inBounds() {
  return mouseX < width && mouseX > 0 && mouseY < height && mouseY > 0;
}

function touchEnded() {
  if (inBounds()) {
    setXY();
    sendXY();
    return false;
  }

}

function sendXY() {
  if (inBounds()) {
    let s = "T" + shovelC + "X" + sendx + "Y" + sendy;
    if (ws.readyState === WebSocket.OPEN) ws.send(s);
  }
}

function setXY() {
  x = mouseX;
  x = constrain(x, 0, width);
  y = mouseY;
  y = constrain(y, 0, height);
  sendx = map(mouseX, 0, width, 0, 100);
  sendx = floor(constrain(sendx, 0, 100));
  sendy = map(mouseY, 0, height, 0, 100);
  sendy = floor(constrain(sendy, 0, 100));
}

function spawn() {

  let url="../spawn";
  let postData = {
    'short_name': plantName,
    'x': sendx,
    'y': sendy
  };
  httpPost(url, postData,()=> { console.log("spawned"); window.location.href = "/api/plants"   }, ()=> { console.log("spawn failed")});

}

function createWebsocket() {

  ws = new WebSocket("ws://" + ip +":" + port + "/"); //172.17.15.216:8025/");

  ws.onopen = function() {
    // Web Socket is connected, send data using send()
    let s = "Opening Connection";
    ws.send(s);
    s = "T" + shovelC + "X" + sendx + "Y" + sendy;
    ws.send(s);
    // alert("Message is sent...");
  };
  ws.onmessage = function (evt) {
    var received_msg = evt.data;
    // alert("Message is received...");
  };
  ws.onclose = function() {
    // websocket is closed.
    // alert("Connection is closed...");
    setTimeout(function(){createWebsocket()}, 5000);
  };
}
