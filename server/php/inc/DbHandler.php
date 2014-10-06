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
        $phone = (int)$phone;
        $result = $this->conn->get_var("SELECT user_id from tb_users WHERE user_phone = '$phone'");
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
            $this->conn->query($sql);
            $userId = $this->conn->insert_id;
            if($userId){
                $userData['user_id'] = $userId;
                return array(
                    'error' => false,
                    'message' => "注册成功！请等待管理员审核!"
                );
            } else{
                return null;
            }
        }else{
            return array(
                'error' => true,
                'message' => "该手机号码已经注册过！"
            );
        }
    }

    /**
     * 判断是否登录
     * @param $phone
     * @param $password
     */
    public function checkLogin($phone,$password){
        $sql = "SELECT user_password FROM tb_users WHERE user_phone = '$phone'";
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
        $sql = "SELECT user_name, user_email, user_qq, user_jobs_years FROM tb_users WHERE user_phone = '$phone'";
        $user = $this->conn->get_row($sql);
        return $user;
    }

    public function getApiKeyById($userId){
        $sql = "SELECT user_api_key FROM tb_users WHERE user_id = $userId";
        $key = $this->conn->get_var($sql);
        return $key;
    }

    /* ------------- `tb_users` table method ------------------ */
    /**
     * 获取人才列表
     * @param $start
     * @param $num
     */
    public function getUsers($start = 0,$num = 30){
        $sql = "SELECT user_id,user_name,user_jobs_years,user_education,user_title,user_intro,user_thum,user_city FROM `tb_users` WHERE user_state = 2 LIMIT $start , $num";
        $data = $this->conn->get_results($sql);
        return $data;
    }

    /**
     * 获取活动详细信息
     * @param $id
     */
    public function getUsersById($id){
        $sql = "SELECT * FROM  `tb_users` WHERE user_id = $id";
        $data = $this->conn->get_row($sql);
        return $data;
    }

    /**
     * 获取公司列表
     * @param $start
     * @param $num
     */
    public function getCompany($start = 0,$num = 30){
        $sql = "SELECT company_name,company_intro FROM  `tb_users` WHERE user_state = 1 LIMIT $start , $num";
        $data = $this->conn->get_results($sql);
        return $data;
    }

    /**
     * 获取活动详细信息
     * @param $id
     */
    public function getCompanyById($id){
        $sql = "SELECT * FROM  `tb_users` WHERE user_id = $id";
        $data = $this->conn->get_row($sql);
        return $data;
    }


    /**
     * 更新用户信息
     * @param $data
     * @return null
     */
    public function updateUsersById($data){
        if(!isset($data['user_id'])){
            return null;
        }
        $where = '`user_id` =' . $data['user_id'];
        $sql = $this->buildSqlUpdate("tb_users",$data,$where);
        $this->conn->query($sql);
        return $data;
    }

    /**
     * 删除用户
     * @param $id
     * @return mixed
     */
    public function delUsersById($id){
        $sql = "UPDATE tb_users SET user_state = 0 WHERE user_id = $id";
        $result = $this->conn->query($sql);
        return $result;
    }


    /* ------------- `tb_jobs` table method ------------------ */
    /**
     * 获取职位信息列表 不包含详细信息
     * @param $start
     * @param $num
     */
    public function getJobs($start = 0,$num = 30){
        $sql = "SELECT * FROM  `tb_jobs` LEFT JOIN tb_users on tb_jobs.`jobs_user_id` = tb_users.user_id WHERE jobs_state = 1 LIMIT $start , $num";
        $data = $this->conn->get_results($sql);
        return $data;
    }

    /**
     * 根据公司用户ID获取职位信息列表
     * @param $start
     * @param $num
     */
    public function getJobsByComId($userId){
        $sql = "SELECT jobs_id,jobs_name,jobs_push_date FROM  `tb_jobs` WHERE jobs_state = 1 AND jobs_user_id = '$userId'";
        $data = $this->conn->get_results($sql);
        return $data;
    }

    /**
     * 获取职位详细信息
     * @param $id
     */
    public function getJobById($id){
        $sql = "SELECT * FROM `tb_jobs` LEFT JOIN tb_users on tb_jobs.`jobs_user_id` = tb_users.user_id where jobs_state = 1 AND jobs_id = $id";
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
        $sql = "SELECT events_id,events_title,events_detail,events_start_time FROM  `tb_events` WHERE events_state = 1 LIMIT $start , $num";
        $data = $this->conn->get_results($sql);
        return $data;
    }

    /**
     * 获取活动详细信息
     * @param $id
     */
    public function getEventsById($id){
        $sql = "SELECT * FROM  `tb_events` WHERE events_state = 1 AND events_id = $id";
        $data = $this->conn->get_row($sql);
        return $data;
    }

    /**
     * 获取活动列表
     * @param $start
     * @param $num
     */
    public function getEventsByUserId($userId){
        $sql = "SELECT events_id,events_title,events_start_time,events_users_num,events_zan FROM  `tb_events` WHERE events_state = 1 AND events_user_id = " . $userId;
        $data = $this->conn->get_results($sql);
        return $data;
    }

    /**
     * 根据地区 获取活动列表
     * @param $start
     * @param $num
     */
    public function searchEvents($search){
        $sql = "SELECT events_id,events_title,events_detail,events_start_time FROM  `tb_events` WHERE events_state = 1 AND events_detail LIKE '%$search%'";
        $data = $this->conn->get_results($sql);
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
        $this->conn->query($sql);
        return $data;
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


    /* ------------- `tb_services` table method ------------------ */
    /**
     * 获取服务列表
     * @param $start
     * @param $num
     */
    public function getServices($where = '',$start = 0,$num = 30){
        $sql = "SELECT services_id,services_detail,services_industry,company_name,user_city FROM  `tb_services` JOIN tb_users ON tb_services.services_user_id = tb_users.user_id WHERE services_state = 1 $where LIMIT $start , $num";
        $data = $this->conn->get_results($sql);
        return $data;
    }


    /**
     * 获取创业服务详情详细信息
     * @param $id
     */
    public function getServicesById($id){
        $sql = "SELECT * FROM  `tb_services` LEFT JOIN tb_users ON tb_services.services_user_id = tb_users.user_id WHERE services_state = 1 AND services_id = $id";
        $data = $this->conn->get_row($sql);
        return $data;
    }

    /**
     * 创建 创业服务
     * @param $data
     * @return null
     */
    public function createServices($data){
        $sql = $this->buildSqlInsert("tb_services",$data);
        $this->conn->query($sql);
        $id = $this->conn->insert_id;
        if($id){
            $data['services_id'] = $id;
            return $data;
        } else{
            return null;
        }
    }

    /**
     * 更新创业服务信息
     * @param $data
     * @return null
     */
    public function updateServicesById($data){
        if(!isset($data['services_id'])){
            return null;
        }
        $where = '`services_id` =' . $data['services_id'];
        $sql = $this->buildSqlUpdate("tb_services",$data,$where);
        $result = $this->conn->query($sql);

        if($result){
            return $data;
        }else{
            return null;
        }
    }

    /**
     * 删除创业服务
     * @param $id
     * @return mixed
     */
    public function delServicesById($id){
        $sql = "UPDATE  tb_services SET services_state = 0 WHERE services_id = $id";
        $result = $this->conn->query($sql);
        return $result;
    }

    /**
     * 提交创业服务
     */
    public function submitServicesProject($servicesId,$projectId){
        $sql = "INSERT INTO `tb_services_project` (`services_id`, `project_id`) VALUES ('$servicesId', '$projectId');";
        $this->conn->query($sql);
        $id = $this->conn->insert_id;
        if($id){
            $data['id'] = $id;
            return $data;
        } else{
            return null;
        }
    }


    /* ------------- `tb_project` table method ------------------ */
    /**
     * 获取创业服务列表
     * @param $start
     * @param $num
     */
    public function getProject($start = 0,$num = 30){
        $sql = "SELECT project_id,project_name,project_thum,project_push_date,project_financing,project_stage,project_intro,project_stage,project_city,project_type FROM  `tb_project` WHERE project_state = 1 LIMIT $start , $num";
        $data = $this->conn->get_results($sql);
        return $data;
    }

    /**
     * 获取服务列表
     * @param $start
     * @param $num
     */
    public function getProjectByUserId($userId,$start = 0,$num = 30){
        $sql = "SELECT project_id,project_name,project_thum,project_push_date,project_financing,project_stage,project_intro,project_stage,project_city,project_type FROM  `tb_project` WHERE project_state = 1 AND project_user_id = '$userId' LIMIT $start , $num";
        $data = $this->conn->get_results($sql);
        return $data;
    }



    /**
     * 获取活动详细信息
     * @param $id
     */
    public function getProjectById($id){
        $sql = "SELECT * FROM  `tb_project` LEFT JOIN tb_users ON tb_project.project_user_id = tb_users.user_id WHERE user_id = $id";
        $data = $this->conn->get_row($sql);
        return $data;
    }

    /**
     * 创建活动
     * @param $data
     * @return null
     */
    public function createProject($data){
        $sql = $this->buildSqlInsert("tb_project",$data);
        $this->conn->query($sql);
        $id = $this->conn->insert_id;
        if($id){
            $data['services_id'] = $id;
            return $data;
        } else{
            return null;
        }
    }

    /**
     * 更新创业服务信息
     * @param $data
     * @return null
     */
    public function updateProjectById($data){
        if(!isset($data['project_id'])){
            return null;
        }
        $where = '`project_id` =' . $data['project_id'];
        $sql = $this->buildSqlUpdate("tb_project",$data,$where);
        $result = $this->conn->query($sql);

        if($result){
            return $data;
        }else{
            return null;
        }
    }

    /**
     * 删除创业项目
     * @param $id
     * @return mixed
     */
    public function delProjectById($id){
        $sql = "UPDATE  tb_project SET project_state = 0 WHERE project_id = $id";
        $result = $this->conn->query($sql);
        return $result;
    }






}

?>