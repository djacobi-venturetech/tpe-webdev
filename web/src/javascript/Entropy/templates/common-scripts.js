
jQuery(function () {

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
			if (window.miwt)
				$result.on('change', miwt.observerFormSubmit);
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


	$('form.miwt-form').each(function (idx, form) {
		form.submit_options = {
			preProcessNode: function (data) {
				destroySelect2(document.getElementById(data.refid));
				return data.content;
			},
			postProcessNode: function (data) {
				$.each(data, function (idx, d) {
					initSelect2(d.node);
					handleDataDownload(d.node);
					enableTooltips(d.node);
				});
			},
			postUpdate: function () {
				$(this).trigger('vs:miwt-post-update');
			}
		};
	});

});