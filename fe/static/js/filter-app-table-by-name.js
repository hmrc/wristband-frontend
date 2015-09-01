/*
  filter-app-table-by-name: defines the behaviour for searching the apps table

  This behaviour IS intended to be reused outside of the spike.
*/

define(function () {

  // basic keys mapping
  var keys = {
    'ZERO': 48,
    'BACKSPACE': 8
  };

  var resultsTable;

  function lookup() {
    // perform the DataTable lookup based on the input value
    resultsTable.column(0).search($('.search.form input').val() || '').draw();
  }

  var init = function () {

    // use the DataTable plugin for filtering the apps table
    resultsTable = $('table').DataTable({
      'paging': false,
      'ordering': false,
      'info': false
    });

    lookup();

    var keyupTimeout;

    $('.search.form').off('submit.filter').on('submit.filter', function (e) {
      e.preventDefault();
    });

    $('body').off('keydown.filter').on('keydown.filter', function (e) {
      if (e.which > keys.ZERO) {
        $('.search.form input').focus();
      }
    });

    $('.search.form input').off('keyup.filter').on('keyup.filter', function (e) {

      /*
        if the user hasn't entered a 'valuable' key, such as a number, letter,
          symbol, or backspace. Intended to avoid lookups taking place when the
          user hits an arrow key, or any other key that isn't likely to have been
          hit in an attempt to search
      */
      if (!(e.which > keys.ZERO || e.which === keys.BACKSPACE)) return false;

      clearTimeout(keyupTimeout);

      // cache DOM requests
      var $this = $(this);
      var $input = $this.closest('.input');

      $input.addClass('loading');

      // perform the DataTable lookup based on the input value
      lookup();

      /*
        simulate a 250ms lookup time. In reality it's instantaneous, but the feedback
          provides good user experience
      */
      keyupTimeout = setTimeout(function () {
        $input.removeClass('loading');
      }, 250);
    });
  };

  // expose publics
  return {
    init: init
  };
});