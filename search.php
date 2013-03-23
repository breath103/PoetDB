<?php
	$subQuery1 = $_GET["query1"];
	$connector1_2 = $_GET["connector1_2"];
	$subQuery2 = $_GET["query2"];
	$connector2_3 = $_GET["connector2_3"];
	$subQuery3 = $_GET["query3"];
	
	
	$whereQuery = "where ".$subQuery1;
	
	if($connector1_2 != NULL &&
	      $subQuery2 != NULL)
	{
		$whereQuery = $query." ".$connector1_2." ".$subQuery2;	
		if($connector2_3 != NULL &&
			$subQuery3 != NUL)
		{
			$whereQuery = $query." ".$connector2_3." ".$subQuery3;	
		}
	}	
	
	require_once('db.class.php');	
	$db = new db_class;
		
	if (!$db->connect(SKKU_URL, SKKU_USER, SKKU_PASSWORD, SKKU_DB_NAME, true)) 
   		$db->print_last_error(false);
	
	
	$r = $db->select("SELECT ".$whereQuery." FROM Poet");
	while ($row=$db->get_row($r, 'MYSQL_ASSOC')) {
  	{
  		foreach ($row as $key => $value) {
			echo $value." ";	 
		}
		echo "<br>";
	}
	
} 	
	
?>
