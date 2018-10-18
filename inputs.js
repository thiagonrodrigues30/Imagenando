function configBrightnessInputs() {
  // Exibe o icone de filtro no filtro que esta com os parametros sendo exbidos
  setParamsIcon("log-icon");
  
  var inputsContainer = document.getElementById("inputs-container");

  // Cria o elemento p de label do input intensidade
  var pItensidade = document.createElement("p");
  pItensidade.classList.add("params-text");
  pItensidade.id = "intensidade-text-brightness";
  pItensidade.textContent = "Brilho: 0";

  // Cria o range para input da intensidade
  var inputIntensidade = document.createElement("input");
  inputIntensidade.type = "range";
  inputIntensidade.classList.add("slider");
  inputIntensidade.min = "0";
  inputIntensidade.max = "100";
  inputIntensidade.value = "0";
  inputIntensidade.id = "intensidade-brightness";

  inputIntensidade.oninput = function() {
    pItensidade.textContent = "Brilho: " + this.value;
  }

  // Cria o botão que ativa o preview do filtro
  var btnLogPreview = document.createElement("input");
  btnLogPreview.type = "button";
  btnLogPreview.classList.add("btn")
  btnLogPreview.classList.add("btn-default");
  btnLogPreview.value = "Preview";

  btnLogPreview.onclick = function () {
    setBrightnessFilter();
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

function configThresholdInputs() {
  // Exibe o icone de filtro no filtro que esta com os parametros sendo exbidos
  setParamsIcon("threshold-icon");
  
  var inputsContainer = document.getElementById("inputs-container");

  // Cria o elemento p de label do input intensidade
  var pItensidade = document.createElement("p");
  pItensidade.classList.add("params-text");
  pItensidade.id = "intensidade-text-threshold";
  pItensidade.textContent = "Intensidade: 0";

  // Cria o range para input da intensidade
  var inputIntensidade = document.createElement("input");
  inputIntensidade.type = "range";
  inputIntensidade.classList.add("slider");
  inputIntensidade.min = "0";
  inputIntensidade.max = "255";
  inputIntensidade.value = "0";
  inputIntensidade.id = "intensidade-threshold";

  inputIntensidade.oninput = function() {
    pItensidade.textContent = "Intensidade: " + this.value;
  }

  // Cria o botão que ativa o preview do filtro
  var btnThresholdPreview = document.createElement("input");
  btnThresholdPreview.type = "button";
  btnThresholdPreview.classList.add("btn")
  btnThresholdPreview.classList.add("btn-default");
  btnThresholdPreview.value = "Preview";

  btnThresholdPreview.onclick = function () {
    setThresholdFilter();
  }


  // Insere os elementos criados no container dos inputs
  inputsContainer.appendChild(pItensidade);
  inputsContainer.appendChild(inputIntensidade);
  inputsContainer.appendChild(document.createElement("br"));
  inputsContainer.appendChild(document.createElement("br"));

  var center = document.createElement("center");
  center.appendChild(btnThresholdPreview);

  inputsContainer.appendChild(center);
  
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

function configConvolutionMatrixInputs(applyFilterFun, iconId) {
  setParamsIcon(iconId);
  
  var inputsContainer = document.getElementById("inputs-container");

  // Cria os inputs para as coordenadas da linha 1
  var inputP1V = document.createElement("input");
  inputP1V.type = "number";
  inputP1V.classList.add("convolution-inputs");
  inputP1V.step = "1";
  inputP1V.value = "0";
  inputP1V.id = "point1-v-convolution";

  var inputP1W = document.createElement("input");
  inputP1W.type = "number";
  inputP1W.classList.add("convolution-inputs");
  inputP1W.step = "1";
  inputP1W.value = "0";
  inputP1W.id = "point1-w-convolution";

  var inputP1X = document.createElement("input");
  inputP1X.type = "number";
  inputP1X.classList.add("convolution-inputs");
  inputP1X.step = "1";
  inputP1X.value = "0";
  inputP1X.id = "point1-x-convolution";

  var inputP1Y = document.createElement("input");
  inputP1Y.type = "number";
  inputP1Y.classList.add("convolution-inputs");
  inputP1Y.step = "1";
  inputP1Y.value = "0";
  inputP1Y.id = "point1-y-convolution";

  var inputP1Z = document.createElement("input");
  inputP1Z.type = "number";
  inputP1Z.classList.add("convolution-inputs");
  inputP1Z.step = "1";
  inputP1Z.value = "0";
  inputP1Z.id = "point1-z-convolution";

  var divInputsP1 = document.createElement("div");
  divInputsP1.classList.add("convolution-inputs-div");

  inputsContainer.appendChild(divInputsP1);

  // Insere os elementos na div dos inputs
  divInputsP1.appendChild(inputP1V);
  divInputsP1.appendChild(inputP1W);
  divInputsP1.appendChild(inputP1X);
  divInputsP1.appendChild(inputP1Y);
  divInputsP1.appendChild(inputP1Z);

  // Cria os inputs para as coordenadas da linha 2
  var inputP2V = document.createElement("input");
  inputP2V.type = "number";
  inputP2V.classList.add("convolution-inputs");
  inputP2V.step = "1";
  inputP2V.value = "0";
  inputP2V.id = "point2-v-convolution";

  var inputP2W = document.createElement("input");
  inputP2W.type = "number";
  inputP2W.classList.add("convolution-inputs");
  inputP2W.step = "1";
  inputP2W.value = "0";
  inputP2W.id = "point2-w-convolution";

  var inputP2X = document.createElement("input");
  inputP2X.type = "number";
  inputP2X.classList.add("convolution-inputs");
  inputP2X.step = "1";
  inputP2X.value = "0";
  inputP2X.id = "point2-x-convolution";

  var inputP2Y = document.createElement("input");
  inputP2Y.type = "number";
  inputP2Y.classList.add("convolution-inputs");
  inputP2Y.step = "1";
  inputP2Y.value = "0";
  inputP2Y.id = "point2-y-convolution";

  var inputP2Z = document.createElement("input");
  inputP2Z.type = "number";
  inputP2Z.classList.add("convolution-inputs");
  inputP2Z.step = "1";
  inputP2Z.value = "0";
  inputP2Z.id = "point2-z-convolution";

  var divInputsP2 = document.createElement("div");
  divInputsP2.classList.add("convolution-inputs-div");

  inputsContainer.appendChild(divInputsP2);

  // Insere os elementos na div dos inputs
  divInputsP2.appendChild(inputP2V);
  divInputsP2.appendChild(inputP2W);
  divInputsP2.appendChild(inputP2X);
  divInputsP2.appendChild(inputP2Y);
  divInputsP2.appendChild(inputP2Z);

  // Cria os inputs para as coordenadas da linha 3
  var inputP3V = document.createElement("input");
  inputP3V.type = "number";
  inputP3V.classList.add("convolution-inputs");
  inputP3V.step = "1";
  inputP3V.value = "0";
  inputP3V.id = "point3-v-convolution";

  var inputP3W = document.createElement("input");
  inputP3W.type = "number";
  inputP3W.classList.add("convolution-inputs");
  inputP3W.step = "1";
  inputP3W.value = "0";
  inputP3W.id = "point3-w-convolution";

  var inputP3X = document.createElement("input");
  inputP3X.type = "number";
  inputP3X.classList.add("convolution-inputs");
  inputP3X.step = "1";
  inputP3X.value = "0";
  inputP3X.id = "point3-x-convolution";

  var inputP3Y = document.createElement("input");
  inputP3Y.type = "number";
  inputP3Y.classList.add("convolution-inputs");
  inputP3Y.step = "1";
  inputP3Y.value = "0";
  inputP3Y.id = "point3-y-convolution";

  var inputP3Z = document.createElement("input");
  inputP3Z.type = "number";
  inputP3Z.classList.add("convolution-inputs");
  inputP3Z.step = "1";
  inputP3Z.value = "0";
  inputP3Z.id = "point3-z-convolution";

  var divInputsP3 = document.createElement("div");
  divInputsP3.classList.add("convolution-inputs-div");

  inputsContainer.appendChild(divInputsP3);

  // Insere os elementos na div dos inputs
  divInputsP3.appendChild(inputP3V);
  divInputsP3.appendChild(inputP3W);
  divInputsP3.appendChild(inputP3X);
  divInputsP3.appendChild(inputP3Y);
  divInputsP3.appendChild(inputP3Z);

  // Cria os inputs para as coordenadas da linha 4
  var inputP4V = document.createElement("input");
  inputP4V.type = "number";
  inputP4V.classList.add("convolution-inputs");
  inputP4V.step = "1";
  inputP4V.value = "0";
  inputP4V.id = "point4-v-convolution";

  var inputP4W = document.createElement("input");
  inputP4W.type = "number";
  inputP4W.classList.add("convolution-inputs");
  inputP4W.step = "1";
  inputP4W.value = "0";
  inputP4W.id = "point4-w-convolution";

  var inputP4X = document.createElement("input");
  inputP4X.type = "number";
  inputP4X.classList.add("convolution-inputs");
  inputP4X.step = "1";
  inputP4X.value = "0";
  inputP4X.id = "point4-x-convolution";

  var inputP4Y = document.createElement("input");
  inputP4Y.type = "number";
  inputP4Y.classList.add("convolution-inputs");
  inputP4Y.step = "1";
  inputP4Y.value = "0";
  inputP4Y.id = "point4-y-convolution";

  var inputP4Z = document.createElement("input");
  inputP4Z.type = "number";
  inputP4Z.classList.add("convolution-inputs");
  inputP4Z.step = "1";
  inputP4Z.value = "0";
  inputP4Z.id = "point4-z-convolution";

  var divInputsP4 = document.createElement("div");
  divInputsP4.classList.add("convolution-inputs-div");

  inputsContainer.appendChild(divInputsP4);

  // Insere os elementos na div dos inputs
  divInputsP4.appendChild(inputP4V);
  divInputsP4.appendChild(inputP4W);
  divInputsP4.appendChild(inputP4X);
  divInputsP4.appendChild(inputP4Y);
  divInputsP4.appendChild(inputP4Z);

  // Cria os inputs para as coordenadas da linha 5
  var inputP5V = document.createElement("input");
  inputP5V.type = "number";
  inputP5V.classList.add("convolution-inputs");
  inputP5V.step = "1";
  inputP5V.value = "0";
  inputP5V.id = "point5-v-convolution";

  var inputP5W = document.createElement("input");
  inputP5W.type = "number";
  inputP5W.classList.add("convolution-inputs");
  inputP5W.step = "1";
  inputP5W.value = "0";
  inputP5W.id = "point5-w-convolution";

  var inputP5X = document.createElement("input");
  inputP5X.type = "number";
  inputP5X.classList.add("convolution-inputs");
  inputP5X.step = "1";
  inputP5X.value = "0";
  inputP5X.id = "point5-x-convolution";

  var inputP5Y = document.createElement("input");
  inputP5Y.type = "number";
  inputP5Y.classList.add("convolution-inputs");
  inputP5Y.step = "1";
  inputP5Y.value = "0";
  inputP5Y.id = "point5-y-convolution";

  var inputP5Z = document.createElement("input");
  inputP5Z.type = "number";
  inputP5Z.classList.add("convolution-inputs");
  inputP5Z.step = "1";
  inputP5Z.value = "0";
  inputP5Z.id = "point5-z-convolution";

  var divInputsP5 = document.createElement("div");
  divInputsP5.classList.add("convolution-inputs-div");

  inputsContainer.appendChild(divInputsP5);

  // Insere os elementos na div dos inputs
  divInputsP5.appendChild(inputP5V);
  divInputsP5.appendChild(inputP5W);
  divInputsP5.appendChild(inputP5X);
  divInputsP5.appendChild(inputP5Y);
  divInputsP5.appendChild(inputP5Z);

  // Cria o botão que ativa o preview do filtro
  var btnLogPreview = document.createElement("input");
  btnLogPreview.type = "button";
  btnLogPreview.classList.add("btn")
  btnLogPreview.classList.add("btn-default");
  btnLogPreview.style.marginTop='10px';
  btnLogPreview.value = "Preview";

  btnLogPreview.onclick = function () {
    applyFilterFun();
  }

  var center = document.createElement("center");
  center.appendChild(btnLogPreview);

  inputsContainer.appendChild(center);
  inputsContainer.appendChild(document.createElement("br"));

}

function configMedianMatrixInputs() {

  // Exibe o icone de filtro no filtro que esta com os parametros sendo exbidos
  setParamsIcon("median-icon");
  
  var inputsContainer = document.getElementById("inputs-container");

  // Cria o elemento p de label do input intensidade
  var pItensidade = document.createElement("p");
  pItensidade.classList.add("params-text");
  pItensidade.id = "vizinhanca-text-median";
  pItensidade.textContent = "Tamanho da Vizinhança: 3";

  // Cria o range para input da intensidade
  var inputIntensidade = document.createElement("input");
  inputIntensidade.type = "range";
  inputIntensidade.classList.add("slider");
  inputIntensidade.min = "3";
  inputIntensidade.max = "25";
  inputIntensidade.value = "3";
  inputIntensidade.step = "2";
  inputIntensidade.id = "vizinhanca-median";

  inputIntensidade.oninput = function() {
    pItensidade.textContent = "Tamanho da Vizinhança: " + this.value;
  }

  // Cria o botão que ativa o preview do filtro
  var btnLogPreview = document.createElement("input");
  btnLogPreview.type = "button";
  btnLogPreview.classList.add("btn")
  btnLogPreview.classList.add("btn-default");
  btnLogPreview.value = "Preview";

  btnLogPreview.onclick = function () {
    setMedianFilter();
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

function configGeometricMeanInputs() {

  // Exibe o icone de filtro no filtro que esta com os parametros sendo exbidos
  setParamsIcon("geometric-mean-icon");
  
  var inputsContainer = document.getElementById("inputs-container");

  // Cria o elemento p de label do input intensidade
  var pItensidade = document.createElement("p");
  pItensidade.classList.add("params-text");
  pItensidade.id = "vizinhanca-text-geometric-mean";
  pItensidade.textContent = "Tamanho da Vizinhança: 3";

  // Cria o range para input da intensidade
  var inputIntensidade = document.createElement("input");
  inputIntensidade.type = "range";
  inputIntensidade.classList.add("slider");
  inputIntensidade.min = "3";
  inputIntensidade.max = "25";
  inputIntensidade.value = "3";
  inputIntensidade.step = "2";
  inputIntensidade.id = "vizinhanca-geometric-mean";

  inputIntensidade.oninput = function() {
    pItensidade.textContent = "Tamanho da Vizinhança: " + this.value;
  }

  // Cria o botão que ativa o preview do filtro
  var btnLogPreview = document.createElement("input");
  btnLogPreview.type = "button";
  btnLogPreview.classList.add("btn")
  btnLogPreview.classList.add("btn-default");
  btnLogPreview.value = "Preview";

  btnLogPreview.onclick = function () {
    setGeometricMeanFilter();
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

function configHarmonicMeanInputs() {

  // Exibe o icone de filtro no filtro que esta com os parametros sendo exbidos
  setParamsIcon("harmonic-mean-icon");
  
  var inputsContainer = document.getElementById("inputs-container");

  // Cria o elemento p de label do input intensidade
  var pItensidade = document.createElement("p");
  pItensidade.classList.add("params-text");
  pItensidade.id = "vizinhanca-text-harmonic-mean";
  pItensidade.textContent = "Tamanho da Vizinhança: 3";

  // Cria o range para input da intensidade
  var inputIntensidade = document.createElement("input");
  inputIntensidade.type = "range";
  inputIntensidade.classList.add("slider");
  inputIntensidade.min = "3";
  inputIntensidade.max = "25";
  inputIntensidade.value = "3";
  inputIntensidade.step = "2";
  inputIntensidade.id = "vizinhanca-harmonic-mean";

  inputIntensidade.oninput = function() {
    pItensidade.textContent = "Tamanho da Vizinhança: " + this.value;
  }

  // Cria o botão que ativa o preview do filtro
  var btnLogPreview = document.createElement("input");
  btnLogPreview.type = "button";
  btnLogPreview.classList.add("btn")
  btnLogPreview.classList.add("btn-default");
  btnLogPreview.value = "Preview";

  btnLogPreview.onclick = function () {
    setHarmonicMeanFilter();
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

function configCounterHarmonicMeanInputs() {

  // Exibe o icone de filtro no filtro que esta com os parametros sendo exbidos
  setParamsIcon("counter-harmonic-mean-icon");
  
  var inputsContainer = document.getElementById("inputs-container");

  // Cria o elemento p de label do input intensidade
  var pItensidade = document.createElement("p");
  pItensidade.classList.add("params-text");
  pItensidade.id = "vizinhanca-text-counter-harmonic-mean";
  pItensidade.textContent = "Tamanho da Vizinhança: 3";

  // Cria o range para input da intensidade
  var inputIntensidade = document.createElement("input");
  inputIntensidade.type = "range";
  inputIntensidade.classList.add("slider");
  inputIntensidade.min = "3";
  inputIntensidade.max = "25";
  inputIntensidade.value = "3";
  inputIntensidade.step = "2";
  inputIntensidade.id = "vizinhanca-counter-harmonic-mean";

  inputIntensidade.oninput = function() {
    pItensidade.textContent = "Tamanho da Vizinhança: " + this.value;
  }

  // Cria o elemento p de label do input intensidade
  var pPotencia = document.createElement("p");
  pPotencia.classList.add("params-text");
  pPotencia.id = "potencia-text-counter-harmonic-mean";
  pPotencia.textContent = "Expoente da Potência: 0";

  // Cria o range para input da intensidade
  var inputPotencia = document.createElement("input");
  inputPotencia.type = "range";
  inputPotencia.classList.add("slider");
  inputPotencia.min = "0";
  inputPotencia.value = "0";
  inputPotencia.step = "1";
  inputPotencia.id = "potencia-counter-harmonic-mean";

  inputPotencia.oninput = function() {
    pPotencia.textContent = "Expoente da Potência: " + this.value;
  }

  // Cria o botão que ativa o preview do filtro
  var btnLogPreview = document.createElement("input");
  btnLogPreview.type = "button";
  btnLogPreview.classList.add("btn")
  btnLogPreview.classList.add("btn-default");
  btnLogPreview.value = "Preview";

  btnLogPreview.onclick = function () {
    setCounterHarmonicMeanFilter();
  }


  // Insere os elementos criados no container dos inputs
  inputsContainer.appendChild(pItensidade);
  inputsContainer.appendChild(inputIntensidade);
  inputsContainer.appendChild(document.createElement("br"));
  inputsContainer.appendChild(pPotencia);
  inputsContainer.appendChild(inputPotencia);
  inputsContainer.appendChild(document.createElement("br"));
  inputsContainer.appendChild(document.createElement("br"));

  var center = document.createElement("center");
  center.appendChild(btnLogPreview);

  inputsContainer.appendChild(center);
}

function configMaximumInputs() {

  // Exibe o icone de filtro no filtro que esta com os parametros sendo exbidos
  setParamsIcon("maximum-icon");
  
  var inputsContainer = document.getElementById("inputs-container");

  // Cria o elemento p de label do input intensidade
  var pItensidade = document.createElement("p");
  pItensidade.classList.add("params-text");
  pItensidade.id = "vizinhanca-text-maximum";
  pItensidade.textContent = "Tamanho da Vizinhança: 3";

  // Cria o range para input da intensidade
  var inputIntensidade = document.createElement("input");
  inputIntensidade.type = "range";
  inputIntensidade.classList.add("slider");
  inputIntensidade.min = "3";
  inputIntensidade.max = "25";
  inputIntensidade.value = "3";
  inputIntensidade.step = "2";
  inputIntensidade.id = "vizinhanca-maximum";

  inputIntensidade.oninput = function() {
    pItensidade.textContent = "Tamanho da Vizinhança: " + this.value;
  }

  // Cria o botão que ativa o preview do filtro
  var btnLogPreview = document.createElement("input");
  btnLogPreview.type = "button";
  btnLogPreview.classList.add("btn")
  btnLogPreview.classList.add("btn-default");
  btnLogPreview.value = "Preview";

  btnLogPreview.onclick = function () {
    setMaximumFilter();
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

function configMinimumInputs() {

  // Exibe o icone de filtro no filtro que esta com os parametros sendo exbidos
  setParamsIcon("minimum-icon");
  
  var inputsContainer = document.getElementById("inputs-container");

  // Cria o elemento p de label do input intensidade
  var pItensidade = document.createElement("p");
  pItensidade.classList.add("params-text");
  pItensidade.id = "vizinhanca-text-minimum";
  pItensidade.textContent = "Tamanho da Vizinhança: 3";

  // Cria o range para input da intensidade
  var inputIntensidade = document.createElement("input");
  inputIntensidade.type = "range";
  inputIntensidade.classList.add("slider");
  inputIntensidade.min = "3";
  inputIntensidade.max = "25";
  inputIntensidade.value = "3";
  inputIntensidade.step = "2";
  inputIntensidade.id = "vizinhanca-minimum";

  inputIntensidade.oninput = function() {
    pItensidade.textContent = "Tamanho da Vizinhança: " + this.value;
  }

  // Cria o botão que ativa o preview do filtro
  var btnLogPreview = document.createElement("input");
  btnLogPreview.type = "button";
  btnLogPreview.classList.add("btn")
  btnLogPreview.classList.add("btn-default");
  btnLogPreview.value = "Preview";

  btnLogPreview.onclick = function () {
    setMinimumFilter();
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

function configMidpointInputs() {

  // Exibe o icone de filtro no filtro que esta com os parametros sendo exbidos
  setParamsIcon("midpoint-icon");
  
  var inputsContainer = document.getElementById("inputs-container");

  // Cria o elemento p de label do input intensidade
  var pItensidade = document.createElement("p");
  pItensidade.classList.add("params-text");
  pItensidade.id = "vizinhanca-text-midpoint";
  pItensidade.textContent = "Tamanho da Vizinhança: 3";

  // Cria o range para input da intensidade
  var inputIntensidade = document.createElement("input");
  inputIntensidade.type = "range";
  inputIntensidade.classList.add("slider");
  inputIntensidade.min = "3";
  inputIntensidade.max = "25";
  inputIntensidade.value = "3";
  inputIntensidade.step = "2";
  inputIntensidade.id = "vizinhanca-midpoint";

  inputIntensidade.oninput = function() {
    pItensidade.textContent = "Tamanho da Vizinhança: " + this.value;
  }

  // Cria o botão que ativa o preview do filtro
  var btnLogPreview = document.createElement("input");
  btnLogPreview.type = "button";
  btnLogPreview.classList.add("btn")
  btnLogPreview.classList.add("btn-default");
  btnLogPreview.value = "Preview";

  btnLogPreview.onclick = function () {
    setMidpointFilter();
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
