if(jQuery) (function($){
	$.extend($.fn, {
		folders: (function() {
			function rFunc(func, context, appendParams) {
				var a = Array.prototype.slice.call(arguments);
				a.splice(0, 3);
				return function () {
					if (appendParams) {
						var b = [].concat(a);
						b = b.concat(Array.prototype.slice.call(arguments));
						func.apply(context, b);
					} else {
						func.apply(context, a);
					}
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
				if (!obj.children('div').has('ul').length) {
					obj.children('div').html((ul = $('<ul></ul>')));
				} else {
					reorder = true;
					ul = obj.children('div').children('ul');
				}

				for (f in files) {
					addPart.apply(this, [ul, files[f], base]);
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
				if (this.options.name) {
					// @todo input.append('<option value="' + value + '></option>');
				}

				// Add id to li
				li.attr('data-id', data.id);

				// Add click (select) functionality
				li.click(rFunc(select, this, true, li, data));

				data._obj = li;

				//@todo if (data.type == 'dir') {
					// Add new link if can create new
					if (this.options.create) {
						li.append((createLink = $('<a>New</a>')));
						createLink.click(rFunc(create, this, true, li, data.id));
					}

					// Add expand button if have subdirectories
					if (data.sub) {
						addSubParts.apply(this, [li, data.sub, base]);
					}
				//}
			}

			function addSubParts(obj, sub, base) {
				var span, div;
				obj.addClass('parent');

				// Add expand objnk
				obj.append((span = $('<span>+</span>')));
				obj.append((div = $('<div></div>')));
				span.click(rFunc(expand, this, true, obj));

				// Draw the subdirectories if we have it
				if (sub !== true) {
					displayFiles.apply(this, [obj, sub,
							base + this.options.separator + name]);
				}
			}

			function select(obj, file, ev) {
				ev.stopPropagation();
				var selected = false;

				if (this.selection[file.id]) { // Was selected
					delete this.selection[file.id];
					
					obj.removeClass(this.options.selectedClass);
					
					var t = this;

					// Remove childSelected from parents
					obj.parents().each(function() {
						if ($(this).is(t.div)) {
							return false;
						}
						if ($(this).find('.' + t.options.selectedClass).length) {
							return false;
						}

						$(this).removeClass('childSelected');
					});

				} else { // Now selected
					selected = true;
					
					obj.addClass(this.options.selectedClass);
					
					if (!this.options.multiple) {
						// Remove others from selection
						if (this.selection) {
							var s;
							for (s in this.selection) {
								if (this.options.selectedClass) {
									if (this.selection[s]._obj) {
										this.selection[s]._obj.removeClass(this.options.selectedClass);
									}
								}

								delete this.selection[s];
							}
						}
						

						// Close the  
						expand.apply(this, [this.div, null, false]);
					} else {
						var t = this;

						// Mark all parent objects
						obj.parents().each(function() {
							if ($(this).is(t.div)) {
								return false;
							}
							if ($(this).is('li')) {
								$(this).addClass('childSelected');
							}
						});
					}

					this.selection[file.id] = file;
				}

				// Handle input if we have them
				if (this.options.name) {
				}

				// Change label
				// Count selected
				var s,i = 0;
				for (s in this.selection) i++;
				switch (i) {
					case 0:
						this.mainLabel.text(this.options.selectLabel);
						break;
					case 1:
						this.mainLabel.text(this.selection[s].label + ' selected');
						break;
					default:
						this.mainLabel.text(i + ' folders selected');
				}

				// Handle selection function if we have them
				if (this.options.selection) {
					var s, selected = [];
					for (s in this.selection) {
						selected.push(this.selection[s]);
					}
					this.options.selection(selected);
				}
			}

			function create(obj, id, ev) {
				ev.stopPropagation();
				var name;
				if ((name = prompt('Please enter a name for the new folder'))) {
					var data = {a: 'create', name: name}
					if (id) data.id = id;
					$.post(this.options.ajaxScript, data,
							rFunc(finishCreate, this, true, obj, name));
				}
			}

			function finishCreate(obj, name, data, textStatus, jqXHR) {
				// Alert an error
				if (data.error) {
					alert(data.error);
					return;
				}

				// Add new folder to list
				// Check if item has children already
				if (!obj.hasClass('parent')) {
					// Add parts so it can be expanded
					if (obj.attr('data-id')) {
						addSubParts(obj, true);
					}
				}
				// Expand menu
				expand(obj, null, true, [{ label: name, id: data.id }]);
			}

			/**
			 * Expands a folder.
			 */
			function expand(obj, ev, force, files) {
				if (ev) {
					ev.stopPropagation();
				}

				
				if (obj.hasClass('expand') && force !== true) {
					obj.removeClass('expand');
					obj.children('span').html('+');
				} else if (force !== false) {
					obj.children('span').html('-');
					if (this.options.collapseSiblings) {
						obj.siblings('li').removeClass('expand');
						obj.siblings('li').children('span').html('+');
					}
					obj.addClass('expand');
				
					// Check if we have already drawn the folder list
					if (!obj.children('div').has('ul').length || files) {
						var list;
						// Draw file list
						if (files) {
							displayFiles(obj, files);
						} else if (this.options.ajaxScript) {
							obj.children('div').html(this.options.loadingLabel);

							// Send AJAX request
							//console.log('sending request to ' + this.options.ajaxScript);
							$.post(this.options.ajaxScript, {id: obj.attr('data-id')},
									rFunc(receiveList, this, true, obj));
						} else {
							// Disable
							return;
						}
					}
				}
			}

			function closeOut(ev) {
				if (!$(ev.target).parents().is(this.obj)) {
					expand.apply(this, [this.div, null, false]);
				}
			}
			
			function Folder(obj, options) {
				// Merge options with default options
				this.options = $.extend({
					loadingLabel: 'Loading...',
					selectLabel: 'Select a folder',
					multiple: false,
					create: false,
					separator: '/',
					collapseSiblings: true,
					class: 'jFolders'
				}, options);

				// Set selected class to default if there is none
				if (!this.options.selectedClass) {
					this.options.selectedClass = 'selected';
				}

				this.obj = obj;
				this.selection = {};

				// Add class if set
				if (this.options.class) {
					obj.addClass(this.options.class);
				}

				obj.append(this.div = $('<div></div>'));

				/* @todo Implement
				if (options.name) {
					$(this).append((input = $('<select name="' + options.name 
							+ '" style="display: none;"></select>')));
				}*/

				// Do label
				this.div.html((this.mainLabel = $('<label>' + this.options.selectLabel
						+ '</label>')));
			
				// Add new folder link
				if (this.options.create) {
					this.obj.append((createLink = $('<a>New</a>')
							.click(rFunc(create,this, true, this.div, null))));
				}

				// Create the div that will contain either the loadingLabel or the
				// file list
				this.div.append(($('<div></div>')));

				this.div.click(rFunc(expand, this, true, this.div));

				// Build what we have if we have something
				if (this.options.files) {
					displayFiles.apply(this, [this.div, this.options.files]);
				}
				
				// Add hook onto document to close if user clicks somewhere else
				$(document).on('click', rFunc(closeOut, this, true));
			}

			return function(options, files) {
				$(this).each( function() {
					new Folder($(this), options, files);
				});
			};
		})()
	});
})(jQuery);
