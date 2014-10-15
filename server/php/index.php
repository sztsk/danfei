<?php

require_once 'inc/DbHandler.php';
require_once 'inc/PassHash.php';
require 'libs/Slim/Slim.php';


\Slim\Slim::registerAutoloader();

global $user_id;


$app = new \Slim\Slim();



$app->post(
    '/register',
    function () use ($app){
        $response = array();
        $userData = $app->request->post();
        $db = new DbHandler();
        $res = $db->createUser($userData);
        if ($res == USER_CREATED_SUCCESSFULLY) {
            $response["error"] = false;
            $response["message"] = "You are successfully registered";
        } else if ($res == USER_CREATE_FAILED) {
            $response["error"] = true;
            $response["message"] = "Oops! An error occurred while registereing";
        } else if ($res == USER_ALREADY_EXISTED) {
            $response["error"] = true;
            $response["message"] = "抱歉，该手机号码已使用！";
        }
        echoRespnse(201,$response);

    }
);

$app->post(
    '/login',
    function () use ($app){
        $phone = $app->request()->post('user_phone');
        $password = $app->request()->post('user_password');
        $response = array();
        $db = new DbHandler();
        if($db->checkLogin($phone,$password)){
            $user = $db->getUserByPhone($phone);
            $db = null;
            echoRespnse(201,$user);
        }else{
            $response["error"] = true;
            $response["message"] = "抱歉，手机号码 或 密码 不对，请重新登录！";
            echoRespnse(201,$response);
        }
    }
);


/******************jobs*********************/

$app->get(
    '/jobs/:id',
    function ($id){
        $db = new DbHandler();
        $data = $db->getJobById($id);
        $db = null;
        echoRespnse(200,$data);
    }
);

//获取该公司下的所有职位
$app->get(
    '/jobs/company/:id',
    function ($id){
        $db = new DbHandler();
        $data = $db->getJobsByComId($id);
        $db = null;
        echoRespnse(200,$data);
    }
);

$app->get(
    '/jobs(/:start)(:/num)',
    function ($start = 0,$num  = 30){
        $db = new DbHandler();
        $data = $db->getJobs('',$start,$num);
        $db = null;
        echoRespnse(200,$data);
    }
);

$app->get(
    '/jobs/:city/:salary/:jobs(/:start)(/:num)',
    function ($city,$salary,$jobs,$start = 0,$num  = 30){
        $db = new DbHandler();
        $where = '';
        if($city != '全部地区'){
            $where .= " AND jobs_city = '$city'";
        };
        if($salary != '全部薪酬'){
            $where .= " AND jobs_salary_start > '$salary'";
        }
        if($jobs != '全部岗位'){
            $where .= " AND jobs_type = '$jobs'";
        }
        $data = $db->getJobs($where,$start,$num);
        $db = null;
        echoRespnse(200,$data);
    }
);

/**
 * 判断是否已报名
 */
$app->get(
    '/check/jobs/:jobsid/user/:userid',
    function ($jobsId,$userId){
        $db = new DbHandler();
        $data = $db->checkUserJob($jobsId,$userId);
        $db = null;
        echoRespnse(200,$data);
    }
);


$app->post(
    '/jobs',
    function () use ($app){
        $data = $app->request->post();
        $db = new DbHandler();
        $jobData = $db->createJobs($data);
        echoRespnse(201,$jobData);
    }
);

//提交简历
$app->post(
    '/join/jobs',
    function () use ($app){
        $data = $app->request->post();
        $db = new DbHandler();
        $jobData = $db->joinJobs($data['jid'],$data['uid']);
        echoRespnse(201,$jobData);
    }
);

$app->patch(
    '/jobs',
    function () use ($app){
        $data = $app->request->patch();
        $db = new DbHandler();
        $jobData = $db->updateJobsById($data);
        $db = null;
        echoRespnse(200,$jobData);
    }
);

$app->delete(
    '/jobs/:id',
    function ($id){
        $db = new DbHandler();
        $result = $db->delJobsById($id);
        if ($result) {
            // task deleted successfully
            $response["error"] = false;
            $response["message"] = "Task deleted succesfully";
        } else {
            // task failed to delete
            $response["error"] = true;
            $response["message"] = "Task failed to delete. Please try again!";
        }
        echoRespnse(200, $response);
    }
);


/******************events*********************/

$app->get(
    '/events/:id',
    function ($id){
        $db = new DbHandler();
        $data = $db->getEventsById($id);
        $db = null;
        echoRespnse(200,$data);
    }
);

$app->get(
    '/events/user/:id',
    function ($id){
        $db = new DbHandler();
        $data = $db->getEventsByUserId($id);
        $db = null;
        echoRespnse(200,$data);
    }
);

/**
 * 根据地区 获取 活动列表
 */
$app->get(
    '/events/city/:city',
    function ($city){
        $db = new DbHandler();
        $data = $db->getEventsByCity($city);
        $db = null;
        echoRespnse(200,$data);
    }
);

/**
 * 根据地区 获取 活动列表
 */
