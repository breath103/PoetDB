/**
 * @author �̻���
 */

		var InLoadingImageCnt = 0;
		function ImageObject()
		{
			//Constructor
			DynamicObject.call(this);
			
			// image.complete��   w3c ǥ���� �ƴϱ⶧���� �ϴ��� �н��ϰ� �������� �ٽ� ����ش�. 
			this.image = new Image();	
			this.m_isImageLoaded = false;
			
			var OuterThis = this;
			this.image.onload  = function()
			{
				InLoadingImageCnt--; 
				OuterThis.m_isImageLoaded = true ;
			};
			this.image.onerror = function()
			{
				InLoadingImageCnt--;
				OuterThis.m_isImageLoaded = false;
			};
			/////////////////////////
			
			/// override 
			this.setImage = function( src )   
			{ 
				this.image.src = src; 
				this.m_isImageLoaded = false;
				InLoadingImageCnt++;
			};
			this.getImage = function () {return this.image;};
			this.onRender = function( context )
			{
				if(this.m_isImageLoaded)
				{
					if(this.m_vSize.x > 0 && this.m_vSize.y > 0)
					{
						context.save();
							OuterThis._applyTransform(context);
							context.drawImage(this.image,this.getLeftX(),this.getTopY(),this.m_vSize.x,this.m_vSize.y);
						context.restore();
					}
				}
			};
				 
		}
		ImageObject.prototype = new DynamicObject();
		ImageObject.prototype.constructor = ImageObject;