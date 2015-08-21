(function (){

  // to provide immediate feedback, all buttons should change state on click
  $('button').click(function () {
    $(this).addClass('loading');
  });

  $('input:first').focus();

  // every 10 seconds, trasparently refresh the page
  setInterval(function () {
    $.ajax({
      url: window.location.href,
      success: function (data) {
          var $table = $('table');
          $table.after($(data).find('table'));
          $table.remove();

          setResultsTable($('table'));
      },
      error: function () {
        // if there's an error, you're probably not logged in, so redirect10 *
        window.location.reload();
      }
    });
  }, 10 * 1000);

}());