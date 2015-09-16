define(['deploy-button', 'filter-app-table-by-name', 'refresh-table', 'notifications', 'requested-deployment'],
  function (deploy_button, filter_app_table_by_name, refresh_table, notifications, requested_deployment) {

    // deploy-button: defines how the deploy button should act
    deploy_button.init();

    // filter-app-table-by-name: defines the behaviour for searching the apps table
    filter_app_table_by_name.init();

    $('.label.failed').closest('tr').addClass('error');

    // to provide immediate feedback, all buttons should change state on click
    $('button').click(function () {
      $(this).addClass('loading');
    });

    // ensure the first input is always focused
    $('input:first').focus();

    // every 5 seconds, trasparently refresh the page
    refresh_table.init({
      seconds: 5
    });

    // initialise notifications
    notifications.init();

    // initialise requested deployment steps
    requested_deployment.init();

    // on click on an element with # we highlight the element that was targeted
    $('body').on('click', '[href*="#"]', function  (e) {
      e.preventDefault();

      var $element = $('#' + $(this).attr('href').split('#')[1]);

      $element.find('.steps').hide().removeClass('open');

      $element.addClass('highlight');

      $('html, body').animate({
        scrollTop: $element.offset().top - $(window).height() / 2
      }, 500);

      setTimeout(function () {
        $element.removeClass('highlight');
      }, 5000);
    });
  }
);