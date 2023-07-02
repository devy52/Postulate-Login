<?php 
$title = 'Saved Images';
require_once 'includes/header.php';
require_once 'db/conn.php';
$data = $crud->getImages();
?>
<br>
<br>
<div class="row row-cols-1 row-cols-md-3 g-4">
  <?php while ($r = $data->fetch(PDO::FETCH_ASSOC)) { ?>
    <div class="col">
      <div class="card">
        <div class="card-body">
          <?php echo '<img src="data:image/jpeg;base64,' . base64_encode($r['image']) . '" alt="Image" class="card-img-top">'; ?>
          <form method="post" action="deleteimg.php">
            <input type="hidden" name="image_id" value="<?php echo $r['Sr No']; ?>"/>
            <button type="submit" class="btn btn-danger">Delete</button>
          </form>
        </div>
      </div>
    </div>
  <?php } ?>
</div>

<br>
<br>
<?php require_once 'includes/footer.php'; ?>
