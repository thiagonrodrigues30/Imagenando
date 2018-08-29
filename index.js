var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");

var imgWidth;
var imgHeight;

var imgMatrixOriginal;
var currentMatrix;

var isGrayScale = false;


// Carrega a imagem pela primeira vez
function loadImage(input){

  var img = document.getElementById("myImage");

  //Poe a imagem do input file no elemento img do html
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    reader.onload = function (e) {
      img.src = e.target.result;
    };

    reader.onloadend = function (e) {
      loadCanvas(img);
    }

    reader.readAsDataURL(input.files[0]);
  }

}

function loadCanvas(img){

  setImageDimension(img);

  //Desenha a imagem no canvas
  ctx.drawImage(img, 0, 0, imgWidth, imgHeight);
  
  //Estraindo a informação dos pixels da imagem q ja esta no canvas
  //Nao necessariamente precisa ser uma imagem, a funcao pega os pixels do q ta no canvas
  var imgData = ctx.getImageData(0, 0, imgWidth, imgHeight);
  //console.log(imgData);

  imgMatrixOriginal = parseToImageMatrix(imgData, imgWidth, imgHeight);
  currentMatrix = imgMatrixOriginal;
  //console.log(imgMatrixOriginal);
  setHistogram();
}


//transforma o array de pixels do canvas numa matriz, acoplando os valores de cada pixel por elemento da matriz
function parseToImageMatrix(imgData, imgWidth, imgHeight){

  var pixelArray = [];
  
  //Extrai as informacoes dos pixels dentro de um array
  var i
  for(i = 0; i < imgData.data.length; i+=4)
  {
    var pixelTemp = new Pixel(imgData.data[i], imgData.data[i + 1], imgData.data[i + 2], imgData.data[i + 3]);

    pixelArray.push(pixelTemp);
  }

  //Poe os pixels do array dentro de uma matriz equivalente a imagem
  var imgMatrix = [];
  i = 0;
  for(var linha = 0; linha < imgHeight; linha++)
  {
    var lineTemp = [];
    for(var coluna = 0; coluna < imgWidth; coluna++)
    {
      lineTemp.push(pixelArray[i]);
      i++;
    }

    //Insere a linha de pixels na matriz
    imgMatrix.push(lineTemp);
  }

  return imgMatrix;
}

//Coloca os bits no array de volta para exibir a imagem tratada
function parseToImageData(imgMatrix, imgWidth, imgHeight){
  var imgData = ctx.createImageData(imgWidth, imgHeight);

  var i = 0;
  for(var linha = 0; linha < imgHeight; linha++)
  {
    for(var coluna = 0; coluna < imgWidth; coluna++)
    {
      var currentPixel = imgMatrix[linha][coluna];
      imgData.data[i] = currentPixel.r;
      imgData.data[i + 1] = currentPixel.g;
      imgData.data[i + 2] = currentPixel.b;
      imgData.data[i + 3] = currentPixel.a;
      i+=4;
    }
  }

  return imgData;
}

function setNegativeFilter(){

  var newMatrix = applyNegativeFilterMatrix(imgMatrixOriginal, imgWidth, imgHeight);
  currentMatrix = newMatrix;

  var newImgData = parseToImageData(newMatrix, imgWidth, imgHeight);

  ctx.putImageData(newImgData, 0, 0);
  setHistogram();
}

function setLogFilter(){
  var newMatrix = applyLogFilterMatrix(imgMatrixOriginal, imgWidth, imgHeight, 30);
  currentMatrix = newMatrix;

  var newImgData = parseToImageData(newMatrix, imgWidth, imgHeight);

  //console.log(newImgData);

  ctx.putImageData(newImgData, 0, 0);
  setHistogram();
}

function setPowerFilter(){
  var newMatrix = applyPowerFilterMatrix(imgMatrixOriginal, imgWidth, imgHeight, 30, 0.4);
  currentMatrix = newMatrix;

  var newImgData = parseToImageData(newMatrix, imgWidth, imgHeight);

  ctx.putImageData(newImgData, 0, 0);
  setHistogram();
}

function setBitPlaneFilter() {
  var newMatrix = applyBitPlaneMatrix(imgMatrixOriginal, imgWidth, imgHeight, 3);
  currentMatrix = newMatrix;

  var newImgData = parseToImageData(newMatrix, imgWidth, imgHeight);

  ctx.putImageData(newImgData, 0, 0);
  setHistogram();
}

