//Scrollbar fix (You can't scroll in modal when closing an second modal)
$(document).on('hidden.bs.modal', '.modal', function () {
    $('.modal:visible').length && $(document.body).addClass('modal-open');
});
//Init wysihtml5 text editor
$('#modalBody').wysihtml5({		
	toolbar: {
	      'font-styles': false,
	      'color': true,
	      'emphasis': true,
	      'blockquote': true,
	      'lists': true,
	      'html': false,
	      'link': true,
	      'image': false,
	      'smallmodals': true
	},
});
/*
 * UI Cloudinary bindings
 */
var fileUploads = 0;
var currentFileUploads = 0;
var doPost = false;

function clearForm() {
	document.getElementById('form').reset();
	$('#fileTable > tbody > tr').remove();
};
function toggleDialogON(selection) {
	if (selection){
		$('#dialogSubmit').removeClass('btn-warning');
		$('#dialogSubmit').addClass('btn-primary');
		$('#modalBody').data('wysihtml5').editor.toolbar.show();
		$('#modalBody').data('wysihtml5').editor.composer.enable();
		$('#form input').prop('disabled', false);
		$('#dialogSubmit').removeClass('btn-default');
		$('.fileinput-button').addClass('btn-info');
		$('#dialogSubmit').text(' Send! ');
	} else {
		$('#dialogSubmit').removeClass('btn-primary');
		$('#dialogSubmit').addClass('btn-warning');
		$('#modalBody').data('wysihtml5').editor.toolbar.hide();
		$('#modalBody').data('wysihtml5').editor.composer.disable();
		$('#form input').prop('disabled', true);
		$('.fileinput-button').removeClass('btn-info');
		$('.fileinput-button').addClass('btn-default');
		$('#dialogSubmit').text(' Sending... ');
	}
};
function doSubmit() {
	toggleDialogON(true);
	$('#form').submit();
	clearForm();
	doPost = false;
	console.log('Form posted');
};
$('#dialogSubmit').on('click', function() {
    if (currentFileUploads == 0){
    	doSubmit();
	} else {
		toggleDialogON(false);
		doPost = true;
	}
});
function FormatFileSize(bytes) {
    if (typeof bytes !== 'number') {
        return '';
    }
    if (bytes >= 1000000000) {
        return (bytes / 1000000000).toFixed(2) + ' GB';
    }
    if (bytes >= 1000000) {
        return (bytes / 1000000).toFixed(2) + ' MB';
    }
    return (bytes / 1000).toFixed(2) + ' KB';
};
function fadeAway(row) {
	row.removeClass('in');
	window.setTimeout(function () {
		row.remove();
	}, 200);
};

$('.cloudinary-fileupload').cloudinary_fileupload({
	autoUpload: false,
    disableImageResize: false,
    imageMaxWidth: 800,
    imageMaxHeight: 600,
    maxFileSize: 10000000 // 10 MB
});
$('.cloudinary-fileupload').bind('fileuploadadd', function (e, data) {
	currentFileUploads++;
	data.process();
});
$('.cloudinary-fileupload').bind('fileuploadprocessalways', function (e, data) {
	data.id = fileUploads;
	data.context = $('.files');
	jqXHR = data.submit();
    $.each(data.files, function (i, file) {
    	var node = $('<tr/>').addClass('fade in').attr('id', fileUploads);
    	
    	if (file.preview) {
        	node.append($('<td/>').append(file.preview));
       	}
        node.append($('<td/>').append($('<span/>').text(file.name)));
        
        btn = $('<button/>').addClass('btn btn-danger cancel');
       	btn.append('<i class="glyphicon glyphicon-ban-circle"></i>');
        
        if (file.error) {
       		node.append($('<td/>').append($('<span class="error text-danger"/>').text(file.error)));
       		
       		btn.click(function (e) {
       			fadeAway($('tr:contains(' + file.name + ')'));
		    	return false;
		    });
       	} else {
       		col = $('<td/>').append($('<p/>').text('Uploading...'));
        	col.append('<div class="progress progress-striped active" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><div class="progress-bar progress-bar-info" style="width:0%;"></div></div>');
        	node.append(col);
        	
        	btn.click(function (e) {
		    	if (jqXHR && jqXHR.readyState != 4) {
		        	jqXHR.abort();  
		       	 	jqXHR = null;
		       	 	console.log('Upload ' + data.id.toString() + ' Canceled');
		    	}
		    	fadeAway($('#' + data.id.toString()));
		    	return false;
		    });
       	}
       	node.append($('<td/>').append(btn));
		node.appendTo(data.context);
	});
    fileUploads++;
});
$('.cloudinary-fileupload').bind('fileuploadprogress', function (e, data) {
    if (e.isDefaultPrevented()) {
        return false;
    }
    var progress = Math.floor(data.loaded / data.total * 100);
   	if (data.context) {
        $('#' + data.id.toString()).find('.progress')
            .attr('aria-valuenow', progress)
            .children().first().css(
                'width',
                progress + '%'
            );
    }
});
$('.cloudinary-fileupload').bind('cloudinarydone', function (e, data) {
	currentFileUploads--;
	row = $('#' + data.id.toString());
	btn = row.find('.cancel');
	btn.removeClass('btn-danger');
	btn.addClass('btn-default');
	btn.children().first().removeClass('glyphicon-ban-circle');
	statusField = row.find('.progress').parent();
	statusField.empty();
	errors = false;
	$.each(data.result.files, function (i, file) { if (file.error) { errors = true; }});
	if (!errors){
		console.log('Upload ' + data.id.toString() + ' finished');
		statusField.append('<i class="text-success glyphicon glyphicon-ok"></i>');
		btn.children().first().addClass('glyphicon-trash');
    	btn.click(function (e) {
	    	if (data.result.delete_token) {
	    		$.cloudinary.delete_by_token(data.result.delete_token);
	       	 	console.log('Upload ' + data.id.toString() + ' Deleted');
	    	}
	    	return false;
	    });
		if (currentFileUploads == 0 && doPost){
			doSubmit();  // AutoSend
		}
	} else {
		statusField.append('<i class="text-danger glyphicon glyphicon-remove"></i>');
		btn.children().first().addClass('glyphicon-alert');
		console.log('Upload ' + data.id.toString() + ' FAILS!');
	}
});
