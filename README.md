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
* `files` - A javascript array containing the file list. See List below for
  the correct format of the array.
* `ajaxScript` - AJAX URI to handle retrieving the JSON array containing the
  file list, and creating and deleting new folders. See AJAX Script below
	for information on what the URI will be passed.
* `name` - Name for the form element(s) if one is to be created (default: none
  created).
* `separator` - Directory separator of the server (default: `/`).
* `base` - Base path of the files in the list. Will be prepended to the name
  of the file (default: none).
* `selection` - Javascript function to be called whenever a (de)selection is
  made. The function will be passed an object containing the objects of the
	selected files.
* `isSelected` - Function to determine if the file has already been selected.
  If none is set, the `files` array will be searched for the path of the file.
* `collapseSiblings` - Set whether sibling folders should be collapsed when a
  folder is clicked (default: true).

* `useUI` - Set whether to use the JQuery UI theming (default: false).

## List
The file list should be an array of objects containing information on each
file. The following information on the files must be set:
* `id` - Basename of the file.
* `label` - A label for the file (will be used in the HTML instead of the
  name).
* `sub` - If a directory and the directory contains files, sub should be a
  file list ob
* `type` - Type of file. Can be `'file'` or `'dir'`.

The following information may also be set:
* `class` - Class to give to the element
If using functions to handle the selection of files, each object of the files
selected will be passed to the selection function.

## AJAX Script
The AJAX script set using the `ajaxScript` parameter in the options will be
called every time a folder creation, deletion and list action is initiated.

### Folder Creation
Upon a folder creation, the AJAX script will be requested with the following
POST data:
* `id` - The id of the folder to create the new folder under
* `name` - The name of the new folder

The AJAX script should return a JSON response containing an object with either
an error message e.g. `{"error": "Could not create folder"}` or the id of the
newly created folder e.g. `{"id":45}`

### Folder Deletion
Upon a folder deletion, the AJAX script will be requested with the following
POST data:
* `id` - The id of the folder to delete

The AJAX script should return a JSON response containing an object with either
an error message e.g. `{"error": "Could not create folder"}` or a message
telling of its success  e.g. `{"msg": "New folder created"}`

### Folder Listing
Upon a folder creation, the AJAX script will be requested with the following
POST data:
* `id` - The id of the folder to list the contents of

The AJAX script should return a JSON response containing an object with either
an error message e.g. `{"error": "Could not create folder"}` or an array
containing the folder listing. See List below for the correct format of the
JSON array.
