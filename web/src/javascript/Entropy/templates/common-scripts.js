
// Note: openSidebar function is declared in the HTML of the page (header)


jQuery(function () {

	if(!window.openSidebar) {
		window.SIDE_BAR_OPEN="FIXME-SIDE-BAR-OPEN";
		window.openSidebar = function(open) {
			// Needs to be declared in the HTML of the page (header)
		} ;
	}

//    sidebar toggle

	function responsiveView() {
		var wSize = $(window).width();
		if (sessionStorage[SIDE_BAR_OPEN] === undefined)
			openSidebar(!(wSize <= 768));
	}

	$(window).on('load', responsiveView);
	$('.fa-bars').click(function () {
		var $body = $("body");
		$body.toggleClass('sidebar-open');
	});


	/*const*/
	var SELECT2_INIT = "select2-init";

// select2
	function initSelect2(ctx) {
		var $select = $(ctx || document).find('select');
		if ($select.length && !($select.closest('.cke_dialog').length || $select.closest('tr[data-dnd-source-def]').length)) {

			//noinspection JSUnresolvedVariable
			var $result = $select
				.select2({
					minimumResultsForSearch: 10,
					dropdownAutoWidth: true,
					width: 'resolve'
				})
				.addClass(SELECT2_INIT)
				.filter('[data-features~="watch"]');
			if (window.miwt){
				//noinspection JSUnresolvedVariable
				$result.on('change', miwt.observerFormSubmit);
			}
		}
	}

	function destroySelect2(ctx) {
		var $select = $(ctx || document);
		if (!$select.hasClass(SELECT2_INIT)) {
			$select = $select.find('select').filter('.' + SELECT2_INIT);
		}

		if ($select.length) {
			$select.removeClass(SELECT2_INIT).select2('destroy');
		}
	}

	initSelect2();

	function handleDataDownload(ctx) {
		var $ctx = $(ctx || document);
		$ctx.find("[data-download]").each(function (idx, el) {
			el.setAttribute("download", "");
		});
	}

	handleDataDownload();

	function switchSupport(ctx) {
		var $ctx = $(ctx || document);
		$ctx.find("input[type=checkbox]").each(function (idx, el) {
			if (!el.id)
				return;
			var otherInput = el.form['_t' + el.id];
			if (!otherInput || otherInput.hasAttribute('data-switchon'))
				return;
			otherInput.setAttribute("data-switchon", el.checked);
			el.addEventListener('change', function () {
				otherInput.setAttribute("data-switchon", this.checked);
			});
		});
	}

	switchSupport();

	function enableTooltips(ctx) {
		var $ctx = $(ctx || document);
		$ctx.find(".tooltips").each(function (idx, el) {
			var $el = $(el);
			if ($el.hasClass("menu-component")) {
				$el.find("a[title]").tooltip();
			} else {
				$el.tooltip();
			}
		});
		$ctx.find('[data-toggle="tooltip"]').tooltip();
		$ctx.find('[data-toggle="popover"]').popover({
			trigger: 'hover'
		});

	}

	enableTooltips();

	var PLUS_CLASS = 'fa-plus-circle';
	var MINUS_CLASS = 'fa-minus-circle';
	function registerActivityToggle(idx, element) {
		var $element = $(element);
		var $target = $($element.data('target'));
		$target.on('show.bs.collapse', function onShow(){
			$element.removeClass('collapsed').addClass('expanded');
			$element.find('i').removeClass(PLUS_CLASS).addClass(MINUS_CLASS);
		});
		$target.on('hide.bs.collapse', function onHide(){
			$element.removeClass('expanded').addClass('collapsed');
			$element.find('i').removeClass(MINUS_CLASS).addClass(PLUS_CLASS);
		});
	}

	/**
	 * Setup the bootstrap expand-collapse persistence.
	 * @param ctx the context such as a DIV or document.
	 */
	function setupExpandCollapse(ctx) {
		var $ctx = $(ctx || document);
		$ctx.find('[data-toggle="collapse"]').each(registerActivityToggle);
	}

	setupExpandCollapse();

	/**
	 * Created by vtdev on 4/7/16.
	 */
	var CN_HAS_ERROR = "has-error";

	function errorMessageCleanup(){
		$("." + CN_HAS_ERROR).each(function (idx, el) {
			var $el = $(el);
			$el.removeClass(CN_HAS_ERROR);
			$el.find('.error-message').remove();
		});
	}

	function setupErrorMessages(ctx){
		function createWrapper($prop){
			var $it;
			if($prop.hasClass('ctb') || $prop.hasClass('rtb'))
				$it = $prop.find('label').wrap('<span class="msg-wrap"></span>').parent();
			else
				$it = $prop.wrap("<span></span>");
			return $it;
		}
		var $ctx = $(ctx || document), hasErrors;
		var $mcs = $ctx.hasClass('message-container') ? $ctx : $ctx.find('.message-container');
		if($mcs.length === 0)
			return;
		$mcs.each(function (idx, mc) {
			var $mc = $(mc);
			$mc.find('.error [data-source]').each(function (idx, el) {
				var $el = $(el), id = $el.data('source');
				var $prop = $('#' + id);
				if($prop.length === 0)
					return;
				if($prop.prop('tagName').toLowerCase() != 'div') {
					var $it = createWrapper($prop);
					$it.addClass(CN_HAS_ERROR);
					$it.append('<span class="error-message"><span class="error-text">' + $el.text() + '</span></span>');
					hasErrors = true;
				} else {
					$prop.addClass(CN_HAS_ERROR);
					$prop.append('<div class="error-message"><span class="error-text">' + $el.text() + '</span></div>');
					hasErrors = true;
				}
				$el.parent().remove();
			});
		});
		if(hasErrors) {
			$mcs.append('<div class="message error"><span class="brief">Please review the errors below</span></div>');
			//noinspection JSUnresolvedFunction - defined in MIWT util.js
			var scrollTo = $('.error-message').parent().first()[0];
			setTimeout(function(){
				scrollTo.scrollIntoViewIfNeeded(true);
			}, 50);
		}
	}

	setupErrorMessages();

	$('form.miwt-form').each(function (idx, form) {
		form.submit_options = {
			preProcessNode: function (data) {
				destroySelect2(document.getElementById(data.refid));
				return data.content;
			},
			postProcessNode: function (data) {
				$.each(data, function (idx, d, ctx) {
					initSelect2(d.node);
					handleDataDownload(d.node);
					enableTooltips(d.node);
					setupExpandCollapse(d.node);
					switchSupport(d.node);
					errorMessageCleanup();
					setTimeout(function () {
						setupErrorMessages(ctx);
					}, 1);
				});
			},
			postUpdate: function () {
				$(this).trigger('vs:miwt-post-update');
			}
		};
	});

	(function (w) {
		var $body = $("body");
		var $window = $(window);
		if ($body.length === 0) return;
		w.addEventListener("orientationchange", function () {
			if (w.orientation === 0)
				openSidebar(false);
		}, false);
		//noinspection JSUnresolvedVariable
		if (w.orientation && w.orientation === 0 && sessionStorage[SIDE_BAR_CLOSED] === undefined) {
			openSidebar(false);
		}
		$window.resize(function(){
			if ($window.width() > 1024) {
				$body.removeClass("sidebar-open");
			}
		});
	})(window);


});