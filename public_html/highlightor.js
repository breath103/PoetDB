			function Highlightor(){
				this.targetArray = new Array();
				
				this.resetTargetWord = function(){
					this.targetArray = new Array();
				};
				this.addWord = function(attr,word){
					this.targetArray.push({
						"attribute" : attr,
						"word" : word
					});				
				};
				
				this.highlightWord = function(){
					for(var i=0;i<this.targetArray.length;i++){
						var node = this.targetArray[i]; 
						
						var $attributeNodes = $(".poet_"+node.attribute);
						for(var j=0;j<$attributeNodes.length;j++){
							var $node = $($attributeNodes[j]);
							var htmlText = $node.html();
							htmlText = htmlText.replaceAll(node.word,'<p class ="HighLightWord">' + node.word + '</p>');
							$node.html(htmlText);	
						}
					}
				};
				this.highlightWordForPoetDiv = function()
				{
					
				}
			};
