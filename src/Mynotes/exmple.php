<?php 
$title='Index';
require_once 'includes/header.php';
require_once 'db/conn.php';

//$data=$crud->getSpecialty();
?>

<!DOCTYPE html>
<html>

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
</head>

<body>
  <div class="container">
    <h1 style="text-align: center; color: black; font-family: cursive;"><b>Save your Image here</b></h1>

    <div class="add-note">
    <form method="post" action="img_upload.php" enctype="multipart/form-data">
      <textarea id="note-input" placeholder="Enter your note..." name="note"></textarea>
      <input type="file" id="image-input" name="image">
      <br><br>

      <br>
      <button type="submit" class="btn btn-primary" name="submit">Save</button>
    </form>
    </div>


    <div id="note-list"></div>
  </div>

  <script>
    function addNote() {
      var noteInput = document.getElementById('note-input');
      var noteContent = noteInput.value.trim();
      noteInput.value = '';

      var imageInput = document.getElementById('image-input');
      var imageFile = imageInput.files[0];
      imageInput.value = '';

      var currentDate = new Date();
      var timestamp = currentDate.toLocaleString();

      var noteElement = document.createElement('div');
      noteElement.className = 'note';

      var noteTitle = document.createElement('h2');
      noteTitle.innerText = 'Note' + (document.getElementsByClassName('note').length + 1);

      var noteText = document.createElement('p');
      noteText.innerText = noteContent;

      var noteTimestamp = document.createElement('p');
      noteTimestamp.className = 'timestamp';
      noteTimestamp.innerText = timestamp;

      var deleteButton = document.createElement('span');
      deleteButton.className = 'delete-button';
      deleteButton.innerText = 'X';
      deleteButton.onclick = function () {
        noteElement.remove();
      };

      noteElement.appendChild(deleteButton);
      noteElement.appendChild(noteTitle);
      noteElement.appendChild(noteText);
      noteElement.appendChild(noteTimestamp);

      if (imageFile) {
        var reader = new FileReader();

        reader.onload = function (e) {
          var noteImage = document.createElement('img');
          noteImage.src = e.target.result;
          noteImage.className = 'note-image';
          noteElement.appendChild(noteImage);
        };

        reader.readAsDataURL(imageFile);
      }

      var noteList = document.getElementById('note-list');
      noteList.prepend(noteElement);



    }

  </script>
</body>

</html>