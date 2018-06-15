/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2018 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["jquery.sap.global","sap/ui/core/Core","sap/ui/base/DataType","sap/ui/Device","sap/m/library","sap/ui/layout/library"],function(q,C,D,a){"use strict";sap.ui.getCore().initLibrary({name:"sap.uxap",dependencies:["sap.ui.core","sap.m","sap.ui.layout"],designtime:"sap/uxap/designtime/library.designtime",types:["sap.uxap.BlockBaseColumnLayout","sap.uxap.ObjectPageConfigurationMode","sap.uxap.ObjectPageHeaderDesign","sap.uxap.ObjectPageHeaderPictureShape","sap.uxap.ObjectPageSubSectionLayout","sap.uxap.ObjectPageSubSectionMode"],interfaces:["sap.uxap.IHeaderTitle","sap.uxap.IHeaderContent"],controls:["sap.uxap.AnchorBar","sap.uxap.BlockBase","sap.uxap.BreadCrumbs","sap.uxap.HierarchicalSelect","sap.uxap.ObjectPageHeader","sap.uxap.ObjectPageDynamicHeaderTitle","sap.uxap.ObjectPageDynamicHeaderContent","sap.uxap.ObjectPageHeaderActionButton","sap.uxap.ObjectPageHeaderContent","sap.uxap.ObjectPageLayout","sap.uxap.ObjectPageSection","sap.uxap.ObjectPageSectionBase","sap.uxap.ObjectPageSubSection"],elements:["sap.uxap.ModelMapping","sap.uxap.ObjectPageHeaderLayoutData"],version:"1.54.4",extensions:{flChangeHandlers:{"sap.uxap.ObjectPageHeader":"sap/uxap/flexibility/ObjectPageHeader","sap.uxap.ObjectPageLayout":"sap/uxap/flexibility/ObjectPageLayout","sap.uxap.ObjectPageSection":"sap/uxap/flexibility/ObjectPageSection","sap.uxap.ObjectPageSubSection":"sap/uxap/flexibility/ObjectPageSubSection","sap.ui.core._StashedControl":{"unstashControl":{"changeHandler":"default","layers":{"USER":true}}}},"sap.ui.support":{publicRules:true}}});sap.uxap.BlockBaseColumnLayout=D.createType('sap.uxap.BlockBaseColumnLayout',{isValid:function(v){return/^(auto|[1-4]{1})$/.test(v);}},D.getType('string'));sap.uxap.BlockBaseFormAdjustment={BlockColumns:"BlockColumns",OneColumn:"OneColumn",None:"None"};sap.uxap.ObjectPageConfigurationMode={JsonURL:"JsonURL",JsonModel:"JsonModel"};sap.uxap.ObjectPageHeaderDesign={Light:"Light",Dark:"Dark"};sap.uxap.ObjectPageHeaderPictureShape={Circle:"Circle",Square:"Square"};sap.uxap.ObjectPageSubSectionLayout={TitleOnTop:"TitleOnTop",TitleOnLeft:"TitleOnLeft"};sap.uxap.ObjectPageSubSectionMode={Collapsed:"Collapsed",Expanded:"Expanded"};sap.uxap.Importance={Low:"Low",Medium:"Medium",High:"High"};sap.uxap.i18nModel=(function(){return new sap.ui.model.resource.ResourceModel({bundleUrl:q.sap.getModulePath("sap.uxap.i18n.i18n",".properties")});}());sap.uxap.Utilities={getClosestOPL:function(c){while(c&&!(c instanceof sap.uxap.ObjectPageLayout)){c=c.getParent();}return c;},isPhoneScenario:function(r){if(a.system.phone){return true;}return sap.uxap.Utilities._isCurrentMediaSize("Phone",r);},isTabletScenario:function(r){return sap.uxap.Utilities._isCurrentMediaSize("Tablet",r);},_isCurrentMediaSize:function(m,r){return r&&r.name===m;}};return sap.uxap;});
