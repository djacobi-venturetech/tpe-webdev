jQuery(function () {

	$('.listing-detail-viewer .prop-body').prepend('<span class="trigger">See all details</span>');

	var trigger = $('span.trigger');
	var $el = $('.seller.listing-offer');

	$(trigger).on('click', function(){
		$('.listing-detail-viewer .prop-body').toggleClass('shown');
	});

	var buyerTrigger = $('.conversation-list h2');

	$(buyerTrigger).on('click', function(){
		$el.toggleClass('buyers-closed');
	});


});