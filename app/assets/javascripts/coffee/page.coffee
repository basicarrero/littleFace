# Place all the behaviors and hooks related to the matching controller here.
# All this logic will automatically be available in application.js.
# You can use CoffeeScript in this file: http://coffeescript.org/

jQuery ->
	if $('#infinite-scrolling').size() > 0
		$(window).on 'scroll', ->
			more_posts_url = $('.pagination .next_page').attr('href')
			if more_posts_url && $(window).scrollTop() > $(document).height() - $(window).height() - 60
				$.getScript more_posts_url
			return
		return
