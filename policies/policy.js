/**
 * Module dependencies.
 */
var acl = require("acl");

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke khub Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([
    {
      roles: ["view"],
      allows: [
        {
          resources: [
            "/corevine/api/user/",
            "/corevine/api/user/:id",
            "/corevine/api/player/",
            "/corevine/api/player/:id",
            "/corevine/api/playlist/",
            "/corevine/api/playlist/:id",
            "/corevine/api/group/",
            "/corevine/api/group/:id",
            "/corevine/api/content/",
            // "/corevine/api/content/media",
            "/corevine/api/content/:id",
            "/corevine/api/associate/",
            "/corevine/api/associate/children",
            "/corevine/api/associate/:id",
            "/corevine/api/schedule/",
            "/corevine/api/schedule/:id",
            "/corevine/api/media/:id",
            "/corevine/api/media/playlist/:id",
            "/corevine/api/media/file/:id",
          ],
          permissions: ["get"],
        },
      ],
    },
    {
      roles: ["player"],
      allows: [
        {
          resources: ["/corevine/api/player/", "/corevine/api/player/:id"],
          permissions: "*",
        },
      ],
    },
    {
      roles: ["group"],
      allows: [
        {
          resources: ["/corevine/api/group/", "/corevine/api/group/:id"],
          permissions: "*",
        },
      ],
    },
    {
      roles: ["playlist"],
      allows: [
        {
          resources: ["/corevine/api/playlist/", "/corevine/api/playlist/:id"],
          permissions: "*",
        },
      ],
    },
    {
      roles: ["schedule"],
      allows: [
        {
          resources: ["/corevine/api/schedule/", "/corevine/api/schedule/:id"],
          permissions: "*",
        },
      ],
    },
    {
      roles: ["content"],
      allows: [
        {
          resources: [
            "/corevine/api/content/",
            "/corevine/api/media/:id",
            "/corevine/api/media/playlist/:id",
            "/corevine/api/content/:id",
            "/corevine/api/media/file/:id",
          ],
          permissions: "*",
        },
      ],
    },
    {
      roles: ["associate"],
      allows: [
        {
          resources: [
            "/corevine/api/associate/",
            "/corevine/api/associate/children",
            "/corevine/api/associate/:id",
          ],
          permissions: "*",
        },
      ],
    },
    {
      roles: ["user"],
      allows: [
        {
          resources: ["/corevine/api/user/", "/corevine/api/user/:id"],
          permissions: "*",
        },
      ],
    },
    {
      roles: ["admin"],
      allows: [
        {
          resources: ["/corevine/api/log/"],
          permissions: "*",
        },
      ],
    },
  ]);
};

/**
 * Check If khub Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = req.user ? req.user.privileges : ["view"];
  const path = req.baseUrl + req.route.path;

  // Check for user roles
  acl.areAnyRolesAllowed(
    roles,
    path,
    req.method.toLowerCase(),
    function (err, isAllowed) {
      if (err) {
        // An authorization error occurred.
        return res.status(500).send("Unexpected authorization error");
      } else {
        if (isAllowed) {
          // Access granted! Invoke next middleware
          return next();
        } else {
          if (!req.user) {
            //If user is not present
            return res.status(401).json({
              message: "You need to signin to continue",
            });
          } else {
            return res.status(403).json({
              //this means user is present, but he does not have authorization
              msg: "User is not authorized",
            });
          }
          // return res.status(403).json({
          //   message: 'User is not authorized'
          // });
        }
      }
    }
  );
};
