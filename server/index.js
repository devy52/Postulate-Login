var express = require('express');
var app = express();
var cors = require('cors');
var mongoose = require('mongoose');
var User = require('./models/user.model');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
var multer = require('multer');
var path = require('path');
var bodyParser = require('body-parser');
var uuidv4 = require('uuid').v4;
var Post = require('./models/post.model');
var nodemailer = require('nodemailer');
var os = require('os');
var AWS = require('aws-sdk');
var hostname = os.hostname();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: false }));

var s3 = new AWS.S3({
  accessKeyId: 'YOUR_ACCESS_KEY',
  secretAccessKey: 'YOUR_SECRET_ACCESS_KEY',
  region: 'YOUR_AWS_REGION',
});

var storage = multer.memoryStorage();

var upload = multer({ storage: storage });

mongoose.connect('mongodb+srv://dev52:root@cluster0.msyyjkw.mongodb.net/postulate', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Add authentication middleware
var authenticateUser = async function (req, res, next) {
  var token = req.headers['x-access-token'];
  if (!token) {
    return res.status(401).json({ message: 'Token not provided' });
  }

  try {
    var decoded = jwt.verify(token, 'abc123');
    var email = decoded.email;
    var user = await User.findOne({ email: email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
};

app.post('/register', async function (req, res) {
  try {
    var hashedPassword = await bcrypt.hash(req.body.password, 10);
    await User.create({
      email: req.body.email,
      password: hashedPassword,
    });
    res.json({ status: 'ok' });
  } catch (err) {
    res.json({ status: 'error', error: 'Duplicate email' });
  }
});

app.post('/login', async function (req, res) {
  var email = req.body.email;
  var password = req.body.password;

  try {
    var user = await User.findOne({ email: email });
    if (!user) {
      return res.json({ status: 'error', error: 'Invalid login' });
    }

    var isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      var token = jwt.sign({ email: user.email }, 'abc123');
      return res.json({ status: 'ok', user: token });
    } else {
      return res.json({ status: 'error', error: 'Invalid login' });
    }
  } catch (error) {
    console.log('Error during login:', error);
    return res.status(500).json({ status: 'error', error: 'Internal server error' });
  }
});

// Endpoint to create a new post
app.post('/posts', authenticateUser, upload.single('file'), async function (req, res) {
  var title = req.body.title;
  var content = req.body.content;
  var file = req.file;
  var userId = req.user._id;
  var date = req.body.date;

  try {
    var params = {
      Bucket: 'YOUR_S3_BUCKET_NAME',
      Key: uuidv4() + path.extname(file.originalname),
      Body: file.buffer,
      ACL: 'public-read',
    };

    s3.upload(params, async function (err, data) {
      if (err) {
        console.error('Error uploading file to S3:', err);
        res.status(500).json({ message: 'Error uploading file to S3' });
      } else {
        var post = {
          id: uuidv4(),
          title: title,
          content: content,
          file: data.Location,
          userId: userId,
          date: date,
        };

        try {
          await Post.create(post);
          res.sendStatus(201);
        } catch (error) {
          console.error('Error creating post:', error);
          res.status(500).json({ message: 'Internal server error' });
        }
      }
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ message: 'Error uploading file' });
  }
});

// Endpoint to get all posts for a specific user
app.get('/posts', authenticateUser, async function (req, res) {
  var userId = req.user._id;
  try {
    var posts = await Post.find({ userId: userId });
    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.delete('/posts/:postId', authenticateUser, async function (req, res) {
  var postId = req.params.postId;

  try {
    var deletedPost = await Post.findOneAndDelete({ _id: postId });
    if (!deletedPost) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Add a new endpoint to initiate the password reset process
app.post("/forgot-password", async function (req, res) {
  var email = req.body.email;
  try {
    var oldUser = await User.findOne({ email: email });
    if (!oldUser) {
      return res.json({ status: "User Not Exists!!" });
    }
    var token = jwt.sign({ email: oldUser.email, id: oldUser._id }, 'abcd1234', {
      expiresIn: "5m",
    });
    var link = "https://" + hostname + "/reset-password/" + oldUser._id + "/" + token;
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
    return res.json({ status: "User Not Exists!!" });
  }
});

app.get("/reset-password/:id/:token", async function (req, res) {
  var id = req.params.id;
  var token = req.params.token;
  console.log(req.params);
  try {
    var oldUser = await User.findOne({ _id: id });
    if (!oldUser) {
      return res.json({ status: "User Not Exists!!" });
    }
    try {
      var verify = jwt.verify(token, 'abcd1234');
      res.render("reset-pass", { email: verify.email, status: "Not Verified" });
    } catch (error) {
      console.log(error);
      res.send("Not Verified");
    }
  } catch (error) {
    console.log(error);
    return res.json({ status: "User Not Exists!!" });
  }
});

app.post("/reset-password/:id/:token", async function (req, res) {
  var id = req.params.id;
  var token = req.params.token;
  var password = req.body.new_password;
  console.log(req.body)
  console.log(req.body.new_password)
  console.log(password)

  try {
    var oldUser = await User.findOne({ _id: id });
    if (!oldUser) {
      return res.json({ status: "User Not Exists!!" });
    }
    try {
      var verify = jwt.verify(token, 'abcd1234');
      bcrypt.hash(password, 10, async function (err, encryptedPassword) {
        try {
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
        } catch (err) {
          console.log(err);
        }
      });
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    console.log(error);
    return res.json({ status: "User Not Exists!!" });
  }
});

var Task = mongoose.model('Task', {
  task: String,
});

// Fetch all tasks for the authenticated user
app.get('/tasks', authenticateUser, async function (req, res) {
  var userId = req.user._id;

  try {
    var tasks = await Task.find({ userId: userId });
    res.json(tasks);
  } catch (err) {
    console.log('Error fetching tasks:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add a new task for the authenticated user
app.post('/tasks', authenticateUser, async function (req, res) {
  var userId = req.user._id;
  var task = req.body.task;

  try {
    var newTask = await Task.create({ task: task, userId: userId });
    res.status(201).json(newTask);
  } catch (err) {
    console.log('Error adding task:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Remove a task for the authenticated user
app.delete('/tasks/:taskId', authenticateUser, async function (req, res) {
  var userId = req.user._id;
  var taskId = req.params.taskId;

  try {
    var deletedTask = await Task.findOneAndDelete({ _id: taskId, userId: userId });
    if (!deletedTask) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    console.log('Error removing task:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update a task for the authenticated user
app.put('/tasks/:taskId', authenticateUser, async function (req, res) {
  var userId = req.user._id;
  var taskId = req.params.taskId;
  var task = req.body.task;

  try {
    var updatedTask = await Task.findOneAndUpdate({ _id: taskId, userId: userId }, { task: task }, { new: true });
    if (!updatedTask) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(updatedTask);
  } catch (err) {
    console.log('Error updating task:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(80, () => {
  console.log(`Server started on port 80`);
});
