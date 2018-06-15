/** @license
 * JS Signals <http://millermedeiros.github.com/js-signals/>
 * Released under the MIT license
 * Author: Miller Medeiros
 * Version: 1.0.0 - Build: 268 (2012/11/29 05:48 PM)
 */
(function(g){function S(b,l,i,c,p){this._listener=l;this._isOnce=i;this.context=c;this._signal=b;this._priority=p||0;}S.prototype={active:true,params:null,execute:function(p){var h,b;if(this.active&&!!this._listener){b=this.params?this.params.concat(p):p;h=this._listener.apply(this.context,b);if(this._isOnce){this.detach();}}return h;},detach:function(){return this.isBound()?this._signal.remove(this._listener,this.context):null;},isBound:function(){return(!!this._signal&&!!this._listener);},isOnce:function(){return this._isOnce;},getListener:function(){return this._listener;},getSignal:function(){return this._signal;},_destroy:function(){delete this._signal;delete this._listener;delete this.context;},toString:function(){return'[SignalBinding isOnce:'+this._isOnce+', isBound:'+this.isBound()+', active:'+this.active+']';}};function v(l,n){if(typeof l!=='function'){throw new Error('listener is a required param of {fn}() and should be a Function.'.replace('{fn}',n));}}function a(){this._bindings=[];this._prevParams=null;var b=this;this.dispatch=function(){a.prototype.dispatch.apply(b,arguments);};}a.prototype={VERSION:'1.0.0',memorize:false,_shouldPropagate:true,active:true,_registerListener:function(l,i,b,p){var c=this._indexOfListener(l,b),d;if(c!==-1){d=this._bindings[c];if(d.isOnce()!==i){throw new Error('You cannot add'+(i?'':'Once')+'() then add'+(!i?'':'Once')+'() the same listener without removing the relationship first.');}}else{d=new S(this,l,i,b,p);this._addBinding(d);}if(this.memorize&&this._prevParams){d.execute(this._prevParams);}return d;},_addBinding:function(b){var n=this._bindings.length;do{--n;}while(this._bindings[n]&&b._priority<=this._bindings[n]._priority);this._bindings.splice(n+1,0,b);},_indexOfListener:function(l,c){var n=this._bindings.length,b;while(n--){b=this._bindings[n];if(b._listener===l&&b.context===c){return n;}}return-1;},has:function(l,c){return this._indexOfListener(l,c)!==-1;},add:function(l,b,p){v(l,'add');return this._registerListener(l,false,b,p);},addOnce:function(l,b,p){v(l,'addOnce');return this._registerListener(l,true,b,p);},remove:function(l,c){v(l,'remove');var i=this._indexOfListener(l,c);if(i!==-1){this._bindings[i]._destroy();this._bindings.splice(i,1);}return l;},removeAll:function(){var n=this._bindings.length;while(n--){this._bindings[n]._destroy();}this._bindings.length=0;},getNumListeners:function(){return this._bindings.length;},halt:function(){this._shouldPropagate=false;},dispatch:function(p){if(!this.active){return;}var b=Array.prototype.slice.call(arguments),n=this._bindings.length,c;if(this.memorize){this._prevParams=b;}if(!n){return;}c=this._bindings.slice();this._shouldPropagate=true;do{n--;}while(c[n]&&this._shouldPropagate&&c[n].execute(b)!==false);},forget:function(){this._prevParams=null;},dispose:function(){this.removeAll();delete this._bindings;delete this._prevParams;},toString:function(){return'[Signal active:'+this.active+' numListeners:'+this.getNumListeners()+']';}};var s=a;s.Signal=a;if(typeof define==='function'&&define.amd){define(function(){return s;});}else{g['signals']=s;}}(this));
