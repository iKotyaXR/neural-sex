/** @type {HTMLCanvasElement} */
const canvas = document.getElementById('root');
/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext('2d');
const cells = 10;
const pixelWidth = canvas.width / cells;

ctx.fillStyle = '#000';
ctx.fillRect(0, 0, canvas.width, canvas.height);

let arr = createMatrix(cells);

let drawing = false;

function draw(e) {
  let x = Math.floor(e.x / pixelWidth);
  let y = Math.floor(e.y / pixelWidth);
  if (arr[y][x]) return;
  arr[y][x] = 1;
  ctx.fillStyle = '#FFF';
  ctx.fillRect(x * pixelWidth, y * pixelWidth, pixelWidth, pixelWidth);
  render();
}

canvas.onmousemove = (e) => {
  if (drawing) draw(e);
};
canvas.onmousedown = (e) => {
  drawing = true;
};

canvas.onmouseup = (e) => {
  drawing = false;
};

function createMatrix(cells) {
  let arr = [];
  for (let i = 0; i < cells; i++) {
    let sub = [];
    for (let j = 0; j < cells; j++) {
      sub.push(0);
    }
    arr.push(sub);
  }
  return arr;
}

function clear() {
  arr = createMatrix(cells);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}
let clearButton = document.getElementById('clear');
clearButton.onclick = clear;

//brain
let data = [];
let net;

const canvasInput = document.getElementById('canvasInput');
const trainButton = document.getElementById('train');
const trainXButton = document.getElementById('trainX');
const info = document.querySelector('.info');

trainButton.onclick = () => {
  data.push({
    input: arr.flat(),
    output: { [canvasInput.value]: 1 },
  });

  net.train(data, {
    log: true,
  });
  render();
  clear();
};

trainXButton.onclick = () => {
  net = new brain.NeuralNetwork();
  data.push({
    input: arr.flat(),
    output: { [canvasInput.value]: 1 },
  });

  net.train(data, {
    log: true,
    keepNetworkIntact: true,
  });
  render();
  clear();
  canvasInput.value = '';
};

function render() {
  if (!net) return;
  info.innerHTML = '';
  let res = net.run(arr.flat());
  Object.entries(res).forEach((el) => {
    let x = document.createElement('span');
    x.innerHTML = `${el[0]}: ${el[1]}`;
    info.appendChild(x);
  });

  let result = document.createElement('span');

  let val = Object.entries(res).sort((a, b) => b[1] - a[1])[0];
  console.log(val);
  result.innerHTML = `Нейросеть думает что это ${val[0]}`;
  info.appendChild(result);
}
