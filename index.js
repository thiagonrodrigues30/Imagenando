var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");

var imgWidth;
var imgHeight;

var imgMatrixOriginal;
var currentMatrix;

var isGrayScale = false;

// Contem o id do filtro dos parametros sendo exibidos
var filterPreview = "";

// Contem os ids dos filtros aplicados na imagem
var appliedFilters = [];

var paramsIcon = document.createElement("img");
paramsIcon.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAACaSURBVDhP3dFBCoJAFIDhMaUWgXSC6Dqto6vkCVy4FQxyWweodbRv3UVq5Tb/J6OIvaSZZT98CMO8GVFDATbYOlqjKcbbwxNde2ibxuzQNcEJ2kZNio8iXKAN9BX42gw3aIPiCPnoo81xx3D4jBA/tUCOg5VhCqfkxqtVyoJrL7Sv/5AF1/7ggAQVvA+QVpC/4X1A29I+BxlTAwB5WfLP2jdRAAAAAElFTkSuQmCC";


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

  // Limpa o container de parametros e tira os icones de parametros
  setParamsIcon(-1);

  // Limpa o background dos filtros anteriores
  setFilterButtonBackground(-1);
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

function reset() {
  currentMatrix = imgMatrixOriginal;
  var newImgData = parseToImageData(imgMatrixOriginal, imgWidth, imgHeight);
  ctx.putImageData(newImgData, 0, 0);
  setHistogram();

  // Limpa o container de parametros e tira os icones de parametros
  setParamsIcon(-1);

  // Limpa o background dos filtros anteriores
  setFilterButtonBackground(-1);
}

function setNegativeFilter(){

  // Limpa o container de parametros e tira os icones de parametros
  setParamsIcon(-1);

  // Limpa o background dos filtros anteriores e seta nesse
  setFilterButtonBackground("negative-item");
  
  // Calcula a nova matriz e aplica o filtro
  var newMatrix = applyNegativeFilterMatrix(imgMatrixOriginal, imgWidth, imgHeight);
  currentMatrix = newMatrix;

  var newImgData = parseToImageData(newMatrix, imgWidth, imgHeight);

  ctx.putImageData(newImgData, 0, 0);
  setHistogram();
}

function setLogFilter(){

  // Tira o background dos filtros anteriores e aplica no atual
  setFilterButtonBackground("log-item");

  // Pega o valor dos inputs
  var intensidadeLog = document.getElementById("intensidade-log").value;

  var newMatrix = applyLogFilterMatrix(imgMatrixOriginal, imgWidth, imgHeight, intensidadeLog);
  currentMatrix = newMatrix;

  var newImgData = parseToImageData(newMatrix, imgWidth, imgHeight);

  ctx.putImageData(newImgData, 0, 0);
  setHistogram();
}

function setPowerFilter(){

  // Tira o background dos filtros anteriores e aplica no atual
  setFilterButtonBackground("power-item");

  // Pega o valor dos inputs
  var intensidadePower = document.getElementById("intensidade-power").value;
  var gamaPower = document.getElementById("gama-power").value;


  var newMatrix = applyPowerFilterMatrix(imgMatrixOriginal, imgWidth, imgHeight, intensidadePower, gamaPower);
  currentMatrix = newMatrix;

  var newImgData = parseToImageData(newMatrix, imgWidth, imgHeight);

  ctx.putImageData(newImgData, 0, 0);
  setHistogram();
}

function setThresholdFilter(){

  // Seta o background dizendo q o filtro esta ativo tbm
  document.getElementById("threshold-item").classList.add("list-group-item-info");
  appliedFilters.push("threshold-item");

  // Pega o valor dos inputs
  var intensidadeThreshold = document.getElementById("intensidade-threshold").value;

  var newMatrix = applyThresholdFilterMatrix(currentMatrix, imgWidth, imgHeight, intensidadeThreshold);
  currentMatrix = newMatrix;

  var newImgData = parseToImageData(newMatrix, imgWidth, imgHeight);

  ctx.putImageData(newImgData, 0, 0);
  setHistogram();
}

