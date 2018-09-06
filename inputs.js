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