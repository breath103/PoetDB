/**
 * @author �댁��� * HTML5湲곕���罹���ㅼ����ъ���린 ��� ��� 媛�껜�ㅼ� 踰�����대��� 2D寃�� �����留�����곕� ������瑜�洹몃�濡�媛���⑤�.
 * 
 */
	//	var g_objects = new Array();	
		var mouseX,mouseY;
		var lastEvent = null;
		
		var screenWidth,screenHeight;
		function SetCanvasSize(width,height)
		{
			var context = document.getElementsByTagName('canvas')[0].getContext('2d');
			screenWidth = width;
			screenHeight = height;
			
			context.canvas.width  = screenWidth;
			context.canvas.height = screenHeight;
		}
		
		var ObjectManager = 
				new function()
				{
					this.g_objects = new Array();		
					this.canvasInfo = null;
					this.setCanvasInfo = function(info) { this.canvasInfo = info;}
					this.registerObject = function(object){ this.g_objects.push(object);  }
					
					this.onRender  = function(context)
					{
						for(var i =0;i<this.g_objects.length;i++)
						{
							this.g_objects[i].onRender(context);
						}
					}
					
					this.onMove = function()
					{
						for(var i =0;i<this.g_objects.length;i++)
						{
							this.g_objects[i].onMove();
						}
					}
					
					this.mouseEventProcess = function ( event )
					{
						mouseX = event.clientX ;// this.canvasInfo.offsetLeft ;
						mouseY = event.clientY ;// this.canvasInfo.offsetTop ; 
						lastEvent = event; 

						for(var i =0;i<this.g_objects.length;i++)
						{
							this.g_objects[i]._mousesteteUpdate(mouseX,mouseY);
						}
					}
					this.onmousedown = function( event )
					{
						for(var i =0;i<this.g_objects.length;i++)
						{
							if(this.g_objects[i].isIntersectPoint(event.clientX,event.clientY))
							{
								if(this.g_objects[i].getMouseButtonState() != "down")
								{
									this.g_objects[i].setMouseButtonState("down");
									this.g_objects[i].onmousedown(event);
									break;
								}
							}
						}
					}
					this.onmouseup = function( event )
					{
						for(var i =0;i<this.g_objects.length;i++)
						{
							if(this.g_objects[i].isIntersectPoint(event.clientX,event.clientY))
							{
								if(this.g_objects[i].getMouseButtonState() != "up")
								{
									this.g_objects[i].setMouseButtonState("up");
									this.g_objects[i].onmouseup(event);
									break;
								}
							}
						}
					}

				};
		function DynamicObject()
		{
			/// constructor ///		
			ObjectManager.registerObject(this);
			
			this.m_vPos  = new Vector2(0,0);
			this.m_vSize = new Vector2(0,0);
			this.m_aniQueue = new Array(); 
			this.m_alpha = 1.0;
			this.m_rotateRadian = 0;
			this.m_vRotateCenter = new Vector2(0,0);
			// 媛�껜�����醫��怨������� 以����� �대�濡����. 媛�껜�����醫��怨����� 媛�껜��以����(0,0) �대� 
				
			var OuterThis = this;
			///////////////////
		
			this.setX 	   = function(x) {this.m_vPos.x=x;};
			this.getX	   = function () {return this.m_vPos.x;};
			this.setY 	   = function(y) {this.m_vPos.y=y;};
			this.getY	   = function()  {return this.m_vPos.y;};
			
			this.setPos	   = function(x,y) { this.setX(x); this.setY(y); };
			this.setWidth  = function(width) {this.m_vSize.x = width;};
			this.getWidth  = function() {return this.m_vSize.x;};
			this.setHeight = function(height) {this.m_vSize.y = height;};
			this.getHeight = function() {return this.m_vSize.y; };
			this.setSize   = function(width,height) {this.setWidth(width); this.setHeight(height); };
			this.setSizeByDelta = function(dw,dh) {this.setWidth(this.getWidth() + dw); this.setHeight(this.getHeight() + dh);};
			this.setBounds = function(x,y,width,height) { this.setX(x); this.setY(y); this.setWidth(width); this.setHeight(height); };
			
			this.setAlpha  = function(alpha) {this.m_alpha = alpha; };
			this.getAlpha  = function() {return this.m_alpha; };
			this.setRotation = function(rotateRadian) {this.m_rotateRadian = rotateRadian; };
			this.getRotation = function() {return this.m_rotateRadian; };
			
			this.getLeftX = function() {return this.m_vPos.x - this.m_vSize.x * 0.5; };
			this.getTopY  = function() {return this.m_vPos.y - this.m_vSize.y * 0.5; };
				
			this.isIntersectPoint = function( x,y )
			{
				return (Between(this.m_vPos.x - this.m_vSize.x * 0.5, x , this.m_vPos.x + this.m_vSize.x * 0.5) &&
						Between(this.m_vPos.y - this.m_vSize.y * 0.5, y , this.m_vPos.y + this.m_vSize.y * 0.5) );
			};
		
			this.onMove = function ( )
			{
				this._animationProcess(); 
				this._mousestateProcess();
			};
			this._applyTransform = function ( context )
			{
				context.globalAlpha = this.m_alpha;
				context.translate(this.m_vPos.x + this.m_vRotateCenter.x,this.m_vPos.y + this.m_vRotateCenter.y);
				context.rotate(this.m_rotateRadian);
				context.translate( - (this.m_vPos.x + this.m_vRotateCenter.x) , - (this.m_vPos.y + this.m_vRotateCenter.y));
				context.fillStyle = this.fillStyle;
			};
			
			this.fillStyle = randomColor();
			this.onRender = function ( context )
			{
				context.save();
				
					this._applyTransform( context );
					context.fillRect(this.getLeftX(),this.getTopY(),this.m_vSize.x,this.m_vSize.y);
				
				context.restore();
			};
			
			this.isVisible = function() 
			{
			//	var screenWidth, screenHeight;
				
				var isVisible = true;
				
				isVisible &= (this.m_alpha > 0);
				
				/*
				var radius = Math.sqrt( Math.pow(this.m_vSize.x,2) + Math.pow(this.m_vSize.y,2)) * 0.5 ;
				// �ш���� ������ 湲몄��������諛��由��濡��〓� ��� ������, ����� 異⑸����吏�寃��. �����㈃  媛�껜瑜���������寃쎌�媛���린 ��Ц��;
				var x = this.m_vPos.x;
				var y = this.m_vPos.y;
				
				var LT = new Vector2(radius,radius);
				var RB = new Vector2(screenWidth-radius,screenHeight-radius);
				
				isVisible &= ( Between(LT.x, x, RB.x) && Between(LT.y , y , RB.y) );
				*/
				return isVisible;
			};
			
			
			///////// MouseEvent 泥�━.
			
			this.m_mouseState = "none";
							//  none, enter, over, out 
			this.m_mouseButtonState = "none";
							//  none, down, up 
			this.setMouseButtonState = function(state){this.m_mouseButtonState = state;};
			this.getMouseButtonState = function() {return this.m_mouseButtonState;};
			///////////// callback ////////////////// 
			this.onmouseenter = function(event) { };
			//	this.onmouseleave = function(event) { }
			this.onmousemove  = function(event) { };
			this.onmouseout   = function(event) { };
			this.onmouseover  = function(event) { };
			////////// buttonCallback //////////////////
			this.onmouseup    = function(event) { };
			this.onmousedown  = function(event) { };
			this.onmousewheel = function(event) { };
			//////////////////////////////////////////
			
			////// update   �����留�����대깽��諛�����留�� 留���ㅼ� ��낫瑜�媛깆��댁� ���,
			////// process  �����留������������留���������肄�갚���몄� 
			////// 媛깆������留��몄���� ��� �⑥��� 利�enter, out�깆� 紐⑤� update��� �몄� 
			this._mousesteteUpdate = function(mouseX,mouseY) 
			{
				var mouseOver = this.isIntersectPoint(mouseX,mouseY);
	
				if(mouseOver)
				{
					switch( this.m_mouseState)
					{
						case "none" :  //留���ㅺ� �ㅻ���� 諛�� ���媛���� �щ��④꼍�� enter
							this.m_mouseState = "enter";	
							this.onmouseenter(lastEvent); 
						break; 
						case "enter" : //�댁���������留���ㅺ� �ㅻ���� ���  �ㅼ����, ��� ��������� �щ������寃쎌�, over 
							this.m_mouseState = "over";
						break;
						case "over" :
						 	this.m_mouseState = "over";
						break; 
					}
				}
				else
				{
					switch( this.m_mouseState)
					{
						case "enter" :
						case "over"  : // �댁������� �ㅻ���� �����留���ㅺ� �ㅼ���굅�� �ㅼ������� 寃쎌� out 
							this.m_mouseState = "out";
							this.onmouseout(lastEvent);
						break;
						case "out" : 
							this.m_mouseState = "none";
						break; 
					}
				}
			};
			/*
			this._mousestateUpdate = function(event)
			{
				var mouseOver = this.isIntersectPoint(event.layerX,event.layerY);
				if(mouseOver)
				{
				} 
			};
			*/
			
			
			this._mousestateProcess = function()
			{
				switch( this.m_mouseState )
				{
					case "over" :  
						this.onmouseover({layerX:mouseX,layerY:mouseY});
					break;
				}
			};

			//////////////////////////////
			
			
			
			///animation
			//���硫����肄�� 臾몃� 
			/*
			 	ani
			 	{
			 		(width , height , x , y , alpha, speed, rotation , callback , method ) : (data); 
			 	}
			 	�� var ani = {width:100,height:100,left:100,top:100}; 
			*/
			
			this.clearAniQueue = function()    { this.m_aniQueue = new Array(); };
			this.getAniQueuePtr = function() { return this.m_aniQueue;};
			this.animate = function(animation) { this.m_aniQueue.unshift(animation);};
			
			this._animationProcess = function()
			{
				if( this.m_aniQueue.length > 0 )
				{
					var DefaultlerpScale = 0.04;
					var lerpScale = DefaultlerpScale;
					
					var method = "swing";
					
					var currentAni = this.m_aniQueue[this.m_aniQueue.length - 1];
					var isAnimationEnd = true; 
					
					if( currentAni.method != undefined)
						method = currentAni.method;

					if( currentAni.speed != undefined)
						lerpScale = currentAni.speed;
					
					if(currentAni.width != undefined)
						isAnimationEnd &= this.m_vSize.lerp(new Vector2(currentAni.width,this.getHeight() ),lerpScale); 
					if(currentAni.height != undefined)
						isAnimationEnd &= this.m_vSize.lerp(new Vector2(this.getWidth() ,currentAni.height),lerpScale); 
					if(currentAni.x != undefined)
						isAnimationEnd &= this.m_vPos. lerp(new Vector2(currentAni.x	,this.getY()      ),lerpScale); 	
					if(currentAni.y != undefined)
						isAnimationEnd &= this.m_vPos. lerp(new Vector2(this.getX()	    ,currentAni.y    ),lerpScale);
					if(currentAni.alpha != undefined )
					{
						if(this.getAlpha() != currentAni.alpha)
						{
							var result = singleLerp(this.getAlpha(),currentAni.alpha,lerpScale,0.01);
							if(result.result)
								this.setAlpha(currentAni.alpha);
							else	
								this.setAlpha(result.value);
							isAnimationEnd &= result.result;					
						}
						isAnimationEnd &= true;
					}
					if(currentAni.rotation != undefined )
					{
						var result = singleLerp(this.getRotation(),currentAni.rotation,lerpScale,0.01);
						if(result.result)
							this.setRotation(currentAni.rotation);
						else
							this.setRotation(result.value);

						isAnimationEnd &= result.result;	
					}
					if(isAnimationEnd)
					{
						this.m_aniQueue.pop();
						if(currentAni.callback != undefined )
						{
							currentAni.callback.call(this);
						}
					}
				}
			}
			this.getAniCount = function() {return this.m_aniQueue.length;}
		}