//Aplica o filtro de negativo a matriz recebida
function applyNegativeFilterMatrix(imgMatrixOriginal, imgWidth, imgHeight){

  //Copia o valor da matriz para nao modificar a original
  var imgMatrix = JSON.parse(JSON.stringify(imgMatrixOriginal));
  //console.log(imgMatrix);

  for(var linha = 0; linha < imgHeight; linha++)
  {
    for(var coluna = 0; coluna < imgWidth; coluna++)
    {
      var currentPixel = imgMatrix[linha][coluna];
      //console.log("loop-> linha: " + linha + " , coluna: " + coluna);
      currentPixel.r = 255 - currentPixel.r;
      currentPixel.g = 255 - currentPixel.g;
      currentPixel.b = 255 - currentPixel.b;
      currentPixel.a = 255;
    }
  }

  return imgMatrix;
}

//Aplica o filtro logarítmico a matriz recebida
function applyLogFilterMatrix(imgMatrixOriginal, imgWidth, imgHeight, c){

  //Copia o valor da matriz para nao modificar a original
  var imgMatrix = JSON.parse(JSON.stringify(imgMatrixOriginal));

  for(var linha = 0; linha < imgHeight; linha++)
  {
    for(var coluna = 0; coluna < imgWidth; coluna++)
    {
      var currentPixel = imgMatrix[linha][coluna];

      currentPixel.r = c * Math.log(1 + currentPixel.r);
      currentPixel.g = c * Math.log(1 + currentPixel.g);
      currentPixel.b = c * Math.log(1 + currentPixel.b);
      currentPixel.a = 255;
    }
  }

  return imgMatrix;
}

//Aplica o filtro de potência a matriz recebida
function applyPowerFilterMatrix(imgMatrixOriginal, imgWidth, imgHeight, c, g){

  //Copia o valor da matriz para nao modificar a original
  var imgMatrix = JSON.parse(JSON.stringify(imgMatrixOriginal));

  for(var linha = 0; linha < imgHeight; linha++)
  {
    for(var coluna = 0; coluna < imgWidth; coluna++)
    {
      var currentPixel = imgMatrix[linha][coluna];

      currentPixel.r = c * Math.pow(currentPixel.r, g);
      currentPixel.g = c * Math.pow(currentPixel.g, g);
      currentPixel.b = c * Math.pow(currentPixel.b, g);
      currentPixel.a = 255;
    }
  }

  return imgMatrix;
}

function applyBitPlaneMatrix(imgMatrixOriginal, imgWidth, imgHeight, bit) {

  //Copia o valor da matriz para nao modificar a original
  var imgMatrix = JSON.parse(JSON.stringify(imgMatrixOriginal));

  for(var linha = 0; linha < imgHeight; linha++)
  {
    for(var coluna = 0; coluna < imgWidth; coluna++)
    {
      var currentPixel = imgMatrix[linha][coluna];

      currentPixel.r = transformPixelByBit(currentPixel.r, bit);
      currentPixel.g = transformPixelByBit(currentPixel.g, bit);
      currentPixel.b = transformPixelByBit(currentPixel.b, bit);
      currentPixel.a = 255;
    }
  }

  return imgMatrix;
}

function transformPixelByBit(pixel, bit) {
  var arrayBits = pixel.toString(2).split('');
  arrayBits[bit] = 1 - arrayBits[bit-1];
  var decimal = parseInt(arrayBits.join(''), 2);
  return decimal;
}

window.onload = function () {
  setContainersHeight();
}

function setContainersHeight() {
  var optionsHeight = window.innerHeight - 40;
  document.getElementById("options-container").style.height = optionsHeight + "px";
  document.getElementById("image-container").style.height = optionsHeight + "px";
}

function setImageDimension(img) {
  //Ver qual lado da imagem é maior (altura ou largura) e exibe a imagem com base na maior dimensão
  // isso vai fazer que o outro lado se adapte mantendo a proporção da imagem
  // se ainda assim a imagem não ficar dentro do limite então a dimensão se baseia na menor dimensão
  // caso o tamanho original da imagem não ultrapasse o maximo permitido pelo programa entao ela deve ser
  // exibida no tamanho original

  var imgOffset = 20;
  var imageContainer = document.getElementById("image-container");
  var containerStyle = getComputedStyle(imageContainer); 

  var widthForUse = containerStyle.width.slice(0, -2) - (2 * imgOffset);
  var heightForUse = containerStyle.height.slice(0, -2) - (2 * imgOffset);

  //Verifica se a imagem cabe no container no tamanho original
  if((img.naturalWidth <= widthForUse) && (img.naturalHeight <= heightForUse))
  {
    img.style.width = img.naturalWidth + "px";
    img.style.height = img.naturalHeight + "px";
  }
  //  Se nao couber o tamanho deve ser tratado
  else
  {
    var imgStyle = getComputedStyle(img); 

    // Verifica se a imagem esta em landscape (deitada)
    if(img.naturalWidth > img.naturalHeight)
    {
      img.style.height = "";
      img.style.width = widthForUse + "px";

      // Se a altura passar da permitida seta o tamanho com base na altura
      if(imgStyle.height.slice(0, -2) > heightForUse)
      {
        img.style.width = "";
        img.style.height = heightForUse + "px";
      }

    }
    // Verifica se a imagem esta em portrait (em pe)
    else
    {
      img.style.width = "";
      img.style.height = heightForUse + "px";

      // Se a largura passar da permitida seta o tamanho com base na largura
      if(imgStyle.width.slice(0, -2) > widthForUse)
      {
        img.style.height = "";
        img.style.width = widthForUse + "px";
      }

    }

  }
  
  //Pega o css em arquivo do elemento
  var imgStyle = getComputedStyle(img); 

  // Pega a string retornada, transforma em numero e arredonda
  imgWidth = Number(imgStyle.width.slice(0, -2)).toFixed(); 
  imgHeight = Number(imgStyle.height.slice(0, -2)).toFixed();

  //Seta a largura e altura do canvas para serem iguais a da imagem exibida
  c.width = imgWidth;
  c.height = imgHeight;
}

