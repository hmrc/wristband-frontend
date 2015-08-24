define(['deploy-button'], function (deploy_button) {

  var colourClass = 'teal';

  function setFixtures(html) {
    $('<div id="jasmine-fixtures">' + html + '</div>').appendTo('body');
  }

  beforeEach(function () {
    setFixtures('<table><tbody><tr><td class="stage"><div class="label">version 2</div></td><td class="deploy"><form><input name="version" value="1.0.1"><button class="button">Deploy</button></form><div class="buttons" style="display: none;">Deploying state</div></td><td class="stage"><div class="label">version 1</div></td></tr></body></table>');
    deploy_button.init();
  });

  describe("Deploy button", function () {

    it("changes the style of the deployable label on mouseover/mouseout", function () {

      $('.button').mouseover();

      expect($('.label:first').attr('class')).toContain(colourClass);

      $('.button').mouseout();

      expect($('.label:first').attr('class')).not.toContain(colourClass);
    });

    it("hides the form on click, and shows the deploying indicator", function () {

      $('.button').click();

      expect($('form').attr('style')).toContain('display: none;');

      expect($('.buttons').attr('style')).not.toContain('display: none;');
    });

    it("triggers a POST AJAX request on click", function () {
      sinon.spy(jQuery, 'ajax');

      $('.button').click();

      var args = jQuery.ajax.getCall(0).args[0];

      expect(args['type']).toEqual('POST');
      expect(args['url']).toEqual('/deploy');
      expect(args['data']).toEqual('version=1.0.1');

      jQuery.ajax.restore();
    });
  });

  afterEach(function () {
    $('#jasmine-fixtures').remove();
  });

});