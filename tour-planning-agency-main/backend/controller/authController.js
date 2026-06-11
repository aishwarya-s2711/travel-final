const User = require('../model/User');
const { generateToken } = require('../utlis/jwt');

exports.signup = async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }
    
    if (await User.findOne({ email })) {
      return res.status(400).json({ message: 'Email already registered' });
    }
    
    const user = await User.create({ name, email, phone, password, role: 'user' });
    const token = generateToken(user._id, user.role);
    
    return res.status(201).json({ 
      token, 
      user: { id: user._id, name: user.name, email: user.email, role: user.role } 
    });
  } catch (err) {
    console.error('Signup error:', err);
    return res.status(500).json({ message: err.message || 'Signup failed' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    const token = generateToken(user._id, user.role);
    
    return res.json({ 
      token, 
      user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar } 
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: err.message || 'Login failed' });
  }
};

exports.getMe = async (req, res) => {
  res.json(req.user);
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;
    const user = await User.findByIdAndUpdate(req.user._id, { name, phone }, { new: true }).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: 'Email not found' });
    
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetToken = otp;
    user.resetTokenExpiry = Date.now() + 15 * 60 * 1000; // 15 minutes
    await user.save();
    
    console.log(`[SECURITY] Password reset OTP for ${email}: ${otp}`);
    res.json({ success: true, message: 'OTP generated. Please check your email.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    
    if (!otp || user.resetToken !== otp || user.resetTokenExpiry < Date.now()) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }
    
    user.password = newPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();
    
    res.json({ success: true, message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.changePassword = async (req, res) => { try { const user = await require('../model/User').findById(req.user._id); if (!user) return res.status(404).json({ message: 'User not found' }); const isMatch = await user.comparePassword(req.body.currentPassword); if (!isMatch) return res.status(400).json({ message: 'Incorrect current password' }); user.password = req.body.newPassword; await user.save(); res.json({ message: 'Password updated successfully' }); } catch (err) { res.status(500).json({ message: err.message }); } };