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
  
  //Pega o css em arquivo do elemento
  var imgStyle = getComputedStyle(img); 

  imgWidth = imgStyle.width.slice(0, -2);
  imgHeight = imgStyle.height.slice(0, -2);

  //Seta a largura e altura do canvas para serem iguais a da imagem exibida
  c.width = imgWidth;
  c.height = imgHeight;

  //Desenha a imagem no canvas
  ctx.drawImage(img, 0, 0, imgWidth, imgHeight);
  

  //Estraindo a informação dos pixels da imagem q ja esta no canvas
  //Nao necessariamente precisa ser uma imagem, a funcao pega os pixels do q ta no canvas
  var imgData = ctx.getImageData(0, 0, imgWidth, imgHeight);
  //console.log(imgData);

  imgMatrixOriginal = parseToImageMatrix(imgData, imgWidth, imgHeight);
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
  imgMatrix = [];
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

//Aplica o filtro de negativo a matriz recebida
function applyNegativeFilterMatrix(imgMatrixOriginal, imgWidth, imgHeight){

  //Copia o valor da matriz para nao modificar a original
  var imgMatrix = JSON.parse(JSON.stringify(imgMatrixOriginal));

  for(var linha = 0; linha < imgHeight; linha++)
  {
    for(var coluna = 0; coluna < imgWidth; coluna++)
    {
      var currentPixel = imgMatrix[linha][coluna];

      currentPixel.r = 255 - currentPixel.r;
      currentPixel.g = 255 - currentPixel.g;
      currentPixel.b = 255 - currentPixel.b;
      currentPixel.a = 255;
    }
  }

  return imgMatrix;
}

