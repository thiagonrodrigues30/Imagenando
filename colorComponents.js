function colorComponent(component) {
  if(component == "RGB")
  {
    var r = Number(document.getElementById("slider-r").value);
    var g = Number(document.getElementById("slider-g").value);
    var b = Number(document.getElementById("slider-b").value);

    document.getElementById("color-r").textContent = "Red: " + r;
    document.getElementById("color-g").textContent = "Green: " + g;
    document.getElementById("color-b").textContent = "Blue: " + b;

    document.getElementById("show-color").style.backgroundColor = "rgb(" + r + ", " + g + ", " + b + ")";

    convertRGBtoCMY(r, g, b);
    convertRGBtoHSI(r, g, b);
  }
  else if(component == "CMY")
  {
    var c = Number(document.getElementById("slider-c").value);
    var m = Number(document.getElementById("slider-m").value);
    var y = Number(document.getElementById("slider-y").value);

    document.getElementById("color-c").textContent = "Cyan: " + c;
    document.getElementById("color-m").textContent = "Magenta: " + m;
    document.getElementById("color-y").textContent = "Yellow: " + y;

    convertCMYtoRGB(c, m, y);
    convertCMYtoHSI(c, m, y);
  }
  else if(component == "HSI")
  {
    var h = Number(document.getElementById("slider-h").value);
    var s = Number(document.getElementById("slider-s").value);
    var i = Number(document.getElementById("slider-i").value);

    document.getElementById("color-h").textContent = "Hue: " + h + "°";
    document.getElementById("color-s").textContent = "Saturation: " + s;
    document.getElementById("color-i").textContent = "Intensity: " + i;

    convertHSItoRGB(h, s, i);
    convertHSItoCMY(h, s, i);
  }
}

function convertRGBtoCMY(r, g, b) {
  var c = 255 - r; 
  var m = 255 - g;
  var y = 255 - b;

  // Seta o valor nos sliders CMY
  document.getElementById("slider-c").value = c;
  document.getElementById("color-c").textContent = "Cyan: " + c;

  document.getElementById("slider-m").value = m;
  document.getElementById("color-m").textContent = "Magenta: " + m;

  document.getElementById("slider-y").value = y;
  document.getElementById("color-y").textContent = "Yellow: " + y;

}

function convertCMYtoRGB(c, m, y) {
  var r = 255 - c; 
  var g = 255 - m;
  var b = 255 - y;

  // Seta o valor nos sliders RGB
  document.getElementById("slider-r").value = r;
  document.getElementById("color-r").textContent = "Red: " + r;

  document.getElementById("slider-g").value = g;
  document.getElementById("color-g").textContent = "Green: " + g;

  document.getElementById("slider-b").value = b;
  document.getElementById("color-b").textContent = "Blue: " + b;

  document.getElementById("show-color").style.backgroundColor = "rgb(" + r + ", " + g + ", " + b + ")";
}

function convertRGBtoHSI(r, g, b) {
  // Normalizando valores
  rNorm = r / (r + g + b);
  gNorm = g / (r + g + b);
  bNorm = b / (r + g + b);

  // Convertendo o H
  if(b <= g)
  {
    var parte1 = (0.5 * ( (rNorm - gNorm) + (rNorm - bNorm) ) );
    var parte2 = Math.sqrt( ((rNorm - gNorm)**2) + (rNorm - bNorm)*(gNorm - bNorm) );
    var h = Math.acos( parte1 / parte2 );
  }
  else
  {
    var parte1 = (0.5 * ( (rNorm - gNorm) + (rNorm - bNorm) ) );
    var parte2 = Math.sqrt( ((rNorm - gNorm)**2) + (rNorm - bNorm)*(gNorm - bNorm) );
    var h = (2*Math.PI) - Math.acos( parte1 / parte2 );
  }

  var s = 1 - (3 * Math.min(rNorm, gNorm, bNorm));
  var i = (r + g + b) / (3 * 255);

  // Mudando o range dos valores HSI
  h = Math.round( (h * 180) / Math.PI );
  s = Math.round( s * 100 );
  i = Math.round( i * 255 );

  // Verifica se é NaN
  (isNaN(h) == true) ? h = 0 : '';
  (isNaN(s) == true) ? s = 0 : '';
  (isNaN(i) == true) ? i = 0 : '';

  // Seta os valores nos sliders HSI
  document.getElementById("slider-h").value = h;
  document.getElementById("color-h").textContent = "Hue: " + h + "°";

  document.getElementById("slider-s").value = s;
  document.getElementById("color-s").textContent = "Saturation: " + s;

  document.getElementById("slider-i").value = i;
  document.getElementById("color-i").textContent = "Intensity: " + i;
}

