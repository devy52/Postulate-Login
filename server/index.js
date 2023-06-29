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
app.use(express.static(path.join(__dirname, '../src/pages')));
app.use(express.static("public"))

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
app.post('/api/reset-password', async (req, res) => {
    const email = req.body.email;
    try {
      const user = await User.findOne({ email: email });
      if (!user) {
        return res.json({ status: 'error', error: 'User not found' });
      }
  
      // Generate a password reset token
      const resetToken = jwt.sign({ email: user.email }, 'abc123', { expiresIn: '1h' });
      user.resetPasswordToken = resetToken;
      console.log('Token sent:',resetToken) // Token expires in 1 hour
  
      // Save the user with the reset token and expiration time
      await user.save();
  
      // Send the password reset email
      const transporter = nodemailer.createTransport({
        // Configure your email service provider here
        service: 'Gmail',
        auth: {
            user: 'dev522003@gmail.com',
            pass: 'suzjhtwvbkociqit',
  },
      });
  
      const mailOptions = {
        from: 'devu44550@gmail.com',
        to: user.email,
        subject: 'Password Reset',
        text: `You are receiving this email because you (or someone else) has requested to reset the password for your account.\n\n` +
          `Please click on the following link, or paste this into your browser to complete the process:\n\n` +
          `http://${req.headers.host}/reset-password/${resetToken}\n\n` +
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
    } catch (error) {
      console.log('Error resetting password:', error);
      res.status(500).json({ status: 'error', error: 'Internal server error' });
    }
  });
  
  // Add a new endpoint to handle the password reset form submission
  app.get('/reset-password/:token', async (req, res) => {
  const token = req.params.token;
  console.log('Token received:', token);
  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    

    // Render the password reset form
    res.sendFile(path.join(__dirname, '../src/pages/pass.js'));
  } catch (error) {
    console.log('Error resetting password:', error);
    res.status(500).json({ status: 'error', error: 'Internal server error' });
  }
});

  


app.listen(2000, () => {
console.log('Server started on port 2000');
});