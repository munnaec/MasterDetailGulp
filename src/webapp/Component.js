sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"sap/mdMasterDetail/model/models"
], function(UIComponent, Device, models) {
	"use strict";

	return UIComponent.extend("sap.mdMasterDetail.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function() {
			//Set on mmanifest json file
			//Not required here
/*			var oUrl="proxy/ESPM_V1/api/";
			var oModel= new sap.ui.model.odata.v2.ODataModel(oUrl);
*/			
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);
			this.getRouter().initialize();

//			this.setModel(oModel,"odatamodel");
			// set the device model
			this.setModel(models.createDeviceModel(), "device");
		}
	});
});