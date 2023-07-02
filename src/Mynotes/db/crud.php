<?php
class crud{
    private $db;
    function __construct($conn)
    {
        $this->db=$conn;
    }
    public function saveNotes($date,$title,$note)
    {
        try{
            $sql="INSERT INTO text_note (Date,Title,Note) VALUES(:dt,:tit,:note)";
            $stmt= $this->db->prepare($sql);
            //$stmt->bindparam(':attendee',$attendee);
            $stmt->bindparam(':dt',$date);
            $stmt->bindparam(':tit',$title);
            $stmt->bindparam(':note',$note);
           

            $stmt->execute();
            return true;
        }
        catch(PDOException $e)
        {
            echo $e->getMessage();
            return false;
        }
    }
    public function saveImage($img)
    {
        try{
            $sql="INSERT INTO images (image) VALUES(:img)";
            $stmt= $this->db->prepare($sql);
            //$stmt->bindparam(':attendee',$attendee);
            $stmt->bindparam(':img',$img);
           
           

            $stmt->execute();
            return true;
        }
        catch(PDOException $e)
        {
            echo $e->getMessage();
            return false;
        }
    }

    public function getNotes()
    {
        $sql = "SELECT * FROM `text_note`";
        $result = $this->db->query($sql);
        return $result;
    }
    public function getImages()
    {
        $sql = "SELECT * FROM `images`";
        $result = $this->db->query($sql);
        return $result;
    }
    public function deleteNote($noteId) {
        try {
            $sql = "DELETE FROM `text_note` WHERE `Sr No` = :noteId";
            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(':noteId', $noteId, PDO::PARAM_INT);
            $stmt->execute();
            return true;
        } catch(PDOException $e) {
            echo $e->getMessage();
            return false;
        }
    }

    public function deleteImage($imageId) {
        try {
            $sql = "DELETE FROM `images` WHERE `Sr No` = :imageId";
            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(':imageId', $imageId, PDO::PARAM_INT);
            $stmt->execute();
            return true;
        } catch (PDOException $e) {
            echo $e->getMessage();
            return false;
        }
    }
    
}

?>