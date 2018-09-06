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

function applyWeightedAvarageMatrix(imgMatrixOriginal, imgWidth, imgHeight, convolutionMatrix) {

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