/*
  filter-app-table-by-name: defines the behaviour for searching the apps table

  This behaviour IS intended to be reused outside of the spike.
*/

(function () {
  // basic keys mapping
  var keys = {
    'ZERO': 48,
    'BACKSPACE': 8
  };

  // use the DataTable plugin for filtering the apps table
  var resultsTable = $('table').DataTable({
    'paging': false,
    'ordering': false,
    'info': false
  });

  window.setResultsTable = function ($newTable) {
    resultsTable = $newTable.DataTable({
      'paging': false,
      'ordering': false,
      'info': false
    });

    lookup();
  };

  var keyupTimeout;

  function lookup() {
    // perform the DataTable lookup based on the input value
    resultsTable.search($('.search.form input').val()).draw();
  }

  $('.search.form input').keyup(function (e) {
    clearTimeout(keyupTimeout);

    /*
      if the user hasn't entered a 'valuable' key, such as a number, letter,
        symbol, or backspace. Intended to avoid lookups taking place when the
        user hits an arrow key, or any other key that isn't likely to have been
        hit in an attempt to search
    */
    if (!(e.which > keys.ZERO || e.which === keys.BACKSPACE)) return false;

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
}());