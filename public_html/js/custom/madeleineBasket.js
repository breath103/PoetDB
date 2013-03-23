/**
 * @author 이상현
 */


		var photoWidth = 200;
		var photoHeight= 270;
							
		function MadeleineIcon(rootDiv,madeleine_info)
		{
			//// super constructor
			HtmlObject.call(this,rootDiv);
			var outerThis = this;
		
			//// constructor 
			this.m_info = madeleine_info;
			this.m_created_time = null;
			
			this.getDiv().rotate(rand(-35,35) + "deg");
			if(this.m_info.is_opened == true) // 이미 쳐먹음
			{
				this.getDiv().addClass("OpenedMadeleineIcon");
				this.getDiv().click(function(){
					$("#MadeleineBasketTastView").attr("href",'./testjy/MadeleineView1.jsp?id=' + outerThis.m_info.idx );
					$("#MadeleineBasketTastView").trigger("click");
				});
				this.m_photoContainer = new ImageDiv(this.getDiv(),
						 this.m_info.cover_photo,
						 "PhotoContainer");
				this.m_photoContainer.setImageOnLoad(function(){
					outerThis.m_photoContainer.getDiv().fadeTo("slow",1);
					CropImageCenter(outerThis.m_photoContainer.getImageDiv(),outerThis.m_photoContainer.getDiv().width(),outerThis.m_photoContainer.getDiv().height());
				});
				this.m_photoContainer.getDiv().css({"opacity":0});
				this.getDiv().append("<div class=\"TextContainer\"><div class =\"DateContainer\"></div><div class=\"MessageContainer\"></div></div>");
				
				this.m_created_time = Date.parse(madeleine_info.created_time);
				this.getDiv().find(".DateContainer").append("<p class=\"Date\">"  +
															String(this.m_created_time.getFullYear()) + "." 
															+ String(this.m_created_time.getMonth() + 1) + "."
															+ String(this.m_created_time.getDate())
															+ "</p>");
			}
			else
			{
				this.getDiv().addClass("ClosedMadeleineIcon");
			}
			
			
			this.getInfo = function() {return this.m_info;};
		}
		MadeleineIcon.prototype 			= HtmlObject.prototype;
		MadeleineIcon.prototype.constructor = MadeleineIcon;
		
		function MadeleineBasketController()
		{
			this.m_madeleineList = null;
			this.m_publicMadeleineList  = new Array();
			this.m_privateMadeleineList = new Array();
			this.m_timelineBar	= null;	
			this.m_dateOverall  = null;
			
			this.m_openedMadeleineCnt = 0 ;
			this.m_closedMadeleineCnt = 0;
			
			var outerThis = this;
			
			this.initCallbacks = function(){
				$(".ShowClosedMadeleine").click(function(){
					$(this).css({
						"background-image":"url(./image/basket/sidebar_menu1_click.png)"
					});
					$(".ShowOpenedMadeleine").css({
						"background-image":"url(./image/basket/sidebar_menu2_basic.png)"
					});
					var $tastedMadeleineArray = $(".OpenedMadeleineIcon");
					for(var i=0;i<$tastedMadeleineArray.length;i++)
					{
						var x = 20 + Math.floor(i/2) * (280 + 20);
						var y = 20 + i%2 * (295 + 20);
						$($tastedMadeleineArray[i]).css({
							"left" : x,
							"top" : y
						});
					}
					$(".ClosedMadeleineIcon").stop().fadeTo("normal",0);
					$(".OpenedMadeleineIcon").stop().fadeTo("normal",1);
				});
				$(".ShowOpenedMadeleine").click(function(){
					
					$(this).css({
						"background-image":"url(./image/basket/sidebar_menu2_click.png)"
					});
					$(".ShowClosedMadeleine").css({
						"background-image":"url(./image/basket/sidebar_menu1_basic.png)"
					});
					
					var $madeleineArray = $(".ClosedMadeleineIcon");
					for(var i=0;i<$madeleineArray.length;i++)
					{
						var x = 20 + Math.floor(i/2) * (280 + 20);
						var y = 20 + i%2 * (295 + 20);
						$($madeleineArray[i]).css({
							"left" : x,
							"top" : y
						});
					}
					$(".ClosedMadeleineIcon").stop().fadeTo("normal",1);
					$(".OpenedMadeleineIcon").stop().fadeTo("normal",0);
				});
				$(".ShowOpenedMadeleine").trigger("click");
				
				
				
				var $CountIndicator = $(".madeleineBasket .BottomBar .CountIndicator");
				$($CountIndicator[0]).children(".Count").html(this.m_openedMadeleineCnt + this.m_closedMadeleineCnt);
				$($CountIndicator[1]).children(".Count").html(this.m_openedMadeleineCnt);
				$($CountIndicator[2]).children(".Count").html(this.m_closedMadeleineCnt);
			};
			this.init = function(facebook_userid)
			{	
				
				this.m_timelineBar = new HtmlObject($(".madeleineBasket"));
				this.m_timelineBar.getDiv().addClass("TimeLine")
										   .append("<div class = \"DragButton\"></div>");
				
				var $timeline 	= $(".madeleineBasket .TimeLine");
				var $dragButton = $(".madeleineBasket .TimeLine .DragButton");
				
				$dragButton[0].isUp = true;
				$dragButton.click(function(){
					if($(this)[0].isUp == true)
					{
						$(this).css({"background-image":"url(./image/basket/footerbar_button_click.png)"});
					}
					else
					{
						$(this).css({"background-image":"url(./image/basket/footerbar_button_basic.png)"});
					}
					$(this)[0].isUp = ! $(this)[0].isUp;
					madeleineBasketController.onClickTimelineButton();
				});
				
				this.m_dateOverall = new UIDateOverall({ Div: $timeline, nBundle: 1, WidthElem: 10, WidthStride: 12 });
				
				$.ajax({
					type: "get",
					async: true,
					url	: "./servlet/GetMadeleineByCreator.jsp",
					data: {"creator": facebook_userid},
					dataType: "JSON",
					success: function(response){
						outerThis.m_madeleineList = response;
						
						for( var i=0;i<response.length;i++)
						{
							var madeleine_info = response[i];
							var madeleineIcon = new MadeleineIcon($(".madeleineBasket"),madeleine_info);

							var x = 20 + Math.floor(i/2) * (280 + 20);
							var y = 20 + i%2 * (295 + 20);
							madeleineIcon.getDiv().css({"left":x,"top":y});
							
							if(madeleineIcon.m_info.is_public)
								outerThis.m_publicMadeleineList.push(madeleineIcon);
							else
								outerThis.m_privateMadeleineList.push(madeleineIcon);
							
							if(madeleineIcon.getInfo().is_opened)
								outerThis.m_openedMadeleineCnt++;
							else
								outerThis.m_closedMadeleineCnt++;
							
						}
						outerThis.initCallbacks();
					}		
				});
				
			};
			
			this.isTimelineHidden = true;
			this.onClickTimelineButton = function(){
				if(this.isTimelineHidden)
				{
					this.m_timelineBar.getDiv().stop().animate({"top":"-=86px"});
				}
				else
				{
					this.m_timelineBar.getDiv().stop().animate({"top":"+=86px"});
				}
				this.isTimelineHidden = !this.isTimelineHidden;
			}
		}
		var madeleineBasketController = new MadeleineBasketController();
		