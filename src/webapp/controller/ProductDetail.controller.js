sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";

	return Controller.extend("sap.mdMasterDetail.controller.ProductDetail", {
		onInit:function(){
			this.getRouter = this._getRouter();
		}
	});
});