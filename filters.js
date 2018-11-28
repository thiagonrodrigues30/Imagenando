//Aplica o brilho na matriz recebida
function applyBrightnessFilterMatrix(imgMatrixOriginal, imgWidth, imgHeight, brightness){

  //Copia o valor da matriz para nao modificar a original
  var imgMatrix = JSON.parse(JSON.stringify(imgMatrixOriginal));

  for(var linha = 0; linha < imgHeight; linha++)
  {
    for(var coluna = 0; coluna < imgWidth; coluna++)
    {
      var currentPixel = imgMatrix[linha][coluna];

      if(brightness == "+") {
        currentPixel.r = currentPixel.r + 30;
        currentPixel.g = currentPixel.g + 30;
        currentPixel.b = currentPixel.b + 30;
        currentPixel.a = 255;
      } else {
        currentPixel.r = currentPixel.r - 30;
        currentPixel.g = currentPixel.g - 30;
        currentPixel.b = currentPixel.b - 30;
        currentPixel.a = 255; 
      }
    }
  }

  return imgMatrix;
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

function applyThresholdFilterMatrix(imgMatrixOriginal, imgWidth, imgHeight, l){

  //Copia o valor da matriz para nao modificar a original
  var imgMatrix = JSON.parse(JSON.stringify(imgMatrixOriginal));

  for(var linha = 0; linha < imgHeight; linha++)
  {
    for(var coluna = 0; coluna < imgWidth; coluna++)
    {
      var currentPixel = imgMatrix[linha][coluna];

      if(currentPixel.r >= l) {
        currentPixel.r = 255;
      } else {
        currentPixel.r = 0;
      }

      if(currentPixel.g >= l) {
        currentPixel.g = 255;
      } else {
        currentPixel.g = 0;
      }

      if(currentPixel.b >= l) {
        currentPixel.b = 255;
      } else {
        currentPixel.b = 0;
      }

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

//Aplica o filtro de sépia a matriz recebida
function applySepiaFilterMatrix(imgMatrixOriginal, imgWidth, imgHeight){

  //Copia o valor da matriz para nao modificar a original
  var imgMatrix = JSON.parse(JSON.stringify(imgMatrixOriginal));
  //console.log(imgMatrix);

  for(var linha = 0; linha < imgHeight; linha++)
  {
    for(var coluna = 0; coluna < imgWidth; coluna++)
    {
      var currentPixel = imgMatrix[linha][coluna];
      var r = Math.trunc(0.393 * currentPixel.r + 0.769 * currentPixel.g + 0.189 * currentPixel.b);
      var g = Math.trunc(0.349 * currentPixel.r + 0.686 * currentPixel.g + 0.168 * currentPixel.b);
      var b = Math.trunc(0.272 * currentPixel.r + 0.534 * currentPixel.g + 0.131 * currentPixel.b);
      currentPixel.a = 255;
      
      if(r > 255) {
        currentPixel.r = 255;
      } else {
        currentPixel.r = r;
      }

      if(g > 255) {
        currentPixel.g = 255;
      } else {
        currentPixel.g = g;
      }

      if(b > 255) {
        currentPixel.b = 255;
      } else {
        currentPixel.b = b;
      }
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

function applyAverageMatrix(imgMatrixOriginal, imgWidth, imgHeight, convolutionMatrix) {

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

      var divider = 1;
      var currentPixel = imgMatrix[linha][coluna];

      if(is3x3(convolutionMatrix)) {
        divider = 9;
      } else {
        divider = 25;
      }

      currentPixel.r = sumR / divider;
      currentPixel.g = sumG / divider;
      currentPixel.b = sumB / divider;


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

function applyGeometricMeanMatrix(imgMatrixOriginal, imgWidth, imgHeight, neighborhoodSize) {
  //Copia o valor da matriz para nao modificar a original
  var imgMatrix = JSON.parse(JSON.stringify(imgMatrixOriginal));

  // Percorre a matriz de imagem
  for(var linha = 0; linha < imgHeight; linha++)
  {
    for(var coluna = 0; coluna < imgWidth; coluna++)
    {
      var prodR = 1;
      var prodG = 1;
      var prodB = 1;

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

            prodR *= currentPixel.r;
            prodG *= currentPixel.g;
            prodB *= currentPixel.b;
          }
        }
      }

      var currentPixel = imgMatrix[linha][coluna];
      currentPixel.r = Math.pow(prodR, 1/(neighborhoodSize*neighborhoodSize));
      currentPixel.g = Math.pow(prodG, 1/(neighborhoodSize*neighborhoodSize));
      currentPixel.b = Math.pow(prodB, 1/(neighborhoodSize*neighborhoodSize));
    }
  } 
  return imgMatrix;
}

function applyHarmonicMeanMatrix(imgMatrixOriginal, imgWidth, imgHeight, neighborhoodSize) {
  //Copia o valor da matriz para nao modificar a original
  var imgMatrix = JSON.parse(JSON.stringify(imgMatrixOriginal));

  // Percorre a matriz de imagem
  for(var linha = 0; linha < imgHeight; linha++)
  {
    for(var coluna = 0; coluna < imgWidth; coluna++)
    {
      var somR = 1;
      var somG = 1;
      var somB = 1;

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

            somR += 1/currentPixel.r;
            somG += 1/currentPixel.g;
            somB += 1/currentPixel.b;
          }
        }
      }

      var currentPixel = imgMatrix[linha][coluna];
      currentPixel.r = (neighborhoodSize*neighborhoodSize)/somR;
      currentPixel.g = (neighborhoodSize*neighborhoodSize)/somG;
      currentPixel.b = (neighborhoodSize*neighborhoodSize)/somB;
    }
  } 
  return imgMatrix;
}

function applyCounterHarmonicMeanMatrix(imgMatrixOriginal, imgWidth, imgHeight, neighborhoodSize, pot) {
  //Copia o valor da matriz para nao modificar a original
  var imgMatrix = JSON.parse(JSON.stringify(imgMatrixOriginal));

  // Percorre a matriz de imagem
  for(var linha = 0; linha < imgHeight; linha++)
  {
    for(var coluna = 0; coluna < imgWidth; coluna++)
    {
      var nR = 0;
      var nG = 0;
      var nB = 0;

      var dR = 0;
      var dG = 0;
      var dB = 0;

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

            nR += Math.pow(currentPixel.r, pot + 1);
            nG += Math.pow(currentPixel.g, pot + 1);
            nB += Math.pow(currentPixel.b, pot + 1);

            dR += Math.pow(currentPixel.r, pot);
            dG += Math.pow(currentPixel.g, pot);
            dB += Math.pow(currentPixel.b, pot);
          }
        }
      }
      
      var currentPixel = imgMatrix[linha][coluna];
      currentPixel.r = nR/dR;
      currentPixel.g = nG/dG;
      currentPixel.b = nB/dB;
    }
  } 
  return imgMatrix;
}