function setHistogram() {
  var histogram = document.getElementById('histograma');
  var histCtx = histogram.getContext("2d");

  var histogramWidth = getComputedStyle(histogram).width.slice(0, -2);
  var histogramHeight = getComputedStyle(histogram).height.slice(0, -2);
  
  histogram.width = histogramWidth;
  histogram.height = histogramHeight;

  histTemp = countPixels();
  var histR = histTemp[0];
  var histG = histTemp[1];
  var histB = histTemp[2];

  // Pega valor do select para saber o tipo de histograma
  // all, red, green, blue
  var op = document.getElementById("histograma-op").value;

  if(op == "all")
  {
    if(isGrayScale)
    {
      var components = [
        {
          color : "black",
          hist: histR,
          alpha: 1
        }
      ];
    }
    else
    {
      var components = [
        {
          color : "red",
          hist: histR,
          alpha: 0.7
        },
        {
          color : "green",
          hist: histG,
          alpha: 0.7
        },
        {
          color : "blue",
          hist: histB,
          alpha: 0.7
        }
      ];
    }
  }
  else if(op == "red")
  {
    var components = [
      {
        color : "red",
        hist: histR,
        alpha: 1
      }
    ]; 
  }
  else if(op == "green")
  {
    var components = [
      {
        color : "green",
        hist: histG,
        alpha: 1
      }
    ]; 
  }
  else if(op == "blue")
  {
    var components = [
      {
        color : "blue",
        hist: histB,
        alpha: 1
      }
    ]; 
  }

  // Faz um array unico com todas as intensidades para poder calcular o valor maximo
  var componentsConcat = [];
  components.forEach(function (item, index) {
    componentsConcat = componentsConcat.concat(item.hist);
  });

  

  // Limpa o histograma antes de desenhar
  histCtx.clearRect(0, 0, histogramWidth, histogramHeight);

  var totalPixels = imgHeight * imgWidth;

  // Calcula altura Y do histograma
  var zoomY = 12;
  var histogramY = totalPixels / zoomY;

  var maxValue = Math.max(...componentsConcat);
  
  // Controla a altura do histograma para a cor de maior ocorrencia sempre caber nele
  if(maxValue > histogramY)
  {
    while((histogramY < maxValue) && (zoomY >= 2))
    {
      zoomY--;
      histogramY = totalPixels / zoomY;
    }
  }

  // Percorre as componentes de cor selecionadas plotando o histograma
  components.forEach(function (item, index) {
    histCtx.beginPath();
    histCtx.strokeStyle = item.color;
    histCtx.globalAlpha = item.alpha;
    var hist = item.hist;

    for(var i = 0; i <= 255; i++)
    {
      var y = (histogramHeight * hist[i]) / histogramY; // Regra de 3 para encontrar o Y para a dada altura do histograma
      y = histogramHeight - y.toFixed(); // Pq o y do canvas é de cima para baixo

      histCtx.moveTo(i , histogramHeight);
      histCtx.lineTo(i , y);
    }

    histCtx.stroke();

  });

}

function countPixels() {
  var histR = new Array(256);
  var histG = new Array(256);
  var histB = new Array(256);

  histR.fill(0);
  histG.fill(0);
  histB.fill(0);

  isGrayScale = true;

  for(var linha = 0; linha < imgHeight; linha++)
  {
    for(var coluna = 0; coluna < imgWidth; coluna++)
    {
      var currentPixel = currentMatrix[linha][coluna];

      histR[Math.min(currentPixel.r.toFixed(), 255)]++;
      histG[Math.min(currentPixel.g.toFixed(), 255)]++;
      histB[Math.min(currentPixel.b.toFixed(), 255)]++;

      //Verifica se a imagem esta em escala de cinza
      if(currentPixel.r != currentPixel.g || currentPixel.r != currentPixel.b)
      {
        isGrayScale = false;
      }
    }
  }

  return [histR, histG, histB];
}