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

    /**
     * 判断是否登录
     * @param $phone
     * @param $password
     */
    public function checkLogin($phone,$password){
        $sql = "SELECT user_password FROM tb_users WHERE user_phone = $phone";
        $passwordHash = $this->conn->get_var($sql);
        if($passwordHash && PassHash::check_password($passwordHash,$password)){
            return true;
        }else{
            return false;
        }
    }

    /***
     * 获取用户信息
     * @param $phone
     * @return mixed
     */
    public function getUserByPhone($phone){
        $sql = "SELECT user_name, user_email, user_qq, user_jobs_time FROM tb_users WHERE user_phone = $phone";
        $user = $this->conn->get_row($sql);
        return $user;
    }

    public function getApiKeyById($userId){
        $sql = "SELECT user_api_key FROM tb_users WHERE user_id = $userId";
        $key = $this->conn->get_var($sql);
        return $key;
    }


    /* ------------- `tb_jobs` table method ------------------ */
    /**
     * 获取职位信息列表 不包含详细信息
     * @param $start
     * @param $num
     */
    public function getJobs($start,$num = 30){
        $sql = "SELECT * FROM  `tb_jobs` WHERE jobs_state = 1 LIMIT $start , $num";
        $data = $this->conn->get_results($sql);
        return $data;
    }

    /**
     * 根据公司名称获取职位信息列表
     * @param $start
     * @param $num
     */
    public function getJobsByComId(){
        $sql = "SELECT jobs_id,jobs_title,jobs_add_time FROM  `tb_jobs` WHERE jobs_state = 1";
        $data = $this->conn->get_results($sql);
        return $data;
    }

    /**
     * 获取职位详细信息
     * @param $id
     */
    public function getJobById($id){
        $sql = "SELECT * FROM  `tb_jobs` WHERE jobs_id = $id";
        $data = $this->conn->get_row($sql);
        return $data;
    }

    public function createJobs($data){
        $sql = $this->buildSqlInsert("tb_jobs",$data);
        $this->conn->query($sql);
        $id = $this->conn->insert_id;
        if($id){
            $data['jobs_id'] = $id;
            return $data;
        } else{
            return null;
        }
    }

    public function updateJobsById($data){
//        var_dump($data);
        if(!isset($data['jobs_id'])){
            return null;
        }
        $where = '`jobs_id` =' . $data['jobs_id'];
        $sql = $this->buildSqlUpdate("tb_jobs",$data,$where);
        $result = $this->conn->query($sql);

        if($result){
            return $data;
        }else{
            return null;
        }
    }

    public function delJobsById($id){
        $sql = "UPDATE  tb_jobs SET jobs_state = 0 WHERE jobs_id = $id";
        $result = $this->conn->query($sql);
        return $result;
    }

    /* ------------- `tb_events` table method ------------------ */
    /**
     * 获取活动列表
     * @param $start
     * @param $num
     */
    public function getEvents($start,$num = 30){
        $sql = "SELECT events_id,events_title,events_detail FROM  `tb_events` WHERE events_state = 1 LIMIT $start , $num";
        $data = $this->conn->get_results($sql);
        return $data;
    }

    /**
     * 获取活动详细信息
     * @param $id
     */
    public function getEventsById($id){
        $sql = "SELECT * FROM  `tb_events` WHERE events_id = $id";
        $data = $this->conn->get_row($sql);
        return $data;
    }

    /**
     * 创建活动
     * @param $data
     * @return null
     */
    public function createEvents($data){
        $sql = $this->buildSqlInsert("tb_events",$data);
        $this->conn->query($sql);
        $id = $this->conn->insert_id;
        if($id){
            $data['events_id'] = $id;
            return $data;
        } else{
            return null;
        }
    }

    /**
     * 更新活动
     * @param $data
     * @return null
     */
    public function updateEventsById($data){
        if(!isset($data['events_id'])){
            return null;
        }
        $where = '`events_id` =' . $data['events_id'];
        $sql = $this->buildSqlUpdate("tb_events",$data,$where);
        $result = $this->conn->query($sql);

        if($result){
            return $data;
        }else{
            return null;
        }
    }

    /**
     * 删除活动
     * @param $id
     * @return mixed
     */
    public function delEventsById($id){
        $sql = "UPDATE  tb_events SET events_state = 0 WHERE events_id = $id";
        $result = $this->conn->query($sql);
        return $result;
    }

    /* ------------- `tb_company` table method ------------------ */
    /**
     * 获取公司列表
     * @param $start
     * @param $num
     */
    public function getCompany($start = 0,$num = 30){
        $sql = "SELECT company_id,company_intro FROM  `tb_company` WHERE company_state = 1 LIMIT $start , $num";
        $data = $this->conn->get_results($sql);
        return $data;
    }

    /**
     * 获取活动详细信息
     * @param $id
     */
    public function getCompanyById($id){
        $sql = "SELECT * FROM  `tb_company` WHERE company_id = $id";
        $data = $this->conn->get_row($sql);
        return $data;
    }

    /**
     * 创建活动
     * @param $data
     * @return null
     */
    public function createCompany($data){
        $sql = $this->buildSqlInsert("tb_company",$data);
        $this->conn->query($sql);
        $id = $this->conn->insert_id;
        if($id){
            $data['company_id'] = $id;
            return $data;
        } else{
            return null;
        }
    }

    /**
     * 更新公司信息
     * @param $data
     * @return null
     */
    public function updateCompanyById($data){
        if(!isset($data['company_id'])){
            return null;
        }
        $where = '`company_id` =' . $data['company_id'];
        $sql = $this->buildSqlUpdate("tb_company",$data,$where);
        $result = $this->conn->query($sql);

        if($result){
            return $data;
        }else{
            return null;
        }
    }

    /**
     * 删除公司
     * @param $id
     * @return mixed
     */
    public function delCompanyById($id){
        $sql = "UPDATE  tb_company SET company_state = 0 WHERE company_id = $id";
        $result = $this->conn->query($sql);
        return $result;
    }



}

?>