function setBitPlaneFilter() {

  // Tira o background dos filtros anteriores e aplica no atual
  setFilterButtonBackground("bit-plane-item");

  // Pega o valor dos inputs
  var bitPlane = document.getElementById("bit-plane-input").value;

  var newMatrix = applyBitPlaneMatrix(imgMatrixOriginal, imgWidth, imgHeight, bitPlane);
  currentMatrix = newMatrix;

  var newImgData = parseToImageData(newMatrix, imgWidth, imgHeight);

  ctx.putImageData(newImgData, 0, 0);
  setHistogram();
}

function setLinearByPartsFilter() {

  // Tira o background dos filtros anteriores e aplica no atual
  setFilterButtonBackground("linear-parts-item");

  // Pega o valor dos inputs
  var xi = Number(document.getElementById("point1-x-linear-parts").value);
  var yi = Number(document.getElementById("point1-y-linear-parts").value);
  var xf = Number(document.getElementById("point2-x-linear-parts").value);
  var yf = Number(document.getElementById("point2-y-linear-parts").value);
  
  var newMatrix = applyLinearByPartsMatrix(imgMatrixOriginal, imgWidth, imgHeight, xi, yi, xf, yf);
  currentMatrix = newMatrix;

  var newImgData = parseToImageData(newMatrix, imgWidth, imgHeight);

  ctx.putImageData(newImgData, 0, 0);
  setHistogram();
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

function setHistogramEqualization() {

  // Limpa o container de parametros e tira os icones de parametros
  setParamsIcon(-1);

  // Seta o background dizendo q o filtro esta ativo tbm
  document.getElementById("hist-equalization-item").classList.add("list-group-item-info");
  appliedFilters.push("hist-equalization-item");

  histTemp = countPixels();
  var histR = histTemp[0];
  var histG = histTemp[1];
  var histB = histTemp[2];

  if(isGrayScale)
  {
    var equalizedArray = getEqualizedArray(histR);
    var newMatrix = applyEqualizationMatrix(currentMatrix, equalizedArray, equalizedArray, equalizedArray); 
  }
  else
  {
    var equalizedArrayR = getEqualizedArray(histR);
    var equalizedArrayG = getEqualizedArray(histG);
    var equalizedArrayB = getEqualizedArray(histB);
    var newMatrix = applyEqualizationMatrix(currentMatrix, equalizedArrayR, equalizedArrayG, equalizedArrayB);
  }

  currentMatrix = newMatrix;

  var newImgData = parseToImageData(newMatrix, imgWidth, imgHeight);
  ctx.putImageData(newImgData, 0, 0);
  setHistogram();

}

function getConvMatrix() {
  // Pega o valor dos inputs
  // Cria a matriz de convulocao por enquanto
  var convolutionMatrix = [];
  convolutionMatrix.push([Number(document.getElementById("point1-v-convolution").value), 
                          Number(document.getElementById("point1-w-convolution").value), 
                          Number(document.getElementById("point1-x-convolution").value), 
                          Number(document.getElementById("point1-y-convolution").value), 
                          Number(document.getElementById("point1-z-convolution").value)]);

  convolutionMatrix.push([Number(document.getElementById("point2-v-convolution").value), 
                          Number(document.getElementById("point2-w-convolution").value), 
                          Number(document.getElementById("point2-x-convolution").value), 
                          Number(document.getElementById("point2-y-convolution").value), 
                          Number(document.getElementById("point2-z-convolution").value)]);  

  convolutionMatrix.push([Number(document.getElementById("point3-v-convolution").value), 
                          Number(document.getElementById("point3-w-convolution").value), 
                          Number(document.getElementById("point3-x-convolution").value), 
                          Number(document.getElementById("point3-y-convolution").value), 
                          Number(document.getElementById("point3-z-convolution").value)]);  
                      
  convolutionMatrix.push([Number(document.getElementById("point4-v-convolution").value), 
                          Number(document.getElementById("point4-w-convolution").value), 
                          Number(document.getElementById("point4-x-convolution").value), 
                          Number(document.getElementById("point4-y-convolution").value), 
                          Number(document.getElementById("point4-z-convolution").value)]);  

  convolutionMatrix.push([Number(document.getElementById("point5-v-convolution").value), 
                          Number(document.getElementById("point5-w-convolution").value), 
                          Number(document.getElementById("point5-x-convolution").value), 
                          Number(document.getElementById("point5-y-convolution").value), 
                          Number(document.getElementById("point5-z-convolution").value)]); 

  return convolutionMatrix;
}

function setConvolutionFilter(){

  // Limpa o background dos filtros anteriores e seta nesse
  setFilterButtonBackground("convolution-item");
  
  // Pega o valor dos inputs
  // Cria a matriz de convulocao por enquanto
  var convolutionMatrix = getConvMatrix();

  // Cria a matriz de convulocao por enquanto
  // var convolutionMatrix = [];
  // convolutionMatrix.push([0, 0, 0, 0, 0]);
  // convolutionMatrix.push([0, 0, 1, 0, 0]);
  // convolutionMatrix.push([0, 1, -4, 1, 0]);
  // convolutionMatrix.push([0, 0, 1, 0, 0]);
  // convolutionMatrix.push([0, 0, 0, 0, 0]);

  
  // Calcula a nova matriz e aplica o filtro
  var newMatrix = applyConvolutionMatrix(imgMatrixOriginal, imgWidth, imgHeight, convolutionMatrix);
  currentMatrix = newMatrix;

  var newImgData = parseToImageData(newMatrix, imgWidth, imgHeight);

  ctx.putImageData(newImgData, 0, 0);
  setHistogram();
}

function setAverageFilter(){

  // Limpa o background dos filtros anteriores e seta nesse
  setFilterButtonBackground("average-item");

  // Cria a matriz de convulocao por enquanto
  var convolutionMatrix = getConvMatrix();

  /*
  convolutionMatrix.push([0, 0, 0, 0, 0]);
  convolutionMatrix.push([0, 0, 1, 0, 0]);
  convolutionMatrix.push([0, 1, -4, 1, 0]);
  convolutionMatrix.push([0, 0, 1, 0, 0]);
  convolutionMatrix.push([0, 0, 0, 0, 0]);
  */

  
  // Calcula a nova matriz e aplica o filtro
  var newMatrix = applyAverageMatrix(imgMatrixOriginal, imgWidth, imgHeight, convolutionMatrix);
  currentMatrix = newMatrix;

  var newImgData = parseToImageData(newMatrix, imgWidth, imgHeight);

  ctx.putImageData(newImgData, 0, 0);
  setHistogram();
}

function setWeightedAverageFilter(){

  // Limpa o background dos filtros anteriores e seta nesse
  setFilterButtonBackground("weighted-average-item");


  // Cria a matriz de convulocao por enquanto
  var convolutionMatrix = getConvMatrix();
  /*
  convolutionMatrix.push([0, 0, 0, 0, 0]);
  convolutionMatrix.push([0, 1, 2, 1, 0]);
  convolutionMatrix.push([0, 2, 4, 2, 0]);
  convolutionMatrix.push([0, 1, 2, 1, 0]);
  convolutionMatrix.push([0, 0, 0, 0, 0]);
  */

  
  // Calcula a nova matriz e aplica o filtro
  var newMatrix = applyWeightedAverageMatrix(imgMatrixOriginal, imgWidth, imgHeight, convolutionMatrix);
  currentMatrix = newMatrix;

  var newImgData = parseToImageData(newMatrix, imgWidth, imgHeight);

  ctx.putImageData(newImgData, 0, 0);
  setHistogram();
}

function setMedianFilter(){

  // Limpa o background dos filtros anteriores e seta nesse
  setFilterButtonBackground("median-item");

  var vizinhancaSize = document.getElementById("vizinhanca-median").value;

  // Calcula a nova matriz e aplica o filtro
  var newMatrix = applyMedianMatrix(imgMatrixOriginal, imgWidth, imgHeight, vizinhancaSize);
  currentMatrix = newMatrix;

  var newImgData = parseToImageData(newMatrix, imgWidth, imgHeight);

  ctx.putImageData(newImgData, 0, 0);
  setHistogram();
}

function setLaplacianFilter() {

  // Limpa o container de parametros e tira os icones de parametros
  setParamsIcon(-1);

  // Limpa o background dos filtros anteriores e seta nesse
  setFilterButtonBackground("laplacian-item");

  // Cria a matriz de convulocao por enquanto
  var convolutionMatrix = [];
  convolutionMatrix.push([0, 0, 0, 0, 0]);
  convolutionMatrix.push([0, 0, 1, 0, 0]);
  convolutionMatrix.push([0, 1, -4, 1, 0]);
  convolutionMatrix.push([0, 0, 1, 0, 0]);
  convolutionMatrix.push([0, 0, 0, 0, 0]);
  
  // Calcula a nova matriz e aplica o filtro
  var newMatrix = applyConvolutionMatrix(imgMatrixOriginal, imgWidth, imgHeight, convolutionMatrix);
  currentMatrix = newMatrix;

  var newImgData = parseToImageData(newMatrix, imgWidth, imgHeight);

  ctx.putImageData(newImgData, 0, 0);
  setHistogram();

}

function setSobelFilter() {

  // Limpa o container de parametros e tira os icones de parametros
  setParamsIcon(-1);

  // Limpa o background dos filtros anteriores e seta nesse
  setFilterButtonBackground("sobel-item");

  // Cria a matriz de convulocao por enquanto
  var convolutionMatrix = [];
  convolutionMatrix.push([0, 0, 0, 0, 0]);
  convolutionMatrix.push([0, -1, 0, 1, 0]);
  convolutionMatrix.push([0, -2, 0, 2, 0]);
  convolutionMatrix.push([0, -1, 0, 1, 0]);
  convolutionMatrix.push([0, 0, 0, 0, 0]);
  
  // Calcula a nova matriz e aplica o filtro
  var newMatrix = applyConvolutionMatrix(imgMatrixOriginal, imgWidth, imgHeight, convolutionMatrix);
  currentMatrix = newMatrix;

  var newImgData = parseToImageData(newMatrix, imgWidth, imgHeight);

  ctx.putImageData(newImgData, 0, 0);
  setHistogram();

}

function setHighBoostFilter() {

  // Limpa o container de parametros e tira os icones de parametros
  setParamsIcon(-1);

  // Limpa o background dos filtros anteriores e seta nesse
  setFilterButtonBackground("high-boost-item");

  // Cria a matriz de convulocao por enquanto
  var convolutionMatrix = [];
  convolutionMatrix.push([0, 0, 0, 0, 0]);
  convolutionMatrix.push([0, 0, -1, 0, 0]);
  convolutionMatrix.push([0, -1, 5, -1, 0]);
  convolutionMatrix.push([0, 0, -1, 0, 0]);
  convolutionMatrix.push([0, 0, 0, 0, 0]);
  
  // Calcula a nova matriz e aplica o filtro
  var newMatrix = applyConvolutionMatrix(imgMatrixOriginal, imgWidth, imgHeight, convolutionMatrix);
  currentMatrix = newMatrix;

  var newImgData = parseToImageData(newMatrix, imgWidth, imgHeight);

  ctx.putImageData(newImgData, 0, 0);
  setHistogram();

}

function setGeometricMeanFilter(){

  // Limpa o background dos filtros anteriores e seta nesse
  setFilterButtonBackground("geometric-mean-item");

  var vizinhancaSize = document.getElementById("vizinhanca-geometric-mean").value;

  // Calcula a nova matriz e aplica o filtro
  var newMatrix = applyGeometricMeanMatrix(imgMatrixOriginal, imgWidth, imgHeight, vizinhancaSize);
  currentMatrix = newMatrix;

  var newImgData = parseToImageData(newMatrix, imgWidth, imgHeight);

  ctx.putImageData(newImgData, 0, 0);
  setHistogram();
}

function setHarmonicMeanFilter(){

  // Limpa o background dos filtros anteriores e seta nesse
  setFilterButtonBackground("harmonic-mean-item");

  var vizinhancaSize = document.getElementById("vizinhanca-harmonic-mean").value;

  // Calcula a nova matriz e aplica o filtro
  var newMatrix = applyHarmonicMeanMatrix(imgMatrixOriginal, imgWidth, imgHeight, vizinhancaSize);
  currentMatrix = newMatrix;

  var newImgData = parseToImageData(newMatrix, imgWidth, imgHeight);

  ctx.putImageData(newImgData, 0, 0);
  setHistogram();
}

function setCounterHarmonicMeanFilter(){

  // Limpa o background dos filtros anteriores e seta nesse
  setFilterButtonBackground("counter-harmonic-mean-item");

  var vizinhancaSize = document.getElementById("vizinhanca-counter-harmonic-mean").value;
  var potencia = document.getElementById("potencia-counter-harmonic-mean").value;

  // Calcula a nova matriz e aplica o filtro
  var newMatrix = applyCounterHarmonicMeanMatrix(imgMatrixOriginal, imgWidth, imgHeight, vizinhancaSize, potencia);
  currentMatrix = newMatrix;

  var newImgData = parseToImageData(newMatrix, imgWidth, imgHeight);

  ctx.putImageData(newImgData, 0, 0);
  setHistogram();
}

function setMaximumFilter(){

  // Limpa o background dos filtros anteriores e seta nesse
  setFilterButtonBackground("maximum-item");

  var vizinhancaSize = document.getElementById("vizinhanca-maximum").value;

  // Calcula a nova matriz e aplica o filtro
  var newMatrix = applyMaximumMatrix(imgMatrixOriginal, imgWidth, imgHeight, vizinhancaSize);
  currentMatrix = newMatrix;

  var newImgData = parseToImageData(newMatrix, imgWidth, imgHeight);

  ctx.putImageData(newImgData, 0, 0);
  setHistogram();
}

function setMinimumFilter(){

  // Limpa o background dos filtros anteriores e seta nesse
  setFilterButtonBackground("minimum-item");

  var vizinhancaSize = document.getElementById("vizinhanca-minimum").value;

  // Calcula a nova matriz e aplica o filtro
  var newMatrix = applyMinimumMatrix(imgMatrixOriginal, imgWidth, imgHeight, vizinhancaSize);
  currentMatrix = newMatrix;

  var newImgData = parseToImageData(newMatrix, imgWidth, imgHeight);

  ctx.putImageData(newImgData, 0, 0);
  setHistogram();
}

function setMidpointFilter(){

  // Limpa o background dos filtros anteriores e seta nesse
  setFilterButtonBackground("midpoint-item");

  var vizinhancaSize = document.getElementById("vizinhanca-midpoint").value;

  // Calcula a nova matriz e aplica o filtro
  var newMatrix = applyMidpointMatrix(imgMatrixOriginal, imgWidth, imgHeight, vizinhancaSize);
  currentMatrix = newMatrix;

  var newImgData = parseToImageData(newMatrix, imgWidth, imgHeight);

  ctx.putImageData(newImgData, 0, 0);
  setHistogram();
}