<?php
require_once 'db/conn.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['note_id'])) {
        $noteId = $_POST['note_id'];
        $isDeleted = $crud->deleteNote($noteId);

        if ($isDeleted) {
            // Note deleted successfully
            echo 'success';
            exit();
        } else {
            // Error occurred while deleting the note
            echo 'error';
            exit();
        }
    } else {
        // Invalid request, note ID not provided
        echo 'error';
        exit();
    }
}
?>
