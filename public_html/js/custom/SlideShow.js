/**
 * @author �̻���
 * 
 * ��� �����̵�� ������Ʈ�� �ݵ�� ��ӹ޾� �����ؾ� �ϴ� �ֻ��� Ŭ���� 
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