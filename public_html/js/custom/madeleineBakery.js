/**
 * @author �̻���
 */



 function toggleButtonImage($button,toBasic)
 {
	 if(toBasic)
	 {
		 $button.css({"background-image":"url(./image/bakery/"+sprintf("menu%d_basic.png",$button[0].buttonIndex + 1)+")"});
	 }
	 else
	 {
		 $button.css({"background-image":"url(./image/bakery/"+sprintf("menu%d_click.png",$button[0].buttonIndex + 1)+")"});
	 }
 }

 function MadeleineBakeryController()
 {
	 this.$rootView 		 	 = null;
	 this.$contentsView 	     = null;
	 this.$contentsSelector      = null;
	 this.$contentsContainer     = null;
	 this.$bookContainer 	     = null;
	 this.$placeContainer        = null;
	 this.$movieContainer        = null;
	 this.$currentSelectedButton = null;
	 this.$currentView 			 = null;
	 this.m_recommendedContents   = null;
	 this.m_randomPublicMadeleine = null;
	 
	 var outerThis = this;
	 
	 this.onEnterMadeleineBasket = function()
 	 { 
		 if($.cookie("use_madeleine_basket") != "true")
		 {
			 $('#BakeryStartPopup_a').trigger('click');
		 }
		 $.cookie("use_madeleine_basket","true");
	 };
	 this.init = function()
	 {
		 this.$rootView 		 = $(".madeleineBakery");
		 this.$contentsView		 = $(".madeleineBakery .RecommendedContents");
		 this.$contentsContainer = $(".madeleineBakery .RecommendedContents .ContentsContainer");	
		 this.$madeleineContainer = $(".MadeleineContainer");
		 
		 this.$bookContainer 	 = this.$contentsContainer.children(".BookContainer");
		 this.$placeContainer    = this.$contentsContainer.children(".PlaceContainer");
		 this.$movieContainer    = this.$contentsContainer.children(".MovieContainer");
		 
		 this.$contentsSelector  = $(".madeleineBakery .RecommendedContents .ContentsSelector"); 
		 
		 this.loadRecommendedContents();
		 this.loadRandomPublicMadeleine();
		 /*
		 $(".ReceivedMadeleine").click(function(){
			//<a id="MadeleineView" class="iframe" href="./testjy/MadeleineBasketTaste.html"></a> 
			 $("#MadeleineView").trigger("click");
		 });
		 */
	 };
	 
	 this._displayRecommendContents = function(recommendedContents)
	 {
		 
		 this.m_recommendedContents = recommendedContents;
		 /*
		 var books = this.m_recommendedContents.book;
		 for(var i=0;i<books.length;i++)
		 {
			 var book = books[i];
			 this.$bookContainer.append("<div class='Book CustomButton'></div>");
			 var $book = $(this.$bookContainer.find(".Book")[i]);
			 $book.append( '<div class="ImageContainer" ><img src="'+ book.image + '"/></img></div>' + 
					 		'<div class="TextArea">'+
					 		'<div class="Title">' + book.title+'</div>' + 
			 			    '<div class="Description">' +sprintf("%s/%s",book.author,book.publisher) +'</div>'+
			 			    '</div>');
			 $book.click(function(){
				window.open(book.link);
			 });
		 }
		 var movies = this.m_recommendedContents.movie;
		 for(var i=0;i<movies.length;i++)
		 {
			 var movie = movies[i];
			 this.$movieContainer.append("<div class='Movie CustomButton'></div>");
			 var $movie = $(this.$movieContainer.find(".Movie")[i]);
			 $movie.append( '<div class="ImageContainer" ><img src="'+ movie.image + '"></img></div>'+ 
					 		'<div class="TextArea">'+
					 		'<div class="Title">' + movie.title+"</div>"+
					 		'<div class="Description">' +sprintf("%s<br>%s<br>%s/%s",movie.subtitle,movie.pubdate,movie.director,movie.actor.replace("|","")) + "</div>" +
					 	    "</div>");
			 $movie.click(function(){
				 window.open(movie.link);
			 });
		 }
		 
		 var places = this.m_recommendedContents.place;
		 for(var i=0;i<places.length;i++)
		 {
			 var place = places[i];
			 this.$placeContainer.append("<div class=\"Place\"></div>");
			 var $place = $(this.$placeContainer.find(".Place")[i]);
			 $place.append(
					 '<div class="Left"></div>' + 
					 '<div class="TextArea">' + 
					 	'<div class="Title">' + place.title + '</div>' + 
					 	'<div class="Address">'+ place.address + '</div>' + 
					 	'<div class="Telephone">'+place.telephone + '</div>' + 
					 	'<div class="Description"><br>' + place.description + '</div>' + 
					 '</div>'
			 );
		 }
		 */
		 
		 this.$currentView = this.$bookContainer;
		 var viewArray = [
			 this.$bookContainer,
			 this.$movieContainer,
			 this.$placeContainer
		 ];
		 
		 
		 var viewChangeButtons = this.$contentsSelector.find(".SelectButton");
		 
		 this.$currentSelectedButton = $(viewChangeButtons[0]);
		 
		 for(var i=0;i<3;i++)
		 {
			 viewChangeButtons[i].targetView = viewArray[i];
			 
			 var $button = $(viewChangeButtons[i]);
			 $button.css({"background-image":"url(./image/bakery/"+sprintf("menu%d_basic.png",i+1)+")"});
			 $button[0].buttonIndex = i;
		 }
		 
		toggleButtonImage($(viewChangeButtons[0]),false);
		 
		 viewChangeButtons.click(function(){
			 if(outerThis.$currentView != this.targetView)
			 {
				 outerThis.$currentView.stop().fadeOut();
				 $(this)[0].targetView.stop().fadeIn();
				 outerThis.$currentView =  $(this)[0].targetView;
				 
				 toggleButtonImage(outerThis.$currentSelectedButton,true);
				 toggleButtonImage($(this),false);
				 outerThis.$currentSelectedButton = $(this);
			 }
		 });
		 
	 };
	 this._displayRandomPublicMadeleine = function(randompublicMadeleine){
		 this.m_randomPublicMadeleine = randompublicMadeleine;
		 
		 this.$madeleineContainer.append('<div class="ReceivedMadeleine"></div>');
		 this.$madeleineContainer.children(".ReceivedMadeleine").click(function(){
		//	$("#MadeleineBakeryTastView").attr("href",'./testjy/MadeleineBakeryTaste.jsp?id=' + outerThis.m_randomPublicMadeleine.idx );
			 $("#MadeleineBakeryTastView").attr("href",'./testjy/MadeleineBakeryTaste.jsp?id=615' );
			 $("#MadeleineBakeryTastView").trigger("click");
		 });
	 };
	 this.loadRecommendedContents = function()
	 {
		 $.getJSON("./servlet/GetRecommendedContents.jsp",function(response){
			 outerThis._displayRecommendContents(response);
		 });
	 };
	 this.loadRandomPublicMadeleine = function(){
		 $.getJSON("./servlet/GetRandomPublicMadeleine.jsp",function(response){
			 outerThis._displayRandomPublicMadeleine(response);
		 });
	 };
 }
 var madeleineBakeryController = new MadeleineBakeryController();
 
 $(document).ready(function(){
	 madeleineBakeryController.init();
 });