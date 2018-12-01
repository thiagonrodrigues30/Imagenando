var downloadComprFile = (function () {
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    return function (data, name) {
        var blob = new Blob([data], {type: "octet/stream"}),
            url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = name;
        a.click();
        window.URL.revokeObjectURL(url);
    };
}());

function loadDescompacFile(input){
  var fileCompac;

  // Extrai os dados do arquivo
  if (input.files && input.files[0]) {

    var reader = new FileReader();
    
    reader.onload = function (e) {
      fileCompac = e.target.result;
    };

    reader.onloadend = function (e) {
      //console.log(new Uint8Array(fileCompac));
      setDecompression(new Uint8Array(fileCompac));
    };

    //reader.readAsDataURL(input.files[0]);
    reader.readAsArrayBuffer(input.files[0]);
  }

}

function byteString(n, dif) {
  if(dif) {
    return n.substr(dif).toString();
  }
  return ("000000000" + n.toString(2)).substr(-8).toString();
}

function bin2Number(stringBits) {
	//console.log("Antes = " + stringBits.length / 8);
	//var arr = new Uint8Array(2);
  //arr[0] = 300;
  //arr[1] = 300;
  //var encodedData = window.btoa(255);

  var arrayIntTemp = [];

  var i = 0;
  while(stringBits.length > 0){
    var byte = stringBits.substr(0, 8);
    var byteDif = byte;
    
    if(stringBits.length < 8) {
      byteDif = byteString(byteDif);
      arrayIntTemp[i] = byteDif.length - byte.length;
      i++;
    }
    
    arrayIntTemp[i] = parseInt(byteDif, 2);

    stringBits = stringBits.substr(8);
    i++;
  }

  var arrayInt = new Uint8Array(arrayIntTemp);

  return arrayInt;
}

function number2Bin(arrayInt) {
	var arrayBinary = [];

	var stringBits = "";

  for(var i = 0; i < arrayInt.length - 2; i++) {
    stringBits += byteString(arrayInt[i].toString(2));
  }
  
  var numAdded = arrayInt[arrayInt.length - 2];

  var lastByte = byteString(arrayInt[arrayInt.length - 1].toString(2));
  
  stringBits += lastByte.substr(numAdded);


  //console.log("Depois = " + stringBits.length / 8);

	return stringBits;
}

function setCompression() {
  
  // Calcula a nova matriz e aplica o filtro
  var newMatrix = applyWaveletCommonFilterMatrix(currentMatrix, imgWidth, imgHeight, coefComprWavelet);

  // Arredonda os valores decimais da matriz
  var imgMatrix = roundMatrix(newMatrix, imgWidth, imgHeight);

  // Pega a tabela de bits para as intensidades dos pixels
  var huffmanTree = applyHuffmanCoding(imgMatrix, imgWidth, imgHeight);

  var imgBitSequence = generateBitsForImage(imgMatrix, imgWidth, imgHeight, huffmanTree);

  var bitSequenceHuffman = generateBitsForHuffmanTree(huffmanTree, imgWidth, imgHeight);

  var bitSequence = bitSequenceHuffman + imgBitSequence;
  

  generateComprFile(bitSequence, imgMatrix, imgWidth, imgHeight);// Tirar os outros parametros depois

  // TO DO: Trocar string de bits pela string retornada nos algoritmos de compressão
  //generateComprFile("0110110100011110011011");
}

function generateComprFile(stringBits, imgMatrix, imgWidth, imgHeight) {

  //var arrayASCII = bin2String(stringBits);
  var arrayInt = bin2Number(stringBits);
  

  downloadComprFile(arrayInt, 'img_compact.imgnd');

	
  var newImgData = parseToImageData(imgMatrix, imgWidth, imgHeight);
  ctx.putImageData(newImgData, 0, 0);
  setHistogram();
  
}

function readComprFile(arrayInt) {
  
 	//var stringBits = string2Bin(arrayInt);
 	var stringBits = number2Bin(arrayInt);

	return stringBits;
}

