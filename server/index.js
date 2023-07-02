const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const Post = require('./models/post.model');
const nodemailer = require('nodemailer');
const os = require('os');
const https = require('https');

const app = express();
const port = process.env.PORT || 3000; // Use the appropriate port for your hosting environment

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));

// Serve static files from the build directory
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: false }));

const storage = multer.diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

app.use((req, res, next) => {
  // Add your CORS configuration if needed
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
  next();
});

mongoose.connect('mongodb+srv://dev52:root@cluster0.msyyjkw.mongodb.net/postulate', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(port, () => {
      console.log(`Server started on port ${port}`);
    });
  })
  .catch((error) => {
    console.error('Failed to connect to MongoDB:', error);
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

// Endpoint to create a new post
app.post('/api/posts', authenticateUser, upload.single('file'), (req, res) => {
  const { title, content } = req.body;
  const file = req.file;
  const post = {
    id: uuidv4(),
    title,
    content,
    file: file ? file.filename : null,
    userId: req.user._id,
    date: req.body.date
  };

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

  Post.findOneAndDelete({ _id: postId })
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
    const link = `http://${req.headers.host}/reset-password/${oldUser._id}/${token}`;
    console.log(link);
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
  } catch (error) {
    console.log(error);
    return res.json({ status: "error", error: "Internal server error" });
  }
});

// Add a new endpoint to handle the password reset form submission
app.post("/reset-password/:id/:token", async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findOne({ _id: id });
    if (!user) {
      return res.json({ status: "error", error: "Invalid user" });
    }
    const secret = 'abcd1234' + user.password;
    const payload = jwt.decode(token, secret);
    if (payload.id === user.id) {
      const salt = await bcrypt.genSalt();
      const newPassword = await bcrypt.hash(password, salt);
      await User.updateOne(
        { _id: id },
        {
          $set: { password: newPassword },
        }
      );
      return res.json({ status: "ok" });
    }
    return res.json({ status: "error", error: "Invalid token" });
  } catch (error) {
    console.log(error);
    return res.json({ status: "error", error: "Internal server error" });
  }
});

// Add a new endpoint to get the current system information
app.get('/system-info', (req, res) => {
  const info = {
    platform: os.platform(),
    architecture: os.arch(),
    totalMemory: os.totalmem(),
    freeMemory: os.freemem(),
  };
  res.json(info);
});

// Add a new endpoint to perform a GET request to an external API
app.get('/external-api', (req, res) => {
  https.get('https://jsonplaceholder.typicode.com/posts', (response) => {
    let data = '';
    response.on('data', (chunk) => {
      data += chunk;
    });

    response.on('end', () => {
      const posts = JSON.parse(data);
      res.json(posts);
    });
  }).on('error', (error) => {
    console.error('Error fetching external API:', error);
    res.status(500).json({ message: 'Internal server error' });
  });
});

app.use(express.static(path.join(__dirname, 'client/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

//const server = app.listen(port, () => {
//  const assignedPort = server.address().port;
//  console.log(`Server started on port ${assignedPort}`);
//});