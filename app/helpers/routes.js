const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.redirect("/");
};

const isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) return next();
  res.redirect("/");
};

const isAdmin = (req, res, next) => {
  if (req.user.role === "admin") return next();
  res.send("You don`t have admin permition!");
};

const isBlocked = (req, res, next) => {
  if (req.user.blocked) return res.redirect("/");
  next();
}

module.exports = { isLoggedIn, isNotLoggedIn, isAdmin, isBlocked };
