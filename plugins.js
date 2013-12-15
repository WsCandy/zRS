(function($) {

	$.fn.zRS = function(options, param) {

		var self = this;

		return this.each(function(i) {

			var defaults = {

				speed : 1000,
				delay : 0,
				pager : 'undefined',
				slideSpacing: 0,
				next : $('.next', this),
				prev : $('.prev', this),
				visibleSlides : 1,
				transition: 'slide',
				pauseOnHover : false,
				trans_callback : null,
				load_callback : null

			};

			var	settings = $.extend(defaults, options);
		
			var slides = self.children().children('.carousel').size() > 0 ? self.children('.inner-slider').children().children() : self.children('.inner-slider').children(),
				numberOfSlides = slides.length,
				currentSlide = 0,
				timer, 
				inner = self.children('.inner-slider');

			var public_methods = {

				init : function(){

					try {

						if(slides.size() <= 0) {

							throw 'No slider! :(';

						}

						if(numberOfSlides > 1) {

							private_methods.loadUp();

							if(numberOfSlides >= 2 && settings.pager != 'undefined') {

								private_methods.pagination();

							}

							timer = settings.delay > 0 ? setInterval(public_methods.transition, settings.delay, 'next') : null;

						} else {

							$('.slider-nav').remove();

							private_methods.loadUp();

							throw 'Less than one slide! :('

						}

					}

					catch(error) {

						console.log('[Zizzi Fluid Slider Shutting Down] - '+error);

					}

				},

				setVisibleSlides : function(visibleSlides) {

					settings.visibleSlides = visibleSlides;

				},

				slideWidthAdjust : function() {

					var carousel = self.children().children('.carousel');
					var carouselWidth = numberOfSlides * self.children('.inner-slider').width() / settings.visibleSlides;

					carousel.css({

						'width' : carouselWidth + 'px',
						'position' : 'relative'

					}).css({

						'width' : settings.visibleSlides == 1 ? '+='+numberOfSlides * settings.slideSpacing + 'px' : '+=' + 1 + 'px'

					});

					var widthValue = (100 / numberOfSlides) / 100;

					slides.css({

						'width' : settings.visibleSlides == 1 ? carouselWidth * widthValue + 'px' : (carouselWidth * widthValue) - settings.slideSpacing + 'px',
						'margin-right' : settings.slideSpacing + 'px'

					});

				},

				transition : function(direction, difference) {

					var carousel = $('.carousel', self);

					if(carousel.is(':animated') || inner.children().is(':animated')) {

						return false;

					} else {

						private_methods.clearTimer();


						if(typeof difference === 'undefined') {

							difference = 1;

						}

						if(direction == 'next') {

							if(currentSlide == numberOfSlides - 1) {

								currentSlide = 0;

							} else {

								currentSlide += difference;

							}

							if(settings.transition == 'slide') {

								carousel.animate({

									'left' : '-' + (slides.outerWidth(true)) * difference + 'px'

								}, settings.speed, function(){

									carousel.css({

										'left' : '0px'

									});

									for(var i=0; i < difference; i++) {

										carousel.children(':first-child').appendTo(carousel);

									}

									if($.isFunction(settings.trans_callback)) {

										settings.trans_callback.call(this);

									}

									$(this).clearQueue();

									private_methods.setTimer();

								});

							} else {

								nextSlide = inner.children().eq(difference);
								
								nextSlide.css({'z-index' : '1'}).fadeIn(settings.speed, function(){

									for(var i=0; i < difference; i++) {

										inner.children(':first-child').css({'position' : 'absolute'}).hide().appendTo(inner);

									}

									$(this).css({

										'position' : 'relative',
										'z-index' : '0'

									});

									private_methods.setTimer();

								});

							}

						} else {


							difference = Math.abs(difference);

							if(currentSlide == 0) {

								currentSlide = numberOfSlides - 1;

							} else {

								currentSlide -= difference;

							}

							if(settings.transition == 'slide') {

								if(!carousel.is(':animated')) {

									for(var i=0; i < difference; i++) {

										carousel.children(':last-child').prependTo(carousel);

									}

									carousel.css({

										'left' : '-'+(slides.outerWidth(true)) * difference + 'px'

									});

									carousel.animate({

										'left' : '0px'

									}, settings.speed, function(){

										if($.isFunction(settings.trans_callback)) {

											settings.trans_callback.call(this);

										}

										$(this).clearQueue();

										private_methods.setTimer();

									});

								} else {

								}

							} else {

								for(var i=0; i < difference; i++) {

									inner.children(':last-child').prependTo(inner);

								}

								inner.children(':first-child').css({'position' : 'absolute', 'z-index' : '1'}).fadeIn(settings.speed, function(){

									inner.children().not($(this)).css({'position' : 'absolute', 'z-index' : '1'}).hide();

									inner.children(':first-child').css({'position' : 'relative', 'z-index' : '0'});
									private_methods.setTimer();

								});

							}

						}

						if(settings.pager != 'undefined') {

							settings.pager.children('a').removeClass().eq(currentSlide).addClass('active');

						}

					}

				}

			}

			var private_methods = {

				loadUp : function() {

					settings.transition == 'fade' && settings.visibleSlides > 1 ? console.log('[Zizzi Fluid Slider] - You are not allowed more than 1 visible slide with fade! Shit happens! :(') : '';
					settings.transition == 'slide' ? slides.wrapAll('<div class="carousel" />') : settings.visibleSlides = 1;

					var loaded = 0;

					inner.css({

						'height' : 'auto',
						'position' : 'relative'

					});

					slides.show(0, function(){
						
						settings.transition == 'fade' ? slides.css({'position': 'absolute', 'z-index' : '1', 'top' : '0', 'left' : '0'}).hide().first().css({'position' : 'relative', 'display' : 'block', 'z-index' : '0'}) : '';

						inner.css({

							'background-image' : 'none'

						});

						loaded++;

						if(loaded == 1){

							public_methods.slideWidthAdjust.call();

						}

						if($.isFunction(settings.load_callback) && loaded == 1) {

							settings.load_callback.call(this);

						}

					});

				},

				pagination : function(){

					slides.each(function(index, element){

						if(index == 0) {

							var PagerHTML = '<a href="javascript:void(0);" data-slide="'+index+'" class="active">';


						} else {

							PagerHTML = '<a href="javascript:void(0);" data-slide="'+index+'">'

						}

						settings.pager.append(PagerHTML);

					});

					var pagerWidth = settings.pager.children('a').outerWidth(true);

					settings.pager.css({

						'width' : pagerWidth * numberOfSlides + 'px',
						'margin-left' : '-' + (pagerWidth * numberOfSlides) /2 + 'px'

					});

					settings.pager.show();

				},

				PagerClick: function(clicked) {

					difference = clicked - currentSlide;

					if(clicked == currentSlide) {

						return false;

					} else if(clicked > currentSlide) {

						public_methods.transition('next', difference);

					} else {

						public_methods.transition('prev', difference);

					}

				},

				setTimer : function(){

					timer = setInterval(public_methods.transition, settings.delay, 'next');

				},

				clearTimer : function(){

					clearInterval(timer);
					timer = null;
				}

			}

			if(public_methods[options]) {

				return public_methods[options].call(self, param);

			} else if(typeof(options) == 'object'){

				public_methods.init.call();

			} else {

				console.log('[Zizzi Fluid Slider] - ' + options + ' is not a defined method :(');

			}

			$(window).resize(function(){

				public_methods.slideWidthAdjust.call();

			});


			if(settings.pauseOnHover == true && settings.delay > 0) {

				self.mouseenter(function(){

					private_methods.clearTimer();

				});

				self.mouseleave(function(){

					private_methods.setTimer();

				});

			}

			//button bindings etc

			settings.next.click(function(e){
				e.preventDefault();
				public_methods.transition('next');

			});

			settings.prev.click(function(e){
				e.preventDefault();
				public_methods.transition();

			});

			if(settings.pager != 'undefined') {

				settings.pager.children('a').click(function(){

					private_methods.PagerClick($(this).data('slide'));

				});

			}

		});

	}

} (jQuery));