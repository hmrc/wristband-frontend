var robohydra     = require('robohydra'),
  path          = require('path'),
  RoboHydraHead = robohydra.heads.RoboHydraHead,
  RoboHydraHeadFilesystem = robohydra.heads.RoboHydraHeadFilesystem,
  Response      = robohydra.Response;

var promotionMessages = [
  sse('queued', '{"status": "ok"}'),
  sse('building', '{"buildUrl": "http://www.example.com", "percent": 25}'),
  sse('building', '{"buildUrl": "http://www.example.com", "percent": 50}'),
  sse('building', '{"buildUrl": "http://www.example.com", "percent": 75}'),
  sse('building', '{"buildUrl": "http://www.example.com", "percent": 100}'),
  sse('success', '{"status": "ok"}')
];

var delayedWrite = function(req, res, next) {
  var wait = 200;

  var res2 = new Response().
    on('head', function(head) {
      res.writeHead(head.statusCode, head.headers);
    }).
    on('data', function(evt) {
      wait = wait * 2;
      setTimeout(function() {
        res.write(evt.data);
      }, wait);
    }).
    on('end', function() {
      wait = wait * 2;
      setTimeout(function() {
        res.end();
      }, wait);
    });
  next(req, res2);
}

function sse(event, data) {
  return [
    'event: ' + event,
    'data: ' + data + "\n\n"
  ].join("\n");
}

exports.getBodyParts = function() {
  "use strict";

  return {
    heads: [
      new RoboHydraHead({
        name: 'App Promotions (staggered response)',
        path: '/api/v1/promote/.*',
        handler: delayedWrite
      }),

      new RoboHydraHead({
        name: 'App Promotions (text/event-stream)',
        path: '/api/v1/promote/.*',
        // method: 'POST',
        handler: function(req, res) {
          res.headers['content-type'] = 'text/event-stream';
          promotionMessages.forEach(function(msg) {
            res.write(msg);
          });
          res.end();
        }
      }),

      new RoboHydraHeadFilesystem({
        name: 'Static JSON fixtures',
        documentRoot: path.join(__dirname, '/../../fixtures')
      })
    ]
  };
};
