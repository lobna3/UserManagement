
const User = require('../model/user.js')
const ValidateRegister = require("../validation/Register.js")
const ValidateLogin = require("../validation/Login.js")
const jwt = require('jsonwebtoken') // Bibliothèque pour créer des tokens JWT
const bcrypt = require('bcryptjs') //  Bibliothèque pour hacher les mots de passe.
require("dotenv").config()
const nodemailer = require('nodemailer'); //to send the email
const crypto = require('crypto');  //to generate a unique token for email verification.

const transporter = nodemailer.createTransport({
    service: 'Gmail', // or your preferred service
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

module.exports = {

    Register: async function (req, res) {

        const { errors, isValid } = ValidateRegister(req.body);
        try {
            // Step 1: Validate input fields
            if (!isValid) {
                return res.status(400).json(errors);
            }

            // Step 2: Check if the email already exists in the database
            const existingUser = await User.findOne({ email: req.body.email });
            if (existingUser) {
                // Step 3: If the email already exists, check if it is verified
                if (existingUser.emailVerified) {
                    // If the user already exists and is verified, send an error
                    errors.email = "User already exists with this email and is already verified.";
                    return res.status(400).json(errors);
                } else {
                    // Step 4: If the email exists but is not verified, resend the verification email

                    // Generate a new verification token
                    const emailVerificationToken = crypto.randomBytes(32).toString('hex');
                    const emailVerificationTokenExpires = Date.now() + 3600000; // Token expires in 1 hour

                    // Update the user with the new verification token and expiration time
                    existingUser.emailVerificationToken = emailVerificationToken;
                    existingUser.emailVerificationTokenExpires = emailVerificationTokenExpires;

                    // Create the verification URL
                    const verificationUrl = `${process.env.BASE_URL}/api/users/verify-email?token=${emailVerificationToken}`;

                    // Set up the email message to resend the verification link
                    const mailOptions = {
                        from: process.env.EMAIL_USER,
                        to: existingUser.email,
                        subject: 'Resend Email Verification',
                        html: `<p>Click <a href="${verificationUrl}">here</a> to verify your email and complete the registration process.</p>`,
                    };

                    // Send the email again
                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            console.error('Error sending email:', error);
                            return res.status(500).json({ error: 'Error sending email verification.' });
                        }
                        console.log('Email sent:', info.response);
                    });

                    // Return a response informing the user that a new verification email has been sent
                    return res.status(200).json({
                        message: 'A new verification email has been sent. Please check your inbox.'
                    });
                }
            }

            // Step 5: If the email does not exist, proceed to create a new user
            const hashedPassword = await bcrypt.hash(req.body.password, 10);

            // Generate a verification token for the new user
            const emailVerificationToken = crypto.randomBytes(32).toString('hex');
            const emailVerificationTokenExpires = Date.now() + 3600000; // Token expires in 1 hour

            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                password: hashedPassword,
                role: 'USER',  // Default role
                emailVerificationToken,
                emailVerificationTokenExpires,
            });

            // Step 6: Save the new user to the database
            const savedUser = await newUser.save();
            console.log(savedUser)

            // Step 7: Create the email verification URL
            const verificationUrl = `http://127.0.0.1:5000/api/users/verify-email?token=${emailVerificationToken}`;

            // Step 8: Set up the email message to send the verification link
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: req.body.email,
                subject: 'Email Verification',
                html: `<p>Click <a href="${verificationUrl}">here</a> to verify your email and complete the registration process.</p>`,
            };

            // Step 9: Send the email with the verification link
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Error sending email:', error);
                    return res.status(500).json({ error: 'Error sending email verification.' });
                }
                console.log('Email sent:', info.response);
            });

            // Step 10: Respond to the user with a success message
            return res.status(201).json({
                message: "User created successfully. Please verify your email to complete the registration."
            });

        } catch (error) {
            console.error('Error registering user:', error);
            return res.status(500).json({ error: error.message });
        }
    },

    VerifyEmail: async function (req, res) {
        const { token } = req.query;
    
        // Verify if the token is present in the request
        if (!token) {
            return res.status(400).json({ error: 'Token is required.' });
        }
    
        try {
            console.log("Received token:", token); // Debugging to ensure the token is received
    
            // Step 1: Find the user by emailVerificationToken and ensure token has not expired
            const user = await User.findOne({
                emailVerificationToken: token, // Use emailVerificationToken to find the user
                emailVerificationTokenExpires: { $gt: Date.now() }, // Ensure token has not expired
            });
    
            // If no user is found or if the token is expired
            if (!user) {
                return res.status(400).json({ error: 'Invalid or expired token.' });
            }
    
            // Step 2: Mark the email as verified
            const updatedUser = await User.findOneAndUpdate(
                { emailVerificationToken: token }, // Find the user using the emailVerificationToken
                {
                    $set: {
                        emailVerified: true, // Mark the email as verified
                        emailVerificationToken: undefined,  // Clear the verification token
                        emailVerificationTokenExpires: undefined,  // Clear the token expiration date
                    }
                },
                { new: true } // Return the updated user document
            );
    
            console.log("Updated user:", updatedUser);
    
            // Step 3: Return a success response
            return res.status(200).json({
                message: 'Email verified successfully. Your account is now activated.',
                user: updatedUser  // Optional: Return the updated user object
            });
    
        } catch (error) {
            console.error('Error verifying email:', error);
            return res.status(500).json({ error: 'Error verifying email.' });
        }
    },
    
    
    Login: async function (req, res) {
        const { errors, isValid } = ValidateLogin(req.body);

        try {
            // Step 1: Validate input fields
            if (!isValid) {
                return res.status(404).json(errors);
            }

            // Step 2: Find the user by email
            User.findOne({ email: req.body.email })
                .then(user => {
                    if (!user) {
                        errors.email = "User not found";
                        return res.status(404).json(errors);
                    }

                    // Step 3: Compare the password
                    bcrypt.compare(req.body.password, user.password)
                        .then(isMatch => {
                            if (!isMatch) {
                                errors.password = "Incorrect password";
                                return res.status(404).json(errors);
                            } else {
                                // Step 4: Generate Access Token
                                const accessToken = jwt.sign(
                                    {
                                        id: user._id,
                                        name: user.name,
                                        email: user.email,
                                        role: user.role
                                    },
                                    process.env.JWT_SECRET,  // Secret key from your environment
                                    { expiresIn: '1h' }  // Access token expires in 1 hour
                                );

                                // Step 5: Generate Refresh Token
                                const refreshToken = jwt.sign(
                                    { id: user._id },
                                    process.env.JWT_SECRET,  // Secret key from your environment
                                    { expiresIn: '7d' }  // Refresh token expires in 7 days
                                );

                                // Optionally, save the refresh token in the database for future revocation (not done here)
                                // user.refreshToken = refreshToken;
                                // await user.save();  // Uncomment if you want to store the refresh token in the DB

                                // Step 6: Send both access and refresh tokens in the response
                                return res.status(200).json({
                                    message: "Login successful",
                                    accessToken: "Bearer " + accessToken,  // Access token sent as Bearer token
                                    refreshToken: refreshToken,  // Refresh token sent as a plain string
                                    user: user
                                });
                            }
                        });
                })
                .catch(error => {
                    console.error(error);
                    return res.status(500).json({ error: error.message });
                });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: error.message });
        }
    },

    Logout: async function (req, res) {
        try {
            return res.status(200).json({
                message: "Logout successful. Please remove your token from local storage."
            });
        } catch (error) {
            console.error("Error during logout:", error);
            return res.status(500).json({ error: "Error logging out." });
        }
    },

    ForgotPassword: async function (req, res) {
        const { email } = req.body;

        try {
            // Step 1: Find user by email
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(404).json({ error: 'No user found with this email.' });
            }

            // Step 2: Generate a password reset token
            const resetToken = crypto.randomBytes(32).toString('hex');
            const resetTokenExpires = Date.now() + 3600000;  // Token expires in 1 hour

            // Step 3: Save the reset token and expiration time to the user's document
            user.passwordResetToken = resetToken;
            user.passwordResetTokenExpires = resetTokenExpires;
            await user.save();

            // Step 4: Create the password reset URL
            const resetUrl = `${process.env.BASE_URL}/api/users/reset-password?token=${resetToken}`;

            // Step 5: Set up the email to send the password reset link
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: user.email,
                subject: 'Password Reset Request',
                html: `<p>Click <a href="${resetUrl}">here</a> to reset your password. The link will expire in 1 hour.</p>`,
            };

            // Step 6: Send the email
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Error sending email:', error);
                    return res.status(500).json({ error: 'Error sending password reset email.' });
                }
                console.log('Password reset email sent:', info.response);
            });

            // Step 7: Respond to the user
            return res.status(200).json({
                message: 'Password reset email sent. Please check your inbox.',
                token: resetToken,
            });

        } catch (error) {
            console.error('Error in forgotPassword:', error);
            return res.status(500).json({ error: 'Error processing your request.' });
        }
    },
    ResetPassword: async function (req, res) {
        const { token, newPassword } = req.body;

        try {
            // Step 1: Find user by reset token
            const user = await User.findOne({
                passwordResetToken: token,
                passwordResetTokenExpires: { $gt: Date.now() },  // Token must not be expired
            });

            if (!user) {
                return res.status(400).json({ error: 'Invalid or expired reset token.' });
            }

            // Step 2: Hash the new password
            const hashedPassword = await bcrypt.hash(newPassword, 10);

            // Step 3: Update the user's password and remove the reset token
            user.password = hashedPassword;
            user.passwordResetToken = undefined;  // Remove the reset token
            user.passwordResetTokenExpires = undefined;  // Remove the expiration time
            await user.save();

            // Step 4: Respond with success
            return res.status(200).json({
                message: 'Password reset successfully. You can now log in with your new password.'
            });

        } catch (error) {
            console.error('Error resetting password:', error);
            return res.status(500).json({ error: 'Error resetting password.' });
        }
    },

    /**Register: async function (req, res) {
        const { errors, isValid } = ValidateRegister(req.body);



        try {
            // Step 1: Validate input fields
            if (!isValid) {
                return res.status(400).json(errors);
            }

            // Step 2: Check if the user already exists
            const existingUser = await User.findOne({ email: req.body.email });
            if (existingUser) {
                errors.email = "User already exists with this email";
                return res.status(400).json(errors);
            }

            // Step 3: Hash the password before saving it
            const hashedPassword = await bcrypt.hash(req.body.password, 10);

            // Step 4: Prepare user data, including email verification token
            const emailVerificationToken = crypto.randomBytes(32).toString('hex');
            const emailVerificationTokenExpires = Date.now() + 3600000; // Token expires in 1 hour

            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                password: hashedPassword,
                role: 'USER',  // Default role
                emailVerificationToken,
                emailVerificationTokenExpires,
            });

            // Step 5: Save the new user to the database
            const savedUser = await newUser.save();

            // Step 6: Create the email verification link
            const verificationUrl = `${process.env.BASE_URL}/api/users/verify-email?token=${emailVerificationToken}`;

            // Step 7: Set up the email message
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: req.body.email,
                subject: 'Email Verification',
                html: `<p>Click <a href="${verificationUrl}">here</a> to verify your email and complete the registration process.</p>`,
            };

            // Step 8: Send the email
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Error sending email:', error);
                    return res.status(500).json({ error: 'Error sending email verification.' });
                }
                console.log('Email sent:', info.response);
            });

            // Step 9: Respond to the user with success message
            return res.status(201).json({
                message: "User created successfully. Please verify your email to complete the registration."
            });

        } catch (error) {
            console.error('Error registering user:', error);
            return res.status(500).json({ error: error.message });
        }
    },*/
    /**Register: async function (req, res) {
        const { errors, isValid } = ValidateRegister(req.body);

        try {
            if (!isValid) {
                return res.status(400).json(errors);
            }

            const exist = await User.findOne({ email: req.body.email });
            if (exist) {
                errors.email = "User already exists";
                return res.status(400).json(errors);
            }

            const hash = await bcrypt.hash(req.body.password, 10);
            req.body.password = hash;
            req.body.role = "USER";
            req.body.id = new mongoose.Types.ObjectId().toString(); // Generate a unique id

            const newUser = await User.create(req.body);
            return res.status(201).json({ message: "User created successfully", user: newUser });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: error.message });
        }
    },*/
    /**Login: async function (req, res) {
          const { errors, isValid } = ValidateLogin(req.body)
          try {
              if (!isValid) {
                  res.status(404).json(errors)
              } else {
                  User.findOne({ email: req.body.email })
                      .then(user => {
                          if (!user) {
                              errors.email = "not found user"
                              res.status(404).json(errors)
                          } else {
                              bcrypt.compare(req.body.password, user.password)
                                  .then(isMatch => {
                                      if (!isMatch) {
                                          errors.password = "incorrect password"
                                          res.status(404).json(errors)
                                      } else {
                                          var token = jwt.sign({
                                              id: user._id,
                                              name: user.name,
                                              email: user.email,
                                              role: user.role
                                          }, process.env.JWT_SECRET, { expiresIn: '1h' });
                                          res.status(200).json({
                                              message: "success",
                                              token: "Bearer " + token
                                          })
                                      }
                                  })
                          }
                      })
              }
          } catch (error) {
              res.status(404).json(error.message);
          }
      },*/

    getAll: async function (req, res) {
        User.find().then((results) => {
            res.status(200).json(results)
        }).catch((error) => {
            res.status(500).send(error)
        })
    },

    add: async function (req, res) {
        const { name, email, password,  role } = req.body
        const newUser = new User({ name, email, password, role })
        newUser.save().then((results) => {
            res.status(201).json(results)
        }).catch((error) => {
            res.status(500).send(error)
        })
    },

    getUser: async function (req, res) {
        const id = req.params.id
        User.find({ _id: id }).then((results) => {
            res.status(201).json(results)
        }).catch((error) => {
            res.status(500).send(error)
        })
    },

    deleteUser: async function (req, res) {
        const id = req.params.id
        User.findOneAndDelete({ _id: id }).then((results) => {
            res.status(201).json({ message: 'User deleted successfully', user: results })
        }).catch((error) => {
            res.status(500).send(error)
        })
    },

    update: async function (req, res) {
        const id = req.params.id
        const { name, email, password, role } = req.body

        try {
            // Find and update the user
            const updatedUser = await User.findOneAndUpdate(
                { _id: id },
                { name, email, password, role }

            )

            if (!updatedUser) {
                return res.status(404).json({ message: 'User not found' })
            }

            res.status(200).json({ message: 'User updated successfully', user: updatedUser })
        } catch (error) {
            res.status(500).json({ message: 'An error occurred while updating the user.', error: error.message })
        }
    },

}


