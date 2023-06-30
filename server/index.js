const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
const bodyParser = require('body-parser');
const {v4: uuidv4} = require('uuid');
const Post = require('./models/post.model')
const nodemailer = require('nodemailer');
const crypto = require('crypto');


app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));
// Serve static files from the build directory
app.use(express.static(path.join(__dirname, '../build')));


const transporter = nodemailer.createTransport({
  // Configure your email service provider here
  service: 'Gmail',
  auth: {
      user: 'dev522003@gmail.com',
      pass: 'suzjhtwvbkociqit',
},
});



const storage = multer.diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    },
  });
  
  const upload = multer({ storage: storage });
  

const posts = [];

mongoose.connect('mongodb://127.0.0.1:27017/postulate', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Add authentication middleware
const authenticateUser = (req, res, next) => {
    const token = req.headers['x-access-token'];
    if (!token) {
      return res.status(401).json({ message: 'Token not provided' });
    }
  
    try {
      const decoded = jwt.verify(token, 'abc123');
      const email = decoded.email;
      User.findOne({ email: email })
        .then((user) => {
          if (!user) {
            return res.status(401).json({ message: 'Invalid token' });
          }
  
          req.user = user;
          next();
        })
        .catch((error) => {
          console.error('Error finding user:', error);
          res.status(500).json({ message: 'Internal server error' });
        });
    } catch (error) {
      console.error('Error verifying token:', error);
      res.status(401).json({ message: 'Invalid token' });
    }
  };

app.post('/api/register', async (req, res) => {
  try {
    const newPassword = await bcrypt.hash(req.body.password, 10);
    await User.create({
      email: req.body.email,
      password: newPassword,
    });
    res.json({ status: 'ok' });
  } catch (err) {
    res.json({ status: 'error', error: 'Duplicate email' });
  }
});

app.post('/api/login', async (req, res) => {
  const user = await User.findOne({
    email: req.body.email,
  });

  if (!user) {
    return res.json({ status: 'error', error: 'Invalid login' });
  }

  const isPasswordValid = await bcrypt.compare(req.body.password, user.password);

  if (isPasswordValid) {
    const token = jwt.sign({ email: user.email }, 'abc123');
    return res.json({ status: 'ok', user: token });
  } else {
    return res.json({ status: 'error', user: false });
  }
});

app.get('/api/quote', async (req, res) => {
  const token = req.headers['x-access-token'];
  try {
    const decoded = jwt.verify(token, 'abc123');
    const email = decoded.email;
    const user = await User.findOne({ email: email });
    return res.json({ status: 'ok', quote: user.quote });
  } catch (error) {
    console.log(error);
    res.json({ status: 'error', error: 'Invalid token' });
  }
});

app.post('/api/quote', async (req, res) => {
  const token = req.headers['x-access-token'];
  try {
    const decoded = jwt.verify(token, 'abc123');
    const email = decoded.email;
    await User.updateOne({ email: email }, { $set: { quote: req.body.quote } });
    return res.json({ status: 'ok' });
  } catch (error) {
    console.log(error);
    res.json({ status: 'error', error: 'Invalid token' });
  }
});

// Endpoint to create a new post
app.post('/api/posts', authenticateUser, upload.single('file'), (req, res) => {
    console.log(req.headers)
    const { title, content } = req.body;
    const file = req.file;
    const post = {
      id: uuidv4(),
      title,
      content,
      file: file ? file.filename : null,
      userId: req.user._id,
    };
    console.log(req.file)
    Post.create(post)
    .then(() => {
      res.sendStatus(201);
    })
    .catch((error) => {
      console.error('Error creating post:', error);
      res.status(500).json({ message: 'Internal server error' });
    });
  });
  
  // Endpoint to get all posts for a specific user
  app.get('/api/posts', authenticateUser, (req, res) => {
    const userId = req.user._id;
    Post.find({ userId: userId })
    .then((posts) => {
      res.json(posts);
    })
    .catch((error) => {
      console.error('Error fetching posts:', error);
      res.status(500).json({ message: 'Internal server error' });
    });
  });

  app.delete('/api/posts/:postId', authenticateUser, (req, res) => {
    const postId = req.params.postId;
  
    Post.findOneAndDelete({ id: postId }) // Change _id to id
      .then((deletedPost) => {
        if (!deletedPost) {
          return res.status(404).json({ error: 'Post not found' });
        }
        return res.status(200).json({ message: 'Post deleted successfully' });
      })
      .catch((error) => {
        console.error('Error deleting post:', error);
        return res.status(500).json({ error: 'Internal server error' });
      });
  });
  
  // Add a new endpoint to initiate the password reset process

  app.post('/api/forgot-password', (req, res) => {
    const { email } = req.body;
  
    // Check if the email exists in the database
    User.findOne({ email })
      .then((user) => {
        if (!user) {
          return res.json({ status: 'error', error: 'User not found' });
        }
  
        // Generate a unique reset token
        const resetToken = jwt.sign({ email }, 'abcd1234', { expiresIn: '1h' });
  
        // Send the reset token to the user's email (you need to implement this functionality)
      // Send the password reset email
      const mailOptions = {
        from: 'devu44550@gmail.com',
        to: user.email,
        subject: 'Password Reset',
        text: `You are receiving this email because you (or someone else) has requested to reset the password for your account.\n\n` +
          `Please click on the following link, or paste this into your browser to complete the process:\n\n` +
          `http://${req.headers.host}/reset-password?token=${resetToken}\n\n` +
          `If you did not request this, please ignore this email and your password will remain unchanged.\n`,
      };
  
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log('Error sending email:', error);
          return res.json({ status: 'error', error: 'Failed to send password reset email' });
        }
        console.log('Email sent:', info.response);
        res.json({ status: 'ok' });
      });
  
        // Return success message
        return res.json({ status: 'ok', message: 'Reset token sent successfully' });
      })
      .catch((error) => {
        console.error('Error finding user:', error);
        res.status(500).json({ message: 'Internal server error' });
      });
  });
  
  // Add a new endpoint to handle the password reset form submission
  app.get('/api/reset-password', (req, res) => {
  const {token} = req.query;
  try {
    const decoded = jwt.verify(token, 'abcd1234');
    const email = decoded.email;

    // Store the email in the session
    req.session.email = email;

    // Redirect the user to the password reset page (pass.js)
    return res.redirect(`/pass?email=${encodeURIComponent(email)}`);
  } catch (error) {
    console.error('Error verifying reset token:', error);
    res.status(401).json({ message: 'Invalid or expired reset token' });
  }
});

app.post('/api/reset-password', async (req, res) => {
  const { email, password } = req.body;

  // Find the user by email (retrieve it from the session or wherever you stored it)

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return res.json({ status: 'error', error: 'User not found' });
      }

      // Update the user's password with the new one
      bcrypt.hash(password, 10)
        .then((hashedPassword) => {
          user.password = hashedPassword;
          user.save()
            .then(() => {
              // Return success message
              return res.json({ status: 'ok', message: 'Password updated successfully' });
            })
            .catch((error) => {
              console.error('Error updating password:', error);
              res.status(500).json({ message: 'Internal server error' });
            });
        })
        .catch((error) => {
          console.error('Error hashing password:', error);
          res.status(500).json({ message: 'Internal server error' });
        });
    })
    .catch((error) => {
      console.error('Error finding user:', error);
      res.status(500).json({ message: 'Internal server error' });
    });
});

app.get('/reset-password', (req, res) => {
  // Render the pass.js file or any other template you want to show for password reset
  res.sendFile(path.join(__dirname, '../build/index.html'));
});


app.listen(2000, () => {
console.log('Server started on port 2000');
});