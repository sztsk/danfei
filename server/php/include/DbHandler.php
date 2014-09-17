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

    /* ------------- helper ------------------ */
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

    /**
     * Generating random Unique MD5 String for user Api key
     */
    private function generateApiKey() {
        return md5(uniqid(rand(), true));
    }

    /**
     * 判断用户是否存在
     * @param String $email email to check in db
     * @return boolean
     */
    private function isUserExists($phone) {
        $result = $this->conn->get_var("SELECT user_id from tb_users WHERE user_phone = $phone");
//        echo $result . "SELECT user_id from tb_users WHERE user_phone = $phone";

        return $result > 0;
    }

    /* ------------- `tb_users` table method ------------------ */

    /**
     * 注册用户
     * @param $userData
     */
    public function createUser($userData){
        require_once 'PassHash.php';
        //手机号码
        $phone = $userData['user_phone'];

        //判断用户是否存在
        if(!$this->isUserExists($phone)){
            $password = $userData['user_password'];
            $password_hash = PassHash::hash($password);
            //API KEY
            $apiKey = $this->generateApiKey();
            //重新整理数据
            $userData['user_password'] = $password_hash;
            $userData['user_api_key'] = $apiKey;

            $sql = $this->buildSqlInsert('tb_users',$userData);

            $result = $this->conn->query($sql);
            if($result){
                return USER_CREATED_SUCCESSFULLY;
            } else{
                return USER_CREATE_FAILED;
            }
        }else{
            return USER_ALREADY_EXISTED;
        }

    }

}

?>
