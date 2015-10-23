define(['filter-app-table-by-name'], function (filter_app_table_by_name) {

  var init = function (config) {

    if ($('table').length > 0) {

      function refreshTable() {
        $.ajax({
          url: window.location.href,
          success: function (data) {
            if (data) {
              var $table = $('#app-table');

              $table.replaceWith($(data).find('#app-table'));

              filter_app_table_by_name.init();

              $('.label.failed').closest('tr').addClass('error');
            }
          },
          error: config.error || function (error) {
            if (error.status == 500) {
                /*  #FIXME 500s are periodically returned when docktor is being deployed or load
                           balancers are restarted. For now we'll ignore these..
                */
                console.log("error -> ", error);
            } else {
                // if there's an error that isn't a 500 you're probably not logged in, so reload
                window.location.reload();
            }
          },
          complete: function () {
            setTimeout(refreshTable, config.seconds * 1000);
          }
        });
      };
      refreshTable();
    }
  };

  // expose publics
  return {
    init: init
  };
});
