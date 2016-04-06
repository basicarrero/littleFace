// SideBar Actions
$("#bar-toggle").click(function(e) {
    e.preventDefault();
    $("#wrapper").toggleClass("toggled");
});
$(".bar-header").click(function(e) {
    e.preventDefault();
	if ($(e.target).hasClass('sidebar-active-text')){
		$(e.target).removeClass('sidebar-active-text');
	} else {
		$(e.target).addClass('sidebar-active-text');
	}
});
// Scrollbar fix (You can't scroll in modal when closing an second modal)
$(document).on('hidden.bs.modal', '.modal', function () {
    $('.modal:visible').length && $(document.body).addClass('modal-open');
});
// Init wysihtml5 text editor
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
