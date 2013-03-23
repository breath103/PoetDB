<?php
	$connection = mysql_connect("124.137.25.250","daily_report","32811314");
	
	mysql_select_db("daily_report");
	
	$user_idx = $_GET["user_idx"];
	$depth1	  = $_GET["depth1"];
	$depth2	  = $_GET["depth2"];
	$keywords = $_GET["keywords"];
	$title	  = $_GET["title"];
	$text	  = $_GET["text"];
	$limit	  = $_GET["limit"];
	$since 	  = $_GET["since"];
	$until	  = $_GET["until"];
	
	$team_idx = $_GET["team_idx"];
	$team_name = $_GET["team_name"];	

	$query = "SELECT idx,written_time,user_idx,depth1,depth2,keywords,title,(select count(*) from reply where report_idx = daily_report.idx) as reply_count FROM daily_report ";
	if($user_idx  != null || 
		$depth1   != null ||
		$depth2   != null ||
		$keywords != null ||
		$title 	  != null ||
		$text 	  != null ||
		$since    != null ||
		$until 	  != null ||
		$team_idx != null ||
		$team_name!= null)
	{
		$query = $query." where ";
	}
	
	$isStart = false; 
	if($user_idx != null )
	{
		if($isStart == true)
			$query = $query." and";
		$isStart = true;
		$query = $query." user_idx = ".$user_idx;
	}
	else if($team_idx != null)
	{
		if($isStart == true)
			$query = $query." and";
		$isStart = true;
		$query = $query." user_idx in (select idx from user_info where team_idx =".$team_idx.")";
	}
	else if($team_name != null)	
	{	
		if($isStart == true)
			$query = $query." and";
		$isStart = true;
		$query = $query." user_idx in (select idx from user_info where team_idx = (select idx from team where name = '".$team_name."'))"; 
	}
	if($depth1 != null)
	{
		if($isStart == true)
			$query = $query." and";
		$isStart = true;
		$query = $query." depth1 = '".$depth1."'";
	}
	if($depth2 != null)
	{
		if($isStart == true)
			$query = $query." and";
		$isStart = true;
		$query = $query." depth2 = '".$depth2."'";
	}
	if($since != null)
	{
		if($isStart == true)
		$query = $query." and";
		$isStart = true;
		$query = $query." written_time > '".$since."'";
	}
	if($until != null)
	{
		if($isStart == true)
		$query = $query." and";
		$isStart = true;
		$query = $query." written_time < '".$until."'";
	}
	$query = $query." order by idx";
	
	if($limit != null)
		$query = $query." limit ".$limit;	
	//echo $query;

	$result = mysql_query($query,$connection);
	$fields_cnt = mysql_num_fields($result);
	$fields_name = array();
	$json_data = array();	
	
	for($i=0;$i<$fields_cnt;$i++)
	  	$fields_name[$i] = mysql_field_name($result, $i);

	$newObject = array();
	$row_cnt = 0;
	while($row = mysql_fetch_row($result))
	{
		for($i=0;$i<$fields_cnt;$i++)
		{
			$newObject[$fields_name[$i]] = $row[$i];
		}
		$json_data[$row_cnt++] = $newObject;
	}
	echo json_encode($json_data);
	mysql_close($connection);
?>