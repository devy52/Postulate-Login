<?php 
$title='Notes Status';
require_once 'includes/header.php'; 
require_once 'db/conn.php';

if(isset($_POST['submit']))
{
   
  $date=$_POST['Date'];
  $title=$_POST['Title'];
  $note=$_POST['Note'];
  $isSuccess= $crud->saveNotes($date,$title,$note);

  if($isSuccess)
  {
    echo '<h1 class="text-center text-success"> Your Notes saved successfully</h1>';
  }
  else{
    echo '<h1 class="text-center text-danger">There was an error in processing</h1>';
  }
}

?>



<div class="card" style="width: 18rem;">
  <div class="card-body">
    <h5 class="card-title"><?php echo $_POST['Date'];?></h5>
    <h6 class="card-subtitle mb-2 text-muted"><?php echo $_POST['Title']; ?></h6>
    <p class="card-text"><?php echo $_POST['Note']; ?></p>
    
  </div>
</div>

<br>
<br>
<?php


?>






<?php require_once 'includes/footer.php'; ?>