$app->get(
    '/events/search/:keyword',
    function ($keyword){
        $db = new DbHandler();
        $data = $db->searchEvents($keyword);
        $db = null;
        echoRespnse(200,$data);
    }
);


$app->get(
    '/events(/:start)(/:num)',
    function ($start = 0,$num  = 30){
        $db = new DbHandler();
        $data = $db->getEvents($start,$num);
        $db = null;
        echoRespnse(200,$data);
    }
);

$app->post(
    '/events',
    function () use ($app){
        $data = $app->request->post();
        $db = new DbHandler();
        $jobData = $db->createEvents($data);
        echoRespnse(201,$jobData);
    }
);

$app->put(
    '/events',
    function () use ($app){
        $data = $app->request->put();
        $db = new DbHandler();
        $jobData = $db->updateEventsById($data);
        $db = null;
        echoRespnse(200,$jobData);
    }
);

$app->delete(
    '/events/:id',
    function ($id){
        $db = new DbHandler();
        $result = $db->delEventsById($id);
        if ($result) {
            // task deleted successfully
            $response["error"] = false;
            $response["message"] = "Task deleted succesfully";
        } else {
            // task failed to delete
            $response["error"] = true;
            $response["message"] = "Task failed to delete. Please try again!";
        }
        echoRespnse(200, $response);
    }
);



/******************services*********************/

$app->get(
    '/services/:id',
    function ($id){
        $db = new DbHandler();
        $data = $db->getServicesById($id);
        $db = null;
        echoRespnse(200,$data);
    }
);

$app->get(
    '/services/user/:userId',
    function ($userId){
        $db = new DbHandler();
        $where = " AND services_user_id = '$userId'";
        $data = $db->getServices($where,0,30);
        $db = null;
        echoRespnse(200,$data);
    }
);


$app->get(
    '/services/:city/:industry(/:start)(/:num)',
    function ($city,$industry,$start = 0,$num  = 30){
        $db = new DbHandler();
        $where = '';
        if($city != '全部地区'){
            $where .= " AND user_city = '$city'";
        };
        if($industry != '全部领域'){
            $where .= " AND services_industry = '$industry'";
        }
        $data = $db->getServices($where,$start,$num);
        $db = null;
        echoRespnse(200,$data);
    }
);



$app->get(
    '/services(/:start)(/:num)',
    function ($start = 0,$num  = 30){
        $db = new DbHandler();
        $data = $db->getServices('',$start,$num);
        $db = null;
        echoRespnse(200,$data);
    }
);

$app->post(
    '/services',
    function () use ($app){
        $data = $app->request->post();
        $db = new DbHandler();
        $jobData = $db->createServices($data);
        echoRespnse(201,$jobData);
    }
);

$app->patch(
    '/services',
    function () use ($app){
        $data = $app->request->patch();
        $db = new DbHandler();
        $jobData = $db->updateServicesById($data);
        $db = null;
        echoRespnse(200,$jobData);
    }
);

$app->delete(
    '/services/:id',
    function ($id){
        $db = new DbHandler();
        $result = $db->delServicesById($id);
        if ($result) {
            // task deleted successfully
            $response["error"] = false;
            $response["message"] = "Task deleted succesfully";
        } else {
            // task failed to delete
            $response["error"] = true;
            $response["message"] = "Task failed to delete. Please try again!";
        }
        echoRespnse(200, $response);
    }
);

$app->post(
    '/services_project',
    function () use ($app){
        $data = $app->request->post();
        $db = new DbHandler();
        $jobData = $db->submitServicesProject($data['sid'],$data['pid']);
        echoRespnse(201,$jobData);
    }
);


/******************project*********************/

$app->get(
    '/project/:id',
    function ($id){
        $db = new DbHandler();
        $data = $db->getProjectById($id);
        $db = null;
        echoRespnse(200,$data);
    }
);

$app->get(
    '/project/user/:id',
    function ($id){
        $db = new DbHandler();
        $data = $db->getProjectByUserId($id);
        $db = null;
        echoRespnse(200,$data);
    }
);


$app->get(
    '/project(/:start)(:/num)',
    function ($start = 0,$num  = 30){
        $db = new DbHandler();
        $data = $db->getProject('',$start,$num);
        $db = null;
        echoRespnse(200,$data);
    }
);


$app->get(
    '/project/:city/:industry(/:start)(/:num)',
    function ($city,$industry,$start = 0,$num  = 30){
        $db = new DbHandler();
        $where = '';
        if($city != '全部地区'){
            $where .= " AND project_city = '$city'";
        };
        if($industry != '全部领域'){
            $where .= " AND project_type = '$industry'";
        }
        $data = $db->getProject($where,$start,$num);
        $db = null;
        echoRespnse(200,$data);
    }
);

$app->post(
    '/project',
    function () use ($app){
        $data = $app->request->post();
        $db = new DbHandler();
        $jobData = $db->createProject($data);
        echoRespnse(201,$jobData);
    }
);

$app->patch(
    '/project',
    function () use ($app){
        $data = $app->request->patch();
        $db = new DbHandler();
        $jobData = $db->updateProjectById($data);
        $db = null;
        echoRespnse(200,$jobData);
    }
);

