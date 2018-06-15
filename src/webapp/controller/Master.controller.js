sap.ui.define([
	"sap/mdMasterDetail/controller/Basecontroller",
	"sap/ui/model/Filter"
], function(BaseController,Filter) {
	"use strict";

	return BaseController.extend("sap.mdMasterDetail.controller.Master", {
		onInit:function(){
			this.getRouter = this._getRouter();
		},
		_handleSearch:function(oEvent){
			
				// add filter for search
				var aFilters = [];
				var sQuery = oEvent.getSource().getValue();
				if (sQuery && sQuery.length > 0) {
					
					var filter = new Filter("Category", sap.ui.model.FilterOperator.Contains, sQuery);
					aFilters.push(filter);
				}	
	
				// update list binding
				var list = this.byId("CatagoryList");
				var binding = list.getBinding("items");
				binding.filter(aFilters, "Application");
		}
	});
});