<?php

require_once 'include/DBHandler.php';
require_once 'include/PassHash.php';
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
//        $response = array();
        $db = new DbHandler();
        if($db->checkLogin($phone,$password)){
            $user = $db->getUserByPhone($phone);
            $db = null;
            return $user;
        }else{
            return NULL;
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
        $data = $db->getJobs($start,$num);
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
    '/events(/:start)(:/num)',
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

$app->patch(
    '/events',
    function () use ($app){
        $data = $app->request->patch();
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
    '/services(/:start)(:/num)',
    function ($start = 0,$num  = 30){
        $db = new DbHandler();
        $data = $db->getServices($start,$num);
        $db = null;
        echoRespnse(200,$data);
    }
);

$app->post(
    '/services',
    function () use ($app){
        $data = $app->request->post();
        $db = new DbHandler();
        $jobData = $db->createEvents($data);
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


/******************services*********************/

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
 * Echoing json response to client
 * @param String $status_code Http response code
 * @param Int $response Json response
 */
function echoRespnse($status_code, $response) {
    $app = \Slim\Slim::getInstance();
    if(!$response){
        $response = array(
            'error' =>true,
            'message' => "The requested resource doesn't exists"
        );
        $status_code = 404;
    }

    // Http response code
    $app->status($status_code);

    // setting response content type to json
    $app->contentType('application/json');

    echo json_encode($response);
}


$app->run();
