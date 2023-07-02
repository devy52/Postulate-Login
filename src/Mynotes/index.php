<?php 
$title='Index';
require_once 'includes/header.php';
require_once 'db/conn.php';

//$data=$crud->getSpecialty();
?>

<h1 class="text-center" style="text-align: center; color: black; font-family: cursive;"> Save Your Notes here  </h1>  
 
<form method="post" action="success.php">


  <div class="mb-3">
  <label for="dateInput">Date</label>
    <input type="text" id="dateInput" name="Date" placeholder="Mention date">
    <br>
    
  </div>

  <div class="mb-3">
  <label for="Title">Title</label>
  <input type="text" name="Title" id="titleInput" placeholder="Title"><br>
    
  </div>

  <div class="mb-3">
  <textarea class="form-control"  name="Note" id="commentTextarea" placeholder="Leave a comment here" style="height: 200px; width: 400px;"></textarea>
      <label for="commentTextarea">Your Note</label>
      <br>
  </div>
  <button type="button" class="btn btn-primary"  id="speechButton" style="border-radius: 1.25rem; color:palevioletred;; background-color: white;">Speech-to-Text</button>
  <button type="submit" class="btn btn-primary" name="submit" style="border-radius: 1.25rem; color: white; background-color: palevioletred;">Save</button>
</form>
<script>
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      recognition.continuous = true; // Enable continuous speech recognition
      recognition.interimResults = true; // Enable capturing interim results

      const titleInput = document.getElementById('titleInput');
      const commentTextarea = document.getElementById('commentTextarea');
      const speechButton = document.getElementById('speechButton');
      let isListening = false; // Flag to track if speech recognition is active
      let recognizedText = ''; // Variable to store recognized text

      titleInput.addEventListener('focus', () => {
        stopListening();
      });

      commentTextarea.addEventListener('focus', () => {
        stopListening();
      });

      speechButton.addEventListener('click', () => {
        if (!isListening) {
          startListening();
        } else {
          stopListening();
        }
      });

      function startListening() {
        recognizedText = commentTextarea.value; // Preserve the existing text
        recognition.start();
        speechButton.classList.add('highlight');
        isListening = true;
      }

      function stopListening() {
        recognition.stop();
        speechButton.classList.remove('highlight');
        isListening = false;
      }

      recognition.onresult = (event) => {
        let interimTranscript = ''; // Variable to store interim recognized text

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            recognizedText += transcript + ' '; // Append the recognized text
          } else {
            interimTranscript += transcript + ' ';
          }
        }

        commentTextarea.value = recognizedText + interimTranscript;
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error occurred: ', event.error);
        stopListening();
      };
    } else {
      console.log('Speech recognition not supported in this browser.');
    }
  </script>

<?php require_once 'includes/footer.php'; ?>