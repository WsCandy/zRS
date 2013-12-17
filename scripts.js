$(document).ready(function(){

	$('.slider').zRS({

		speed : 1000,
		delay: 6000,
		visibleSlides: 3,
		slideSpacing : 0,
		transition: 'slide',
		pauseOnHover : true

	});

	$('.slider2').zRS({

		speed : 1000,
		delay: 5000,
		transition: 'fade',
		pager : $('.pager'),
		pauseOnHover : true

	});

	$('.slider3').zRS({

		speed : 1000,
		delay: 4000,
		transition: 'fade',
		pauseOnHover : true,
		visibleSlides : 1,
		adjustWidth: false

	});

});
