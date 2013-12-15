zRS - Responsive Slider
===

Here's a list of options with all their defualt values:

speed : 1000
delay : 0
pager : 'undefined'
slideSpacing: 0
next : $('.next', this)
prev : $('.prev', this)
visibleSlides : 1
transition: 'slide'
pauseOnHover : false
trans_callback : null
load_callback : null

Implementation:

Use the following HTML structure when implementing the slider to your webpage.

<div class="slider"> <!-- The element the slider needs to be called on -->
	<div class="inner-slider"> <!-- Inner slider is necessary to make the plugin function correctly, make sure this is 100% width if you want it responsive! -->
		<img src="img/trans/1.jpg" alt="Tester" />
		<img src="img/trans/2.jpg" alt="Tester" />
		<img src="img/trans/3.jpg" alt="Tester" />
		<img src="img/trans/4.jpg" alt="Tester" />
		<img src="img/trans/5.jpg" alt="Tester" />
		<img src="img/trans/6.jpg" alt="Tester" />
		<img src="img/trans/7.jpg" alt="Tester" />
		<img src="img/trans/8.jpg" alt="Tester" />
	</div>
</div>

I'll add more at some point... 