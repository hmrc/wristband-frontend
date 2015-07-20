var robohydra     = require('robohydra'),
    path          = require("path"),
    RoboHydraHead = robohydra.heads.RoboHydraHead,
    RoboHydraHeadFilesystem = robohydra.heads.RoboHydraHeadFilesystem;

exports.getBodyParts = function(conf) {
    return {
        heads: [
          new RoboHydraHead({
              name: 'Promote Service (text/event-stream)',
              path: '/api/promote',
              handler: function(req, res) {
                  res.headers['content-type'] = 'text/event-stream';
                  for (var i = 0, len = 5; i < len; i++) {
                      res.write(new Buffer("Some data here -> " + i + "\n"));
                  }
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
