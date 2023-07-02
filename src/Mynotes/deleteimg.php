<?php
require_once 'db/conn.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['image_id'])) {
        $imageId = $_POST['image_id'];
        $isDeleted = $crud->deleteImage($imageId);

        if ($isDeleted) {
            // Image deleted successfully
            header("Location: viewimg.php"); // Redirect to the viewimg.php page
            exit();
        } else {
            // Error occurred while deleting the image
            echo '<h1 class="text-center text-danger">There was an error in deleting the image</h1>';
        }
    } else {
        // Invalid request, image ID not provided
        echo '<h1 class="text-center text-danger">Invalid request</h1>';
    }
}
?>
