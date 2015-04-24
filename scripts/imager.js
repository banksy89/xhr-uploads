(function () {

	/** 
	 * The uploader instance
	 * We are allowing multiple uploaders on a page so this changes on an uploader-by-uploader basis.
	 * Defaulting to 1 as a single uploader
	 * 
	 * @var {String}
	 */
	var instance = 1;	

	/**
	 * The type of upload it is (categorised images etc. to handle on the server side end)
	 *
	 * @var {String}
	 */
	var type = null;

	/**
	 * Hanldes the action upon selecting file(s)
	 *
	 * @param {Object} e
	 */
	function handleSelectFile (e) {
		var files = e.target.files;

		for (var i=0, file; file=files[i]; i++) {
			filePreview(file);
			fileUpload(file);
		}
	}

	/**
	 * Appends and displays the preview of the image uploading
	 * 
	 * @param {String} output
	 */
	function renderPreview(output) {
		$('#js-uploader-preview-'+instance).append(output);
	}

	/**
	 * Handles the formatting of the file preview
	 *
	 * @param {Object} file
	 */
	function filePreview(file) {

		if (file.type.indexOf('image') == 0) {

			var fileReader = new FileReader();
			
			fileReader.onload = function (e) {

				renderPreview('<img src="'+e.target.result+'" width="100" />');	
			}

			fileReader.readAsDataURL(file);

		}
	}

	/**
	 * Uploads the file to our server script
	 * while altering the progress bar to show
	 * something is happening to our user
	 *
	 * @param {Object} file
	 */
	function fileUpload(file) {

		var xhr = new XMLHttpRequest();

		if (xhr.upload && file.size <= 30000000000) {

			var progressBarObj = $('#js-uploader-progress-'+instance);

			// Progress listener
			xhr.upload.addEventListener('progress', function (e) {

				var percentage = parseInt(100-(e.loaded/e.total*100));
				
				progressBarObj.prop('value', percentage);

			}, false);

			// File upload response
			xhr.onreadystatechange = function (e) {
				
				if (xhr.readyState == 4) {
					progressBarObj.prop('value', 100);
				}
			}

			// Upload to PHP AJAX
			xhr.open('POST', 'upload.php', true);
			xhr.setRequestHeader('XHR_FILENAME', file.name);
			xhr.setRequestHeader('XHR_FILE_TYPE', type);
			xhr.send(file);
		}

	}	

	/**
	 * Initialises our uploader!
	 */
	function init() {

		var uploaders = $('.js-uploader');

		uploaders.on('change', function (e) {
			
			var atts = e.target.attributes;
			
			// Take the attributes that define the uploader from the file input

			type = (!!atts['data-type'].value ? atts['data-type'].value : null);

			instance = (!!atts['data-instance'].value ? atts['data-instance'].value : null);

			handleSelectFile(e);
		});

	}

	// Go Go Go!
	init();

})();