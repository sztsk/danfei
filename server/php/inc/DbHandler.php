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
                return $userData;
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
        $sql = "SELECT user_id,user_name,user_type, user_phone FROM tb_users WHERE user_phone = '$phone'";
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
    public function getUsers($where = '',$start = 0,$num = 30){
        $sql = "SELECT user_id,user_nice_name,user_jobs_years,user_education,user_title,user_intro,user_thum,user_city FROM `tb_users` WHERE user_state = 2 $where LIMIT $start , $num";
        $data = $this->conn->get_results($sql);
        if($data){
            return $data;
        }else{
            return array();
        }
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
     * 获取活动详细信息
     * @param $id
     */
    public function getUsersEditById($id){
        $sql = "SELECT user_id,user_nice_name,user_phone,user_thum FROM  `tb_users` WHERE user_id = $id";
        $data = $this->conn->get_row($sql);
        return $data;
    }


    /**
     * 获取公司列表
     * @param $start
     * @param $num
     */
    public function getCompany($start = 0,$num = 30){
        $sql = "SELECT user_name,company_intro FROM  `tb_users` WHERE user_state = 1  ORDER BY user_id DESC LIMIT $start , $num";
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

    /**
     * 发出邀请
     */
    public function joinCompany($companyId,$userId){
        $sql = "INSERT INTO `tb_company_users` (`company_id`, `user_id`) VALUES ('$companyId', '$userId');";
        $this->conn->query($sql);
        $id = $this->conn->insert_id;
        if($id){
            $data['id'] = $id;
            return $data;
        } else{
            return null;
        }
    }

    /**
     * 判断是否已邀请
     * @param $start
     * @param $num
     */
    public function checkCompanyJoin($companyId,$userId){
        $sql = "SELECT id FROM  `tb_company_users` WHERE company_id = '$companyId' AND user_id = '$userId'";
        $result = $this->conn->get_var($sql);
        return $result > 0;
    }

    /**
     * 更新赞
     * @param $data
     * @return null
     */
    public function updateUsersZanById($userId){
        $sql = "update tb_users set user_zan = user_zan + 1 where user_id = $userId";
        $this->conn->query($sql);
        $data = $this->getUsersById($userId);
        return $data;
    }


    /* ------------- `tb_jobs` table method ------------------ */
    /**
     * 获取职位信息列表 不包含详细信息
     * @param $start
     * @param $num
     */
    public function getJobs($where = '',$start = 0,$num = 30){
        $sql = "SELECT * FROM  `tb_jobs` LEFT JOIN tb_users on tb_jobs.`jobs_user_id` = tb_users.user_id WHERE jobs_state = 1 $where ORDER BY jobs_id DESC LIMIT $start , $num";
        $data = $this->conn->get_results($sql);
        if($data){
            return $data;
        }else{
            return array();
        }
    }

    /**
     * 根据公司用户ID获取职位信息列表
     * @param $start
     * @param $num
     */
    public function getJobsByComId($userId){
        $sql = "SELECT jobs_id,jobs_name,jobs_push_date FROM  `tb_jobs` WHERE jobs_state = 1 AND jobs_user_id = '$userId'  ORDER BY jobs_id DESC";
        $data = $this->conn->get_results($sql);
        if($data){
            return $data;
        }else{
            return array();
        }
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

    /**
     * 提交简历
     */
    public function joinJobs($jobId,$userId){
        //先判断用户是否已完善简历
        $checkSql = "SELECT user_id FROM tb_users WHERE user_jobs_years IS NOT NULL AND user_id = '$userId'";

        $result = $this->conn->get_var($checkSql);
        //简历ready
        if($result){
            $sql = "INSERT INTO `tb_jobs_users` (`jobs_id`, `user_id`) VALUES ('$jobId', '$userId');";
            $this->conn->query($sql);
            $id = $this->conn->insert_id;
            if($id){
                $data['id'] = $id;
                return $data;
            } else{
                return null;
            }
        }else{
            $data['error'] = "请先完善简历";
            return $data;
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

    /**
     * 更新赞
     * @param $data
     * @return null
     */
    public function updateJobsZanById($jobsId){
        $sql = "update tb_jobs set jobs_zan = jobs_zan + 1 where jobs_id = $jobsId";
        $this->conn->query($sql);
        $data = $this->getJobById($jobsId);
        return $data;
    }


    /* ------------- `tb_events` table method ------------------ */
    /**
     * 获取活动列表
     * @param $start
     * @param $num
     */
    public function getEvents($start,$num = 30){
        $sql = "SELECT events_id,events_title,events_city,events_img,events_start_time FROM  `tb_events` WHERE events_state = 1 ORDER BY events_id DESC LIMIT $start , $num";
        $data = $this->conn->get_results($sql);
        return $data;
    }

    /**
     * 获取活动详细信息
     * @param $id
     */
    public function getEventsById($id){
        $sql = "SELECT events_id,user_name,events_title,events_user_id,events_users_num,events_city,events_start_time,events_end_time,events_guests,events_quota,events_detail,events_img,events_address,events_zan FROM  `tb_events` LEFT JOIN tb_users ON tb_events.events_user_id = tb_users.user_id WHERE events_state = 1 AND events_id = $id  ORDER BY events_id DESC";
        $data = $this->conn->get_row($sql);
        return $data;
    }

    /**
     * 获取活动列表
     * @param $start
     * @param $num
     */
    public function getEventsByUserId($userId){
        $sql = "SELECT events_id,events_city,events_title,events_start_time,events_users_num,events_img,
events_zan FROM  `tb_events` WHERE events_state = 1 AND events_user_id = $userId ORDER BY events_id DESC ";
        $data = $this->conn->get_results($sql);
        if($data){
            return $data;
        }else{
            return array();
        }
    }

    /**
     * 获取活动列表
     * @param $start
     * @param $num
     */
    public function getEventsByCity($city,$sort = 'events_id'){
        $whereCity = "";
        if($city != '不限'){
            $whereCity = " AND events_city = '$city'";
        }
        $sql = "SELECT events_id,events_title,events_start_time,events_users_num,events_img,
events_city FROM  `tb_events` WHERE events_state = 1 $whereCity ORDER BY $sort DESC ";
        $data = $this->conn->get_results($sql);
        if($data){
            return $data;
        }else{
            return array();
        }
    }



    /**
     * 根据地区 获取活动列表
     * @param $start
     * @param $num
     */
    public function searchEvents($search){
        $sql = "SELECT events_id,events_title,events_detail,events_start_time FROM  `tb_events` WHERE events_state = 1 AND events_detail LIKE '%$search%'  ORDER BY events_id DESC";
        $data = $this->conn->get_results($sql);
        if($data){
            return $data;
        }else{
            return array();
        }
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
     * 更新赞
     * @param $data
     * @return null
     */
    public function updateEventZanById($eventId){
        $sql = "update tb_events set events_zan = events_zan + 1 where events_id = $eventId";
        $this->conn->query($sql);
        $data = $this->getEventsById($eventId);
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

    /**
     * 获取报名人数
     * @param $start
     * @param $num
     */
    public function getJoinEventsById($eventsId){
        $sql = "SELECT events_id,tb_events_users.user_id,user_name,user_phone FROM  `tb_events_users` LEFT JOIN tb_users ON tb_events_users.user_id = tb_users.user_id WHERE events_id = '$eventsId'";
        $data = $this->conn->get_results($sql);
        return $data;
    }

    /**
     * 我要报名
     */
    public function joinEvents($eventsId,$userId){
        $sql = "INSERT INTO `tb_events_users` (`events_id`, `user_id`) VALUES ('$eventsId', '$userId');";
        $this->conn->query($sql);
        $id = $this->conn->insert_id;
        if($id){
            $data['id'] = $id;
            return $data;
        } else{
            return null;
        }
    }

    /**
     * 判断是否已报名
     * @param $start
     * @param $num
     */
    public function checkUserJoin($eventsId,$userId){
        $sql = "SELECT id FROM  `tb_events_users` WHERE events_id = '$eventsId' AND user_id = '$userId'";
        $result = $this->conn->get_var($sql);
        return $result > 0;
    }

    /**
     * 判断是否已提交简历
     * @param $start
     * @param $num
     */
    public function checkUserJob($jobsId,$userId){
        $sql = "SELECT id FROM  `tb_jobs_users` WHERE jobs_id = '$jobsId' AND user_id = '$userId'";
        $result = $this->conn->get_var($sql);
        return $result > 0;
    }






    /* ------------- `tb_services` table method ------------------ */
    /**
     * 获取服务列表
     * @param $start
     * @param $num
     */
    public function getServices($where = '',$start = 0,$num = 30){
        $sql = "SELECT services_id,services_content,services_img,services_industry,services_organization_name,services_city FROM  `tb_services` WHERE services_state = 1 $where  ORDER BY services_id DESC LIMIT $start , $num";
        $data = $this->conn->get_results($sql);
        if($data){
            return $data;
        }else{
            return array();
        }
    }


    /**
     * 获取创业服务详情详细信息
     * @param $id
     */
    public function getServicesById($id){
        // LEFT JOIN tb_users ON tb_services.services_user_id = tb_users.user_id
        $sql = "SELECT * FROM  `tb_services` WHERE services_state = 1 AND services_id = $id";
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

    /**
     * 更新赞
     * @param $data
     * @return null
     */
    public function updateServicesZanById($servicesId){
        $sql = "update tb_services set services_zan = services_zan + 1 where services_id = $servicesId";
        $this->conn->query($sql);
        $data = $this->getServicesById($servicesId);
        return $data;
    }


    /* ------------- `tb_project` table method ------------------ */
    /**
     * 获取创业服务列表
     * @param $start
     * @param $num
     */
    public function getProject($where = '',$start = 0,$num = 30){
        $sql = "SELECT project_id,project_name,project_img,project_push_date,project_financing,project_stage,project_intro,project_stage,project_city,project_type FROM  `tb_project` WHERE project_state = 1 $where  ORDER BY project_id DESC LIMIT $start , $num";
        $data = $this->conn->get_results($sql);
        if($data){
            return $data;
        }else{
            return array();
        }
    }

    /**
     * 获取服务列表
     * @param $start
     * @param $num
     */
    public function getProjectByUserId($userId,$start = 0,$num = 30){
        $sql = "SELECT project_id,project_name,project_img,project_date,project_financing,project_stage,project_brief,project_stage,project_city,project_type FROM  `tb_project` WHERE project_state = 1 AND project_user_id = '$userId'  ORDER BY project_id DESC LIMIT $start , $num";
        $data = $this->conn->get_results($sql);
        if($data){
            return $data;
        }else{
            return array();
        }
    }



    /**
     * 获取活动详细信息
     * @param $id
     */
    public function getProjectById($id){
        $sql = "SELECT * FROM  `tb_project` WHERE project_id = $id";
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
            $data['project_id'] = $id;
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

    /**
     * 更新赞
     * @param $data
     * @return null
     */
    public function updateProjectZanById($projectId){
        $sql = "update tb_project set project_zan = project_zan + 1 where project_id = $projectId";
        $this->conn->query($sql);
        $data = $this->getProjectById($projectId);
        return $data;
    }


    /* ------------- `tb_cv` table method ------------------ */


    /**
     * 获取我的简历
     * @param $id
     */
    public function getCvByUserId($id){
        $sql = "SELECT * FROM  `tb_cv` WHERE cv_user_id = $id";
        $data = $this->conn->get_row($sql);
        return $data;
    }

    /**
     * 创建活动
     * @param $data
     * @return null
     */
    public function createCv($data){
        $sql = $this->buildSqlInsert("tb_cv",$data);
        $this->conn->query($sql);
        $id = $this->conn->insert_id;
        if($id){
            $data['cv_id'] = $id;
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
    public function updateCvByUserId($data){
        if(!isset($data['cv_user_id'])){
            return null;
        }
        $where = '`cv_user_id` =' . $data['cv_user_id'];
        $sql = $this->buildSqlUpdate("tb_cv",$data,$where);
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
    public function delCvByUserId($id){
        $sql = "UPDATE  tb_cv SET cv_state = 0 WHERE project_id = $id";
        $result = $this->conn->query($sql);
        return $result;
    }

    /**
     * 更新赞
     * @param $data
     * @return null
     */
    public function updatCvZanById($userId){
        $sql = "update tb_cv set cv_zan = cv_zan + 1 where cv_id = $userId";
        $this->conn->query($sql);
        $data = $this->getCvByUserId($userId);
        return $data;
    }

    /**
     * 新增
     * @param $id
     * @return mixed
     */
    public function createCollect($data){
        //判断是否已经收藏过
        $favorites_user_id = $data['favorites_user_id'];
        $favorites_type = $data['favorites_type'];
        $favorites_type_id = $data['favorites_type_id'];

        $check = "SELECT favorites_id FROM  `tb_favorites_user` WHERE `favorites_user_id` = $favorites_user_id AND  `favorites_type` = $favorites_type  AND  `favorites_type_id` = $favorites_type_id";
        $favorites_id = $this->conn->get_var($check);
        if($favorites_id){
            $data['favorites_id'] = $favorites_id;
            return $data;
        }else{
            $sql = $this->buildSqlInsert("tb_favorites_user",$data);
            $this->conn->query($sql);
            $id = $this->conn->insert_id;
            if($id){
                $data['favorites_id'] = $id;
                return $data;
            } else{
                return null;
            }
        }

    }







}

?>
