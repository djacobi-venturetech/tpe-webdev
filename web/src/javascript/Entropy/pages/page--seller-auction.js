jQuery(function () {

	$('.listing-detail-viewer .prop-body').prepend('<span class="trigger">See all details</span>');
	var trigger = $('span.trigger');

	$(trigger).on('click', function(){
		$('.listing-detail-viewer .prop-body').toggleClass('shown');
	});

});