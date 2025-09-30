const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');
const { signAccessToken, signRefreshToken } = require('../utils/token');

const createToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1h'}
  );
};

// @desc    Signup new user
exports.signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Email already taken' });
    }

    const allowedSignupRoles = ["user", "manager"];
    
    // Log if someone attempts to self-assign an unauthorized role
    if (role && !allowedSignupRoles.includes(role)) {
      console.warn(`Unauthorized role assignment attempt: ${role} from email: ${email}`);
    }

    const assignedRole = role && allowedSignupRoles.includes(role) ? role : "user";

    const user = await User.create({
      name,
      email,
      password,
      role: assignedRole
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: createToken(user),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// @desc    Login user
exports.login = async (req, res) => {
  try {
    /*console.log("Email:", email);
    console.log("Password:", password);*/

    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'Email and password required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid email' });

    const isMatch = await bcrypt.compare(password, user.password); 
    if (!isMatch) return res.status(401).json({ message: 'Invalid password' });

    const accessToken = signAccessToken({ sub: user._id, role: user.role });
    const refreshToken = await signRefreshToken(user._id);

    res.json({
      accessToken,
      refreshToken,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Refresh access token
exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ message: 'Missing refresh token' });

    const stored = await RefreshToken.findOne({ token: refreshToken });
    if (!stored || stored.revoked)
      return res.status(401).json({ message: 'Invalid refresh token' });

    try {
      const payload = jwt.verify(refreshToken, process.env.JWT_SECRET);
      const user = await User.findById(payload.sub);
      if (!user) return res.status(401).json({ message: 'User not found' });

      const newAccessToken = signAccessToken({ sub: user._id, role: user.role });
      res.json({ accessToken: newAccessToken });
    } catch (err) {
      stored.revoked = true;
      await stored.save();
      return res.status(401).json({ message: 'Invalid refresh token' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Logout user (invalidate refresh token)
exports.logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken)
      return res.status(400).json({ message: 'Missing refresh token' });

    const stored = await RefreshToken.findOne({ token: refreshToken });
    if (stored) {
      stored.revoked = true;
      await stored.save();
    }

    res.json({ message: 'Logged out' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
