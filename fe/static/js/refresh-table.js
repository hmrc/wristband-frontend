define(['filter-app-table-by-name'], function (filter_app_table_by_name) {

  var init = function (config) {

    if ($('table').length > 0) {

      setInterval(function () {
        $.ajax({
          url: 'http://localhost:5000',
          success: function (data) {
            if (data) {
              var $table = $('table');
              $table.after($(data).find('table'));
              $table.remove();

              filter_app_table_by_name.init();
            }
          },
          error: config.error || function () {
            // if there's an error, you're probably not logged in, so reload
            window.location.reload();
          },
          // this is imperative for the etag to work (in Chrome)
          ifModified: true
        });
      }, config.seconds * 1000);
    }
  };

  // expose publics
  return {
    init: init
  };
});