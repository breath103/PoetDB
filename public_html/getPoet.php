<?php
	header ('Content-Type: text/plain; charset=UTF-8');
		
	$poet_idx = $_GET["poet_id"];
	

	require_once('DBTemplate.php');
	require_once('db.class.php');	
	
	
	$db = new db_class;
		
	if (!$db->connect(SKKU_URL, SKKU_USER, SKKU_PASSWORD, SKKU_DB_NAME, true)) 
   		$db->print_last_error(false);
	mysql_query("SET NAMES UTF8");

	$query = "select * from PoetExt where idx = ".Unescape($poet_idx);
	
	$r = $db->select($query);
	
	$jsonResult = array();
	array_push($jsonResult, $db->get_row($r, 'MYSQL_ASSOC'));	
	echo json_encode($jsonResult);
	
	mysql_close();
?>
