window.onload = function() {
	
	var canvas = document.getElementById('snow'),
		ctx = canvas.getContext('2d'),
		width = $(document).width(),
		height = $(document).height();


	canvas.width = width;
	canvas.height = height;
	
	var mp, particles, mIncr = 500;

	function init(){
	
		mp = 10,
		particles = [];

		for(var i = 0; i < mp; i++) {

			particles.push({

				x: Math.random()*width,
				y: Math.random()*height,
				r: Math.random()*4+1,
				d: Math.random()*mp

			});

		}
		
	}

	function draw(){

		ctx.clearRect(0, 0, width, height);
		// ctx.fillStyle = 'rgba(0,0,0, 0.05)';
		// ctx.fillRect(0,0,width,height);

		ctx.beginPath();

		for(var i = 0; i < mp; i++) {

			var p = particles[i];

			ctx.moveTo(p.x, p.y);
			ctx.arc(p.x, p.y, p.r, 0, Math.PI*2, true);

		}

		var gradient = ctx.createRadialGradient(10, 0, 0, 850, 50, 1000);
			gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
			gradient.addColorStop(1, 'rgba(255, 255, 255, 0.0)');


		ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
		//ctx.fillStyle = gradient;
		ctx.fill();
		update();

	}

	var angle = 0;

	function newFlake(){

		particles.push({

			x: Math.random()*width,
			y: -5,
			r: Math.random()*4+1,
			d: Math.random()*mp

		});

	}

	function update(){		

		angle +=0.01;

		for (var i = 0; i < mp; i++) {

			var p = particles[i];

			p.y += (Math.cos(angle + p.d)+ 1 + p.r/2) /4;
			
			p.y >= height - Math.ceil(p.r) ? p.x += 0 : p.x += 0.8;

			if(p.y >= height - Math.ceil(p.r)) {

				//particles[i] = {x: Math.random()*width, y : -10, r: p.r, d : p.d};
				particles[i] = {y : height - Math.ceil(p.r), x: p.x, r: p.r, d : p.d};

			} else if(p.x > width + 5) {

				particles[i] = {x: -5, y : Math.random() * height, r: p.r, d : p.d};

			} else if (p.x < -5) {

				particles[i] = {x: width +5, y : Math.random() * height, r: p.r, d : p.d};

			}

		}

		var chance = Math.round(Math.random()*30);

		if(chance == 1) {

			mp += 1;

			for(var i = 0; i < mp; i++) {
			
				newFlake();

			}

		}

		if(chance == 1 && mp > 400) {

			removeParticle = Math.random()*mp;
			particles.splice(Math.ceil(removeParticle), 1);

		}

	}

	init();
	letItSnow = setInterval(draw, 10);

	canvas.onclick = function(){

		if(letItSnow == 'paused') {

			letItSnow = setInterval(draw, 10);

		} else {

			clearInterval(letItSnow);
			letItSnow = 'paused';
			
		}

	};

};