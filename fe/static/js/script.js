(function (){

  // to provide immediate feedback, all buttons should change state on click
  $('button').click(function () {
    $(this).addClass('loading');
  });

}());