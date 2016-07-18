function ActivePlaceholder(element, base = 'Always shown: ', placeholders = ['Changes'], framesPerSecond = 24, framesBase = 12, framesBuild = 24, framesFull = 18, framesRemove = 24) {
	var element = element;
	this.base = base;
	this.placeholders = placeholders;
	
	this.fBase = framesBase;
	this.fBuild = framesBuild;
	this.fFull = framesFull;
	this.fRemove = framesRemove;

	var state = 'base'; // 'base' 'build' 'full' 'remove'
	var currentWord = null;
	var currentWordIndex = 0;
	var countdown = 0;
	var animation = null;
	var fps = framesPerSecond;

	this.start = function() {
		var activePlaceholder = this;
		animation = window.setInterval(function() {
			switch(state) {
				case 'base':
				if (countdown > 0) {
					if (--countdown === 0) {
						state = 'build';
					}
				} else {
					currentWordIndex = (currentWordIndex + 1) % placeholders.length;
					currentWord = placeholders[currentWordIndex];
					element.placeholder = base;
					countdown = activePlaceholder.fBase;
				}
				break;

				case 'build':
				if (countdown > 0) {
					var percent = (activePlaceholder.fBuild - countdown) / activePlaceholder.fBuild;
					var addon = currentWord.substring(0, Math.floor(percent * currentWord.length));
					element.placeholder = activePlaceholder.base + addon;
					if (--countdown === 0) {
						state = 'full';
					}
				} else {
					countdown = activePlaceholder.fBuild;
				}
				break;

				case 'full':
				if (countdown > 0) {
					if (--countdown === 0) {
						state = 'remove';
					}
				} else {
					element.placeholder = activePlaceholder.base + currentWord;
					countdown = activePlaceholder.fFull;
				}
				break;

				case 'remove':
				if (countdown > 0) {
					var percent = countdown/activePlaceholder.fRemove;
					var addon = currentWord.substring(0, Math.floor(percent * currentWord.length));
					element.placeholder = activePlaceholder.base + addon;
					if (--countdown === 0) {
						state = 'base';
					}
				} else {
					countdown = activePlaceholder.fRemove;
				}
				break;

				default:
				console.log('Something went horribly wrong');
				break;
			}
		}, 1000/fps);
	}

	this.stop = function() {
		window.clearInterval(animation);
		element.placeholder = this.base + placeholders[currentWordIndex];
		state = 'full';
		countdown = 0;
	}
}