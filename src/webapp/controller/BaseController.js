sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";

	return Controller.extend("sap.mdMasterDetail.controller.BaseController", {
	
		_getRouter:function(){
			return sap.ui.core.UIComponent.getRouterFor(this);
		},
		_handleSubMasterNavigation:function(oEvent){
			var oPath =oEvent.getSource().getSelectedItem().getBindingContext();
			var oCategory = this.getView().getModel().getProperty(oPath.getPath()).Category;
			this.getRouter.navTo("category",{
				id:oCategory
			});
		},
		__handleProductNavigation:function(oEvent){
			var oPath =oEvent.getSource().getSelectedItem().getBindingContext();
			debugger;
			var oProductId = this.getView().getModel().getProperty(oPath.getPath()).ProductId;
			this.getRouter.navTo("product",{
				productId: oProductId }
			);
		}
	});
});