function applyMaximumMatrix(imgMatrixOriginal, imgWidth, imgHeight, neighborhoodSize) {
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

      var currentPixel = imgMatrix[linha][coluna];
      currentPixel.r = Math.max.apply(null, elementsR);
      currentPixel.g = Math.max.apply(null, elementsG);
      currentPixel.b = Math.max.apply(null, elementsB);
    }
  } 
  return imgMatrix;
}

function applyMinimumMatrix(imgMatrixOriginal, imgWidth, imgHeight, neighborhoodSize) {
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

      var currentPixel = imgMatrix[linha][coluna];
      currentPixel.r = Math.min.apply(null, elementsR);
      currentPixel.g = Math.min.apply(null, elementsG);
      currentPixel.b = Math.min.apply(null, elementsB);
    }
  } 
  return imgMatrix;
}

function applyMidpointMatrix(imgMatrixOriginal, imgWidth, imgHeight, neighborhoodSize) {
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

      var currentPixel = imgMatrix[linha][coluna];
      currentPixel.r = (elementsR[0] + elementsR[elementsR.length-1])/2;
      currentPixel.g = (elementsG[0] + elementsG[elementsG.length-1])/2;
      currentPixel.b = (elementsB[0] + elementsB[elementsB.length-1])/2;
    }
  } 
  return imgMatrix;
}

