jQuery(function () {

	$('.listing-detail-viewer .prop-body').prepend('<span class="trigger">See all details</span>');

	var trigger = $('span.trigger');
	var $el = $('.seller.listing-offer');

	$el.removeClass('buyers-closed');

	$(trigger).on('click', function(){
		$('.listing-detail-viewer .prop-body').toggleClass('shown');
	});

	var buyerTrigger = $('.conversation-list h2');

	$(buyerTrigger).on('click', function(){
		$el.toggleClass('buyers-closed');
	});

	$('.richlist .element').each(function () {
		//noinspection JSUnusedGlobalSymbols
		$('.conversation-container .miwt-form')[0].submit_options = {
			postProcessNode: function (data) {
				$.each(data, function (idx, ctx) {
					$el.addClass('buyers-closed');
				});
			}
		};
	});


});