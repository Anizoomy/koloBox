const { User } = require('../models');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const { sendMail } = require('../utils/sendMail');
const { signupMail } = require('../utils/signupMail');
const { passwordResetMail } = require('../utils/resetPasswordMail')
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        
        const { name, email, phone, password} = req.body;

        const existingUser = await User.findOne({ where: { email }});

        if (existingUser) {
            return res.status(400).json({
                message: 'User already exists'
            })
        }

        const saltRound = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, saltRound);
        
        // to generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        

        const user = await User.create({
            id: uuidv4(),
            name,
            email,
            phone,
            password: hashPassword,
            otp,
            otpExpiry: Date.now() + 5 * 60 * 1000, // it will expire within 5 minutes 
            isVerified: false
        });
        // console.log(`otp for ${email}: ${otp}`);

        await sendMail({
            email: user.email,
             subject: 'Verify Your Splita Account',
             html:signupMail(otp, user.name)
        }) 

        res.status(201).json({
            message: 'User registered successfully.',
            data: user
        })
        
    } catch (error) {
        res.status(500).json({
            message: 'Internal Server Error',
            error: error.message
        })
    }
};

exports.verifyEmail = async (req, res) => {
    try {

        const { email, otp } = req.body;

        const user = await User.findOne({ where: { email }});

        if (!user) {
            return res.status(404).json({
                message: ' User not found'
            });
        }

        if (user.isVerified) {
            return res.status(400).json({
                message: "User already verified"
            });
        }

        if (user.otp !== otp) {
            return res.status(400).json({
                message: "Invalid OTP"
            });
        }

        if (user.otpExpiry < Date.now()) {
            return res.status(400).json({
                message: "OTP has expired"
            });
        }

        user.isVerified = true;
        user.otp = null;
        user.otpExpiry = null;

        await user.save();

        const token = jwt.sign({
            id: user.id,
            email: user.email
        }, process.env.JWT_SECRET, {
             expiresIn: '1d'
            });

        res.status(200).json({
            message: "Email verified successfullyy",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                isVerified: user.isVerified
            }
        });

    } catch (error) {
        res.status(500).json({
            message: 'Internal Server Error',
            error: error.message 
        })
    }
};

exports.login = async (req, res) => {
    try {

        const { email, password } = req.body;

        const user = await User.findOne({ where: { email }});

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                message: 'Invalid credentials'
            });
        }

        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
            expiresIn: '1d'
        });

        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                isVerified: user.isVerified
            }
        });

    } catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        })
    }
};

exports.resendOtp = async (req, res) => {

    try {

        const { email } = req.body;

        const user = await User.findOne({ where: { email }});

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }
        if (user.isVerified) {
            return res.status(400).json({
                message: 'User already verified'
            });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = Date.now() + 5 * 60 * 1000;

        user.otp = otp;
        user.otpExpiry = otpExpiry;

        await user.save();

        await sendMail({
            email: user.email,
            subject: 'Your New Solita Verification Code',
            html: signupMail(otp, user.name)
        });

        res.status(200).json({
            message: 'OTP resent successfully',
            email: user.email
        });

    } catch {
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        })
    }
};


exports.deleteUser = async (req, res) => {
    try {
        
        const userId = req.params.id;

        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        await user.destroy();

        res.status(200).json({
            message: 'User deleted successfully'
        });

    } catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        })
    }
};


exports.forgotPassword = async (req, res) => {
    try {
        
        const { email } = req.body;

        const user = await User.findOne({ where: { email }});

        if(!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

    //     const resetToken = jwt.sign({
    //         id: user.id,
    //         email: user.email
    //     }, process.env.JWT_SECRET, { expiresIn: '10m' }
    // );

    // const resetLink = `${req.protocol}://${req.get(
    //   "host"
    // )}/api/v1/user/reset-password?token=${resetToken}`;

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = Date.now() + 5 * 60 * 1000;

    user.otp = otp;
    user.otpExpiry = otpExpiry;

    await user.save();

    
    const html = passwordResetMail(user.name, otp);
    await sendMail({
      email: user.email,
      subject: "Reset Your Password",
      html,
    });

    
    return res.status(200).json({
      message: "Password reset link sent successfully. check your mail",
      otp

    })

    } catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        })
    }
};


exports.resetPassword = async (req, res) => {
  try {
    const { otp, newPassword, confirmNewPassword } = req.body;

    if (!otp || !newPassword || !confirmNewPassword) {
      return res.status(400).json({
         message: "otp and new password and confirm new password required"
         });
    }

    if (newPassword !== confirmNewPassword) {
        return res.status({
            message: 'Password do not match'
        })
    }

    // Find user by the otp being stored in the user database
    const user = await User.findOne({ where: { otp } });
    
    if (!user) {
        return res.status(400).json({
             message: 'Invalid OTP'
        });
    } 

    if (Date.now() > user.otpExpiry) {
        return res.status(400).json({
            message: 'OTP has expired'
        })
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    
    res.status(400).json({ 
        message: "Invalid or expired otp",
        error: error.message 
    });
}
};


exports.getAllUsers = async (req, res) => {

  try {

    const users = await User.findAll({

      attributes: { exclude: ['password', 'otp', 'otpExpiry'] },

    });

    res.status(200).json({
        message: 'All users fetch successfully',
        data: users
    });

  } catch (err) {
    res.status(500).json({
         message: 'Server error',
         error: err.message
     });
  } 
};


