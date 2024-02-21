const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
  try {
    debug('auth');
    const token = req.headers.authorization.split(' ')[1];
    if (!token)
      return res.status(401).json({ msg: 'No auth token, access denied' });

    const verified = jwt.verify(token, process.env.JWT_KEY);
    debug(verified);
    if (!verified) {
      return res
        .status(401)
        .json({ msg: 'Token verification failed, authorization denied.' });
    }

    req.user = verified.userId;
    req.token = token;
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = auth;
