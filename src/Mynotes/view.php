<?php 
$title = 'Saved Notes';
require_once 'includes/header.php';
require_once 'db/conn.php';
$data = $crud->getNotes();
?>
<br>
<br>
<div class="row row-cols-1 row-cols-md-3 g-4">
  <?php while ($r = $data->fetch(PDO::FETCH_ASSOC)) { ?>
    <div class="col">
      <div class="card">
        <div class="card-body">
          <h5 class="card-title"><?php echo $r['Date']; ?></h5>
          <h6 class="card-subtitle mb-2 text-muted"><?php echo $r['Title']; ?></h6>
          <p class="card-text"><?php echo $r['Note']; ?></p>
          <button type="button" class="btn btn-danger delete-btn" data-note-id="<?php echo $r['Sr No']; ?>">Delete</button>
        </div>
      </div>
    </div>
  <?php } ?>
</div>

<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script>
$(document).ready(function() {
  $('.delete-btn').click(function() {
    var noteId = $(this).data('note-id');
    var card = $(this).closest('.card'); // Get the closest parent card element
    if (confirm('Are you sure you want to delete this note?')) {
      $.ajax({
        url: 'deletenote.php',
        type: 'POST',
        data: { note_id: noteId },
        success: function(response) {
          if (response === 'success') {
            card.remove(); // Remove the card from the UI
          } else {
            console.log('Error occurred while deleting the note');
          }
        },
        error: function(xhr, status, error) {
          console.log(error);
        }
      });
    }
  });
});
</script>

<br>
<br>
<?php require_once 'includes/footer.php'; ?>
