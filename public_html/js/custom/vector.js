/**
 * @author ÀÌ»óÇö
 */


		function Vector4(x,y,z,w)
		{
			this.x = x;
			this.y = y;
			this.z = z; 
			this.w = w; 
			
			this.multiply = function (f)
			{
				this.x *= f;
				this.y *= f;
				this.z *= f;
				this.w *= f;
			}
			this.add = function (v2)
			{
				this.x += v2.x;
				this.y += v2.y;
				this.z += v2.z;
				this.w += v2.w; 
			}

			this.subtract = function (v2)
			{
				this.x -= v2.x;
				this.y -= v2.y;
				this.z -= v2.z; 
				this.w -= v2.w; 
			}
			
			this.lerp = function (v2,lerpScale)
			{
				var lerpResult = false;
				
				v2.subtract(this);
				
				if(v2.length() < 2)
					lerpResult = true; 	
				
				v2.multiply(lerpScale);
				this.add(v2);
				
				return lerpResult; 
			}
		}
		function Vector3(x,y,z)
		{
			this.x = x;
			this.y = y;
			this.z = z; 
			
			this.multiply = function (f)
			{
				this.x *= f;
				this.y *= f;
				this.z *= f;
			}
			this.add = function (v2)
			{
				this.x += v2.x;
				this.y += v2.y;
				this.z += v2.z;
			}
			this.subtract = function (v2)
			{
				this.x -= v2.x;
				this.y -= v2.y;
				this.z -= v2.z; 
			}
			
			this.lerp = function (v2,lerpScale)
			{
				var lerpResult = false;
				
				v2.subtract(this);
				
				if(v2.length() < 2)
					lerpResult = true; 	
				else
					v2.multiply(lerpScale);
				this.add(v2); 
				return lerpResult; 
			}
		}
		function Vector2(x,y)
		{
			this.x = x;
			this.y = y;
			
			this.multiply = function (f)
			{
				this.x *= f;
				this.y *= f;
			}
			this.add = function (v2)
			{
				this.x += v2.x;
				this.y += v2.y;
			}
			this.subtract = function (v2)
			{
				this.x -= v2.x;
				this.y -= v2.y;
			}
			this.length = function()
			{
				return Math.sqrt(this.x*this.x + this.y * this.y);
			}
			this.lerp = function (v2,lerpScale)
			{
				var lerpResult = false;
				
				v2.subtract(this);
				
				if(v2.length() < 2)
					lerpResult = true; 	
				else
					v2.multiply(lerpScale);
				this.add(v2); 
				return lerpResult; 
			}
		}
		