function convertHSItoRGB(h, s, i) {
  // Destransforma o range dos valores
  h = h * Math.PI / 180;
  s = s / 100;
  i = i / 255;

  if(h < (2 * Math.PI / 3) ) //120
  {
    var x = i * (1 - s);
    x = Math.min(x, 1);
    var y = i * (1 + ( (s * Math.cos(h)) / Math.cos( (Math.PI / 3) - h ) ));
    y = Math.min(y, 1);
    var z = (3 * i) - (x + y);
    z = Math.min(z, 1);

    var b = x;
    var r = y;
    var g = z;
  }
  else if(( h >= (2 * Math.PI / 3) ) && ( h < (4 * Math.PI / 3)) ) //240
  {
    h = h - (2 * Math.PI / 3);

    var x = i * (1 - s);
    x = Math.min(x, 1);
    var y = i * (1 + ( (s * Math.cos(h)) / Math.cos( (Math.PI / 3) - h ) ));
    y = Math.min(y, 1);
    var z = (3 * i) - (x + y);
    z = Math.min(z, 1);   
    
    var r = x;
    var g = y;
    var b = z;
  }
  else if( ( h <= (2 * Math.PI) ) && ( h >= (4 * Math.PI / 3)) )
  {
    h = h - (4 * Math.PI / 3);

    var x = i * (1 - s);
    x = Math.min(x, 1);
    var y = i * (1 + ( (s * Math.cos(h)) / Math.cos( (Math.PI / 3) - h ) ));
    y = Math.min(y, 1);
    var z = (3 * i) - (x + y);
    z = Math.min(z, 1);   

    var g = x;
    var b = y;
    var r = z;
  }

  r = Math.round(r * 255);
  g = Math.round(g * 255);
  b = Math.round(b * 255);

  // Seta os valores nos slider RGB
  document.getElementById("slider-r").value = r;
  document.getElementById("color-r").textContent = "Red: " + r;

  document.getElementById("slider-g").value = g;
  document.getElementById("color-g").textContent = "Green: " + g;

  document.getElementById("slider-b").value = b;
  document.getElementById("color-b").textContent = "Blue: " + b;

  document.getElementById("show-color").style.backgroundColor = "rgb(" + r + ", " + g + ", " + b + ")";

}

function convertCMYtoHSI(c, m, y) {

  var r = 255 - c; 
  var g = 255 - m;
  var b = 255 - y;

  // Normalizando valores
  rNorm = r / (r + g + b);
  gNorm = g / (r + g + b);
  bNorm = b / (r + g + b);

  // Convertendo o H
  if(b <= g)
  {
    var parte1 = (0.5 * ( (rNorm - gNorm) + (rNorm - bNorm) ) );
    var parte2 = Math.sqrt( ((rNorm - gNorm)**2) + (rNorm - bNorm)*(gNorm - bNorm) );
    var h = Math.acos( parte1 / parte2 );
  }
  else
  {
    var parte1 = (0.5 * ( (rNorm - gNorm) + (rNorm - bNorm) ) );
    var parte2 = Math.sqrt( ((rNorm - gNorm)**2) + (rNorm - bNorm)*(gNorm - bNorm) );
    var h = (2*Math.PI) - Math.acos( parte1 / parte2 );
  }

  var s = 1 - (3 * Math.min(rNorm, gNorm, bNorm));
  var i = (r + g + b) / (3 * 255);

  // Mudando o range dos valores HSI
  h = Math.round( (h * 180) / Math.PI );
  s = Math.round( s * 100 );
  i = Math.round( i * 255 );

  // Verifica se é NaN
  (isNaN(h) == true) ? h = 0 : '';
  (isNaN(s) == true) ? s = 0 : '';
  (isNaN(i) == true) ? i = 0 : '';

  // Seta os valores nos sliders HSI
  document.getElementById("slider-h").value = h;
  document.getElementById("color-h").textContent = "Hue: " + h + "°";

  document.getElementById("slider-s").value = s;
  document.getElementById("color-s").textContent = "Saturation: " + s;

  document.getElementById("slider-i").value = i;
  document.getElementById("color-i").textContent = "Intensity: " + i;
}

