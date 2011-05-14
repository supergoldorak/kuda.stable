/**
 * Copyright 2009 Tim Down.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var Hashtable=(function(){var w="undefined",f="function",k="string",j="equals",t="hashCode",o="toString";var r=(typeof Array.prototype.splice==f)?function(y,x){y.splice(x,1)}:function(A,z){var y,B,x;if(z===A.length-1){A.length=z}else{y=A.slice(z+1);A.length=z;for(B=0,x=y.length;B<x;++B){A[z+B]=y[B]}}};function v(y){var x;if(typeof y==k){return y}else{if(typeof y[t]==f){x=y.hashCode();return(typeof x==k)?x:v(x)}else{if(typeof y[o]==f){return y.toString()}else{return String(y)}}}}function s(x,y){return x.equals(y)}function b(x,y){return(typeof y[j]==f)?y.equals(x):(x===y)}function d(x){return function(y){if(y===null){throw new Error("null is not a valid "+x)}else{if(typeof y==w){throw new Error(x+" must not be undefined")}}}}var g=d("key"),c=d("value");function i(y,z,x){this.entries=[];this.addEntry(y,z);if(x!==null){this.getEqualityFunction=function(){return x}}}var a=0,l=1,h=2;function p(x){return function(z){var y=this.entries.length,B,A=this.getEqualityFunction(z);while(y--){B=this.entries[y];if(A(z,B[0])){switch(x){case a:return true;case l:return B;case h:return[y,B[1]]}}}return false}}function u(x){return function(A){var B=A.length;for(var z=0,y=this.entries.length;z<y;++z){A[B+z]=this.entries[z][x]}}}i.prototype={getEqualityFunction:function(x){return(typeof x[j]==f)?s:b},getEntryForKey:p(l),getEntryAndIndexForKey:p(h),removeEntryForKey:function(y){var x=this.getEntryAndIndexForKey(y);if(x){r(this.entries,x[0]);return x[1]}return null},addEntry:function(x,y){this.entries[this.entries.length]=[x,y]},keys:u(0),values:u(1),getEntries:function(y){var A=y.length;for(var z=0,x=this.entries.length;z<x;++z){y[A+z]=this.entries[z].slice(0)}},containsKey:p(a),containsValue:function(y){var x=this.entries.length;while(x--){if(y===this.entries[x][1]){return true}}return false}};function q(){}q.prototype=[];function e(A,x){var y=A.length,z;while(y--){z=A[y];if(x===z[0]){return y}}return null}function n(y,x){var z=y[x];return(z&&(z instanceof q))?z[1]:null}function m(A,x){var B=this;var E=[];var y={};var C=(typeof A==f)?A:v;var z=(typeof x==f)?x:null;this.put=function(I,K){g(I);c(K);var F=C(I),J,H,G=null;var L=n(y,F);if(L){H=L.getEntryForKey(I);if(H){G=H[1];H[1]=K}else{L.addEntry(I,K)}}else{J=new q();J[0]=F;J[1]=new i(I,K,z);E[E.length]=J;y[F]=J}return G};this.get=function(H){g(H);var F=C(H);var I=n(y,F);if(I){var G=I.getEntryForKey(H);if(G){return G[1]}}return null};this.containsKey=function(G){g(G);var F=C(G);var H=n(y,F);return H?H.containsKey(G):false};this.containsValue=function(G){c(G);var F=E.length;while(F--){if(E[F][1].containsValue(G)){return true}}return false};this.clear=function(){E.length=0;y={}};this.isEmpty=function(){return !E.length};var D=function(F){return function(){var G=[],H=E.length;while(H--){E[H][1][F](G)}return G}};this.keys=D("keys");this.values=D("values");this.entries=D("getEntries");this.remove=function(I){g(I);var G=C(I),F,H=null;var J=n(y,G);if(J){H=J.removeEntryForKey(I);if(H!==null){if(!J.entries.length){F=e(E,G);r(E,F);y[G]=null;delete y[G]}}}return H};this.size=function(){var G=0,F=E.length;while(F--){G+=E[F][1].entries.length}return G};this.each=function(I){var F=B.entries(),G=F.length,H;while(G--){H=F[G];I(H[0],H[1])}};this.putAll=function(N,I){var H=N.entries();var K,L,J,F,G=H.length;var M=(typeof I==f);while(G--){K=H[G];L=K[0];J=K[1];if(M&&(F=B.get(L))){J=I(L,F,J)}B.put(L,J)}};this.clone=function(){var F=new m(A,x);F.putAll(B);return F}}return m})();