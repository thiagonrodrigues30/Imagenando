function Pixel(r, g, b, a) {
  this.r = r;
  this.g = g;
  this.b = b;
  this.a = a;
}

function SubImage(imgWidthBegin, imgWidthEnd, imgHeightBegin, imgHeightEnd) {
	this.imgWidthBegin = imgWidthBegin; 
	this.imgWidthEnd = imgWidthEnd;
	this.imgHeightBegin = imgHeightBegin; 
	this.imgHeightEnd = imgHeightEnd;
}