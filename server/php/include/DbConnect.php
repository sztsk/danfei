<?php

/**
 * Handling database connection
 *
 * @author hugo hua
 */
class DbConnect {

    private $conn;

    function __construct() {        
    }

    /**
     * Establishing database connection
     * @return database connection handler
     */
    function connect() {
        include_once dirname(__FILE__) . '/Config.php';
        include_once dirname(dirname(__FILE__)) . '/libs/ezSQL/shared/ez_sql_core.php';
        include_once dirname(dirname(__FILE__)) . '/libs/ezSQL/pdo/ez_sql_pdo.php';
        // Connecting to mysql database
        $this->conn = new ezSQL_pdo("mysql:host=DB_HOST;dbname=DB_NAME;charset=utf8", DB_USERNAME, DB_PASSWORD);

        // Check for database connection error
        if (mysqli_connect_errno()) {
            echo "Failed to connect to MySQL: " . mysqli_connect_error();
        }

        // returing connection resource
        return $this->conn;
    }

}

?>
