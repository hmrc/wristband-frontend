define(['deploy-button', 'filter-app-table-by-name', 'refresh-table'],
  function (deploy_button, filter_app_table_by_name, refresh_table) {

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
  }
);