jQuery(function () {

	var $el = $('.seller.listing-offer');

	function showDetails() {
		$('.listing-detail-container .listing-detail-viewer .prop-body').prepend('<span class="trigger">See all details</span>');

		var trigger = $('span.trigger');

		$(trigger).on('click', function(){
			$('.listing-detail-viewer .prop-body').toggleClass('shown');
		});
	}

	showDetails();

	$('.listing-detail-container .miwt-form')[0].submit_options = {
		postProcessNode: function (data) {
			$.each(data, function (idx, ctx) {
				showDetails();
			});
		},
		postUpdate: function () {
			showDetails();
		}
	};

	$el.removeClass('buyers-closed');
	var buyerTrigger = $('.conversation-list h2');

	$(buyerTrigger).on('click', function(){
		$el.toggleClass('buyers-closed');
	});

	$('.richlist .element').each(function () {
		$('.conversation-container .miwt-form')[0].submit_options = {
			postProcessNode: function (data) {
				$.each(data, function () {
					$el.addClass('buyers-closed');
				});
			}
		};
	});


});