if(jQuery) (function($){
	$.extend($.fn, {
		folders: function(options, files) {
			// Merge options with default options
			options = $.extend({
				loadingLabel: 'Loading...',
				selectLabel: 'Select a folder',
				multiple: false,
				create: false,
				selectedClass: 'selected',
				separator: '/',
				collapseSiblings: true,
				class: 'jFolders'
			}, options);
			
			function returnFunction(func) {
				var a = Array.prototype.slice.call(arguments);
				a.shift();
				var t = this;
				return function () {
					var b = [].concat(a);
					b = b.concat(Array.prototype.slice.call(arguments));
					func.apply(t, b);
				};
			}

			function receiveList(obj, data, textStatus, jqXHR) {
				if (!data.error) {
					displayFiles(obj.children('div'), data);
				}
			}

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
				var f, ul, reorder = false;
				// Create a unnumbered list if we haven't already got one
				console.log(obj);
				if (!obj.children('div').has('ul').length) {
					console.log('creating a new ul');
					obj.children('div').html((ul = $('<ul></ul>')));
				} else {
					reorder = true;
					console.log('getting old ul');
					ul = obj.children('div').children('ul');
				}

				for (f in files) {
					console.log('adding...');
					console.log(ul);
					console.log(files[f]);
					addPart(ul, files[f], base);
				}

				if (reorder) {
					// Reorder the elements
				}
			}

			function addPart(obj, data, base) {
				var li, input, label;
				
				obj.append((li = $('<li></li>')));
				li.append((label = $('<label>' + data.label + '</label>')));
				// Create the input if required
				if (options.name) {
					// @todo input.append('<option value="' + value + '></option>');
				}

				// Add id to li
				li.attr('data-id', data.id);

				// Add click (select) functionality
				li.click(returnFunction(select, li, data));

				data._obj = li;

				//@todo if (data.type == 'dir') {
					// Add new link if can create new
					if (options.create) {
						li.append((createLink = $('<a>New</a>')));
						createLink.click(returnFunction(create, li, data.id));
					}

					// Add expand button if have subdirectories
					if (data.sub) {
						addSubParts(li, data.sub, base);
					}
				//}
			}

			function addSubParts(obj, sub, base) {
				var span, div;
				obj.addClass('parent');

				// Add expand objnk
				obj.append((span = $('<span>+</span>')));
				obj.append((div = $('<div></div>')));
				span.click(returnFunction(expand, obj));

				// Draw the subdirectories if we have it
				if (sub !== true) {
					displayFiles(obj, sub,
							base + options.separator + name);
				}
			}

			function select(obj, file, ev) {
				ev.stopPropagation();
				var selected = false;

				if (selection[file.id]) { // Was selected
					delete selection[file.id];
				} else { // Now selected
					selected = true;

					if (!options.multiple) {
						// Remove others from selection
						if (selection) {
							var s;
							for (s in selection) {
								if (options.selectedClass) {
									if (selection[s]._obj) {
										selection[s]._obj.removeClass(options.selectedClass);
									}
								}

								delete selection[s];
							}
						}

						// Change 
						mainLabel.text(file.label);
						expand(main);
					}

					selection[file.id] = file;
				}
					
				// Find out if we are (de)selecting
				if (options.selectedClass) {
					if (selected) {
						obj.addClass(options.selectedClass);
					} else {
						obj.removeClass(options.selectedClass);
					}
				}

				// Handle input if we have them
				if (options.name) {
				}

				// Handle selection function if we have them
				if (options.selection) {
					var s, selected = [];
					for (s in selection) {
						selected.push(selection[s]);
					}
					options.selection(selected);
				}
			}

			function create(obj, id, ev) {
				ev.stopPropagation();
				var name;
				if ((name = prompt('Please enter a name for the new folder'))) {
					console.log('Got new name of ' + name);
					console.log('address is "' + options.ajaxScript + '"');
					console.log(options);
					var data = {a: 'create', name: name}
					if (id) data.id = id;
					$.post(options.ajaxScript, data,
							returnFunction(finishCreate, obj, name));
				}
			}

			function finishCreate(obj, name, data, textStatus, jqXHR) {
				// Alert an error
				if (data.error) {
					alert(data.error);
					return;
				}

				console.log('success in creating ' + name);
				console.log(data);
				console.log(obj);

				// Add new folder to list
				// Check if item has children already
				if (!obj.hasClass('parent')) {
					// Add parts so it can be expanded
					if (obj.attr('data-id')) {
						addSubParts(obj, true);
					}
				}
				// Expand menu
				console.log('expanding');
				console.log([{ label: name, id: data.id }]);
				expand(obj, null, true, [{ label: name, id: data.id }]);
			}

			/**
			 * Expands a folder.
			 */
			function expand(obj, ev, forceOpen, files) {
				if (ev) {
					ev.stopPropagation();
					console.log(ev);
				}

				
				if (obj.hasClass('expand') && forceOpen !== true) {
					obj.removeClass('expand');
					obj.children('span').html('+');
				} else if (forceOpen !== false) {
					obj.children('span').html('-');
					if (options.collapseSiblings) {
						obj.siblings('li').removeClass('expand');
						obj.siblings('li').children('span').html('+');
					}
					obj.addClass('expand');
				
					// Check if we have already drawn the folder list
					if (!obj.children('div').has('ul').length || files) {
						var list;
						// Draw file list
						if (files) {
							console.log('calling display files');
							displayFiles(obj, files);
						} else if (options.ajaxScript) {
							obj.children('div').html(options.loadingLabel);

							// Send AJAX request
							//console.log('sending request to ' + options.ajaxScript);
							$.post(options.ajaxScript, {id: obj.attr('data-id')},
									returnFunction(receiveList, obj));
						} else {
							// Disable
							return;
						}
					}
				}
			}

			// Create the div for each list
			var mainLabel;
			var main = $(this);
			var div;
			var selection = {};

			$(this).each( function() {
				if (options.class) {
					$(this).addClass(options.class);
				}

				$(this).append(div = $('<div></div>'));

				/* @todo Implement
				if (options.name) {
					$(this).append((input = $('<select name="' + options.name 
							+ '" style="display: none;"></select>')));
				}*/

				// Do label
				div.html((mainLabel = $('<label>' + options.selectLabel
						+ '</label>')));
			
				// Add new folder link
				if (options.create) {
					var createLink;
					$(this).append((createLink = $('<a>New</a>')));
					createLink.click(returnFunction(create, div, null));
				}

				// Create the div that will contain either the loadingLabel or the
				// file list
				div.append(($('<div></div>')));

				div.click(returnFunction(expand, div));

				// Build what we have if we have something
				if (options.listing) {
					displayFiles(div, options.listing);
					//div.data('list', options.fullListing);
				}
			});

			// Add hook onto document to close if user clicks somewhere else
			$(document).on('click', function(ev) {
				var parents;
				if (!(parents = $(ev.target).parents(main)).length) {
					div.not(parents).each(function() {
						expand($(this). null, true)
					});
				}
			});
		}
	});
})(jQuery);
