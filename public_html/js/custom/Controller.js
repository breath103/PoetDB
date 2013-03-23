/**
 * @author 이상현
 */

	var ThumbnailSize ={x:70,y:70};
	var border = 5;



	function Controller()
	{
		////////////////// constructor
		this.m_ControllerDiv     = $("#Controller");
		this.m_ControllerZoneDiv = $("#ControllerZone");
		
		this.m_thumbnailsDiv = $("#ThumbnailContainer");
		this.m_thumbnailZone = $("#ThumbnailZone");
		
		this.m_thumbnailArray = new Array();
		
		this.m_thumbnailCnt = 0;
		this.m_film		  = $("#Film");
		
		//////////////////////////////////
		//////////////////////////////////
		var widthScale = 0.3;
		this.m_ControllerZoneDiv.css({width:window.screen.width+"px" , height : window.screen.height*widthScale+"px" ,
						 			   left:"0px" , top:(1-widthScale)*window.screen.height+"px"});			
		this.m_ControllerDiv.css({top : (1-widthScale) * window.screen.height+"px"});
		this.m_ControllerDiv.css({left : (window.screen.width * 0.5 - $("#Controller").width() * 0.5) + "px" });
		
		//////////////////////////////////

		this.initThumbnails = function( slides )
		{
			var size = {x:70,y:70};
			
			$("#ThumbnailZone").css( {
				"top": window.screen.height - 170 + "px",
				"left" : "0px",
				"height" : "180px"
			});
			$("#ThumbnailContainer" ).draggable({ axis: 'x' });
			for(var i = 0;i<slides.length;i++)
			{
				//prepend가 레이어를 앞으로 끼워넣기 때문에 순서를 맞추려면 배열의 뒤부터 넣어야 한다.
				var newImgDiv = new ImageDiv($("#ThumbnailContainer"),slides[slides.length- 1 - i].getImageSrc());
				newImgDiv.setSize(size.x,size.y);
				newImgDiv.addClass("Thumbnail");
				
				newImgDiv.m_htmlDiv[0].thumbnailIndex = slides.length - 1 - i;
				newImgDiv.m_htmlDiv.click(function(event) 
				{
					slideShow.showAt(this.thumbnailIndex);
				});
				this.m_thumbnailArray.push(newImgDiv);
			}
			
			this.m_thumbnailCnt = slides.length;
		};
		this.getThumbnails = function() {return this.m_thumbnailArray;};
		this.showThumbnails = function()
		{
			// 필름통이 보일때 위치 left:80%;top:-20px
			this.m_thumbnailsDiv.stop(true);
			this.m_film.stop(true);
			
			var outerThis = this;
			this.m_film.animate({"top":"-20px"}   ,{
				complete: function(){
					var targetPos = outerThis.m_film.position().left - outerThis.m_thumbnailCnt * 80;
					if(targetPos < 0 )
						targetPos = 0;
					outerThis.m_thumbnailsDiv.animate({"left": targetPos+"px"},1500);
				}
			});
		};
		this.hideTumbnails = function()
		{
			// 필름통이 보일때 위치 left:80%;top:-20px
			this.m_thumbnailsDiv.stop(true);
			this.m_film.stop(true);
			
			var outerThis = this;
			this.m_thumbnailsDiv.animate({"left":"80%"}   ,{
				complete: function(){
					outerThis.m_film.animate({"top":"100px"},500);
				}
			});
		};

		this.isHitWithController = function(mouseX,mouseY)
		{
			var x = this.m_ControllerDiv.position().left;
			var y = this.m_ControllerDiv.position().top;
			
			var width  = this.m_ControllerDiv.width();
			var height = this.m_ControllerDiv.height();
			
			return Between(x,mouseX,x+width) && Between(y,mouseY,y+height);
		};
		this.isHitWithThumbnail = function(mouseX,mouseY)
		{
			var x = this.m_thumbnailZone.position().left;
			var y = this.m_thumbnailZone.position().top;
			
			var width  = this.m_thumbnailZone.width();
			var height = this.m_thumbnailZone.height();
			
			return Between(x,mouseX,x+width) && Between(y,mouseY,y+height);
		};
		this.onControllerOn = function()
		{
			if (!this.isHitWithController(event.clientX,event.clientY) &&
				!this.isHitWithThumbnail(event.clientX,event.clientY)) {
				this.m_ControllerDiv.stop(true);
				this.m_ControllerDiv.show("fast");
				this.showThumbnails();
			}
		};
		this.onControllerOff = function()
		{
			if (!this.isHitWithController(event.clientX,event.clientY) && 
				!this.isHitWithThumbnail(event.clientX,event.clientY)) {
				this.m_ControllerDiv.stop(true);
				this.m_ControllerDiv.fadeOut("fast");
				this.hideTumbnails();
			}
		};
	}