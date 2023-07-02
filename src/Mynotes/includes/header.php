<!doctype html>
<html lang="en">
  <head>
  <!-- Font Awesome -->
  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet" />
  <!-- Google Fonts -->
  <link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" rel="stylesheet" />
  <!-- MDB -->
  <link href="https://cdnjs.cloudflare.com/ajax/libs/mdb-ui-kit/6.4.0/mdb.min.css" rel="stylesheet" />
  <title>Note Taking</title>
  <style>
    body {
      font-family: Arial, sans-serif;
    }

    .container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }

    .note .delete-button {
      position: absolute;
      background-color: #ffffff;
      top: 5px;
      right: 5px;
      color: red;
      font-size: 14px;
      cursor: pointer;
    }

    .note {
      margin-bottom: 20px;
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 5px;
    }

    .note h2 {
      margin-top: 0;
      color: black;
      font-family: cursive;
    }

    .note p {
      margin-bottom: 0;
    }

    .note .timestamp {
      color: #888;
      font-size: 12px;
    }

    .add-note {
      margin-bottom: 20px;
    }

    .add-note textarea,
    .add-note input[type="file"] {
      width: 100%;
      margin-bottom: 10px;
    }

    .add-note button {
      padding: 10px 20px;
    }

    .note-image {
      max-width: 100%;
      margin-bottom: 10px;
    }

    body {
      background-image: url('https://static.vecteezy.com/system/resources/previews/006/862/445/original/pinned-paper-note-on-abstract-pink-cute-memphis-background-vector.jpg');
      background-repeat: no-repeat;
      background-position: center;
      width: auto;
      background-size: cover;
      backdrop-filter: blur(2px);
      height: 100vh;
    }

    input:hover {
      color: pink;
    }

    #note-input {
      border-radius: 1.25rem;
      margin-top: 30px;
      padding: 30px 20px 10px 20px;
      border-color: rgb(190, 105, 133);
      box-sizing: border-box;
    }
  </style>
  <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Attendence- <?php echo $title ?> </title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-Zenh87qX5JnK2Jl0vWa8Ck2rdkQ2Bzep5IDxbcnCeuOxjzrPF/et3URy9Bv1WTRi" crossorigin="anonymous">
    <link rel="stylesheet" href="css/site.css" /> 
  </head>
  <body>
  <div class="container">
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark" style="justify content;space between">
  <div class="container-fluid">
    <a class="navbar-brand" href="index.php">Save Notes</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav">
        <li class="nav-item">
          <a class="nav-link active" aria-current="page" href="exmple.php">Save Image</a>
        </li>
        <li class="nav-item">
          <a class="nav-link active" aria-current="page"  href="view.php">View Notes</a>
        </li>
        <li class="nav-item">
          <a class="nav-link active" aria-current="page"  href="viewimg.php">View Images</a>
        </li>
        
      </ul>
    </div>
  </div>
</nav> 