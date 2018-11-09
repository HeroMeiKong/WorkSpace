var screenInit = {
	setDefaultFontSize: function() {
		document.querySelector('html').style.fontSize = window.innerWidth / 750 * 100 + 'px';
	},
	setMetaTag: function() {
		var meta = document.createElement('meta');
		var dpr = 0;
		var u = (window.navigator.appVersion.match(/android/gi), window.navigator.appVersion.match(/iphone/gi)),
            _dpr = window.devicePixelRatio;
		dpr = u ? ( (_dpr >= 3 && (!dpr || dpr >= 3))
                        ? 3
                        : (_dpr >= 2 && (!dpr || dpr >= 2))
                            ? 2
                            : 1
                  )
                : 1;
		meta.setAttribute('name','viewport');
		meta.setAttribute('content', 'initial-scale=' + 1/dpr + ', maximum-scale=' + 1/dpr + ', minimum-scale=' + 1/dpr + ', user-scalable=0, width=device-width');
		document.getElementsByTagName('head')[0].appendChild(meta);
	}
};

// screenInit.setMetaTag();
screenInit.setDefaultFontSize();
window.addEventListener('resize',screenInit.setDefaultFontSize,false);
