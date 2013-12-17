(function($) {

	$.fn.zRS = function(options, param) {

		var self = this;
		var timer;

		this.each(function(i) {

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
				load_callback : null, 
				adjustWidth : true,
				fixed : false

			};

			var settings = $.extend(defaults, options);

			if(typeof(options) == 'object') {
				
				self.data('settings', settings);
				self.data('savedSettings', settings.delay);
				self.data('visibleSlides', settings.visibleSlides);

			} else {

				settings = self.data('settings');
				settings.delay = self.data('savedSettings');			
			}

			var slides = self.children().children('.carousel').size() > 0 ? self.children('.inner-slider').children().children() : self.children('.inner-slider').children(),
				numberOfSlides = slides.length,
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

							private_methods.loadUp();

							throw 'Less than one slide! :(';

						}

						if(settings.adjustWidth == false && settings.transition != 'fade') {

							throw 'You need to use fade with no width adjust!';

						}

					}

					catch(error) {

						console.log('[Fluid Slider Shutting Down] - '+error);

					}

				},

				setVisibleSlides : function(visibleSlides) {

					settings.visibleSlides = visibleSlides;

					self.data('visibleSlides', settings.visibleSlides);

				},

				slideWidthAdjust : function() {
 					var carousel = self.children().children('.carousel');
					var carouselWidth = numberOfSlides * inner.width() / self.data('visibleSlides');
					var carouselHeight = numberOfSlides * inner.outerHeight() / self.data('visibleSlides');

					if(settings.adjustWidth == true) {

						carousel.css({

							'width' : settings.transition == 'slide' ? carouselWidth + 'px' : inner.width(),
							'position' : 'relative'

						}).css({

							'width' : self.data('visibleSlides') == 1 && settings.transition != 'vertical' ? '+='+numberOfSlides * settings.slideSpacing + 'px' : '+=' + 1 + 'px'

						});					

						var widthValue = (100 / numberOfSlides) / 100;

						if(settings.transition == 'vertical') {

							slides.css({

								'padding-top' : settings.slideSpacing /2 + 'px',
								'padding-bottom' : settings.slideSpacing /2 + 'px'

							});

						} else {

							slides.css({

								'width' : self.data('visibleSlides') == 1 ? carouselWidth * widthValue + 'px' : (carouselWidth * widthValue) - settings.slideSpacing + 'px',
								'margin-right' : settings.slideSpacing /2 + 'px',
								'margin-left' : settings.slideSpacing /2 + 'px'

							});

						}

						if(settings.transition == 'vertical') {

							inner.css({

								'height' : self.data('visibleSlides') == 1 ? slides.outerHeight(true) * self.data('visibleSlides') + 'px' : (slides.outerHeight(true) + settings.slideSpacing) * self.data('visibleSlides')

							});

						}

					} else {

						if(inner.width() < slides.width()) {

						slides.css({

							'left' : '50%',
							'margin-left' : '-' + slides.width() / 2 + 'px'

						});
							
						}

					}

				},

				transition : function(direction, difference) {

					var carousel = $('.carousel', self);

					if(carousel.is(':animated') || inner.children().is(':animated')) {

						return false;

					} else {

						currentSlide = self.data('currentSlide') == undefined ? 0 : self.data('currentSlide');
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

							} else if(settings.transition == 'fade') {

								nextSlide = inner.children().eq(difference);
								
								nextSlide.css({'z-index' : '0'}).fadeIn(settings.speed, function(){

									for(var i=0; i < difference; i++) {

										inner.children(':first-child').css({'position' : settings.fixed == true ? 'fixed' : 'absolute'}).hide().appendTo(inner);

									}

									$(this).css({

										'position' : settings.fixed == true ? 'fixed' : 'relative',
										'z-index' : '-1'

									});

									private_methods.setTimer();

								});

							} else {

								carousel.animate({

									'top' : '-' + (slides.outerHeight(true)) * difference + 'px'

								}, settings.speed, function(){

									carousel.css({

										'top' : '0px'

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

							}

						} else {


							difference = Math.abs(difference);

							if(currentSlide == 0) {

								currentSlide = numberOfSlides - 1;

							} else {

								currentSlide -= difference;

							}

							if(settings.transition == 'slide') {

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

							} else if(settings.transition == 'fade') {

								for(var i=0; i < difference; i++) {

									inner.children(':last-child').prependTo(inner);

								}

								inner.children(':first-child').css({'position' : settings.fixed == true ? 'fixed' : 'relative', 'z-index' : '0'}).fadeIn(settings.speed, function(){

									inner.children().not($(this)).css({'position' : settings.fixed == true ? 'fixed' : 'absolute', 'z-index' : '0'}).hide();
									inner.children(':first-child').css({'position' : settings.fixed == true ? 'fixed' : 'relative', 'z-index' : '-1'});
									private_methods.setTimer();

								});

							} else {

								for(var i=0; i < difference; i++) {

									carousel.children(':last-child').prependTo(carousel);

								}

								carousel.css({

									'top' : '-'+(slides.outerHeight(true)) * difference + 'px'

								});

								carousel.animate({

									'top' : '0px'

								}, settings.speed, function(){

									if($.isFunction(settings.trans_callback)) {

										settings.trans_callback.call(this);

									}

									$(this).clearQueue();

									private_methods.setTimer();

								});

							}

						}

					}					

					self.data('currentSlide', currentSlide);

					if(settings.pager != 'undefined') {

						settings.pager.children('a').removeClass().eq(self.data('currentSlide')).addClass('active');

					}

				}

			}

			var private_methods = {

				loadUp : function() {

					if (settings.transition == 'fade' && settings.visibleSlides > 1) {

						console.log('[Banana Tree Fluid Slider] - You are not allowed more than 1 visible slide with fade! Shit happens! :(');
						self.data('visibleSlides', 1);

					}

					settings.transition == 'slide' || settings.transition == 'vertical' ? slides.wrapAll('<div class="carousel" />') : settings.visibleSlides = 1;

					var loaded = 0;

					inner.css({

						'height' : 'auto',
						'position' : 'relative'

					});

					slides.show(0, function(){
						
						settings.transition == 'fade' ? slides.css({'position': settings.fixed == true ? 'fixed' : 'absolute', 'z-index' : '1', 'top' : '0', 'left' : '0'}).hide().first().css({'position' : settings.fixed == true ? 'fixed' : 'relative', 'display' : 'block', 'z-index' : '0'}) : '';

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
							currentSlide = 0;
							self.data('currentSlide', currentSlide);


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

					difference = clicked - self.data('currentSlide');

					if(clicked == currentSlide) {

						return false;

					} else if(clicked > currentSlide) {

						public_methods.transition('next', difference);

					} else {

						public_methods.transition('prev', difference);

					}

				},

				setTimer : function(){

					window.clearInterval(timer);

					if(settings.delay > 0 && typeof(options) == 'object') {

						timer = setInterval(public_methods.transition, settings.delay, 'next');

					}

				},

				clearTimer : function(){

					window.clearInterval(timer);

				}

			}

			if(public_methods[options]) {

				return public_methods[options].call(this, param);

			} else if(typeof(options) == 'object'){

				public_methods.init.call();

			} else {

				console.log('[Fluid Slider] - ' + options + ' is not a defined method :(');

			}

			$(window).resize(function(){

				public_methods.slideWidthAdjust.call();

			});

			if(settings.pauseOnHover == true && settings.delay > 0) {

				self.mouseover(function(){

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