function convertHSItoCMY(h, s, i) {
  // Destransforma o range dos valores
  h = h * Math.PI / 180;
  s = s / 100;
  i = i / 255;

  if(h < (2 * Math.PI / 3) )
  {
    var x = i * (1 - s);
    x = Math.min(x, 1);
    var y = i * (1 + ( (s * Math.cos(h)) / Math.cos( (Math.PI / 3) - h ) ));
    y = Math.min(y, 1);
    var z = (3 * i) - (x + y);
    z = Math.min(z, 1);  

    var b = x;
    var r = y;
    var g = z;
  }
  else if(( h >= (2 * Math.PI / 3) ) && ( h < (4 * Math.PI / 3)) )
  {
    h = h - (2 * Math.PI / 3);

    var x = i * (1 - s);
    x = Math.min(x, 1);
    var y = i * (1 + ( (s * Math.cos(h)) / Math.cos( (Math.PI / 3) - h ) ));
    y = Math.min(y, 1);
    var z = (3 * i) - (x + y);
    z = Math.min(z, 1);  
    
    var r = x;
    var g = y;
    var b = z;
  }
  else if( ( h <= (2 * Math.PI) ) && ( h >= (4 * Math.PI / 3)) )
  {
    h = h - (4 * Math.PI / 3);

    var x = i * (1 - s);
    x = Math.min(x, 1);
    var y = i * (1 + ( (s * Math.cos(h)) / Math.cos( (Math.PI / 3) - h ) ));
    y = Math.min(y, 1);
    var z = (3 * i) - (x + y);
    z = Math.min(z, 1);  

    var g = x;
    var b = y;
    var r = z;
  }

  r = Math.round(r * 255);
  g = Math.round(g * 255);
  b = Math.round(b * 255);

  var c = 255 - r; 
  var m = 255 - g;
  var y = 255 - b;

  // Seta os valores nos slider RGB
  document.getElementById("slider-c").value = c;
  document.getElementById("color-c").textContent = "Cyan: " + c;

  document.getElementById("slider-m").value = m;
  document.getElementById("color-m").textContent = "Magenta: " + m;

  document.getElementById("slider-y").value = y;
  document.getElementById("color-y").textContent = "Yellow: " + y;

}

function convertRGBtoHSV(r, g, b) {
  var min = Math.min(r, g, b);
  var max = Math.max(r, g, b);
  var delta = max - min;
  var h, s, v = max;

  v = Math.floor(max / 255 * 100);
    
  if (max == 0) {
    return { h: 0, s: 0, v: 0 };
  }

  s = Math.floor(delta / max);
    
  var deltadiv; 
  if(delta == 0) {
    deltadiv = 1;
  } else {
    deltadiv = delta;
  }
    
  if(r == max) {
    h = (g - b) / deltadiv;
  } else if(g == max) {
    h = 2 + (b - r) / deltadiv;
  } else {
    h = 4 + (r - g) / deltadiv;
  }
    
  h = Math.floor(h * 60);
  if(h < 0) {
    h += 360;
  }
    
  return { h: h, s: s, v: v }
}

function convertHSVtoRGB(h, s, v) {
  h = h / 360;
  s = s / 100;
  v = v / 100;

  if (s == 0) {
    var val = Math.round(v * 255);
    return { r: val, g: val, b: val };
  }

  hPos = h * 6;
  hPosBase = Math.floor(hPos);
  base1 = v * (1 - s);
  base2 = v * (1 - s * (hPos - hPosBase));
  base3 = v * (1 - s * (1 - (hPos - hPosBase)));
    
  if (hPosBase == 0) {
    r = v; 
    g = base3; 
    b = base1;
  } else if (hPosBase == 1) {
    r = base2; 
    g = v; 
    b = base1;
  } else if (hPosBase == 2) {
    r = base1; 
    g = v; 
    b = base3;
  } else if (hPosBase == 3) {
    r = base1; 
    g = base2; 
    b = v;
  } else if (hPosBase == 4) {
    r = base3; 
    g = base1; 
    b = v;
  } else {
    r = v; 
    g = base1; 
    b = base2;
  }

  r = Math.round(r * 255);
  g = Math.round(g * 255);
  b = Math.round(b * 255);
  
  return { r: r, g: g, b: b };
}