var subImageMatrix;

function loadSubImage(input) {

	var img = document.getElementById("secondaryImage");

  //Poe a imagem do input file no elemento img do html
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    reader.onload = function (e) {
      img.src = e.target.result;
    };

    reader.onloadend = function (e) {
      loadCanvasImgSub(img);
    }

    reader.readAsDataURL(input.files[0]);
  }
}

function loadCanvasImgSub(img) {
	
  //setImageDimension(img);
  setSecondaryImageDimension(img);

  //Desenha a imagem no canvas
  ctx2.drawImage(img, 0, 0, imgWidth, imgHeight);
  
  //Estraindo a informação dos pixels da imagem q ja esta no canvas
  //Nao necessariamente precisa ser uma imagem, a funcao pega os pixels do q ta no canvas
  var imgData = ctx2.getImageData(0, 0, imgWidth, imgHeight);
  //console.log(imgData);

  subImageMatrix = parseToImageMatrix(imgData, imgWidth, imgHeight);

}

function setSecondaryImageDimension(img) {
	
	img.style.width = imgWidth + "px";
  img.style.height = imgHeight + "px";

  //Seta a largura e altura do canvas para serem iguais a da imagem exibida
  c2.width = imgWidth;
  c2.height = imgHeight;
}

function setImageSubtraction(){

  // Limpa o container de parametros e tira os icones de parametros
  setParamsIcon(-1);

  // Limpa o background dos filtros anteriores
  setFilterButtonBackground(-1);
  
  // Calcula a nova matriz e aplica o filtro
  var newMatrix = applyImageSubtractionMatrix(currentMatrix, subImageMatrix, imgWidth, imgHeight);
  currentMatrix = newMatrix;

  var newImgData = parseToImageData(newMatrix, imgWidth, imgHeight);

  ctx.putImageData(newImgData, 0, 0);
  setHistogram();
}

function applyImageSubtractionMatrix(imgMatrixOriginal, subImageMatrix, imgWidth, imgHeight) {
	//Copia o valor da matriz para nao modificar a original
  var imgMatrix = JSON.parse(JSON.stringify(imgMatrixOriginal));
  //console.log(imgMatrix);

  for(var linha = 0; linha < imgHeight; linha++)
  {
    for(var coluna = 0; coluna < imgWidth; coluna++)
    {
      var currentPixel = imgMatrix[linha][coluna];
      var currentPixelSecImg = subImageMatrix[linha][coluna];
      //console.log("loop-> linha: " + linha + " , coluna: " + coluna);
      currentPixel.r = (currentPixel.r - currentPixelSecImg.r + 255) / 2;
      currentPixel.g = (currentPixel.g - currentPixelSecImg.g + 255) / 2;
      currentPixel.b = (currentPixel.b - currentPixelSecImg.b + 255) / 2;
     
    }
  }

  return imgMatrix;
}