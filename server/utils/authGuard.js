// Shared auth helpers (stopgap — see note below).
//
// The client authenticates with Firebase on the frontend, but this API has no
// Firebase Admin verification yet, so there is no unforgeable server-side
// identity. These middlewares raise the bar using server-side facts:
//
// - requireAdmin: the caller must present an `x-user-id` that belongs to a
//   User document whose role is "admin". User _ids are opaque (no list-users
//   endpoint) and roles live only in MongoDB, so random callers cannot pass.
// - requireOwner(getTargetId): the `x-user-id` caller must equal the resource
//   owner id targeted by the request (body/query/params).
//
// UPGRADE PATH (logged in docs/suggestions.md): verify Firebase ID tokens
// with firebase-admin (FIREBASE_SERVICE_ACCOUNT) and derive identity from the
// verified token instead of the header. Until then the client sends its own
// _id via an axios default header (see client UserContext).
const User = require("../models/userModel");

function callerId(req) {
  return (
    req.headers["x-user-id"] ||
    (req.body && (req.body.userId || req.body.id || req.body.user)) ||
    req.query.userId ||
    null
  );
}

async function requireAdmin(req, res, next) {
  try {
    const id = callerId(req);
    if (!id) {
      return res.status(401).json({ error: "Admin identity required" });
    }
    const user = await User.findById(id).select("role").lean();
    if (!user || user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }
    req.adminUser = user;
    next();
  } catch (err) {
    res.status(500).json({ error: "Admin check failed" });
  }
}

function requireOwner(getTargetId) {
  return async (req, res, next) => {
    try {
      const headerId = req.headers["x-user-id"];
      if (!headerId) {
        return res.status(401).json({ error: "x-user-id header required" });
      }
      const targetId = getTargetId(req);
      if (!targetId || String(targetId) !== String(headerId)) {
        return res.status(403).json({ error: "Not the resource owner" });
      }
      const user = await User.findById(headerId).select("_id").lean();
      if (!user) {
        return res.status(401).json({ error: "Unknown user" });
      }
      next();
    } catch (err) {
      res.status(500).json({ error: "Ownership check failed" });
    }
  };
}

module.exports = { requireAdmin, requireOwner, callerId };