function applyWaveletCommonFilterMatrix(imgMatrixOriginal, imgWidth, imgHeight, steps) {

  var widthTemp = imgWidth;
  var heightTemp = imgHeight;

  var imgMatrixTemp = JSON.parse(JSON.stringify(imgMatrixOriginal));

  for(var i = 0; i < steps; i++)
  {
    var imgMatrixNova = haarMatrixStep(imgMatrixTemp, 0, widthTemp - 1, 0, heightTemp - 1);

    widthTemp = widthTemp / 2;
    heightTemp = heightTemp / 2;
    var imgMatrixTemp = JSON.parse(JSON.stringify(imgMatrixNova));
  }
  
  return imgMatrixNova;
}

function applyWaveletFilterMatrix(imgMatrixOriginal, imgWidth, imgHeight) {

  var subImagesArrayAtual = [];
  var subImagesArrayNovo = [];

  subImagesArrayAtual.push(new SubImage(0, imgWidth - 1, 0, imgHeight - 1));

  var imgMatrixAnterior = JSON.parse(JSON.stringify(imgMatrixOriginal));

  var maxInteration = 4;
  var currentInteration = 0;

  while(subImagesArrayAtual.length > 0 && currentInteration < maxInteration)
  {

    for(var i = 0; i < subImagesArrayAtual.length; i++)
    {
      var currentSubImage = subImagesArrayAtual[i];
      var imgMatrixNova = haarMatrixStep(imgMatrixAnterior, currentSubImage.imgWidthBegin, currentSubImage.imgWidthEnd, currentSubImage.imgHeightBegin, currentSubImage.imgHeightEnd);
    
      // Verifica se a energia nova é menor que a anterior
      if(!isFinished(imgMatrixAnterior, imgMatrixNova, currentSubImage.imgWidthBegin, currentSubImage.imgWidthEnd, currentSubImage.imgHeightBegin, currentSubImage.imgHeightEnd))
      {
        // Subimagem do 1º quadrante
        subImagesArrayNovo.push(new SubImage(
          currentSubImage.imgWidthBegin, 
          ((currentSubImage.imgWidthEnd - currentSubImage.imgWidthBegin + 1) / 2) - 1,
          currentSubImage.imgHeightBegin,
          ((currentSubImage.imgHeightEnd - currentSubImage.imgHeightBegin + 1) / 2) - 1
        ));

        // Subimagem do 2º quadrante
        subImagesArrayNovo.push(new SubImage(
          currentSubImage.imgWidthBegin, 
          ((currentSubImage.imgWidthEnd - currentSubImage.imgWidthBegin + 1) / 2) - 1,
          ((currentSubImage.imgHeightEnd - currentSubImage.imgHeightBegin + 1) / 2),
          currentSubImage.imgHeightEnd
        ));

        // Subimagem do 3º quadrante
        subImagesArrayNovo.push(new SubImage(
          ((currentSubImage.imgWidthEnd - currentSubImage.imgWidthBegin + 1) / 2), 
          currentSubImage.imgWidthEnd,
          ((currentSubImage.imgHeightEnd - currentSubImage.imgHeightBegin + 1) / 2),
          currentSubImage.imgHeightEnd
        ));

        // Subimagem do 4º quadrante
        subImagesArrayNovo.push(new SubImage(
          ((currentSubImage.imgWidthEnd - currentSubImage.imgWidthBegin + 1) / 2), 
          currentSubImage.imgWidthEnd,
          currentSubImage.imgHeightBegin,
          ((currentSubImage.imgHeightEnd - currentSubImage.imgHeightBegin + 1) / 2) - 1
        ));

        var imgMatrixAnterior = JSON.parse(JSON.stringify(imgMatrixNova));
      }

    }

    subImagesArrayAtual = JSON.parse(JSON.stringify(subImagesArrayNovo));
    subImagesArrayNovo = [];

    currentInteration++;
  }

  var imgMatrixNova = JSON.parse(JSON.stringify(imgMatrixAnterior));

  return imgMatrixNova;
}

