define(['refresh-table'], function (refresh_table) {

  var seconds = 10;

  function setFixtures(html) {
    $('<div id="jasmine-fixtures">' + html + '</div>').appendTo('body');
  }

  var tableHTML = '<table><thead><tr><th>App</th></tr></thead><tbody><tr><td>name</td></tr></tbody></table>';

  beforeEach(function () {
    setFixtures(tableHTML);
    jasmine.clock().install();
  });

  describe("Refresh table", function () {

    it("reinjects the current page every " + seconds + " seconds", function () {
      sinon.spy(jQuery, 'ajax');

      refresh_table.init({seconds: seconds});

      jasmine.clock().tick((seconds * 1000) + 1000);

      var args = jQuery.ajax.getCall(0).args[0];

      args['success']('<body><div>' + tableHTML.replace('<td>', '<td>updated') + '</div></body>');

      expect($('table').text()).toContain('updated');

      jQuery.ajax.restore();
    });

    it("forces a full page reload if an error is returned", function () {
      sinon.spy(jQuery, 'ajax');

      var errorSpy = sinon.spy();

      refresh_table.init({
        seconds: seconds,
        error: errorSpy
      });

      jasmine.clock().tick((seconds * 1000) + 1000);

      // trigger the error callback
      jQuery.ajax.getCall(0).args[0]['error']();

      expect(errorSpy.called).toEqual(true);

      jQuery.ajax.restore();
    });

  });

  afterEach(function () {
    $('#jasmine-fixtures').remove();
    jasmine.clock().uninstall();
  });

});