			function ConditionNode()
			{
				var outerthis = this;
				
				this.$containerDiv = null;
				this.$conditionDiv = null;
				this.$dbNameSelect = null;
				this.$searchValueInput = null;
				this.$searchMethodSelect = null;
				this.$connectorConnectorSelect = null;
				this.$deleteButton = null;
			
				$(".condition_container").append('<div class="condition_node"><div class="condition_div"></div></div>');
				
				this.$containerDiv = $($(".condition_container").children(".condition_node").last());
				this.$conditionDiv = this.$containerDiv.children(".condition_div");
				
				
				g_conditionNodes.push(this);
				if(g_conditionNodes.length > 1)
				{
					//if this node is not a first node 
					this.$containerDiv.prepend('<select class="condition_connector_select"></select>');
					this.$connectorConnectorSelect = $(this.$containerDiv.children(".condition_connector_select"));
					
					for(var i=0;i<g_conditionConnectors.length;i++){
						this.$connectorConnectorSelect.append('<option>' + g_conditionConnectors[i].name + '</option>');
					}
				}	
					
				this.$conditionDiv.append('<select class="db_name_select"></select>');
				this.$conditionDiv.append('<select class="search_method_select"></select>');
				this.$conditionDiv.append('<input  class="search_value_input" type="text">');
				
				this.$dbNameSelect 		 = this.$conditionDiv.children(".db_name_select");
				this.$searchValueInput   = this.$conditionDiv.children(".search_value_input");
				this.$searchMethodSelect = this.$conditionDiv.children(".search_method_select");
				
				for(var i=0;i<g_tableValues.length;i++){
					this.$dbNameSelect.append('<option>' + g_tableValues[i].name + '</option>');
				}
				
				this.$dbNameSelect.change(function(e){
					var dbInfo = getDBInfo(getSelected($(this)).val());
					//get the possible operators with parameters name
					var operatorArray = g_operatorListForType[dbInfo.type];
					
					outerthis.$searchMethodSelect.children().remove();
					for (var i = 0; i < operatorArray.length; i++) {
						outerthis.$searchMethodSelect.append('<option>' + operatorArray[i] + '</option>');
					}	
				});
				
				this.$dbNameSelect.trigger("change");
				
				
				if(g_conditionNodes.length > 1)
				{
					this.$containerDiv.append('<div class="delete_button"></div>');
					this.$deleteButton = this.$containerDiv.children(".delete_button");
					this.$deleteButton.click(function(){
						if (g_conditionNodes.length > 1) {
							outerthis.$containerDiv.remove();
							g_conditionNodes.remove(outerthis);
						}
					});
				}
				
				
				
				/////////////////////////////////////////
				this.getLeftValue = function(){
					return getSelected(this.$dbNameSelect).val();
				};
				this.getOperator = function(){
					return getSelected(this.$searchMethodSelect).val();
				};
				this.getRightValue = function(){
					return this.$searchValueInput.val();	
				};
				this.getConnectingOperator = function(){
					if(this.$connectorConnectorSelect != null)
						return getSelected(this.$connectorConnectorSelect).val();
					else
						return ""; 
				};
				this.isValid = function(){
				//	console.log(this.getRightValue());
					return this.getLeftValue()  != null &&
						   this.getOperator()   != null &&
						   this.getRightValue() != null && 
						   this.getRightValue().length > 0;
				};
			};