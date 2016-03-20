// Scrollbar fix (You can't scroll in modal when closing an second modal)
$(document).on('hidden.bs.modal', '.modal', function () {
    $('.modal:visible').length && $(document.body).addClass('modal-open');
});
$('#modalBody').wysihtml5({		// Init wysihtml5 text editor
	toolbar: {
	      'font-styles': true,
	      'color': true,
	      'emphasis': {
	        'small': true
	      },
	      'blockquote': true,
	      'lists': true,
	      'html': true,
	      'link': true,
	      'image': false,
	      'smallmodals': true
	},
});
