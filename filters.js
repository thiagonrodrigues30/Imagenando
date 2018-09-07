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
  bit = arrayBits.length - bit;
  for(var pos = 0; pos < arrayBits.length; pos++) {
    if(pos != bit) {
      arrayBits[pos] = 0;
    }
  }
  var decimal = parseInt(arrayBits.join(''), 2);
  return decimal;
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

function calculateEquation(pixel, Xo, Yo, X, Y) {
  return ( (Y - Yo) / (X - Xo) ) * (pixel - Xo) + Yo;
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

function applyConvolutionMatrix(imgMatrixOriginal, imgWidth, imgHeight, convolutionMatrix) {

  //Copia o valor da matriz para nao modificar a original
  var imgMatrix = JSON.parse(JSON.stringify(imgMatrixOriginal));

  // Percorre a matriz de imagem
  for(var linha = 0; linha < imgHeight; linha++)
  {
    for(var coluna = 0; coluna < imgWidth; coluna++)
    {
      var sumR = 0;
      var sumG = 0;
      var sumB = 0;

      // Percorre a matriz de convoluacao
      for(var linhaConv = 0; linhaConv < 5; linhaConv++)
      {
        for(var colunaConv = 0; colunaConv < 5; colunaConv++)
        {
          var linhaIndex = linha - 2 + linhaConv;
          var colunaIndex = coluna - 2 + colunaConv;

          if(linhaIndex >= 0 && linhaIndex < imgHeight && colunaIndex >= 0 && colunaIndex < imgWidth)
          {
            var currentPixel = imgMatrixOriginal[linhaIndex][colunaIndex];

            sumR += convolutionMatrix[linhaConv][colunaConv] * currentPixel.r;
            sumG += convolutionMatrix[linhaConv][colunaConv] * currentPixel.g;
            sumB += convolutionMatrix[linhaConv][colunaConv] * currentPixel.b;
          }

        }
      }

      var currentPixel = imgMatrix[linha][coluna];

      currentPixel.r = sumR;
      currentPixel.g = sumG;
      currentPixel.b = sumB;


    }
  }
  

  return imgMatrix;
}

function applyWeightedAverageMatrix(imgMatrixOriginal, imgWidth, imgHeight, convolutionMatrix) {

  //Copia o valor da matriz para nao modificar a original
  var imgMatrix = JSON.parse(JSON.stringify(imgMatrixOriginal));

  // Percorre a matriz de imagem
  for(var linha = 0; linha < imgHeight; linha++)
  {
    for(var coluna = 0; coluna < imgWidth; coluna++)
    {
      var sumR = 0;
      var sumG = 0;
      var sumB = 0;

      var coefficientSum = 0;

      // Percorre a matriz de convoluacao
      for(var linhaConv = 0; linhaConv < 5; linhaConv++)
      {
        for(var colunaConv = 0; colunaConv < 5; colunaConv++)
        {
          var linhaIndex = linha - 2 + linhaConv;
          var colunaIndex = coluna - 2 + colunaConv;

          if(linhaIndex >= 0 && linhaIndex < imgHeight && colunaIndex >= 0 && colunaIndex < imgWidth)
          {
            var currentPixel = imgMatrixOriginal[linhaIndex][colunaIndex];

            sumR += convolutionMatrix[linhaConv][colunaConv] * currentPixel.r;
            sumG += convolutionMatrix[linhaConv][colunaConv] * currentPixel.g;
            sumB += convolutionMatrix[linhaConv][colunaConv] * currentPixel.b;

            coefficientSum += convolutionMatrix[linhaConv][colunaConv];
          }

        }
      }


      // Se for 0 seta como 1 para nao fazer divisao por 0
      if(coefficientSum == 0)
      {
        coefficientSum = 1;
      }

      var currentPixel = imgMatrix[linha][coluna];

      currentPixel.r = sumR / coefficientSum;
      currentPixel.g = sumG / coefficientSum;
      currentPixel.b = sumB / coefficientSum;


    }
  }


  return imgMatrix;
}

function is3x3(convolutionMatrix) {
  
  if(convolutionMatrix[0][0] == 0 && convolutionMatrix[0][1] == 0 && convolutionMatrix[0][2] == 0 && convolutionMatrix[0][3] == 0 &&
    convolutionMatrix[0][4] == 0 && convolutionMatrix[4][0] == 0 && convolutionMatrix[4][1] == 0 && convolutionMatrix[4][2] == 0 &&
    convolutionMatrix[4][3] == 0 && convolutionMatrix[4][4] == 0 && convolutionMatrix[1][0] == 0 && convolutionMatrix[2][0] == 0 &&
    convolutionMatrix[3][0] == 0 && convolutionMatrix[1][4] == 0 && convolutionMatrix[2][4] == 0 && convolutionMatrix[3][4] == 0 )
  {
    return true;
  }
  else
  {
    return false;
  }
}

function applyMedianMatrix(imgMatrixOriginal, imgWidth, imgHeight, neighborhoodSize) {
  //Copia o valor da matriz para nao modificar a original
  var imgMatrix = JSON.parse(JSON.stringify(imgMatrixOriginal));

  // Percorre a matriz de imagem
  for(var linha = 0; linha < imgHeight; linha++)
  {
    for(var coluna = 0; coluna < imgWidth; coluna++)
    {
      var elementsR = [];
      var elementsG = [];
      var elementsB = [];

      // Percorre a matriz de convoluacao
      for(var linhaConv = 0; linhaConv < neighborhoodSize; linhaConv++)
      {
        for(var colunaConv = 0; colunaConv < neighborhoodSize; colunaConv++)
        {
          var borderDist = (neighborhoodSize - 1) / 2;
          var linhaIndex = linha - borderDist + linhaConv;
          var colunaIndex = coluna - borderDist + colunaConv;

          if(linhaIndex >= 0 && linhaIndex < imgHeight && colunaIndex >= 0 && colunaIndex < imgWidth)
          {
            var currentPixel = imgMatrixOriginal[linhaIndex][colunaIndex];

            elementsR.push(currentPixel.r);
            elementsG.push(currentPixel.g);
            elementsB.push(currentPixel.b);
          }

        }
      }

      // Ordena os elementos
      elementsR.sort(function(a, b){return a-b});
      elementsG.sort(function(a, b){return a-b});
      elementsB.sort(function(a, b){return a-b});

      // Verifica se quantidade de elementos é par
      if((elementsR.length % 2) == 0)
      {
        var mid = elementsR.length / 2;
        var medianR = Math.round( Number(( elementsR[mid] + elementsR[mid + 1] ) / 2) );
        var medianG = Math.round( Number(( elementsG[mid] + elementsG[mid + 1] ) / 2) );
        var medianB = Math.round( Number(( elementsB[mid] + elementsB[mid + 1] ) / 2) );
      }
      // Ou se é impar
      else
      {
        var mid = ((elementsR.length - 1) / 2) + 1;
        var medianR = elementsR[mid];
        var medianG = elementsG[mid];
        var medianB = elementsB[mid];
      }

      var currentPixel = imgMatrix[linha][coluna];

      currentPixel.r = medianR;
      currentPixel.g = medianG;
      currentPixel.b = medianB;

    }
  }
 
 
  return imgMatrix;
}