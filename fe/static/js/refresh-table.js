define(['filter-app-table-by-name', 'requested-deployment'],
  function (filter_app_table_by_name, requested_deployment) {

    var init = function (config) {

      if ($('table').length > 0) {

        setInterval(function () {
          $.ajax({
            url: window.location.href,
            success: function (data) {
              if (data) {
                var $table = $('#app-table');
                var $opened = $('#' + $('body').data('opened'));
                var opened = $opened.length > 0 && $('.steps', $opened).hasClass('open');

                $table.replaceWith($(data).find('#app-table'));

                filter_app_table_by_name.init();
                requested_deployment.init();

                if (opened) {
                  $('#' + $('body').data('opened')).click();
                }

                $('.label.failed').closest('tr').addClass('error');
              }
            },
            error: config.error || function () {
              // if there's an error, you're probably not logged in, so reload
              window.location.reload();
            }
          });
        }, config.seconds * 1000);
      }
    };

    // expose publics
    return {
      init: init
    };
  }
);
