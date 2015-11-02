define(['filter-app-table-by-name'], function (filter_app_table_by_name) {

  var init = function (config) {

    if ($('table').length > 0) {

      function refreshTable() {
        $.ajax({
          _retry_count: 0,
          url: window.location.href,
          success: function (data) {
            if (data) {
              var $table = $('#app-table');

              $table.replaceWith($(data).find('#app-table'));

              filter_app_table_by_name.init();

              $('.label.failed').closest('tr').addClass('error');
              this._retry_count = 0;
            }
          }.bind(this),
          error: config.error || function (error) {
            if (this._retry_count > 5 && (error.status == 500 || error.status == 502)) {
                /*  #FIXME 500s are periodically returned when docktor is being deployed or load
                           balancers are restarted. For now we'll ignore these..
                */
                console.log("error -> ", error);
            } else {
                // if there's an error that isn't a 500 you're probably not logged in, so reload
                window.location.reload();
            }
          }.bind(this),
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
