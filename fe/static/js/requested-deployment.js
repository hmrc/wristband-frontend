define(function () {
  var init = function () {
    var $trigger = $('.requested.button', '.table');

    $trigger.each(function () {
      var $this = $(this);

      $this.click(function (e) {
        var $steps = $('.steps', $this);
        var open = $steps.hasClass('open');

        $('.steps.open').hide().removeClass('open');

        if (!open && $(e.target).closest('.steps').length === 0) {
          $steps.show().addClass('open');

          $('body').data('opened', $this.attr('id'));
        }
      });
    });
  };

  return {
    init: init
  };
});