// Parent JavaScript file for use with spotify cover generator site
/////////// Elements & Variables ///////////
const c = document.getElementById("canvas");
const ctx = c.getContext("2d");
const bgc = document.getElementById("bgcanvas");
const bgctx = bgc.getContext("2d");

let backgroundImage = new Image();
backgroundImage.src = "./resources/fractal.jpeg";

const select = document.getElementById("select");
const input = document.getElementById("input");
let text = input.value;

const slider = document.getElementById("fontSize");
let size = slider.value;
const output = document.getElementById("value");
output.innerHTML = slider.value; // Display the default slider value

const leftAlign = document.getElementById("left");
const centerAlign = document.getElementById("center");
const rightAlign = document.getElementById("right");
const alignChoice = document.getElementsByName("align");
const vertical = document.getElementById("vertical");

const download = document.getElementById("download");
const upload = document.getElementById("upload");

//variables & constants
let alignment = "center";
const leftVal = 10;
const rightVal = 290;
let alignVal = c.width / 2;
let verticalVal = c.height / 2;
let lineHeight = Math.ceil(size.value * 1.2);
const maxWidth = 280;

const fonts = [
  "Kanit",
  "Lato",
  "Martel",
  "Montserrat",
  "Open Sans",
  "Permanent Marker",
  "Playfair Display",
  "Roboto",
  "Volkhov",
  "Yeseva One"
];

//Initialize select dropdown with fonts
for (let i = 0; i < fonts.length; i++) {
  let opt = document.createElement("option");
  opt.value = opt.innerHTML = fonts[i];
  opt.style.fontFamily = fonts[i];
  select.add(opt);
}

//////////////////Events//////////////////
select.addEventListener("change", updateText);
input.addEventListener("keyup", updateText);
leftAlign.addEventListener("change", () => {
  alignVal = leftVal;
  updateText();
});
centerAlign.addEventListener("change", () => {
  alignVal = c.width / 2;
  updateText();
});
rightAlign.addEventListener("change", () => {
  alignVal = rightVal;
  updateText();
});
download.addEventListener("click", downloadImg);
upload.addEventListener("click", uploadImg);

//////////////////Default canvas//////////////////
backgroundImage.onload = () => {
  bgctx.drawImage(backgroundImage, 0, 0);
}
bgctx.fillRect(0, 0, c.width, c.height);
ctx.font = "30px Arial";
ctx.textAlign = "center";
ctx.fillStyle = "white";
ctx.fillText(text, c.width / 2, c.height / 2);

//////////////////Methods//////////////////

//grabs alignment value from radio buttons
function checkAlignment() {
  for (item in alignChoice) {
    if (alignChoice[item].checked) {
      alignment = alignChoice[item].value;
    }
  }
}

function clearCanvas () {
    ctx.clearRect(0, 0, 300, 300);
    ctx.restore();
}

function updateText() {
  //store current values
  let selection = document.getElementById("select").value;
  let saveText = document.getElementById("input").value;
  let fontSize = document.getElementById("fontSize").value;
  
  checkAlignment();

  //clear canvas & set background to white
  clearCanvas();
  
  //Restore font color
  ctx.fillStyle = "black";
  ctx.font = `${fontSize}px ${selection}`;
  ctx.textAlign = `${alignment}`;

  //wrap text if needed
  let words = saveText.split(" ");
  let line = "";
  let y = verticalVal;
  lineHeight = Math.ceil(fontSize * 1.2);

  for (let n = 0; n < words.length; n++) {
    let testLine = line + words[n] + " ";
    let metrics = ctx.measureText(testLine);
    let testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line, alignVal, y);
      line = words[n] + " ";
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, alignVal, y);
  //update canvas
  // ctx.fillText(saveText, alignVal, c.height/2);
  ctx.save();
}

//change font size
slider.oninput = function () {
  output.innerHTML = this.value;
  updateText();
};

vertical.oninput = function () {
  verticalVal = 300 - this.value;
  updateText();
}

function downloadImg() {
  // IE/Edge Support (PNG only)
  if (window.navigator.msSaveBlob) {
    window.navigator.msSaveBlob(c.msToBlob(), "cover-image.png");
  } else {
    const a = document.createElement("a");
    document.body.appendChild(a);
    a.download = "cover-image.jpg";
    a.href = document.getElementById("canvas").toDataURL("image/jpeg").replace("image/jpeg", "image/octet-stream");
    a.click();
    document.body.removeChild(a);
  }

  const dataURI = document.getElementById("canvas").toDataURL("image/jpeg");
  console.log(dataURI);
}

function uploadImg() {
  const dataURI = document.getElementById("canvas").toDataURL("image/jpeg");
  console.log(dataURI);
  //CODE HERE FOR SPOTIFY UPLOAD
}

//Text wrap found here: https://www.html5canvastutorials.com/tutorials/html5-canvas-wrap-text-tutorial/#:~:text=To%20wrap%20text%20with%20HTML5,the%20next%20line%20should%20wrap.
