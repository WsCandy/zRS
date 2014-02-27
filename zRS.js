(function($) {

	$.fn.zRS = function(options, param) {

		return this.each(function(i) {

			var self = $(this);

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
				self.data('self', self);

			} else {

				settings = self.data('settings');
				self = self.data('self');
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

							settings.delay > 0 ? public_methods.resume() : null;

						} else {

							private_methods.loadUp();

							throw 'Less than one slide! :(';

						}

					}

					catch(error) {

						console.log('[Fluid Slider Shutting Down] - '+error);

					}

				},

				setVisibleSlides : function(visibleSlides) {

					settings.visibleSlides = visibleSlides;
					self.data('visibleSlides', settings.visibleSlides);
					public_methods.slideWidthAdjust();

				},

				slideWidthAdjust : function() {
 					var carousel = self.children().children('.carousel');
					var carouselWidth = numberOfSlides * inner.width() / settings.visibleSlides;
					var carouselHeight = numberOfSlides * inner.outerHeight() / settings.visibleSlides;

					if(settings.adjustWidth == true) {

						carousel.css({

							'width' : settings.transition == 'slide' ? carouselWidth + 'px' : inner.width(),
							'position' : 'relative'

						}).css({

							'width' : settings.visibleSlides == 1 && settings.transition != 'vertical' ? '+='+numberOfSlides * settings.slideSpacing + 'px' : '+=' + 1 + 'px'

						});					

						var widthValue = (100 / numberOfSlides) / 100;

						if(settings.transition == 'vertical') {

							slides.css({

								'padding-top' : settings.slideSpacing /2 + 'px',
								'padding-bottom' : settings.slideSpacing /2 + 'px'

							});

						} else {

							slides.css({

								'width' : settings.visibleSlides == 1 ? carouselWidth * widthValue + 'px' : (carouselWidth * widthValue) - settings.slideSpacing + 'px',
								'margin-right' : settings.slideSpacing /2 + 'px',
								'margin-left' : settings.slideSpacing /2 + 'px'

							});

						}

						if(settings.transition == 'vertical') {

							inner.css({

								'height' : settings.visibleSlides == 1 ? slides.outerHeight(true) * settings.visibleSlides + 'px' : (slides.outerHeight(true) + settings.slideSpacing) * settings.visibleSlides

							});

						}
					} else {

						if(inner.width() <= slides.width()) {

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
						
						public_methods.pause();

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

									public_methods.resume();

								});

							} else if(settings.transition == 'fade') {

								nextSlide = inner.children().eq(difference);
								
								nextSlide.css({'z-index' : '1'}).fadeIn(settings.speed, function(){

									for(var i=0; i < difference; i++) {

										inner.children(':first-child').css({'position' : settings.fixed == true ? 'fixed' : 'absolute'}).hide().appendTo(inner);

									}

									$(this).css({

										'position' : settings.fixed == true ? 'fixed' : 'relative',
										'z-index' : '0'

									});

									public_methods.resume();

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

									public_methods.resume();

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

									public_methods.resume();

								});

							} else if(settings.transition == 'fade') {

								for(var i=0; i < difference; i++) {

									inner.children(':last-child').prependTo(inner);

								}

								inner.children(':first-child').css({'position' : settings.fixed == true ? 'fixed' : 'absolute', 'z-index' : '2'}).fadeIn(settings.speed, function(){

									inner.children().not($(this)).css({'position' : settings.fixed == true ? 'fixed' : 'absolute', 'z-index' : '0'}).hide();
									inner.children(':first-child').css({'position' : settings.fixed == true ? 'fixed' : 'relative', 'z-index' : '1'});
									public_methods.resume();

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

									public_methods.resume();

								});

							}

						}

					}					

					self.data('currentSlide', currentSlide);

					if(settings.pager != 'undefined') {

						settings.pager.children('a').removeClass().eq(self.data('currentSlide')).addClass('active');

					}

				},

				pause : function(){

					window.clearTimeout(self.timer);

				},

				resume : function(){

					public_methods.pause();
					
					settings.delay > 0 ? self.timer = window.setTimeout(public_methods.transition, settings.delay, 'next') : '';

					

				}

			}

			var private_methods = {

				loadUp : function() {

					if (settings.transition == 'fade' && settings.visibleSlides > 1) {

						console.log('[Fluid Slider] - You are not allowed more than 1 visible slide with fade! Shit happens! :(');
						settings.visibleSlides = 1;

					}

					settings.transition == 'slide' || settings.transition == 'vertical' ? slides.wrapAll('<div class="carousel" />') : settings.visibleSlides = 1;

					var loaded = 0;

					inner.css({

						'height' : 'auto',
						'position' : 'relative'

					});

					slides.show(0, function(){
						
						settings.transition == 'fade' ? slides.css({'position': settings.fixed == true ? 'fixed' : 'absolute', 'z-index' : '0', 'top' : '0', 'left' : settings.adjustWidth == true ? '0' : '50%'}).hide().first().css({'position' : settings.fixed == true ? 'fixed' : 'relative', 'display' : 'block', 'z-index' : '1'}) : '';

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
						'margin-left' : '-' + (pagerWidth * numberOfSlides) /2 + 'px',
						'z-index' : '5'

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

				}

			}

			if(public_methods[options]) {

				return public_methods[options].call(self, param);

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

					public_methods.pause();

				});

				self.mouseleave(function(){

					public_methods.resume();

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