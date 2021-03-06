(function() {
	
	var allowedMimeTypes = [
		'image/jpeg',
		'image/png',
		'image/gif'
	];
	
	var Blurred = function(element) {
		this._element = element;
		this._blurStrength = 5;
		this._url = this._element.getAttribute('data-blur');
		this._mimeType = allowedMimeTypes[0];
	};
	
	Blurred.prototype.setBlurStrength = function(blur) { 
		this._blurStrength = parseInt(blur, 10);
		return this;
	};
	
	Blurred.prototype.setMimeType = function(mime) { 
		this._mimeType = (!!~allowedMimeTypes.indexOf(mime)) ? mime : this._mimeType; 
		return this;
	};
	
	Blurred.prototype.setUrl = function(url) {
		this._url = url || this._element.getAttribute('data-blur') || this._url;
		return this;
	};
	
	Blurred.prototype.render = function() {
		var canvas = document.createElement('canvas');

		if (!!(canvas.getContext && canvas.getContext('2d')) === false)
			return this._element.style.backgroundImage = 'url(' + ImgUrl + ')';

		var img = new Image();
		img.crossOrigin = 'Anonymous';
		img.src = this._url;
		
		var self = this;

		img.onload = function()
		{
			var iw = this.width,
				ih = this.height;

			canvas.setAttribute('width', iw);
			canvas.setAttribute('height', ih);

			canvas = document.body.appendChild(canvas);

			var context = canvas.getContext('2d');

			var cw = context.canvas.width,
				ch = context.canvas.height;

			context.drawImage(img, (cw / 2 - iw / 2), (ch / 2 - ih / 2));

			context.globalAlpha = 0.5;

			for (var y = -self._blurStrength; y <= self._blurStrength; y += 2)
			{
				for (var x = -self._blurStrength; x <= self._blurStrength; x += 2)
				{
					context.drawImage(canvas, x, y);
					if (x >= 0 && y >= 0)
						context.drawImage(canvas, -(x - 1), -(y - 1));
				}
			}

			context.globalAlpha = 1.0;

			var base64 = context.canvas.toDataURL(self._mimeType);
			document.body.removeChild(canvas);

			return self._element.style.backgroundImage = 'url(' + base64 + ')';
		};
	};
	
	Blurred.prototype.destroy = function() {
		if (!!this._element)
			this._element.style.backgroundImage = '';
	};
	
	// AMD / CommonJS stuff
	if (typeof define === "function" && !!define.amd)
		define(function() { return Blurred; });
	else if (typeof module === "object" && !!module && typeof module.exports === "object" && !!module.exports)
		module.exports = Blurred;
	else
		window.Blurred = Blurred;	

})();