function setDecompression(arrayInt) {
  
	var bitSequence = readComprFile(arrayInt);
	//console.log(bitSequence.length / 8);

	
	var tempDesc = descompressBitSequence(bitSequence);
	var imgMatrix = tempDesc[0];
	var imgWidth = tempDesc[1];
	var imgHeight = tempDesc[2];

  
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

function applyHuffmanCoding(imgMatrixOriginal, imgWidth, imgHeight) {
	
	var numOccurrency = countPixelsHuffman(imgMatrixOriginal, imgWidth, imgHeight);

	var huffmanTree = [];

	// Crio um array com as probabilidades que vao ser usados para construir a "arvore" do codigo de huffman
	for(var [key, value] of numOccurrency)
	{
		var prob = value / (imgWidth * imgHeight * 3); //Como ta juntando rgb tem q multiplicar por 3
		var tempNode = new HuffmanNode(prob);
		tempNode.intensity = key;

		huffmanTree.push(tempNode);
	}

	var seq = [];
	var idCount = 0;
	
	// Percorre a arvore deixando apenas dois elementos no final
	do {
		// Ordena os elementos
		huffmanTree.sort(function(a, b){ return b.prob - a.prob; });

		var ultimo = huffmanTree[huffmanTree.length - 1];
		var penultimo = huffmanTree[huffmanTree.length - 2];

		var newProb = (ultimo.prob * 10 + penultimo.prob * 10) / 10;

		var res = new HuffmanNode(newProb);
		idCount++;
		res.id = idCount;

		huffmanTree.splice(-2, 2);
		huffmanTree.push(res);

		// Adiciona os elementos no array de sequencia para poder voltar o processo no final
		seq.push(ultimo);
		seq.push(penultimo);
		seq.push(res);

	} while(huffmanTree.length > 2);

	// Ordena e inicializa os 2 valores que restaram
	huffmanTree.sort(function(a, b){ return b.prob - a.prob; });
	huffmanTree[huffmanTree.length - 2].code += "0";
	huffmanTree[huffmanTree.length - 1].code += "1";
	
	// Vem reconstruindo a arvore setando os bits de cada probabilidade
	while(seq.length > 0)
	{
		var res = seq[seq.length - 1];
		var penultimo = seq[seq.length - 2];
		var ultimo = seq[seq.length - 3];

		var index = huffmanTree.findIndex(node => node.id === res.id);

		var resAnt = huffmanTree[index];
		huffmanTree.splice(index, 1);

		penultimo.code = resAnt.code + "0";
		ultimo.code = resAnt.code + "1";

		huffmanTree.push(penultimo);
		huffmanTree.push(ultimo);

		seq.splice(-3, 3);
		
	}

	return huffmanTree;
}

function countPixelsHuffman(imgMatrixOriginal, imgWidth, imgHeight) {

	var imgMatrix = JSON.parse(JSON.stringify(imgMatrixOriginal));

	var numOccurrency = new Map();


	for(var linha = 0; linha < imgHeight; linha++)
  {
    for(var coluna = 0; coluna < imgWidth; coluna++)
    {
    	var currentPixel = imgMatrix[linha][coluna];

    	// Insere o elemento se ele nao existe no array
    	if(!(numOccurrency.has(currentPixel.r)))
    	{
    		numOccurrency.set(currentPixel.r, 1);
    	}
    	else
    	{
    		var numTemp = numOccurrency.get(currentPixel.r);
    		numOccurrency.set(currentPixel.r, numTemp + 1);
    	}

    	if(!(numOccurrency.has(currentPixel.g)))
    	{
    		numOccurrency.set(currentPixel.g, 1);
    	}
    	else
    	{
    		var numTemp = numOccurrency.get(currentPixel.g);
    		numOccurrency.set(currentPixel.g, numTemp + 1);
    	}

    	if(!(numOccurrency.has(currentPixel.b)))
    	{
    		numOccurrency.set(currentPixel.b, 1);
    	}
    	else
    	{
    		var numTemp = numOccurrency.get(currentPixel.b);
    		numOccurrency.set(currentPixel.b, numTemp + 1);
    	}

    }
  }

  return numOccurrency;
}

function generateBitsForImage(imgMatrix, imgWidth, imgHeight, huffmanTree) {
	
	var huffmanCodes = new Map();

	// Passa as informacoes da huffmanTree para um Map para facilitar a manipulacao
	for(var i = 0; i < huffmanTree.length; i++)
	{
		var node = huffmanTree[i];
		huffmanCodes.set(node.intensity, node.code);
	}

	var bitSequence = "";

	// Transcreve a matriz da imagem em uma cadeia de bits
	for(var linha = 0; linha < imgHeight; linha++)
  {
    for(var coluna = 0; coluna < imgWidth; coluna++)
    {
    	var currentPixel = imgMatrix[linha][coluna];
      
      bitSequence += huffmanCodes.get(currentPixel.r);
      bitSequence += huffmanCodes.get(currentPixel.g);
      bitSequence += huffmanCodes.get(currentPixel.b);
      
    }
  }

  return bitSequence;
}

function generateBitsForHuffmanTree(huffmanTree, imgWidth, imgHeight) {

	var bitSequenceHuffman = ""; 

	// Salva as dimensoes da imagem
	bitSequenceHuffman += ("00000000000000000" + Number(imgWidth).toString(2) ).substr(-16).toString();
	bitSequenceHuffman += ("00000000000000000" + Number(imgHeight).toString(2) ).substr(-16).toString();


	// Salva a quantidade de intensidades diferentes
	var lengthTemp = huffmanTree.length.toString(2);

	while(lengthTemp.length < 8)
	{
		lengthTemp = "0" + lengthTemp;
	}

	bitSequenceHuffman += lengthTemp;

	for(var i = 0; i < huffmanTree.length; i++)
	{
		//Adiciono a intensidade com o bit de sinal
		var intensityTemp = huffmanTree[i].intensity;

		if(intensityTemp < 0)
		{
			bitSequenceHuffman += 1;
			intensityTemp = intensityTemp * (-1);
		}
		else
		{
			bitSequenceHuffman += 0;
		}

		var intensityBits = intensityTemp.toString(2);

		while(intensityBits.length < 8)
		{
			intensityBits = "0" + intensityBits;
		}

		bitSequenceHuffman += intensityBits;


		// Adiciono o tamanho do codigo da intensidade
		var sizeCode = huffmanTree[i].code.length.toString(2);

		while(sizeCode.length < 8)
		{
			sizeCode = "0" + sizeCode;
		}

		bitSequenceHuffman += sizeCode;


		// Adiciono o codigo da intensidade
		bitSequenceHuffman += huffmanTree[i].code;

	}

	return bitSequenceHuffman;
}

function descompressBitSequence(bitSequence) {
	
	var temp = extractHuffmanTree(bitSequence);
	var huffmanTree = temp[0];
	var bitSequence = temp[1]
	var imgWidth = temp[2];
	var imgHeight = temp[3];

	var pixelsArray = extractBitsImage(huffmanTree, bitSequence, imgWidth, imgHeight);
	var imgData = [];
	imgData.data = pixelsArray;

	var imgMatrix = parseToImageMatrix(imgData, imgWidth, imgHeight);

	return [imgMatrix, imgWidth, imgHeight];
}

function extractHuffmanTree(bitSequence) {
	
	// Pega a dimensao da imagem
	var imgWidth = parseInt(bitSequence.substr(0, 16) , 2);
	bitSequence = bitSequence.substr(16);

	var imgHeight = parseInt(bitSequence.substr(0, 16) , 2);
	bitSequence = bitSequence.substr(16);

	// Pega a quantidade de intensidades diferentes na imagem
	var numIntensity = parseInt(bitSequence.substr(0, 8) , 2);
	bitSequence = bitSequence.substr(8);

	// Monta a huffman tree
	var huffmanTree = new Map();

	for(var i = 0; i < numIntensity; i++)
	{
		// Pega o bit de sinal
		var bitSinal = bitSequence.substr(0, 1);
		bitSequence = bitSequence.substr(1);

		// Pega a intensidade
		var intensity = parseInt(bitSequence.substr(0, 8) , 2);
		bitSequence = bitSequence.substr(8);

		if(bitSinal == "1")
		{
			intensity = intensity * (-1);
		}

		// Pega o tamanho do codigo
		var sizeCode = parseInt(bitSequence.substr(0, 8) , 2);
		bitSequence = bitSequence.substr(8);

		// Pega o codigo
		var code = bitSequence.substr(0, sizeCode);
		bitSequence = bitSequence.substr(sizeCode);

		huffmanTree.set(code, intensity);
	}

	
	return [huffmanTree, bitSequence, imgWidth, imgHeight];
}

function extractBitsImage(huffmanTree, bitSequence, imgWidth, imgHeight) {

	var pixelsArray = [];

	var countAlpha = 0;
	
	while(bitSequence.length > 0)
	{
		var complete = false;

		for(var i = 1; complete == false; i++)
		{
			var bitsTemp = bitSequence.substr(0, i);
			
			if(huffmanTree.has(bitsTemp))
			{
				pixelsArray.push(huffmanTree.get(bitsTemp));
				bitSequence = bitSequence.substr(i);

				complete = true;
			}

		}

		// Insere o alfa a cada 3 intensidades
		countAlpha++;
		if(countAlpha % 3 == 0)
		{
			pixelsArray.push(255);
		}
		
	}

	return pixelsArray;
}

