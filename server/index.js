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


app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));
// Serve static files from the build directory
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));
//app.use(express.urlencoded({ extended: false }));
app.use(express.urlencoded({ extended: false }));

const JWT_SECRET =
  "hvdvay6ert72839289()aiyg8t87qt72393293883uhefiuh78ttq3ifi78272jbkj?[]]pou89ywe";

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
    console.log(req.params.postId)
    const postId = req.params.postId;
    
    Post.findOneAndDelete({ _id: postId }) // Change _id to id
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

  app.post("/forgot-password", async (req, res) => {
    const { email } = req.body;
    try {
      const oldUser = await User.findOne({ email });
      if (!oldUser) {
        return res.json({ status: "User Not Exists!!" });
      }
      const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, 'abcd1234', {
        expiresIn: "5m",
      });
      const link = `http://127.0.0.1:2000/reset-password/${oldUser._id}/${token}`; 
      console.log(link)
      var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "dev522003@gmail.com",
          pass: "unspfufvlcpzucrh",
        },
      });
  
      var mailOptions = {
        from: "dev522003@gmail.com",
        to: oldUser.email,
        subject: "Password Reset",
        text: link,
      };
  
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          return res.json({ status: "ok" });
          console.log("Email sent: " + info.response);
        }
      });
      console.log(link);
    } catch (error) { }
  });
  
  app.get("/reset-password/:id/:token", async (req, res) => {
    const { id, token } = req.params;
    console.log(req.params);
    //res.send("Done")
    const oldUser = await User.findOne({ _id: id });
    if (!oldUser) {
      return res.json({ status: "User Not Exists!!" });
    }
    try {
      const verify = jwt.verify(token, 'abcd1234');
      res.render("reset-pass", { email: verify.email, status: "Not Verified" });
    } catch (error) {
      console.log(error);
      res.send("Not Verified");
    }
  });
  
  app.post("/reset-password/:id/:token", async (req, res) => {
    const { id, token } = req.params;
    const password = req.body.new_password;
    console.log(req.body)
    console.log(req.body.new_password)
    console.log(password)
  
    const oldUser = await User.findOne({ _id: id });
    if (!oldUser) {
      return res.json({ status: "User Not Exists!!" });
    }
    try {
      const verify = jwt.verify(token, 'abcd1234');
      const encryptedPassword = await bcrypt.hash(password, 10);
      await User.updateOne(
        {
          _id: id,
        },
        {
          $set: {
            password: encryptedPassword,
          },
        }
      );
  
      res.render("reset-pass", { email: verify.email, status: "verified" });
    } catch (error) {
      console.log(error);
      //res.json({ status: "Something Went Wrong" });
    }
  });



app.listen(2000, () => {
console.log('Server started on port 2000');
});