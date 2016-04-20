// SideBar Actions
$("#bar-toggle").click(function(e) {
    e.preventDefault();
    $("#wrapper").toggleClass("toggled");
    $("#bar-ico").toggleClass("rotate180");
});
// Scrollbar fix (You can't scroll in modal when closing an second modal)
$(document).on('hidden.bs.modal', '.modal', function () {
    $('.modal:visible').length && $(document.body).addClass('modal-open');
});
