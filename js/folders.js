if(jQuery) (function($){
	$.extend($.fn, {
		folders: function(options, files) {
			// Merge options with default options
			options = $.extend({
						loadingLabel: 'Loading...',
						selectLabel: 'Select a folder',
						multiple: false,
						create: false,
						className: 'jfolders',
						fullListing: true,
						separator: '/',
						collapseSiblings: true
					}, options);

			/**
			 * Generates the HTML list displaying the file list with associated
			 * checkboxes/radio buttons if form elements are required.
			 *
			 * @param obj JQueryDOMObject Object to append HTML list to
			 * @param files Object Object containing file list
			 * @param base String String containing the path to the file (to be used
			 *                    in the value.
			 */
			function displayFiles(obj, files, base) {
				var f, ul, li, input;
				obj.append((ul = $('<ul></ul>')));
				for (f in files) {
					ul.append((li = $('<li>' + files[f].label + '</li>')));
					// Create the input if required
					if (options.name) {
						li.prepend((input = $('<input value="'
								+ (base ? base + options.separator : '')
								+ (value ? value : name) + '>')));
						if (options.multiple) {
							input.attr('type', 'checkbox');
							input.attr('name', options.name + '[]');
						} else {
							input.attr('type', 'radio');
							input.attr('name', options.name);
						}
					}

					// Add click (select) functionality
					//li.click(select);

					// Add expand button if have subdirectories
					if (files[f].sub) {
						li.addClass('parent');

						// Draw the subdirectories if we have it

						if (files[f].sub !== true) {
							displayFolders(li, files[f].sub,
									base + options.separator + name);
						}
					}
				}
			}

			function expand() {
				// Check if we have the list of files
				if (!$(this).child('div').has('ul')) {
				}

				if ($(this).hasClass('expand')) {
					$(this).removeClass('expand');
				} else {
					if (options.collapseSiblings) {
						$(this).siblings('li').removeClass('expand');
					}
					$(this).addClass('expand');
				}
			}

			$(this).each( function() {
				var div;
				// Get file/folder list
				if (options.files) {
				} else if (options.ajaxScript) {
				} else {
					// Disable
					return;
				}

				// Create the div that will contain either the loadingLabel or the
				// file list
				$(this).append((div = $('<div></div>')));

				$(this).click(expand);
			});
		}
	});
})(jQuery);
