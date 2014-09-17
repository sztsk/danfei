<?php

/**
 * Class to handle all db operations
 * This class will have CRUD methods for database tables
 *
 * @author hugo hua
 */
class DbHandler {

    private $conn;

    function __construct() {
        require_once dirname(__FILE__) . '/DbConnect.php';
        // opening db connection
        $db = new DbConnect();
        $this->conn = $db->connect();
    }

    /* ------------- sql helper ------------------ */
    private function buildSqlInsert($table, $data)
    {
        $key = array_keys($data);
        $val = array_values($data);
        $sql = "INSERT INTO $table (" . implode(', ', $key) . ") "
            . "VALUES ('" . implode("', '", $val) . "')";

        return($sql);
    }

    /* function to build SQL UPDATE string */
    private function buildSqlUpdate($table, $data, $where)
    {
        $cols = array();
        foreach($data as $key=>$val) {
            $cols[] = "$key = '$val'";
        }
        $sql = "UPDATE $table SET " . implode(', ', $cols) . " WHERE $where";

        return($sql);
    }

    /* ------------- `tb_users` table method ------------------ */

    /**
     * 注册用户
     * @param $userData
     */
    public  function createUser($userData){
        require_once 'PassHash.php';
        $sql = buildSqlInsert('tb_users',$userData);
        $result = $this->conn->query($sql);
        if($result){
            return USER_CREATED_SUCCESSFULLY;
        } else{
            return USER_CREATE_FAILED;
        }

    }

}

?>
