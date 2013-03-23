/**
 * @author 이상현
 */


		var photoWidth = 269;
		var photoHeight= 303;
					
					
					
		function Photo(rootDiv,fb_photo)
		{
			//// super constructor
			HtmlObject.call(this,rootDiv);
			var outerThis = this;
			
			//// member var 
			this.m_fbPhoto = fb_photo;
			this.isSelected = false; 
			this.m_photoContainer    = null;
			this.m_queueThumbnail = null;
			this.$overlayDiv = null;
		
			this.getDiv().rotate(rand(-30,30) + "deg");
			//// method 
			this.select = function(){
				this.$overlayDiv.stop().fadeTo("normal",1.0);
				this.isSelected = true; 
			};
			this.unselect = function(){
				this.$overlayDiv.stop().fadeTo("normal",0);
				this.isSelected = false; 
			};
			this.toggleSelect = function(){
				if(this.isSelected == true)
					this.unselect();
				else
					this.select();
				return this.isSelected;
			};
			this.setQueueThumbnail = function( queueThumbnail) { this.m_queueThumbnail = queueThumbnail;};
			this.getQueueThumbnail = function( queueThumbnail) { return this.m_queueThumbnail;			};
			
			this.scaleImageWithHeight = function ( maxHeight ){
				if(this.m_image != null)
				{
					var aspect = this.m_image.width / this.m_image.height; 
					var width = aspect * maxHeight; 
					this.m_htmlImg.css({"width" :width,
									    "height":maxHeight});							
				}
			};
			this.getFBPhoto   = function() {return this.m_fbPhoto;};
			this.loadComments = function(){
			////// 저장용 코드 
				FB.api("/" + fb_photo.id + "/comments", function (response) {
					for(var i =0;i<response.data.length;i++)
					{
						outerThis.getDiv().find(".MessageContainer").append(response.data[i].message + "<br>");
					}
				});
			};
			//// constructor 
			this.getDiv().addClass("Photo");
			this.getDiv().click( function(){
				madeleineQueueController.addPhoto(outerThis);
			});
			this.m_photoContainer = new ImageDiv(this.getDiv(),this.m_fbPhoto.source,"PhotoContainer");
			
			this.m_photoContainer.setImageOnLoad(function(){
				outerThis.m_photoContainer.getDiv().fadeTo("slow",1);
				CropImageCenter(outerThis.m_photoContainer.getImageDiv(),266,169);
			});
			
			this.m_photoContainer.getDiv().css({"opacity":0});
			this.getDiv().append("<div class=\"TextContainer\"><div class =\"DateContainer\"></div><div class=\"MessageContainer\"></div></div>");
			if(fb_photo.name != undefined)
			{
				this.getDiv().find(".MessageContainer").append("<p>"+fb_photo.name+"</p>");
			}

			this.getDiv().append("<div class=\"Tape\"></div>");
			
			var created_time = new Date();
			created_time.setISO8601(this.m_fbPhoto.created_time);
				
			
			
			var dayImage = sprintf("./image/day/%s.png",created_time.getDate());
			var monthImage = sprintf("./image/month/%s.png",String(created_time.getMonth()+1));
				
			this.getDiv().find(".DateContainer").append("<div class=\"Date\"><img src=\""+dayImage+"\"></div> <div class=\"Month\"><img src=\""+ monthImage + "\"></div>");	
														
			this.loadComments();
			
			this.getDiv().append("<div class=\"PhotoSelctedOverlay\"></div>");
			this.$overlayDiv = this.getDiv().children(".PhotoSelctedOverlay");
			
			if(madeleineQueueController.getPhotoWithSrc(this.m_fbPhoto.source) != undefined)
			{
				this.$overlayDiv.css({"opacity":1.0});
				this.isSelected = true; 
				madeleineQueueController.setPhotoWithSrc(this,this.m_fbPhoto.src);
			}
			
			this.getDiv().append("<div class=\"BottomBar\"></div>");
			
			
		/*
			$overlayDiv.mouseenter(function(){
				$(this).find(".SearchIconOverlay").clearQueue().animate({"opacity":1.0});
			});
		*/
		}
		Photo.prototype = HtmlObject.prototype;
		Photo.prototype.constructor = Photo;
		
	
		
		

		var g_albums = new Array();
		var g_selectedAlbum = null;
		
		var maxPhotoWidth  = 3; //한화면에 보여줄 사진 너비 갯수 
		var maxPhotoHeight = 2; //한화면에 보여줄 사진 높이 갯수

		function Album(rootDiv,fb_album)
		{							
			////////////// super constructor 
			HtmlObject.call(this,rootDiv);
			var outerThis = this;	  
			
			////////////// member var 
			this.m_fbAlbum = fb_album;
		
			this.m_prevPagePhotos;
			this.m_photos = new Array();	
			
			this.m_coverPhotoContainer = null; 
			this.m_fbPhotosResponse = null;
			this.m_searchIconOverlay = null;
			this.m_loadedPhotoCnt = 0;
		
			this.m_pageCount = 0;
			this.m_currentPageIndex = -1;
			
			this.m_pageSize = maxPhotoWidth*maxPhotoHeight;
			
			////////////// method 
			this.getPhotos = function getPhotos() {return this.m_photos;};
			this.loadPhotos = function(){
				if(this.m_fbPhotosResponse == null)
				{					
					FB.api("/" + fb_album.id + "/photos", function(response){
						outerThis.m_fbPhotosResponse = response;
						outerThis.m_pageCount = outerThis.getPageCount();
						outerThis.loadNextPhotos();
						//outerThis.getDiv().children("p").html(fb_album.name + "<br>-" + response.data.length + " Photos");
						outerThis.getDiv().append("<div class=\"TextContainer\"><div class=\"AlbumTitle\">" + fb_album.name + "</div>"+
												  "<div class=\"AlbumSize\">" + response.data.length + "</div></div>");
						
					});
				}
				else{}
			};
			this.getFBPhotosResponse =function() {return this.m_fbPhotosResponse;};
			this.getCurrentPageIndex = function(){
				return this.m_currentPageIndex;
			};
			this._removePhotos = function()
			{
				for(var i = 0 ;i<this.m_photos.length;i++)
				{
					this.m_photos[i].removeDiv();
					this.m_photos[i] = null;
				}
				this.m_photos = new Array();
			};
			this._loadPhotoInRange = function(start,end)
			{
				//this._removePhotos();
				this.m_prevPagePhotos = this.m_photos;
				this.m_photos = new Array();
				
				for (var i = start; i < end; i++) {
					var newPhoto = new Photo(rootDiv,this.m_fbPhotosResponse.data[i]);
					newPhoto.setPos(this.getCenterX() - 50, this.getCenterY() - 50);
					newPhoto.setSize(photoWidth,photoHeight);
					newPhoto.getDiv().hide();
					this.m_photos.push(newPhoto);
				}
			};
			
			this.getPageCount = function()
			{
				var allPhotoCnt = this.m_fbPhotosResponse.data.length;
				var pages_photoCnt = maxPhotoWidth*maxPhotoHeight; 
				var pageCount = Math.floor(allPhotoCnt / pages_photoCnt);
				if(allPhotoCnt % pages_photoCnt > 0) 
					pageCount++;
				
				return pageCount;
			};
			this.getTotalPageCount = function()
			{
				return this.m_pageCount;
			};
			this.convertPageToRange = function(pageIndex)
			{
				var range = {};
				var rest = this.m_fbPhotosResponse.data.length % (maxPhotoWidth*maxPhotoHeight);
				if(pageIndex == this.m_pageCount - 1 && rest!=0)
				{
					range.start = pageIndex * this.m_pageSize;
					range.end   = pageIndex * this.m_pageSize + rest;
				}
				else
				{
					range.start = pageIndex * this.m_pageSize;
					range.end   =  (pageIndex + 1) * this.m_pageSize;
				}
				return range;
			};
			this.hasNextAndPrev = function()
			{
				return {
					hasNext : this.m_currentPageIndex <= this.m_pageCount - 2,
					hasPrev : this.m_currentPageIndex >= 1
				};
			};
			this.loadNextPhotos = function()
			{
				if(this.m_currentPageIndex > this.m_pageCount - 1) 
					return false;
				if(++this.m_currentPageIndex > this.m_pageCount - 1)
					this.m_currentPageIndex = this.m_pageCount - 1;
				
				var range = this.convertPageToRange(this.m_currentPageIndex);
				this._loadPhotoInRange(range.start, range.end);
				
				if(g_selectedAlbum == this)
				{
					var mainWidth = $(".middle").width();
					var mainHeight = $(".middle").height();
					
					for(var i = 0;i<this.m_prevPagePhotos.length;i++)
					{
						this.m_prevPagePhotos[i].getDiv().animate({"left":"-="+mainWidth},"normal",function(){
							$(this).remove();
						});
					}	//이전페이지를 왼쪽으로 민다.  
					
					
					for (var i = 0; i < this.m_photos.length; i++) 
					{
						this.m_photos[i].getDiv().show();
						var x = 20 + Math.floor(i/2) * (photoWidth + 20) + mainWidth;
						var y = 20 + i%2 * (photoHeight + 20);
						this.m_photos[i].getDiv().css({"left":x,"top":y});
						this.m_photos[i].getDiv().animate({"left":"-="+mainWidth},"slow");
					}   //현재 페이지를 오른쪽에서 만들어서 왼쪽으로 민다. 
					
				}
					
				return this.hasNextAndPrev();
			};
			this.loadPrevPhotos = function()
			{
				if(this.m_currentPageIndex <= 0 ) 
					return false;
				if(--this.m_currentPageIndex <= 0 )
				{
					this.m_currentPageIndex = 0;
				}
				
				var range = this.convertPageToRange(this.m_currentPageIndex);
				this._loadPhotoInRange(range.start, range.end);
				
				if(g_selectedAlbum == this)
				{

					var mainWidth = $(".middle").width();
					
					for(var i = 0 ;i<this.m_prevPagePhotos.length;i++)
					{
						this.m_prevPagePhotos[i].getDiv().animate({"left":"+="+mainWidth},"slow",function(){
							$(this).remove();
						});
					}	//이전페이지를 왼쪽으로 민다.  
					
				
					for (var i = 0; i < this.m_photos.length; i++) 
					{
						this.m_photos[i].getDiv().show();
						var x = 20 + Math.floor(i/2) * (photoWidth + 20) - mainWidth;
						var y = 20 + i%2 * (photoHeight + 20);
						this.m_photos[i].getDiv().css({"left":x,"top":y});
						this.m_photos[i].getDiv().animate({"left":"+="+mainWidth},"normal");
					}   //현재 페이지를 오른쪽에서 만들어서 왼쪽으로 민다. 
					
				}
					
				return this.hasNextAndPrev();
			};
			this.hidePhotos = function()
			{
				for(var i = 0; i<this.m_photos.length;i++)
				{
					this.m_photos[i].animatePos(outerThis.getCenterX() - 50,outerThis.getCenterY() - 50);
					this.m_photos[i].getDiv().fadeOut();
				}
			};
			this.showPhotos = function()
			{	
				if(this.m_fbPhotosResponse == null)
				{
					alert("앨범이 아직 로딩되지 않았습니다.");
					return false;
				}
				var photoWidth = this.m_photos[0].getDiv().width();
				var photoHeight= this.m_photos[0].getDiv().height();
				for (var i = 0; i < this.m_photos.length; i++) 
				{
					this.m_photos[i].getDiv().fadeIn();
					var x = 20 + Math.floor(i/2) * (photoWidth + 20);
					var y = 0 + i%2 * (photoHeight + 20);
					this.m_photos[i].animatePos(x,y);
				}
				return true;
			};
		
			/////////// constructor 
				this.getDiv().click (function(){
					albumViewController.selectAlbum(outerThis);
				});	
				this.getDiv().hide();
				this.getDiv().addClass("Album");
				this.m_coverPhotoContainer = new ImageDiv(this.getDiv(),null);
				this.m_coverPhotoContainer.getDiv().addClass("PhotoContainer");
				FB.api("/" + fb_album.cover_photo, function (response) 
				{
					outerThis.m_coverPhotoContainer.setImage(response.source);
					outerThis.getDiv().rotate(rand(-30,30) + "deg");
		
					outerThis.m_coverPhotoContainer.setImageOnLoad(function(){
						outerThis.getDiv().fadeIn();
						outerThis.loadPhotos();
					});
					g_albums.push(outerThis);					
				});
				
			 //	this.getDiv().append("<p>" + fb_album.name + "</p>");
				
				this.m_searchIconOverlay = new HtmlObject(this.m_coverPhotoContainer.getDiv(),null);
				this.m_searchIconOverlay.getDiv().addClass("SearchIconOverlay");
				
				this.getDiv().mouseenter(function(){
					$(this).find(".SearchIconOverlay").stop().animate({"opacity":1.0});
				});
				this.getDiv().mouseleave(function(){
					$(this).find(".SearchIconOverlay").stop().animate({"opacity":0.0});
				});
				
			///////////////////////////////
		}
		Album.prototype = HtmlObject.prototype;
		Album.prototype.constructor = Album;
		
		
		function Post(rootDiv,fb_post)
		{
			HtmlObject.call(this,rootDiv);
		
			var outerThis = this;
			
			//// member var 
			this.m_fbPost = fb_post;
			this.m_postContainer = new HtmlObject(this.getDiv());
			
			this.getFBPost = function() {return this.m_fbPost;};
			this.loadComments = function()
			{
				////// 저장용 코드 
				FB.api("/" + fb_photo.id + "/comments", function (response) {
					for(var i =0;i<response.data.length;i++)
						outerThis.getDiv().append(addQuotes(response.data[i].message) + "<br>");
				});
			};
		
			//// constructor 
			this.getDiv().addClass("Post");
			
			// AddPost 구현
			this.addPost = function(post){
				this.m_post = post;
				post.loadComments();
			};
			
			this.getDiv().click( function(){
				madeleineQueueController.addPost(outerThis);
			});
			
			this.m_postContainer.getDiv().addClass("PostContainer");
			this.m_postContainer.getDiv().append("<p>"+this.m_fbPost.message+ "</p>");
			
			var commentsArray = this.m_fbPost.comments.data;
			if(commentsArray)
			{
				for(var i=0;i<commentsArray.length;i++)
				{
					var comment = this.m_fbPost.comments.data[i];
					this.getDiv().append("<p>"+comment.from.name+" : " +comment.message+ "</p>");
				}
			}
		}
		Post.prototype			   = HtmlObject.prototype;
		Post.prototype.constructor = Post;
		
		
		
		function PhotoDetailView()
		{
			this.$view;
			this.$anchor; 
			
			this.show = function(photo)
			{
				
				this.$anchor.trigger("click");
			};
			
		}
		var photoDetailView = new PhotoDetailView();
		
		
		 
		
		
		
		
		
		
		
		
		
		
		
		
		 
		