$app->delete(
    '/project/:id',
    function ($id){
        $db = new DbHandler();
        $result = $db->delProjectById($id);
        if ($result) {
            // task deleted successfully
            $response["error"] = false;
            $response["message"] = "Task deleted succesfully";
        } else {
            // task failed to delete
            $response["error"] = true;
            $response["message"] = "Task failed to delete. Please try again!";
        }
        echoRespnse(200, $response);
    }
);


/******************users*********************/

$app->get(
    '/users/:id',
    function ($id){
        $db = new DbHandler();
        $data = $db->getUsersById($id);
        $db = null;
        echoRespnse(200,$data);
    }
);


$app->get(
    '/users(/:start)(:/num)',
    function ($start = 0,$num  = 30){
        $db = new DbHandler();
        $data = $db->getUsers('',$start,$num);
        $db = null;
        echoRespnse(200,$data);
    }
);

//人才展示 筛选
$app->get(
    '/users/:city/:salary/:jobs(/:start)(/:num)',
    function ($city,$salary,$jobs,$start = 0,$num  = 30){
        $db = new DbHandler();
        $where = '';
        if($city != '全部地区'){
            $where .= " AND user_city = '$city'";
        };
//        if($salary != '全部薪酬'){
//            $where .= " AND jobs_salary_start > '$salary'";
//        }
        if($jobs != '全部岗位'){
            $where .= " AND user_jobs_type = '$jobs'";
        }
        $data = $db->getUsers($where,$start,$num);
        $db = null;
        echoRespnse(200,$data);
    }
);


$app->post(
    '/users',
    function () use ($app){
        $data = $app->request->post();
        $db = new DbHandler();
        $jobData = $db->createUser($data);
        $db = null;
        echoRespnse(201,$jobData);
    }
);

$app->patch(
    '/users',
    function () use ($app){
        $data = $app->request->patch();
        $db = new DbHandler();
        $jobData = $db->updateUsersById($data);
        $db = null;
        echoRespnse(200,$jobData);
    }
);

$app->delete(
    '/users/:id',
    function ($id){
        $db = new DbHandler();
        $result = $db->delUsersById($id);
        $db = null;
        if ($result) {
            // task deleted successfully
            $response["error"] = false;
            $response["message"] = "Task deleted succesfully";
        } else {
            // task failed to delete
            $response["error"] = true;
            $response["message"] = "Task failed to delete. Please try again!";
        }
        echoRespnse(200, $response);
    }
);


/******************company*********************/

$app->get(
    '/company/:id',
    function ($id){
        $db = new DbHandler();
        $data = $db->getCompanyById($id);
        $db = null;
        echoRespnse(200,$data);
    }
);

/**
 * 获取报名人数
 */
$app->get(
    '/join/events/:eventsid',
    function ($eventsId){
        $db = new DbHandler();
        $data = $db->getJoinEventsById($eventsId);
        $db = null;
        echoRespnse(200,$data);
    }
);

/**
 * 判断是否已报名
 */
$app->get(
    '/check/events/:eventsid/user/:userid',
    function ($eventsId,$userId){
        $db = new DbHandler();
        $data = $db->checkUserJoin($eventsId,$userId);
        $db = null;
        echoRespnse(200,$data);
    }
);

/**
 * 我要报名
 */
$app->post(
    '/join/events',
    function () use ($app){
        $data = $app->request->post();
        $db = new DbHandler();
        $jobData = $db->joinEvents($data['eid'],$data['uid']);
        echoRespnse(201,$jobData);
    }
);


/**
 * 判断是否已发出邀请
 */
$app->get(
    '/check/company/:companyid/user/:userid',
    function ($companyId,$userId){
        $db = new DbHandler();
        $data = $db->checkCompanyJoin($companyId,$userId);
        $db = null;
        echoRespnse(200,$data);
    }
);

/**
 * 我要发出邀请
 */
$app->post(
    '/join/company',
    function () use ($app){
        $data = $app->request->post();
        $db = new DbHandler();
        $jobData = $db->joinCompany($data['cid'],$data['uid']);
        echoRespnse(201,$jobData);
    }
);

$app->post('/upload/img',
    function () use ($app)
    {
        $userData = $app->request->post();
        $data = $userData['dataURL'];
        list($type, $data) = explode(';', $data);
        list(, $data)      = explode(',', $data);
        $data = base64_decode($data);
        file_put_contents('tt.png', $data);
    }
);



/**
 * Echoing json response to client
 * @param String $status_code Http response code
 * @param Int $response Json response
 */
function echoRespnse($status_code, $response) {
    $app = \Slim\Slim::getInstance();
//    if(!$response){
//        $response = array(
//            'error' =>true,
//            'message' => "The requested resource doesn't exists"
//        );
//        $status_code = 404;
//    }

    // Http response code
    $app->status($status_code);

    // setting response content type to json
    $app->contentType('application/json');

    if(is_array($response)){
        echo json_encode($response);
    }else{
        echo '{"data":'. json_encode($response) .'}';
    }

}




$app->run();