<?php
	header ('Content-Type: text/plain; charset=UTF-8');
		
	$query = $_GET["query"];
	

	require_once('DBTemplate.php');
	require_once('db.class.php');	
	
	
	$db = new db_class;
		
	if (!$db->connect(SKKU_URL, SKKU_USER, SKKU_PASSWORD, SKKU_DB_NAME, true)) 
   		$db->print_last_error(false);
	mysql_query("SET NAMES UTF8");

	$query = "select SQL_CALC_FOUND_ROWS * from PoetExt ".Unescape($query);
	$r = $db->select($query);
	
	$echoResult = array();
	while ($row=$db->get_row($r, 'MYSQL_ASSOC')) 
  	{
  	//	$row["text"] = null;
		array_push($echoResult,$row);	
	}
	
	$totalRowCnt = 0;
	$r = $db->select("select FOUND_ROWS()");
	while ($row=$db->get_row($r, 'MYSQL_ASSOC'))
	{
		$totalRowCnt = $row["FOUND_ROWS()"];
		echo $row[0];
	}
	
	$resultJSON = array();
	$resultJSON['data']   = $echoResult;
	$resultJSON['rowCnt'] = $totalRowCnt;
	
	echo json_encode($resultJSON);
	
	mysql_close();
?>
