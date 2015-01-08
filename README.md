jquery-folders
==============
JQuery folders is a simple JQuery plugin to present and allow selection of
folders in a reasonably flexible and simple manner. File lists can either be
given in full when the plugin is first initiated, retrieved in full using AJAX
or retrieved when required using AJAX. Selection can either be stored using
input fields or using callback functions.

## Options
The following options are available when creating the JQuery folders list:
* `loadingLabel` - Label to display while retrieving file listing if required
  (default: `'Loading...'`).
* `selectLabel` - Label to display if no file is selected (default:
  `'Select a folder'`).
* `multiple` - Set whether to allow selection of multiple files
  (default: false).
* `create` - Set whether user is able to create new folders (default: false).
* `className` - Class to add to the given object (default: `jfolders`). Can
  be set to `false` to not add a class (will remove default formatting).
* `files` - A javascript array containing the file list. See List below for
  the correct format of the array.
* `ajaxScript` - AJAX URI to retrieve the JSON array containing the file list.
  See List below for the correct format of the JSON array.
* `fullListing` - Set whether the AJAX script returns the full listing or just
  the current directory listing (default: true).
* `name` - Name for the form element(s) if one is to be created (default: none
  created).
* `separator` - Directory separator of the server (default: `/`).
* `base` - Base path of the files in the list. Will be prepended to the name
  of the file (default: none).
* `selection` - Javascript function to be called whenever a selection is made.
  The function will be passed an object containing the objects of the selected
  files.
* `isSelected` - Function to determine if the file has already been selected.
  If none is set, the `files` array will be searched for the path of the file.
* `collapseSiblings` - Set whether sibling folders should be collapsed when a
  folder is clicked (default: true).

* `useUI` - Set whether to use the JQuery UI theming (default: false).

## List
The file list should be a array of objects containing information on each
file. The following information on the files must be set:
* `name` - Basename of the file.
* `type` - Type of file, currently:
  * `d` - for directory
	* `f` - for file
The following information may also be set:
* `value` - A label for the file (will be used in the HTML instead of the
  name).
If using functions to handle the selection of files, each object of the files
selected will be passed to the selection function. 
