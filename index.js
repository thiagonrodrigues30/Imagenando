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

function applyLinearByPartsMatrix(imgMatrixOriginal, imgWidth, imgHeight, Xo, Yo, X, Y) {

  //Copia o valor da matriz para nao modificar a original
  var imgMatrix = JSON.parse(JSON.stringify(imgMatrixOriginal));

  for(var linha = 0; linha < imgHeight; linha++)
  {
    for(var coluna = 0; coluna < imgWidth; coluna++)
    {

      var currentPixel = imgMatrix[linha][coluna];

      if(currentPixel.r <= Xo) {
        currentPixel.r = calculateEquation(currentPixel.r, 0, 0, Xo, Yo);
      } else if(currentPixel.r > Xo && currentPixel.r <= X) {
        currentPixel.r = calculateEquation(currentPixel.r, Xo, Yo, X, Y);
      } else if(currentPixel.r > X && currentPixel.r <= 255) {
        currentPixel.r = calculateEquation(currentPixel.r, X, Y, 255, 255);
      }

      if(currentPixel.g <= Xo) {
        currentPixel.g = calculateEquation(currentPixel.g, 0, 0, Xo, Yo);
      } else if(currentPixel.g > Xo && currentPixel.g <= X) {
        currentPixel.g = calculateEquation(currentPixel.g, Xo, Yo, X, Y);
      } else if(currentPixel.g > X && currentPixel.g <= 255) {
        currentPixel.g = calculateEquation(currentPixel.g, X, Y, 255, 255);
      }

      if(currentPixel.b <= Xo) {
        currentPixel.b = calculateEquation(currentPixel.b, 0, 0, Xo, Yo);
      } else if(currentPixel.b > Xo && currentPixel.b <= X) {
        currentPixel.b = calculateEquation(currentPixel.b, Xo, Yo, X, Y);
      } else if(currentPixel.b > X && currentPixel.b <= 255) {
        currentPixel.b = calculateEquation(currentPixel.b, X, Y, 255, 255);
      }

      currentPixel.a = 255;

    }
  }

  return imgMatrix;
}

function transformPixelByBit(pixel, bit) {
  var arrayBits = pixel.toString(2).split('');
  bit = arrayBits.length - bit;
  for(var pos = 0; pos < arrayBits.length; pos++) {
    if(pos != bit) {
      arrayBits[pos] = 0;
    }
  }
  var decimal = parseInt(arrayBits.join(''), 2);
  return decimal;
}

