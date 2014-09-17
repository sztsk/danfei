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


/**
 * Echoing json response to client
 * @param String $status_code Http response code
 * @param Int $response Json response
 */
function echoRespnse($status_code, $response) {
    $app = \Slim\Slim::getInstance();
    // Http response code
    $app->status($status_code);

    // setting response content type to json
    $app->contentType('application/json');

    echo json_encode($response);
}

/**
 * Step 4: Run the Slim application
 *
 * This method should be called last. This executes the Slim application
 * and returns the HTTP response to the HTTP client.
 */
$app->run();
