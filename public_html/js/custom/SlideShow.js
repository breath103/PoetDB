/**
 * @author 이상현
 * 
 * 모든 슬라이드쇼 오브젝트가 반드시 상속받아 구현해야 하는 최상위 클래스 
 */

function SlideShow(title,creator,created_time)	
{	
	this.m_title = title; 
	this.m_creator = creator; 
	this.m_created_time = created_time;
	
	//
	$("title").html(title);
	//
	
	this.m_slides = new Array();
	
	this.addSlide = function(slide){ this.m_slides.push(slide); return slide;};
	this.getSlides = function() {return this.m_slides;};
	this.startShow = function() {};
	
	this.stop = function() {};
	this.resume = function() {};
	
	this.showNext = function() {};
	this.showPrevious = function() {};
	this.showAt = function( index ) {};
}

function Comment(author,text,written_time)
{
	this.m_author = author;
	this.m_text = text; 
	this.m_written_time = written_time; 
}

function BookFlipEffct($prevPage1,$prevPage2,$nextPage1,$nextPage2)
{
	
}