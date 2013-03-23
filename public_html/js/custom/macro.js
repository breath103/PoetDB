/**
 * @author ÀÌ»óÇö */

		function rand( min , max)
		{
			return min + (max - min) * Math.random();
		}
		function clone (obj, deep) { 
		  var objectClone = new obj.constructor(); 
		  for (var property in obj) 
		    if (!deep) 
		   		objectClone[property] = obj[property]; 
		    else if (typeof obj[property] == 'object') 
		    	objectClone[property] = obj[property].clone(deep); 
		    else 
		    	objectClone[property] = obj[property]; 
		  	return objectClone; 
		}
		function randomColor()
		{
			var r = Math.round(Math.random() * 255);	
			var g = Math.round(Math.random() * 255);
			var b = Math.round(Math.random() * 255);
			return "rgb("+r+","+g+","+b+")";
		}
		
		function array_removeObject(array,object)
		{
			for( var i=0; i<array.length; i++ ){
				if( array[i]==object ){
					array.splice(i,1);
					break;
			    }
			}
		}
		function Between(min, x, max)
		{
			return ( min <= x && x<=max );
		}		
		function toRadian(degree)
		{
			return (degree / 360) * Math.PI * 2; 
		}
		function toDegree(radian)
		{
			return 360 * radian / ( Math.PI * 2 );
		}
		function singleLerp( v1, v2, scale , threshold)
		{
			if(threshold == undefined)
			{
				threshold = 1;
			}
			var isAnimationEnd = false; 
			var dv = v2 - v1;
			if ( Math.abs(dv) < threshold )
			{
				isAnimationEnd = true; 
			}
			return { result : isAnimationEnd , value : v1 + dv*scale };
		}
		
		function CropImageCenter( $image ,parentWidth,parentHeight)
		{
		
			var imgSize = { "width" : $image[0].width, "height" : $image[0].height};
			
			var scale = parentWidth / imgSize.width;
			
			imgSize.width  *= scale;
			imgSize.height *= scale;
			
			if(imgSize.height > parentHeight)
			{
				$image.css({
					"width": imgSize.width,
					"height": imgSize.height,
					"top"  : parentHeight*0.5 - imgSize.height * 0.5
				});	
			}
			else
			{
				imgSize = { "width" : $image[0].width, "height" : $image[0].height};
				
				var scale = parentHeight / imgSize.height;
				
				imgSize.width  *= scale;
				imgSize.height *= scale;
				
				$image.css({
					"width": imgSize.width,
					"height": imgSize.height,
					"left"  : parentWidth*0.5 - imgSize.width * 0.5
				});
			}
		}
		$.asyncPost = function(url,data,dataType,successFunc){
			$.ajax({
				type: "post",
				url	: url,
				data: data,
				dataType: dataType,
				success: successFunc
			});
		};
		$.syncPost = function(url,data,dataType,successFunc){
			$.ajax({
				type     : "post",
				async    : false,
				url      : url,
				data     : data,
				dataType : dataType,
				success  : successFunc
			});
		};
		
		$.syncGet = function(url,data,dataType,successFunc){
			$.ajax({
				type: "get",
				async: false,
				url	: url,
				data: data,
				dataType: dataType,
				success: successFunc
			});
		};
		
		
		String.prototype.replaceAll = function(stringToFind,stringToReplace){
			return this.split(stringToFind).join(stringToReplace);  
		};
		Array.prototype.last = function() {return this[this.length-1];}
		jQuery.fn.animateAuto = function(prop, speed, callback){
		    var elem, height, width;
		    return this.each(function(i, el){
		        el = jQuery(el), elem = el.clone().css({"height":"auto","width":"auto"}).appendTo("body");
		        height = elem.css("height"),
		        width = elem.css("width"),
		        elem.remove();

		        if(prop === "height")
		            el.animate({"height":height}, speed, callback);
		        else if(prop === "width")
		            el.animate({"width":width}, speed, callback);
		        else if(prop === "both")
		            el.animate({"width":width,"height":height}, speed, callback);
		    });
		};
		
		Array.prototype.remove = function(val) {
		    for(var i=0; i<this.length; i++) {
		        if(this[i] == val) {
		            this.splice(i, 1);
		            break;
		        }
		    }
		}

		
		
		function getSelected($select)
		{
			return $($select.children('option:selected'));
		}
		
		