// roles: admin, manager, user
// permit(...roles) - allow only users whose role is in the allowed list
// ownerOr(...roles) - allow if user is resource owner (id match in params/body) OR has any of the provided roles


const permit = (...allowed) => {
const allowedSet = new Set(allowed);
return (req, res, next) => {
if (!req.user) return res.status(401).json({ message: 'Not authenticated' });
if (!allowedSet.has(req.user.role)) return res.status(403).json({ message: 'Forbidden' });
next();
};
};


const ownerOr = (...roles) => {
const allowedSet = new Set(roles);
return (req, res, next) => {
if (!req.user) return res.status(401).json({ message: 'Not authenticated' });


// if user has one of the allowed roles, proceed
if (allowedSet.has(req.user.role)) return next();


// otherwise check ownership: userId in params or body
const targetId = req.params.userId || req.params.id || req.body.userId || req.body.id;
if (!targetId) return res.status(400).json({ message: 'Missing target user id for ownership check' });


if (req.user._id && req.user._id.toString() === targetId.toString()) return next();


return res.status(403).json({ message: 'Forbidden' });
};
};


module.exports = { permit, ownerOr };