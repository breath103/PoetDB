			



			function PoetDiv($parentDiv,poetJSON)
			{
				this.parseText = function(originalText)
				{
					var resultText;
					
					var text = originalText;
					
					var components = text.split("[");
					
					resultText = components[0].replaceAll(".",".</br>");
					
					for(var i=1;i<components.length;i++)
					{
						var commentAndText = components[i].split("]");
						if(commentAndText[0] != undefined)	
							resultText += '<div class="comment_div">' + commentAndText[0] + "</div>";
						if(commentAndText[1] != undefined)
							resultText += commentAndText[1].replaceAll(".",".</br>");
					}

					return resultText;
				};
				
				this.$poetJSON = poetJSON;
				$parentDiv.append("<div></div>");
				this.$div = $parentDiv.children("div").last(); 
				this.$div.addClass("PoetDiv");
				this.$div.append('<p>' + poetJSON.authorName + "</p>" + 
								 '<p>' + poetJSON.mediaName + "</p>" + 
								 '<p>' + poetJSON.title + "</p>" +
								 '<p>' + poetJSON.published_date + "</p>" + 
								 this.parseText(poetJSON.text));
				

				this.$div.children(".comment_div").click(function(){
					
					if($(this).css("width") != "10px")
						$(this).animate({"width" :"10px",
										 "height":"13px"});
					else
					{
						var currentWidth   = $(this).width();
						var currentHeight  = $(this).height();
				
						$(this).css({
							"width":"auto",
							"height":"auto"
						});
						var autoWidth  = $(this).width();
						var autoHeight = $(this).height();
						$(this).css({
							"width" :currentWidth,
							"height":currentHeight
						}).animate({
							"width" :autoWidth,
							"height":autoHeight
						});
					}
				});
			}
			
			function CommentDiv($parentDiv,comment)
			{
				$parentDiv.append("<div></div>");
			 	this.$div = $parentDiv.children("div").last(); 
				
				$div.onclick(function(){
					$(this).slideUp();
				});
				
				
				$div.append("<p>"+comment+"</p>");
				this.$commentParagraph = $div.find("p");
				$commentParagraph.css({
					"font-color" : "red"
				});
			}
			

			
			function PoetSearch()
			{
				var searchingCall;
				var POET_PAGE_SIZE = 30; //
				
				this.m_currentPage = 1;
				this.m_maxPage = 1;
				
				this.m_lastQuery; 
				
				var outerThis = this;
				
				var generatePageLinks = function(maxPage)
				{
					$($(".footer-outer .page_list").children()).remove();
					this.m_maxPage = maxPage;	
					for(var i =0;i<maxPage;i++){
						$(".footer-outer .page_list").append(" <a>"+(i+1)+"</a> ");
					}
					
					var pageLinks = $(".footer-outer a");
					for(var i=0;i<maxPage;i++){
						$(pageLinks[i]).click(function(){
							outerThis.moveToPage($(this).html(),outerThis.m_lastQuery);
						});
					}
				};
				var executeSearchQuery = function(query,generatePageBor)
				{
					$.getJSON("./testQuery.php",{
						'query' : escape(query)
					},function(result){
						
						if(generatePageBor == true)
							generatePageLinks(result.rowCnt / POET_PAGE_SIZE);				
					
						var poetArray = result.data;
						
						/*
						for(var i=0;i<poetArray.length;i++){
							new PoetDiv($("#html-root"),poetArray[i]);
						}*/
						
						$($("#poetList").children("tbody")).remove();
						$("#poetList").append(generatePoetTable(poetArray));
						
						$("#loadingDiv").fadeOut("fast");
						clearInterval(searchingCall);
					
						highlightor.highlightWord();
					});
				};
				
				
				this.moveToPage = function(page,query)
				{
					this.m_currentPage = page;
					
					this.m_lastQuery = query;
					$("#html-root").children().remove();
					
					$("#loadingDiv").fadeIn("fast");
					searchingCall = setInterval(function(){
						var dotPar = $($("#loadingDiv").find("p")[1]);
						if(dotPar.html().length < 6){
							dotPar.html(dotPar.html()+".");
						}
						else{
							dotPar.html(".");
						}
					},500);

					
					if(query.indexOf("limit") < 0)
					{
						var startIndex = POET_PAGE_SIZE * (this.m_currentPage - 1);
						var endIndex   = POET_PAGE_SIZE;
						query += " limit "+startIndex+","+endIndex;		
					}

					executeSearchQuery(query,page == 1);
				};
				
				this.onDoQuery = function(){
					highlightor.resetTargetWord();
					this.moveToPage(1,"where " + buildQuery());
				};
			}