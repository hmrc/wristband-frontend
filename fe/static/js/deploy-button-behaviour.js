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

  var deployingTemplate = function (version) {
    /*
      the DeployingTemplate is a very simple combo of two buttons to provide
        some context of the version being deployed and a loading spinner -
        http://semantic-ui.com/elements/button.html#buttons
    */
    return '<div class="ui buttons">' +
      '<button class="ui ' + colourClass + ' right icon button">' +
        '<span class="text">' + version + ' <i class="right arrow icon large-only"></i><i class="down arrow icon mobile-only"></i></span>' +
      '</button>' +
      '<button class="ui button loading ' + colourClass + '"></button>' +
    '</div>';
  };

  var setButtonAsDeploying = function ($this, version) {
    // hide this button, and revert label state
    $this.mouseout().hide();

    // add the DeployingTemplate
    $this.after(deployingTemplate(version));

    // add a class to the button to track state
    $this.closest('tr').addClass('deploying');
  };

  $('.deploy .button').each(function () {

    // cache DOM requests
    var $this = $(this);
    var $deploy = $this.closest('.deploy');
    var $prev = $deploy.prev('.stage');
    var $next = $deploy.next('.stage');
    var $row = $this.closest('tr');
    var $form = $this.closest('form');

    $this
      .mouseover(function () {
        // highlight the version that will be deployed
        if ($row.hasClass('deploying')) return false;

        $prev.find('.label').addClass(colourClass);
      })
      .mouseout(function () {
        // remove the highlight from the to-be-deployed version
        $prev.find('.label').removeClass(colourClass);
      })
      .click(function (e) {
        // prevent the form from submitting
        e.preventDefault();

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
        })
      })
    ;
  });
}());