function calculateEquation(pixel, Xo, Yo, X, Y) {
  return ( (Y - Yo) / (X - Xo) ) * (pixel - Xo) + Yo;
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

function getEqualizedArray(hist) {

  var totalPixels = imgHeight * imgWidth;

  var probArray = new Array(256);
  probArray.fill(0);

  // Pega a probabilidade de ocorrencia de cara intensidade de cor
  for(var i = 0; i < 256; i++)
  {
    probArray[i] = hist[i] / totalPixels;
  }

  var equalizedArray = new Array(256);
  equalizedArray.fill(0);

  // Calcula a nova cor respectiva de cada intensidade
  for(var i = 0; i < 256; i++)
  {
    var sum = 0;
    for(var j = 0; j <= i; j++)
    {
      sum += hist[j];
    }

    equalizedArray[i] = Math.round(((255 / totalPixels) * sum));
  }

  return equalizedArray;
}

function applyEqualizationMatrix(currentMatrix, equalizedR, equalizedG, equalizedB) {
  
  //Copia o valor da matriz para nao modificar a original
  var imgMatrix = JSON.parse(JSON.stringify(currentMatrix));

  for(var linha = 0; linha < imgHeight; linha++)
  {
    for(var coluna = 0; coluna < imgWidth; coluna++)
    {
      var currentPixel = imgMatrix[linha][coluna];

      currentPixel.r = equalizedR[Math.min(currentPixel.r.toFixed(), 255)];
      currentPixel.g = equalizedG[Math.min(currentPixel.g.toFixed(), 255)];
      currentPixel.b = equalizedB[Math.min(currentPixel.b.toFixed(), 255)];
    }
  }

  return imgMatrix;
}

function configLogInputs() {
  /*
  <p class="params-text" id="intensidade-text-log">Intensidade: 30</p>
  <input type="range" min="0" max="255" value="30" class="slider" id="intensidade-log">

  <br><br>
  <center>
    <input type="button" class="btn btn-default" value="Preview" >
  </center>
  */

  // Exibe o icone de filtro no filtro que esta com os parametros sendo exbidos
  setParamsIcon("log-icon");
  
  var inputsContainer = document.getElementById("inputs-container");

  // Cria o elemento p de label do input intensidade
  var pItensidade = document.createElement("p");
  pItensidade.classList.add("params-text");
  pItensidade.id = "intensidade-text-log";
  pItensidade.textContent = "Intensidade: 30";

  // Cria o range para input da intensidade
  var inputIntensidade = document.createElement("input");
  inputIntensidade.type = "range";
  inputIntensidade.classList.add("slider");
  inputIntensidade.min = "0";
  inputIntensidade.max = "255";
  inputIntensidade.value = "30";
  inputIntensidade.id = "intensidade-log";

  inputIntensidade.oninput = function() {
    pItensidade.textContent = "Intensidade: " + this.value;
  }

  // Cria o botão que ativa o preview do filtro
  var btnLogPreview = document.createElement("input");
  btnLogPreview.type = "button";
  btnLogPreview.classList.add("btn")
  btnLogPreview.classList.add("btn-default");
  btnLogPreview.value = "Preview";

  btnLogPreview.onclick = function () {
    setLogFilter();
  }


  // Insere os elementos criados no container dos inputs
  inputsContainer.appendChild(pItensidade);
  inputsContainer.appendChild(inputIntensidade);
  inputsContainer.appendChild(document.createElement("br"));
  inputsContainer.appendChild(document.createElement("br"));

  var center = document.createElement("center");
  center.appendChild(btnLogPreview);

  inputsContainer.appendChild(center);
  
}

function setFilterButtonBackground(id) {

  // Tira o background dos filtros anteriores e aplica no atual
  appliedFilters.forEach(function (item, index) {
    document.getElementById(item).classList.remove("list-group-item-info");
  });
  appliedFilters = [];

  if(id != -1)
  {
    document.getElementById(id).classList.add("list-group-item-info");
    appliedFilters.push(id);
  }

}

function setParamsIcon(id) {

  // Limpa os icones dos butoes
  if(filterPreview != "")
  {
    document.getElementById(filterPreview).innerHTML = "";
  }

  // Se o id for uma string ele adiciona o icone nesse id, se for -1 ele nao adiciona nada
  if(id != -1)
  {
    document.getElementById(id).appendChild(paramsIcon);
    filterPreview = id;
  }
  
  var inputsContainer = document.getElementById("inputs-container");
  inputsContainer.innerHTML = "";
}

function configPowerInputs() {

  // Exibe o icone de filtro no filtro que esta com os parametros sendo exbidos
  setParamsIcon("power-icon");

  var inputsContainer = document.getElementById("inputs-container");

  // Cria o elemento p de label do input intensidade
  var pItensidade = document.createElement("p");
  pItensidade.classList.add("params-text");
  pItensidade.id = "intensidade-text-power";
  pItensidade.textContent = "Intensidade: 30";

  // Cria o range para input da intensidade
  var inputIntensidade = document.createElement("input");
  inputIntensidade.type = "range";
  inputIntensidade.classList.add("slider");
  inputIntensidade.min = "0";
  inputIntensidade.max = "255";
  inputIntensidade.value = "30";
  inputIntensidade.id = "intensidade-power";

  inputIntensidade.oninput = function() {
    pItensidade.textContent = "Intensidade: " + this.value;
  }


  // Cria o elemento p de label do input de gama
  var pGama = document.createElement("p");
  pGama.classList.add("params-text");
  pGama.id = "gama-text-power";
  pGama.textContent = "Gama: 0.4";

  // Cria o range para input de gama
  var inputGama = document.createElement("input");
  inputGama.type = "range";
  inputGama.classList.add("slider");
  inputGama.min = "0";
  inputGama.max = "15";
  inputGama.step = "0.1";
  inputGama.value = "0.4";
  inputGama.id = "gama-power";

  inputGama.oninput = function() {
    pGama.textContent = "Gama: " + this.value;
  }

  // Cria o botão que ativa o preview do filtro
  var btnLogPreview = document.createElement("input");
  btnLogPreview.type = "button";
  btnLogPreview.classList.add("btn")
  btnLogPreview.classList.add("btn-default");
  btnLogPreview.value = "Preview";

  btnLogPreview.onclick = function () {
    setPowerFilter();
  }


  // Insere os elementos criados no container dos inputs
  inputsContainer.appendChild(pItensidade);
  inputsContainer.appendChild(inputIntensidade);
  inputsContainer.appendChild(document.createElement("br"));

  inputsContainer.appendChild(pGama);
  inputsContainer.appendChild(inputGama);
  inputsContainer.appendChild(document.createElement("br"));
  inputsContainer.appendChild(document.createElement("br"));

  var center = document.createElement("center");
  center.appendChild(btnLogPreview);

  inputsContainer.appendChild(center);
  inputsContainer.appendChild(document.createElement("br"));
  
}

function configBitPlaneInputs() {
  
  // Exibe o icone de filtro no filtro que esta com os parametros sendo exbidos
  setParamsIcon("bit-plane-icon");
  
  var inputsContainer = document.getElementById("inputs-container");

  // Cria o elemento p de label do input intensidade
  var pPlanoBits = document.createElement("p");
  pPlanoBits.classList.add("params-text");
  pPlanoBits.id = "bit-plane-text-log";
  pPlanoBits.textContent = "Plano de Bit: 3";

  // Cria o range para input da intensidade
  var inputPlanoBits = document.createElement("input");
  inputPlanoBits.type = "range";
  inputPlanoBits.classList.add("slider");
  inputPlanoBits.min = "1";
  inputPlanoBits.max = "8";
  inputPlanoBits.step = "1";
  inputPlanoBits.value = "3";
  inputPlanoBits.id = "bit-plane-input";

  inputPlanoBits.oninput = function() {
    pPlanoBits.textContent = "Plano de Bit: " + this.value;
  }


  // Cria o botão que ativa o preview do filtro
  var btnLogPreview = document.createElement("input");
  btnLogPreview.type = "button";
  btnLogPreview.classList.add("btn")
  btnLogPreview.classList.add("btn-default");
  btnLogPreview.value = "Preview";

  btnLogPreview.onclick = function () {
    setBitPlaneFilter();
  }


  // Insere os elementos criados no container dos inputs
  inputsContainer.appendChild(pPlanoBits);
  inputsContainer.appendChild(inputPlanoBits);
  inputsContainer.appendChild(document.createElement("br"));
  inputsContainer.appendChild(document.createElement("br"));

  var center = document.createElement("center");
  center.appendChild(btnLogPreview);

  inputsContainer.appendChild(center);

}

function configLinearByPartsInputs() {
  /*
  <p class="params-text linear-partes-input-label" >Primeiro ponto:</p> 
  <div class="linear-parts-inputs-div">
  ( 
  <input type="number" id="point1-x-linear-parts" class="linear-parts-inputs" min="0" max="255" value="100"> ,
  <input type="number" id="point1-y-linear-parts" class="linear-parts-inputs" min="0" max="255" value="150">
  )
  </div><br><br>
  */
  
  // Exibe o icone de filtro no filtro que esta com os parametros sendo exbidos
  setParamsIcon("linear-parts-icon");
  
  var inputsContainer = document.getElementById("inputs-container");

  // Cria o elemento p de label do ponto 1
  var pPrimeiro = document.createElement("p");
  pPrimeiro.classList.add("params-text");
  pPrimeiro.classList.add("linear-partes-input-label");
  pPrimeiro.textContent = "Primeiro ponto:";

  // Cria os inputs para as coordenadas do ponto 1
  var inputP1X = document.createElement("input");
  inputP1X.type = "number";
  inputP1X.classList.add("linear-parts-inputs");
  inputP1X.min = "0";
  inputP1X.max = "255";
  inputP1X.step = "1";
  inputP1X.value = "100";
  inputP1X.id = "point1-x-linear-parts";

  var inputP1Y = document.createElement("input");
  inputP1Y.type = "number";
  inputP1Y.classList.add("linear-parts-inputs");
  inputP1Y.min = "0";
  inputP1Y.max = "255";
  inputP1Y.step = "1";
  inputP1Y.value = "50";
  inputP1Y.id = "point1-y-linear-parts";

  var divInputsP1 = document.createElement("div");
  divInputsP1.classList.add("linear-parts-inputs-div");

  inputsContainer.appendChild(pPrimeiro);
  inputsContainer.appendChild(divInputsP1);

  // Insere os elementos na div dos inputs
  divInputsP1.insertAdjacentHTML('afterbegin', "( ");
  divInputsP1.appendChild(inputP1X);
  inputP1X.insertAdjacentHTML('afterend', " , ");
  divInputsP1.appendChild(inputP1Y);
  divInputsP1.insertAdjacentHTML('beforeend', " )");

  inputsContainer.appendChild(document.createElement("br"));
  inputsContainer.appendChild(document.createElement("br"));


  // Cria o elemento p de label do ponto 2
  var pSegundo = document.createElement("p");
  pSegundo.classList.add("params-text");
  pSegundo.classList.add("linear-partes-input-label");
  pSegundo.textContent = "Segundo ponto:";

  // Cria os inputs para as coordenadas do ponto 2
  var inputP2X = document.createElement("input");
  inputP2X.type = "number";
  inputP2X.classList.add("linear-parts-inputs");
  inputP2X.min = "0";
  inputP2X.max = "255";
  inputP2X.step = "1";
  inputP2X.value = "200";
  inputP2X.id = "point2-x-linear-parts";

  var inputP2Y = document.createElement("input");
  inputP2Y.type = "number";
  inputP2Y.classList.add("linear-parts-inputs");
  inputP2Y.min = "0";
  inputP2Y.max = "255";
  inputP2Y.step = "1";
  inputP2Y.value = "230";
  inputP2Y.id = "point2-y-linear-parts";

  var divInputsP2 = document.createElement("div");
  divInputsP2.classList.add("linear-parts-inputs-div");

  inputsContainer.appendChild(pSegundo);
  inputsContainer.appendChild(divInputsP2);

  // Insere os elementos na div dos inputs
  divInputsP2.insertAdjacentHTML('afterbegin', "( ");
  divInputsP2.appendChild(inputP2X);
  inputP2X.insertAdjacentHTML('afterend', " , ");
  divInputsP2.appendChild(inputP2Y);
  divInputsP2.insertAdjacentHTML('beforeend', " )");

  inputsContainer.appendChild(document.createElement("br"));
  inputsContainer.appendChild(document.createElement("br"));

  // Cria o botão que ativa o preview do filtro
  var btnLogPreview = document.createElement("input");
  btnLogPreview.type = "button";
  btnLogPreview.classList.add("btn")
  btnLogPreview.classList.add("btn-default");
  btnLogPreview.value = "Preview";

  btnLogPreview.onclick = function () {
    setLinearByPartsFilter();
  }

  var center = document.createElement("center");
  center.appendChild(btnLogPreview);

  inputsContainer.appendChild(center);
  inputsContainer.appendChild(document.createElement("br"));

}