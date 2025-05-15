// === /controllers/userController.js ===
const User = require('../models/User');

//  Get all users
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (err) {
    next(err);
  }
};

// get user by id
exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    next(err);
  }
};

// create user
exports.createUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    
    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'user' // Default to 'user' if role not specified
    });
    
    res.status(201).json({
      success: true,
      data: user
    });
  } catch (err) {
    next(err);
  }
};


// update user
exports.updateUserById = async (req, res, next) => {
  try {
    // Admin check is already handled by the middleware
    // Proceed with the user update process

    let user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Check if password is being updated and hash it
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }

    // Perform the update
    user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        error: 'Failed to update user'
      });
    }

    // Return the updated user data
    res.status(200).json({
      success: true,
      data: user
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

  // delete user
exports.deleteUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    await user.deleteOne();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};