function setCompression() {
  
  // Calcula a nova matriz e aplica o filtro
  var newMatrix = applyWaveletCommonFilterMatrix(currentMatrix, imgWidth, imgHeight, coefComprWavelet);

  // Arredonda os valores decimais da matriz
  var imgMatrix = roundMatrix(newMatrix, imgWidth, imgHeight);

  generateComprFile(imgMatrix, imgWidth, imgHeight);

}

function generateComprFile(imgMatrix, imgWidth, imgHeight) {
	// Fazer depois, funcao que gera o arquivo para baixar

	// tirar isso depois
	compressedImgMatrix = imgMatrix; // funciona como se fosse os dados salvos no arquivo

  var newImgData = parseToImageData(imgMatrix, imgWidth, imgHeight);

  ctx.putImageData(newImgData, 0, 0);
  setHistogram();
}

function readComprFile() {
	// Fazer depois, funcao que le o arquivo gerado

	return compressedImgMatrix;
}

function setDecompression() {

	imgMatrix = readComprFile();
  
  // Calcula a nova matriz e aplica o filtro
  var newMatrix = undoWaveletCommonFilterMatrix(imgMatrix, imgWidth, imgHeight);



  // Mostra a imagem no final do processo de descompressão
  currentMatrix = newMatrix;

  var newImgData = parseToImageData(newMatrix, imgWidth, imgHeight);

  ctx.putImageData(newImgData, 0, 0);
  setHistogram();
}

function undoWaveletCommonFilterMatrix(imgMatrixOriginal, imgWidth, imgHeight) {

	// Como o coeficiente de compressao é padronizado, apenas com os tamanhos da imagem da pra obter os valores necessarios
	var imgMainWidth = imgWidth / (2 ** coefComprWavelet);
  var imgMainHeight = imgHeight / (2 ** coefComprWavelet);


  var imgMatrixTemp = JSON.parse(JSON.stringify(imgMatrixOriginal));

  while( (imgMainWidth < imgWidth) && (imgMainHeight < imgHeight) )
  {
    var imgMatrixNova = undoHaarMatrixStep(imgMatrixTemp, imgMainWidth - 1, imgMainHeight - 1);

    imgMainWidth = imgMainWidth * 2;
    imgMainHeight = imgMainHeight * 2;

    var imgMatrixTemp = JSON.parse(JSON.stringify(imgMatrixNova));
  }
  
  return imgMatrixNova;
}

function undoHaarMatrixStep(imgMatrix, imgMainWidth, imgMainHeight) {
	//Volta desfaz expande primeiro na altura depois na largura

	var imgWidthEnd = (imgMainWidth * 2) + 1;
	var imgHeightEnd = (imgMainHeight * 2) + 1;

	//Copia o valor da matriz para nao modificar a original
  var imgMatrixAnterior = JSON.parse(JSON.stringify(imgMatrix));
  var imgMatrixAtual = JSON.parse(JSON.stringify(imgMatrix));
  var imgMatrixNova = JSON.parse(JSON.stringify(imgMatrix));

  // Loop da coluna
  for(var coluna = 0; coluna <= imgWidthEnd; coluna++)
  {
    for(var linha = 0; linha <= imgHeightEnd; linha+=2)
    {

    	var indexMediaLinha = (linha / 2 );
      var indexSubLinha = (linha / 2 ) + ( (imgHeightEnd + 1) / 2 );

      // Pega um pixel da metade inicial e um do meio em diante que vao ser usados para calcular os valores
      var pixelMedia = imgMatrixAtual[indexMediaLinha][coluna];
      var pixelSub = imgMatrixAtual[indexSubLinha][coluna];

      // Pixels da nova imagem
      var firstPixel = imgMatrixNova[linha][coluna];
      var secondPixel = imgMatrixNova[linha + 1][coluna];

      firstPixel.r = pixelMedia.r + pixelSub.r;
      firstPixel.g = pixelMedia.g + pixelSub.g;
      firstPixel.b = pixelMedia.b + pixelSub.b;

      secondPixel.r = pixelMedia.r - pixelSub.r;
      secondPixel.g = pixelMedia.g - pixelSub.g;
      secondPixel.b = pixelMedia.b - pixelSub.b;

    }
  }

  var imgMatrixAtual = JSON.parse(JSON.stringify(imgMatrixNova));

  // Loop da linha
  for(var linha = 0; linha <= imgHeightEnd; linha++)
  {
    for(var coluna = 0; coluna <= imgWidthEnd; coluna+=2)
    {

    	var indexMediaColuna = (coluna / 2 );
      var indexSubColuna = (coluna / 2 ) + ( (imgWidthEnd + 1) / 2 );

      // Pega um pixel da metade inicial e um do meio em diante que vao ser usados para calcular os valores
      var pixelMedia = imgMatrixAtual[linha][indexMediaColuna];
      var pixelSub = imgMatrixAtual[linha][indexSubColuna];

      // Pixels da nova imagem
      var firstPixel = imgMatrixNova[linha][coluna];
      var secondPixel = imgMatrixNova[linha][coluna + 1];

      firstPixel.r = pixelMedia.r + pixelSub.r;
      firstPixel.g = pixelMedia.g + pixelSub.g;
      firstPixel.b = pixelMedia.b + pixelSub.b;

      secondPixel.r = pixelMedia.r - pixelSub.r;
      secondPixel.g = pixelMedia.g - pixelSub.g;
      secondPixel.b = pixelMedia.b - pixelSub.b;

    }
  }

  return imgMatrixNova;
}

function roundMatrix(imgMatrixOriginal, imgWidth, imgHeight) {

	var imgMatrix = JSON.parse(JSON.stringify(imgMatrixOriginal));

	for(var linha = 0; linha < imgHeight; linha++)
  {
    for(var coluna = 0; coluna < imgWidth; coluna++)
    {
    	var currentPixel = imgMatrix[linha][coluna];
      
      currentPixel.r = Math.round(currentPixel.r);//Math.max( Math.round(currentPixel.r) , 0 );
      currentPixel.g = Math.round(currentPixel.g);//Math.max( Math.round(currentPixel.g) , 0 );;
      currentPixel.b = Math.round(currentPixel.b);//Math.max( Math.round(currentPixel.b) , 0 );;
      
    }
  }
  
  return imgMatrix;
}