<?php

	define(SKKU_URL,"115.145.129.37");
	define(SKKU_USER,"inmunskku");
	define(SKKU_PASSWORD,"1278");
	define(SKKU_DB_NAME,"inmunskku");
	
	
	
	function UnescapeFunc($str)
	{
		return iconv('UTF-16LE', 'UTF-8', chr(hexdec(substr($str[1], 2, 2))).chr(hexdec(substr($str[1],0,2))));
	}
	
	function Unescape($str) // UnescapeFunc는 아래에 정의되어 있음
	{
		return urldecode(preg_replace_callback('/%u([[:alnum:]]{4})/', 'UnescapeFunc', $str));
	}
	
	
	
	
	class WhereQueryNode 
	{
		var $leftValue;
		var $operator;
		var $rightValue;
		function WhereQueryNode($lValue,$operator,$rValue)
		{
			$this->leftValue  = $lValue;
			$this->operator   = $operator;
			$this->rightValue = $rValue;
		}
		function toQueryString()
		{
			$leftStr   = (get_class($this->leftValue)  == "WhereQueryNode") ? $this->leftValue.toQueryString() : $this->leftValue;
			$rightStr  = (get_class($this->rightValue) == "WhereQueryNode") ? $this->rightValue.toQueryString() : $this->rightValue;
			return "( ".$leftStr." ".$this->operator." ".$rightStr." )";
		}
	}
	define(WQN,WhereQueryNode);
	
	class WhereQueryBuilder
	{
		var $rootQuery;
		function WhereQueryBuilder($rootQuery)
		{
			$this->rootQuery = $rootQuery;
		}
		function toQueryString()
		{
			return " where ".$this->rootQuery.toQueryString();
		}
	}
	/*
	class SelectParamterListNode 
	{
		var $originalParamName;
		var $asParamNmae; 		//select a as b 
	
		function SelectParamterListNode($originalParamName,$asParamName = NULL)
		{
			$this->originalParamName = $originalParamName;
			$this->asParamNmae		 = $asParamName;
		}
		function toQueryString()
		{
			if($this->asParamNmae != NULL)
				return $this->originalParamName." as ".$this->asParamNmae;
			else
				return $this->originalParamName;
		}	
	}
	class SelectParamterListContainer
	{
		var $parametersList;
		function SelectParamterListContainer()
		{
			$this->parametersList = array();
			
		}
		function setParameterList($parameterMap)
		{
			foreach ($parameterMap as $key => $value) {
				array_push($this->parametersList,new Select)	
				//$this->parametersList 
			}
		}
		function toQueryString()
		{
			$queryString = "";
			foreach ($this->parametersList as $key => $value) {
				$queryString = $queryString." ".$value;
			}
		}
	}
	
	class DBTemplate
	{
		var $m_connection;
		
		function DBTemplate()
		{
			$this->m_connection = mysql_connect(SKKU_URL,SKKU_USER,SKKU_PASSWORD);
			mysql_select_db(SKKU_DB_NAME,$this->m_connection);
		}
		function executeQuery($query) 
		{
			return mysql_query($query,$this->m_connection);
		}
		function selectQuery($tableName,$selectParameterArray,$where)	
		{
			
		}
		function getPoetsList()
		{
			
		}
		function getMediaList()
		{
			
		}
		function getAuthorList()
		{
			
		}
	}
	 * *
	 */
?>
