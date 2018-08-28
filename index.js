var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");

var imgWidth;
var imgHeight;

var imgMatrixOriginal;


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
  //console.log(imgMatrixOriginal);
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

  var newImgData = parseToImageData(newMatrix, imgWidth, imgHeight);

  ctx.putImageData(newImgData, 0, 0);
}

function setLogFilter(){
  var newMatrix = applyLogFilterMatrix(imgMatrixOriginal, imgWidth, imgHeight, 30);

  var newImgData = parseToImageData(newMatrix, imgWidth, imgHeight);

  //console.log(newImgData);

  ctx.putImageData(newImgData, 0, 0);
}

function setPowerFilter(){
  var newMatrix = applyPowerFilterMatrix(imgMatrixOriginal, imgWidth, imgHeight, 30, 0.4);

  var newImgData = parseToImageData(newMatrix, imgWidth, imgHeight);

  ctx.putImageData(newImgData, 0, 0);
}

function setBitPlaneFilter() {
  var newMatrix = applyBitPlaneMatrix(imgMatrixOriginal, imgWidth, imgHeight, 3);

  var newImgData = parseToImageData(newMatrix, imgWidth, imgHeight);

  ctx.putImageData(newImgData, 0, 0);
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