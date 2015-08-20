(function (){

  // to provide immediate feedback, all buttons should change state on click
  $('button').click(function () {
    $(this).addClass('loading');
  });

  // every 5 minutes, trasparently refresh the page
  setInterval(function () {
    $.ajax({
      url: window.location.href,
      success: function (data) {
          var $table = $('table');
          $table.after($(data).find('table'));
          $table.remove();
      },
      error: function () {
        // if there's an error, you're probably not logged in, so redirect
        window.location.reload();
      }
    });
  }, 5 * 60 * 1000);

}());