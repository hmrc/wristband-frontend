/*
  deploy-button-behaviour: defines how the deploy button should act

  This behaviour IS intended to be reused outside of the spike.
*/

(function () {
  /*
    in case we want to change the Semantic UI colour scheme later -
      http://semantic-ui.com/elements/button.html#colored
  */
  var colourClass = 'teal';

  var setButtonAsDeploying = function ($this, version) {
    // revert label state
    $this.mouseout();

    // showing the deploying state
    $this.closest('form').hide().next('.buttons').show();

    // add a class to the button to track state
    $this.closest('tr').addClass('deploying');
  };

  $('body').on('click', '.deploy .button', function (e) {
    // prevent the form from submitting
    e.preventDefault();

    var $this = $(this);
    var $deploy = $this.closest('.deploy');
    var $prev = $deploy.prev('.stage');
    var $form = $this.closest('form');

    setButtonAsDeploying($this, $prev.find('.label').text());

    $.ajax({
      type: 'POST',
      url: '/deploy',
      data: $form.serialize(),
      success: function (data) {
        /*
          we maybe don't want to do anything here?
            the /deploy POST should push updates to all UIs to say the
            button was clicked, and a deployment is in progress
        */
      }
    });
  });

  $('body').on('mouseover', '.deploy .button', function () {
    var $this = $(this);
    var $deploy = $this.closest('.deploy');
    var $prev = $deploy.prev('.stage');
    var $row = $this.closest('tr');

    // highlight the version that will be deployed
    if ($row.hasClass('deploying')) return false;

    $prev.find('.label').addClass(colourClass);
  });

  $('body').on('mouseout', '.deploy .button', function () {
    var $this = $(this);
    var $deploy = $this.closest('.deploy');
    var $prev = $deploy.prev('.stage');

    // remove the highlight from the to-be-deployed version
    $prev.find('.label').removeClass(colourClass);
  });
}());