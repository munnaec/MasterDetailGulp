/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2018 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','sap/ui/model/Context','sap/ui/model/FilterType','sap/ui/model/ListBinding','sap/ui/model/odata/ODataUtils','sap/ui/model/odata/CountMode','sap/ui/model/odata/Filter','sap/ui/model/odata/OperationMode','sap/ui/model/ChangeReason','sap/ui/model/Filter','sap/ui/model/FilterProcessor','sap/ui/model/Sorter','sap/ui/model/SorterProcessor'],function(q,C,F,L,O,a,b,c,d,e,f,S,g){"use strict";var h=L.extend("sap.ui.model.odata.v2.ODataListBinding",{constructor:function(m,p,o,s,i,P){L.apply(this,arguments);this.sFilterParams=null;this.sSortParams=null;this.sRangeParams=null;this.sCustomParams=this.oModel.createCustomParams(this.mParameters);this.iStartIndex=0;this.iLength=0;this.bPendingChange=false;this.aAllKeys=null;this.aKeys=[];this.sCountMode=(P&&P.countMode)||this.oModel.sDefaultCountMode;this.sOperationMode=(P&&P.operationMode)||this.oModel.sDefaultOperationMode;this.bCreatePreliminaryContext=(P&&P.createPreliminaryContext)||m.bPreliminaryContext;this.bUsePreliminaryContext=(P&&P.usePreliminaryContext)||m.bPreliminaryContext;this.bRefresh=false;this.bNeedsUpdate=false;this.bDataAvailable=false;this.bIgnoreSuspend=false;this.bPendingRefresh=false;this.sGroupId=undefined;this.sRefreshGroupId=undefined;this.bLengthRequested=false;this.bUseExtendedChangeDetection=true;this.bFaultTolerant=P&&P.faultTolerant;this.bLengthFinal=false;this.iLastEndIndex=0;this.aLastContexts=null;this.aLastContextData=null;this.bInitial=true;this.mRequestHandles={};this.oCountHandle=null;this.bSkipDataEvents=false;this.bUseExpandedList=false;this.oModel.checkFilterOperation(this.aApplicationFilters);if(P&&(P.batchGroupId||P.groupId)){this.sGroupId=P.groupId||P.batchGroupId;}this.iThreshold=(P&&P.threshold)||0;this.bThresholdRejected=false;if(this.sCountMode==a.None){this.bThresholdRejected=true;}var u=this.checkExpandedList();if(!u){this.resetData();}},metadata:{publicMethods:["getLength"]}});h.prototype.getContexts=function(s,j,t){if(this.bInitial){return[];}if(!this.bLengthFinal&&this.sOperationMode==c.Auto&&(this.sCountMode==a.Request||this.sCountMode==a.Both)){if(!this.bLengthRequested){this._getLength();this.bLengthRequested=true;}return[];}if(!this.bLengthFinal&&!this.bPendingRequest&&!this.bLengthRequested){this._getLength();this.bLengthRequested=true;}this.iLastLength=j;this.iLastStartIndex=s;this.iLastThreshold=t;if(!s){s=0;}if(!j){j=this.oModel.iSizeLimit;if(this.bLengthFinal&&this.iLength<j){j=this.iLength;}}if(!t){t=0;}if(this.sOperationMode==c.Auto){if(this.iThreshold>=0){t=Math.max(this.iThreshold,t);}}var m=true,n=this._getContexts(s,j),o=[],p;if(this.useClientMode()){if(!this.aAllKeys&&!this.bPendingRequest&&this.oModel.getServiceMetadata()){this.loadData();n.dataRequested=true;}}else{p=this.calculateSection(s,j,t,n);m=n.length!==j&&!(this.bLengthFinal&&n.length>=this.iLength-s);if(this.oModel.getServiceMetadata()){if(!this.bPendingRequest&&p.length>0&&(m||j<p.length)){this.loadData(p.startIndex,p.length);n.dataRequested=true;}}}if(this.bRefresh){this.bRefresh=false;}else{for(var i=0;i<n.length;i++){o.push(this.getContextData(n[i]));}if(this.bUseExtendedChangeDetection){if(this.aLastContexts&&s<this.iLastEndIndex){n.diff=q.sap.arraySymbolDiff(this.aLastContextData,o);}}this.iLastEndIndex=s+j;this.aLastContexts=n.slice(0);this.aLastContextData=o.slice(0);}return n;};h.prototype.getCurrentContexts=function(){return this.aLastContexts||[];};h.prototype.getEntryKey=function(o){return o.getPath();};h.prototype.getEntryData=function(o){return JSON.stringify(o.getObject(this.mParameters));};h.prototype._getContexts=function(s,j){var m=[],o,K;if(!s){s=0;}if(!j){j=this.oModel.iSizeLimit;if(this.bLengthFinal&&this.iLength<j){j=this.iLength;}}for(var i=s;i<s+j;i++){K=this.aKeys[i];if(!K){break;}o=this.oModel.getContext('/'+K);m.push(o);}return m;};h.prototype.calculateSection=function(s,m,t,n){var o,p,P,r,R,u={},K;p=s;o=0;for(var i=s;i>=Math.max(s-t,0);i--){K=this.aKeys[i];if(!K){r=i+1;break;}}for(var j=s+m;j<s+m+t;j++){K=this.aKeys[j];if(!K){P=j;break;}}R=s-r;if(r&&s>t&&R<t){if(n.length!==m){p=s-t;}else{p=r-t;}o=t;}p=Math.max(p,0);if(p===s){p+=n.length;}if(n.length!==m){o+=m-n.length;}R=P-s-m;if(R===0){o+=t;}if(P&&R<t&&R>0){if(p>s){p=P;o+=t;}}if(this.bLengthFinal&&this.iLength<(o+p)){o=this.iLength-p;}u.startIndex=p;u.length=o;return u;};h.prototype.setContext=function(o){var r,i=o&&o.bCreated,j=o&&o.isRefreshForced(),u=o&&o.isUpdated(),p=o&&o.isPreliminary();if(this.bInitial||!this.isRelative()){return;}if(p&&!this.bUsePreliminaryContext){return;}if(u&&this.bUsePreliminaryContext){this._fireChange({reason:d.Context});return;}if(C.hasChanged(this.oContext,o)){this.oContext=o;r=this.oModel.resolve(this.sPath,this.oContext);if(!r||i){if(this.aAllKeys||this.aKeys.length>0||this.iLength>0){this.aAllKeys=null;this.aKeys=[];this.iLength=0;this.bLengthFinal=true;this._fireChange({reason:d.Context});}return;}this._initSortersFilters();if(this.checkExpandedList()&&!j){this._fireChange({reason:d.Context});}else{this._refresh();}}};h.prototype.checkExpandedList=function(s){var r=!!this.oModel.resolve(this.sPath,this.oContext),R=this.oModel._getObject(this.sPath,this.oContext);if(!r||R===undefined||(this.sOperationMode===c.Server&&(this.aApplicationFilters.length>0||this.aFilters.length>0||this.aSorters.length>0))){this.bUseExpandedList=false;this.aExpandRefs=undefined;return false;}else{this.bUseExpandedList=true;this.aExpandRefs=R;if(Array.isArray(R)){if(!s&&(this.oModel._isReloadNeeded("/"+R[0],this.mParameters)||this.oModel._isReloadNeeded("/"+R[R.length-1],this.mParameters))){this.bUseExpandedList=false;this.aExpandRefs=undefined;return false;}this.aAllKeys=R;this.iLength=R.length;this.bLengthFinal=true;this.bDataAvailable=true;this.applyFilter();this.applySort();}else{this.aAllKeys=null;this.aKeys=[];this.iLength=0;this.bLengthFinal=true;this.bDataAvailable=true;}return true;}};h.prototype.updateExpandedList=function(K){if(this.aExpandRefs){for(var i=0;i<K.length;i++){this.aExpandRefs[i]=K[i];}this.aExpandRefs.length=K.length;}};h.prototype.useClientMode=function(){return(this.sOperationMode===c.Client||this.sOperationMode===c.Auto&&!this.bThresholdRejected||this.sOperationMode!==c.Server&&this.bUseExpandedList);};h.prototype.loadData=function(s,j){var t=this,I=false,G=q.sap.uid(),m;if(s||j){this.sRangeParams="$skip="+s+"&$top="+j;this.iStartIndex=s;}else{s=this.iStartIndex;}var p=[];if(this.sRangeParams&&!this.useClientMode()){p.push(this.sRangeParams);}if(this.sSortParams){p.push(this.sSortParams);}if(this.sFilterParams&&!this.useClientMode()){p.push(this.sFilterParams);}if(this.sCustomParams){p.push(this.sCustomParams);}if(this.sCountMode==a.InlineRepeat||!this.bLengthFinal&&(this.sCountMode===a.Inline||this.sCountMode===a.Both)){p.push("$inlinecount=allpages");I=true;}function n(D){if(I&&D.__count){t.iLength=parseInt(D.__count,10);t.bLengthFinal=true;if(t.sOperationMode==c.Auto){if(t.iLength<=t.mParameters.threshold){t.bThresholdRejected=false;}else{t.bThresholdRejected=true;delete t.mRequestHandles[G];t.bPendingRequest=false;t.bNeedsUpdate=true;return;}}}if(t.useClientMode()){t.aKeys=[];q.each(D.results,function(i,r){t.aKeys[i]=t.oModel._getKey(r);});t.updateExpandedList(t.aKeys);t.aAllKeys=t.aKeys.slice();t.iLength=t.aKeys.length;t.bLengthFinal=true;t.applyFilter();t.applySort();}else{if(D.results.length>0){q.each(D.results,function(i,r){t.aKeys[s+i]=t.oModel._getKey(r);});if(t.iLength<s+D.results.length){t.iLength=s+D.results.length;t.bLengthFinal=false;}if(!D.__next&&(D.results.length<j||j===undefined)){t.iLength=s+D.results.length;t.bLengthFinal=true;}}else{if(t.bFaultTolerant&&D.__next){t.iLength=s;t.bLengthFinal=true;}if(s===0){t.iLength=0;t.aKeys=[];t.bLengthFinal=true;}if(s===t.iLength){t.bLengthFinal=true;}}}delete t.mRequestHandles[G];t.bPendingRequest=false;t.bNeedsUpdate=true;t.bIgnoreSuspend=true;t.oModel.callAfterUpdate(function(){t.fireDataReceived({data:D});});}function E(i){var A=i.statusCode==0;delete t.mRequestHandles[G];t.bPendingRequest=false;if(t.bFaultTolerant){t.iLength=t.aKeys.length;t.bLengthFinal=true;t.bDataAvailable=true;}else if(!A){t.aKeys=[];t.aAllKeys=[];t.iLength=0;t.bLengthFinal=true;t.bDataAvailable=true;t._fireChange({reason:d.Change});}if(!t.bSkipDataEvents){t.fireDataReceived();}}var P=this.sPath,o=this.oContext;if(this.isRelative()){P=this.oModel.resolve(P,o);}if(P){this.bPendingRequest=true;if(!this.bSkipDataEvents){this.fireDataRequested();}this.bSkipDataEvents=false;m=this.sRefreshGroup?this.sRefreshGroup:this.sGroupId;this.mRequestHandles[G]=this.oModel.read(P,{groupId:m,urlParameters:p,success:n,error:E});}};h.prototype.isLengthFinal=function(){return this.bLengthFinal;};h.prototype.getLength=function(){if(this.bLengthFinal||this.iLength==0){return this.iLength;}else{var A=this.iLastThreshold||this.iLastLength||10;return this.iLength+A;}};h.prototype._getLength=function(){var t=this;var G;if(this.sCountMode!==a.Request&&this.sCountMode!==a.Both){return;}var p=[];if(this.sFilterParams&&this.sOperationMode!=c.Auto){p.push(this.sFilterParams);}if(this.mParameters&&this.mParameters.custom){var o={custom:{}};q.each(this.mParameters.custom,function(s,v){o.custom[s]=v;});p.push(this.oModel.createCustomParams(o));}function _(D){t.iLength=parseInt(D,10);t.bLengthFinal=true;t.bLengthRequested=true;t.oCountHandle=null;if(t.sOperationMode==c.Auto){if(t.iLength<=t.mParameters.threshold){t.bThresholdRejected=false;}else{t.bThresholdRejected=true;}t._fireChange({reason:d.Change});}}function i(E){delete t.mRequestHandles[P];var s="Request for $count failed: "+E.message;if(E.response){s+=", "+E.response.statusCode+", "+E.response.statusText+", "+E.response.body;}q.sap.log.warning(s);}var P=this.oModel.resolve(this.sPath,this.oContext);if(P){P=P+"/$count";G=this.sRefreshGroup?this.sRefreshGroup:this.sGroupId;this.oCountHandle=this.oModel.read(P,{withCredentials:this.oModel.bWithCredentials,groupId:G,urlParameters:p,success:_,error:i});}};h.prototype.refresh=function(i,G){if(typeof i==="string"){G=i;i=false;}this.sRefreshGroup=G;this._refresh(i);this.sRefreshGroup=undefined;};h.prototype._refresh=function(j,m,E){var n=false,o=this.isRelative()&&this.oContext&&this.oContext.bCreated;if(o){return;}this.bPendingRefresh=false;if(!j){if(E){var r=this.oModel.resolve(this.sPath,this.oContext);if(r){var p=this.oModel.oMetadata._getEntityTypeByPath(r);if(p&&(p.entityType in E)){n=true;}}}if(m&&!n){q.each(this.aKeys,function(i,K){if(K in m){n=true;return false;}});}if(!m&&!E){n=true;}}if(j||n){if(this.bSuspended&&!this.bIgnoreSuspend&&!j){this.bPendingRefresh=true;return;}this.abortPendingRequest(true);this.resetData();this._fireRefresh({reason:d.Refresh});}};h.prototype._fireRefresh=function(p){if(this.oModel.resolve(this.sPath,this.oContext)){this.bRefresh=true;this.fireEvent("refresh",p);}};h.prototype.initialize=function(){var i=this.isRelative()&&this.oContext&&this.oContext.bCreated;if(this.oModel.oMetadata&&this.oModel.oMetadata.isLoaded()&&this.bInitial&&!i){this.bInitial=false;this._initSortersFilters();if(!this.bSuspended){if(this.bDataAvailable){this._fireChange({reason:d.Change});}else{this._fireRefresh({reason:d.Refresh});}}}return this;};h.prototype.checkUpdate=function(i,m){var j=this.sChangeReason?this.sChangeReason:d.Change,n=false,o,t=this,p;if((this.bSuspended&&!this.bIgnoreSuspend&&!i)||this.bPendingRequest){return false;}this.bIgnoreSuspend=false;if(this.bPendingRequest){return;}if(!i&&!this.bNeedsUpdate){p=this.aExpandRefs;var r=this.aKeys.slice();var E=this.checkExpandedList(true);if(!E&&this.useClientMode()){this.applyFilter();this.applySort();}if(!q.sap.equal(p,this.aExpandRefs)){n=true;}else if(m){if(this.aKeys.length!==r.length){n=true;}else{for(var K in m){if(this.aKeys.indexOf(K)>-1||r.indexOf(K)>-1){n=true;break;}}}}else{n=true;}if(n&&this.aLastContexts){n=false;var s=this._getContexts(this.iLastStartIndex,this.iLastLength,this.iLastThreshold);if(this.aLastContexts.length!==s.length){n=true;}else{q.each(this.aLastContextData,function(I,u){o=t.getContextData(s[I]);if(u!==o){n=true;return false;}});}}}if(i||n||this.bNeedsUpdate){this.bNeedsUpdate=false;this._fireChange({reason:j});}this.sChangeReason=undefined;};h.prototype.resetData=function(){this.aKeys=[];this.aAllKeys=null;this.iLength=0;this.bLengthFinal=false;this.sChangeReason=undefined;this.bDataAvailable=false;this.bLengthRequested=false;this.bThresholdRejected=false;if(this.sCountMode==a.None){this.bThresholdRejected=true;}};h.prototype.abortPendingRequest=function(A){if(!q.isEmptyObject(this.mRequestHandles)){this.bSkipDataEvents=true;q.each(this.mRequestHandles,function(p,r){r.abort();});if(A&&this.oCountHandle){this.oCountHandle.abort();}this.mRequestHandles={};this.bPendingRequest=false;}};h.prototype.getDownloadUrl=function(s){var p=[],P;if(s){p.push("$format="+encodeURIComponent(s));}if(this.sSortParams){p.push(this.sSortParams);}if(this.sFilterParams){p.push(this.sFilterParams);}if(this.sCustomParams){p.push(this.sCustomParams);}P=this.oModel.resolve(this.sPath,this.oContext);if(P){return this.oModel._createRequestUrl(P,null,p);}};h.prototype.sort=function(s,r){var i=false;this.bIgnoreSuspend=true;if(!s){s=[];}if(s instanceof S){s=[s];}this.aSorters=s;if(!this.useClientMode()){this.createSortParams(s);}if(!this.bInitial){this.addComparators(s,true);if(this.useClientMode()){if(this.aAllKeys){if(s.length==0){this.applyFilter();}else{this.applySort();}this._fireChange({reason:d.Sort});}else{this.sChangeReason=d.Sort;}}else{this.aKeys=[];this.abortPendingRequest(false);this.sChangeReason=d.Sort;this._fireRefresh({reason:this.sChangeReason});}this._fireSort({sorter:s});i=true;}if(r){return i;}else{return this;}};h.prototype.addComparators=function(E,s){var p,t,o=this.oEntityType,i;if(!o){q.sap.log.warning("Cannot determine sort/filter comparators, as entitytype of the collection is unkown!");return;}E.forEach(function(j){if(j.aFilters){this.addComparators(j.aFilters);}else if(!j.fnCompare){p=this.oModel.oMetadata._getPropertyMetadata(o,j.sPath);t=p&&p.type;i=O.getComparator(t);if(s){j.fnCompare=k(i);}else{j.fnCompare=l(i,t,j);}}}.bind(this));};function k(i){return function(v,V){if(v===V){return 0;}if(v===null){return-1;}if(V===null){return 1;}return i(v,V);};}function l(i,t,o){if(t=="Edm.Decimal"&&(typeof o.oValue1=="number"||typeof o.oValue2=="number")){var j=i;i=function(v,V){return j.call(null,v,V.toString());};}return i;}h.prototype.applySort=function(){var t=this,o;this.aKeys=g.apply(this.aKeys,this.aSorters,function(r,p){o=t.oModel.getContext('/'+r);return t.oModel.getProperty(p,o);});};h.prototype.createSortParams=function(s){this.sSortParams=O.createSortParams(s);};h.prototype.filter=function(i,s,r){var j=false;this.bIgnoreSuspend=true;if(!i){i=[];}if(i instanceof e){i=[i];}this.oModel.checkFilterOperation(i);if(s===F.Application){this.aApplicationFilters=i;}else{this.aFilters=i;}i=this.aFilters.concat(this.aApplicationFilters);if(!i||!Array.isArray(i)||i.length===0){this.aFilters=[];this.aApplicationFilters=[];}if(!this.useClientMode()){this.createFilterParams(i);}if(!this.bInitial){this.addComparators(this.aFilters);this.addComparators(this.aApplicationFilters);if(this.useClientMode()){if(this.aAllKeys){this.applyFilter();this.applySort();this._fireChange({reason:d.Filter});}else{this.sChangeReason=d.Filter;}}else{this.resetData();this.abortPendingRequest(true);this.sChangeReason=d.Filter;this._fireRefresh({reason:this.sChangeReason});}if(s===F.Application){this._fireFilter({filters:this.aApplicationFilters});}else{this._fireFilter({filters:this.aFilters});}j=true;}if(r){return j;}else{return this;}};h.prototype.applyFilter=function(){var t=this,o,j=this.aFilters.concat(this.aApplicationFilters),m=[];q.each(j,function(i,n){if(n instanceof b){m.push(n.convert());}else{m.push(n);}});this.aKeys=f.apply(this.aAllKeys,m,function(r,p){o=t.oModel.getContext('/'+r);return t.oModel.getProperty(p,o);});this.iLength=this.aKeys.length;};h.prototype.createFilterParams=function(i){this.sFilterParams=O.createFilterParams(i,this.oModel.oMetadata,this.oEntityType);};h.prototype._initSortersFilters=function(){var r=this.oModel.resolve(this.sPath,this.oContext);if(!r){return;}this.oEntityType=this._getEntityType();this.addComparators(this.aSorters,true);this.addComparators(this.aFilters);this.addComparators(this.aApplicationFilters);if(!this.useClientMode()){this.createSortParams(this.aSorters);this.createFilterParams(this.aFilters.concat(this.aApplicationFilters));}};h.prototype._getEntityType=function(){var r=this.oModel.resolve(this.sPath,this.oContext);if(r){var E=this.oModel.oMetadata._getEntityTypeByPath(r);return E;}return undefined;};h.prototype.resume=function(){this.bIgnoreSuspend=false;this.bSuspended=false;if(this.bPendingRefresh){this._refresh();}else{this.checkUpdate();}};h.prototype.suspend=function(){if(this.bInitial){this.bPendingRefresh=true;}L.prototype.suspend.apply(this,arguments);};return h;});
