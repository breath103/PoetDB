/**
 * @author 이상현
 */
		function addQuotes(str){ return "\"" + str + "\""; }

		var divIdIndicator = 1;
		
		var Albums = new Array(); 
		var albumCounts = 0; 
		
		function HtmlObject(rootDiv)
		{
			if (rootDiv != undefined) {
				rootDiv.append("<div id = " + addQuotes("div" + divIdIndicator) + "></div>");
			}
			
			this.m_rootDiv = rootDiv; 
			this.m_htmlDiv = $("#div" + divIdIndicator);
			this.m_id = divIdIndicator++;
		};
		HtmlObject.prototype = {
				getID  	   : function() { return this.m_id;},
				getWidth   : function() { return this.m_htmlDiv.width();},
				getHeight  : function() { return this.m_htmlDiv.height();},
				getX       : function() { return this.m_htmlDiv.position().left;},
				getY	   : function() { return this.m_htmlDiv.position().top;},
				getCenterX : function() {return this.getX() + this.getWidth() * 0.5;},
				getCenterY : function() {return this.getY() + this.getHeight() * 0.5;},
				getDiv     : function() { return this.m_htmlDiv;},
				setX	   : function(x) { this.m_htmlDiv.css({"left":x+"px"}); },		
				setY	   : function(y) { this.m_htmlDiv.css({"top":y+"px"});  },
				setPos	   : function(x,y) {this.setX(x); this.setY(y);},
				setWidth   : function(width) {this.m_htmlDiv.css({"width":width+"px"});},
				setHeight  : function(height){this.m_htmlDiv.css({"height":height+"px"});},
				setSize    : function(width,height) { this.setWidth(width); this.setHeight(height);},
				setWidthByDelta  : function(dWidth)  { this.setWidth(getWidth() + dWidth);  },
				setHeightByDelta : function(dHeight) { this.setHeight(getHeight() + dHeight); },
				setBounds   : function(x,y,width,height) { this.setX(x); this.setY(y); this.setWidth(width); this.setHeight(height);},
				animatePos 	: function(x,y,speed){ this.m_htmlDiv.animate({"left":x+"px","top":y+"px"},speed);},
				animateSize : function(width,height,speed,bMaintainCenter){
					this.m_htmlDiv.animate({"width":width+"px","height":height+"px"},speed);
					if(bMaintainCenter == 1)
						this.animatePos( this.getCenterX() - width * 0.5,this.getCenterY() - height * 0.5);
				},
				animatePosByDelta  : function(dx,dy,speed){ this.animatePos(this.getX() + dx,this.getY() + dy,speed); },
				animateSizeByDelta : function(dWidth,dHeight,spedd){ this.animateSize(this.getWidth() + dWidth, this.getHeight() + dHeight,speed);},
				setAlpha 		   : function( floatAlpha ){this.getDiv({"opacity":floatAlpha});},
				removeDiv 		   : function(){this.m_htmlDiv.remove();}
		};
		
		
		//페북 API를 호출했을때 가지고 오는 photo 객채를 그냥 넘긴다. 
		function ImageDiv(rootDiv,imageURL,className)
		{
			//Constructor
			HtmlObject.call(this,rootDiv);
			
			if(className != undefined)
				this.getDiv().addClass(className);

		
		 	this.m_htmlImg = null;
			this.m_image = null;
			
			this.setImage = function(imageURL)
			{
				this.getDiv().prepend("<img name = " + addQuotes(this.m_id) + "src = " + addQuotes(imageURL) + "/>");
			
				this.m_htmlImg = this.getDiv().find("img");
				this.m_image = this.m_htmlImg[0];
			};
			this.addClass = function(className){	this.getDiv().addClass(className);};
			
			this.getImageDiv = function() {return this.m_htmlImg;};
			
			////////////////////////////////////
			if(imageURL != undefined)
				this.setImage(imageURL);
			///////////////////////////////////
			
			this.setImageOnLoad = function( callback )
			{
				if(this.m_image != null )
					this.m_image.onload = callback;
			};
				
			///// Overide 
			this.setWidth  = function(width) 
			{
				this.m_htmlDiv.css({"width":width+"px"});
				this.m_htmlImg.css({"width":width+"px"});
			};
			this.setHeight = function(height) 
			{
				this.m_htmlDiv.css({"height":height+"px"});
				this.m_htmlImg.css({"height":height+"px"});
			};
			this.clearAniQueue = function()
			{
				this.m_htmlDiv.clearQueue();
				this.m_htmlImg.clearQueue();
			};
			this.animateSize = function(width,height,speed,bMaintainCenter)
			{ 
				if(bMaintainCenter)
					this.m_htmlDiv.animate({"width":width+"px","height":height+"px",
											"left":this.getCenterX() - 0.5*width + "px","top" : this.getCenterY() - 0.5*height + "px"},speed);
				else
					this.m_htmlDiv.animate({"width":width+"px","height":height+"px"},speed);
				this.m_htmlImg.animate({"width":width+"px","height":height+"px"},speed);
			};
		}
		ImageDiv.prototype = HtmlObject.prototype;		
		ImageDiv.prototype.constructor = ImageDiv;
 