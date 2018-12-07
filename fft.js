function icfft(amplitudes){
	var N = amplitudes.length;
	var iN = 1 / N;
 
	for(var i = 0 ; i < N; ++i)
		if(amplitudes[i] instanceof Complex)
			amplitudes[i].im = -amplitudes[i].im;
 
	// aplica a transformada
	amplitudes = cfft(amplitudes)
 
	for(var i = 0 ; i < N; ++i)
	{
		
		amplitudes[i].im = -amplitudes[i].im;
		
		amplitudes[i].re *= iN;
		amplitudes[i].im *= iN;
	}
	return amplitudes;
}
 
function cfft(amplitudes){

	var N = amplitudes.length;
	if( N <= 1 )
		return amplitudes;
 
	var hN = N / 2;
	var even = [];
	var odd = [];
	even.length = hN;
	odd.length = hN;
	for(var i = 0; i < hN; ++i)
	{
		even[i] = amplitudes[i*2];
		odd[i] = amplitudes[i*2+1];
	}
	even = cfft(even);
	odd = cfft(odd);
 
	var a = -2*Math.PI;
	for(var k = 0; k < hN; ++k)
	{
		if(!(even[k] instanceof Complex))
			even[k] = new Complex(even[k], 0);
		if(!(odd[k] instanceof Complex))
			odd[k] = new Complex(odd[k], 0);
		var p = k/N;
		var t = new Complex(0, a * p);
		t.cexp(t).mul(odd[k], t);
		amplitudes[k] = even[k].add(t, odd[k]);
		amplitudes[k + hN] = even[k].sub(t, even[k]);
	}
	return amplitudes;
}

function espToFreq() {

	var imgMatrix = JSON.parse(JSON.stringify(imgMatrixOriginal));
	

	// Cria uma matriz com apenas valores numericos invez de pixels	
	matrizNum = [];
	
	for(var coluna = 0; coluna < imgWidth; coluna++)
	{
		var colunaTemp = [];

		for(var linha = 0; linha < imgHeight; linha++)
		{
			colunaTemp.push(imgMatrix[linha][coluna].r);
		}

		matrizNum.push(colunaTemp);
	}
	

	// Aplica o fft em uma linha por vez da matriz
	for(var i = 0; i < imgHeight; i++)
	{
		matrizNum[i] = cfft(matrizNum[i]);
	}
	
	
	// Faz a transposta da matriz
	matrizNum = transposeArray(matrizNum, imgWidth);
	
	// Aplica o fft em uma linha por vez da matriz transposta que agora significa q eram colunas
	for(var i = 0; i < imgHeight; i++)
	{
		matrizNum[i] = cfft(matrizNum[i]);
	}

	fourierMatrix = matrizNum;
	
	// Transpoe de novo para voltar ao normal
	matrizNum = transposeArray(matrizNum, imgWidth);


	//Poe os pixels do array dentro de uma matriz equivalente a imagem
  var imgMatrix = [];
  i = 0;
  for(var linha = 0; linha < imgHeight; linha++)
  {
    var lineTemp = [];
    for(var coluna = 0; coluna < imgWidth; coluna++)
    {
    	var temp = matrizNum[linha][coluna];
    	var mag = Math.sqrt( (temp.re*temp.re) + (temp.im*temp.im) );
    	var phase = Math.atan(temp.im/temp.re);

      lineTemp.push(new Pixel(temp.re, temp.re, temp.re, 255));
      i++;
    }

    //Insere a linha de pixels na matriz
    imgMatrix.push(lineTemp);
  }

  // Plota a imagem na tela
  currentMatrix = imgMatrix;

  var newImgData = parseToImageData(imgMatrix, imgWidth, imgHeight);

  ctx.putImageData(newImgData, 0, 0);
  setHistogram();
}

function transposeArray(array, arrayLength){
    var newArray = [];
    for(var i = 0; i < array.length; i++){
        newArray.push([]);
    };

    for(var i = 0; i < array.length; i++){
        for(var j = 0; j < arrayLength; j++){
            newArray[j].push(array[i][j]);
        };
    };

    return newArray;
}

function freqToEsp() {

	var matrizNum = fourierMatrix;

	// Transpoe de novo para voltar ao normal
	matrizNum = transposeArray(matrizNum, imgWidth);

	// Aplica o fft em uma linha por vez da matriz
	for(var i = 0; i < imgHeight; i++)
	{
		matrizNum[i] = icfft(matrizNum[i]);
	}

	// Transpoe de novo para voltar ao normal
	matrizNum = transposeArray(matrizNum, imgWidth);

	// Aplica o fft em uma linha por vez da matriz
	for(var i = 0; i < imgHeight; i++)
	{
		matrizNum[i] = icfft(matrizNum[i]);
	}

	
	//Poe os pixels do array dentro de uma matriz equivalente a imagem
  var imgMatrix = [];
  i = 0;
  for(var linha = 0; linha < imgHeight; linha++)
  {
    var lineTemp = [];
    for(var coluna = 0; coluna < imgWidth; coluna++)
    {
    	var temp = matrizNum[linha][coluna];
    	var mag = Math.sqrt( (temp.re*temp.re) + (temp.im*temp.im) );
    	var phase = Math.atan(temp.im/temp.re);

      lineTemp.push(new Pixel(mag, mag, mag, 255));
      i++;
    }

    //Insere a linha de pixels na matriz
    imgMatrix.push(lineTemp);
  }

  // Plota a imagem na tela
  currentMatrix = imgMatrix;

  var newImgData = parseToImageData(imgMatrix, imgWidth, imgHeight);

  ctx.putImageData(newImgData, 0, 0);
  setHistogram();
}