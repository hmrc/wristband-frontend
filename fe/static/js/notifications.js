define(function () {
  var $menu = $('.right.menu');
  var $trigger = $('.dropdown', $menu);
  var $notifications = $('.notifications', $menu);
  var $feed = $('.feed', $menu);
  var $label = $('.label.red', $menu);

  var $requesteds = $('.requested', '.table').closest('tr');

  // this should obviously be handled by the Jinja templates when the data exists
  var template = '<div class="event">' +
    '<div class="label">' +
      '<i class="right arrow icon"></i>' +
    '</div>' +
    '<div class="content">' +
      '<div class="summary">' +
        '<strong>' +
          'kalbir' +
        '</strong> requested a production deployment of <a href="#{name}">{name}</a>' +
        '<div class="date">' +
          '1 Hour Ago' +
        '</div>' +
      '</div>' +
    '</div>' +
  '</div>';

  if (window.Notifications && Notification.permission !== 'denied') {
    Notification.requestPermission();
  }

  var notify = function (title, obj) {
    if ('Notification' in window && Notification.permission === 'granted') {
      var notification = new Notification(title, obj);

      setTimeout(function () {
        notification.close();
      }, 5000);
    }
  };

  var init = function () {

    $requesteds.each(function () {
      $feed.append(template.replace(/{name}/g, this.id));
    });

    notify('Wristband', {body:'You have ' + $requesteds.length + ' new messages!'});

    $label.text($requesteds.length).show();

    $trigger.click(function (e) {
      // don't toggle if the user has clicked on .notifications
      if ($(e.target).closest('.notifications').length === 0 || $(e.target).is('a')) {
        $notifications.toggle();
      }
    });
  };

  return {
    init: init,
    notify: notify
  };
});