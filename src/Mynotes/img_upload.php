<?php 
$title = 'Image Status';
require_once 'includes/header.php'; 
require_once 'db/conn.php';

if (isset($_POST['submit'])) {
  $imageData = file_get_contents($_FILES['image']['tmp_name']);  // Read the image file and convert it to binary data
  
  $isSuccess = $crud->saveImage($imageData);

  if ($isSuccess) {
    echo '<h1 class="text-center text-success">Your image saved successfully</h1>';
    echo '<div class="card" style="width: 18rem;">';
    echo '<div class="card-body">';
    echo '<h5 class="card-title">' . $_FILES['image']['name'] . '</h5>';
    echo '<img src="data:image/jpeg;base64,' . base64_encode($imageData) . '" alt="Uploaded Image">';
    echo '</div>';
    echo '</div>';
  } else {
    echo '<h1 class="text-center text-danger">There was an error in processing</h1>';
  }
}
?>

<br>
<br>
<?php require_once 'includes/footer.php'; ?>