function haarMatrixStep(imgMatrix, imgWidthBegin, imgWidthEnd, imgHeightBegin, imgHeightEnd) {
  
  //Copia o valor da matriz para nao modificar a original
  var imgMatrixAnterior = JSON.parse(JSON.stringify(imgMatrix));
  var imgMatrixAtual = JSON.parse(JSON.stringify(imgMatrix));
  var imgMatrixNova = JSON.parse(JSON.stringify(imgMatrix));
  //console.log(imgMatrix);

  // Loop da linha
  for(var linha = imgHeightBegin; linha <= imgHeightEnd; linha++)
  {
    for(var coluna = imgWidthBegin; coluna <= imgWidthEnd; coluna+=2)
    {
      var firstPixel = imgMatrixAtual[linha][coluna];
      var secondPixel = imgMatrixAtual[linha][coluna + 1];
      
      var mediaR = ( firstPixel.r + secondPixel.r ) / 2;
      var mediaG = ( firstPixel.g + secondPixel.g ) / 2;
      var mediaB = ( firstPixel.b + secondPixel.b ) / 2;

      var subR = ( firstPixel.r - secondPixel.r ) / 2;
      var subG = ( firstPixel.g - secondPixel.g ) / 2;
      var subB = ( firstPixel.b - secondPixel.b ) / 2;

      var indexMediaCol = ((coluna - imgWidthBegin) / 2 ) + imgWidthBegin;
      var indexSubCol = ((coluna - imgWidthBegin) / 2 ) + ( (imgWidthEnd - imgWidthBegin + 1) / 2 ) + imgWidthBegin;
      
      var currentPixelMedia = imgMatrixNova[linha][indexMediaCol];
      var currentPixelSub = imgMatrixNova[linha][indexSubCol];

      currentPixelMedia.r = mediaR;
      currentPixelMedia.g = mediaG;
      currentPixelMedia.b = mediaB;

      currentPixelSub.r = subR;
      currentPixelSub.g = subG;
      currentPixelSub.b = subB;
      
    }
  }

  var imgMatrixAtual = JSON.parse(JSON.stringify(imgMatrixNova));

  // Loop da coluna
  for(var coluna = imgWidthBegin; coluna <= imgWidthEnd; coluna++)
  {
    for(var linha = imgHeightBegin; linha <= imgHeightEnd; linha+=2)
    {
      var firstPixel = imgMatrixAtual[linha][coluna];
      var secondPixel = imgMatrixAtual[linha + 1][coluna];
      
      var mediaR = ( firstPixel.r + secondPixel.r ) / 2;
      var mediaG = ( firstPixel.g + secondPixel.g ) / 2;
      var mediaB = ( firstPixel.b + secondPixel.b ) / 2;

      var subR = ( firstPixel.r - secondPixel.r ) / 2;
      var subG = ( firstPixel.g - secondPixel.g ) / 2;
      var subB = ( firstPixel.b - secondPixel.b ) / 2;

      var indexMediaLinha = ((linha - imgHeightBegin) / 2 ) + imgHeightBegin;
      var indexSubLinha = ((linha - imgHeightBegin) / 2 ) + ( (imgHeightEnd - imgHeightBegin + 1) / 2 ) + imgHeightBegin;

      var currentPixelMedia = imgMatrixNova[indexMediaLinha][coluna];
      var currentPixelSub = imgMatrixNova[indexSubLinha][coluna];

      currentPixelMedia.r = mediaR;
      currentPixelMedia.g = mediaG;
      currentPixelMedia.b = mediaB;

      currentPixelSub.r = subR;
      currentPixelSub.g = subG;
      currentPixelSub.b = subB;
      
    }
  }

  return imgMatrixNova;
}

function isFinished(imgMatrixAnterior, imgMatrixNova, imgWidthBegin, imgWidthEnd, imgHeightBegin, imgHeightEnd) {
  var matrixAnteriorEnergy = 0;
  var matrixNovaEnergy = 0;

  // Calcula energia da matriz anterior
  for(var linha = imgHeightBegin; linha <= imgHeightEnd; linha++)
  {
    for(var coluna = imgWidthBegin; coluna <= imgWidthEnd; coluna++)
    {
      var currentPixelAnterior = imgMatrixAnterior[linha][coluna];
      var currentPixelNova = imgMatrixNova[linha][coluna];
      
      matrixAnteriorEnergy += currentPixelAnterior.r + currentPixelAnterior.g + currentPixelAnterior.b;
      matrixNovaEnergy += currentPixelNova.r + currentPixelNova.g + currentPixelNova.b;
    }
  }

  if(matrixNovaEnergy < matrixAnteriorEnergy)
  {
    return false;
  }
  else
  {
    return true;
  }

}