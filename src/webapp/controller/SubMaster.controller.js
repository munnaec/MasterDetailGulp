sap.ui.define([
	"sap/mdMasterDetail/controller/Basecontroller"
], function(Basecontroller) {
	"use strict";

	return Basecontroller.extend("sap.mdMasterDetail.controller.SubMaster", {
		onInit:function(){
			this.getRouter = this._getRouter();
		}
	});
});