var wxtilesjs=(()=>{var rt=Object.create;var A=Object.defineProperty;var ot=Object.getOwnPropertyDescriptor;var st=Object.getOwnPropertyNames;var it=Object.getPrototypeOf,at=Object.prototype.hasOwnProperty;var B=t=>A(t,"__esModule",{value:!0});var Et=typeof require!="undefined"?require:t=>{throw new Error('Dynamic require of "'+t+'" is not supported')};var lt=(t,e)=>()=>(e||t((e={exports:{}}).exports,e),e.exports),ct=(t,e)=>{B(t);for(var n in e)A(t,n,{get:e[n],enumerable:!0})},ut=(t,e,n)=>{if(e&&typeof e=="object"||typeof e=="function")for(let r of st(e))!at.call(t,r)&&r!=="default"&&A(t,r,{get:()=>e[r],enumerable:!(n=ot(e,r))||n.enumerable});return t},mt=t=>ut(B(A(t!=null?rt(it(t)):{},"default",t&&t.__esModule&&"default"in t?{get:()=>t.default,enumerable:!0}:{value:t,enumerable:!0})),t);var et=lt((Jt,tt)=>{tt.exports=window.L});var Rt={};ct(Rt,{WxDebugCoordsLayer:()=>It,WxGetColorStyles:()=>k,WxTileGroupLayer:()=>Ft,WxTileLayer:()=>nt,WxTileLibSetup:()=>H,WxTileLogging:()=>Ut,WxTileWatermark:()=>Pt});var ht={comment1:["degC: ['K', 1, 273.15] -> degC = K * 1 + 273.15",0],comment2:["hPa: ['Pa', 100]' -> hPa = Pa * 100 + 0 (0 - could be ommited)",0],K:["K",1],F:["K",.5555555555,255.372222222],C:["K",1,273.15],degC:["K",1,273.15],"kg/m^2/s":["kg/m^2/s",1],"Kg m**-2 s**-1":["kg/m^2/s",1],"W/m^2":["W/m^2",1],"W m**2":["W/m^2",1],"m/s":["m/s",1],"m s**-1":["m/s",1],knot:["m/s",.514444],knots:["m/s",.514444],"km/h":["m/s",.27777777777],s:["s",1],sec:["s",1],h:["s",3600],min:["s",60],m:["m",1],cm:["m",.01],inch:["m",.0254],Pa:["Pa",1],hPa:["Pa",100]},dt={none:["#00000000","#00000000"],rainbow:["#f00","#ff0","#0f0","#0ff","#00f","#f0f"],rainbow2:["#f00","#ff0","#0f0","#0ff","#00f","#f0f","#f00"],rainbowzerro:["#ff000000","#f00","#ff0","#0f0","#0ff","#00f","#f0f"],bluebird:["#00f","#f0f","#0ff","#80f","#88f"],bluebirdzerro:["#0000ff00","#00f","#f0f","#0ff","#80f","#88f"],bw:["#000","#fff"],wb:["#fff","#000"],redish:["#f0f","#f00","#ff0"],greenish:["#ff0","#0f0","#0ff"],blueish:["#f0f","#00f","#0ff"],hspastel:["#AC6EA4FF","#8E92BDFF","#ACD4DEFF","#E9DC8EFF","#E7A97DFF","#E59074FF","#BE7E68FF","#A88F86FF"]},Z={base:{parent:void 0,name:"base",fill:"gradient",isolineColor:"inverted",isolineText:!0,vectorType:"arrows",vectorColor:"inverted",streamLineColor:"#777",streamLineSpeedFactor:1,streamLineStatic:!1,showBelowMin:!0,showAboveMax:!0,colorScheme:"rainbow",colors:void 0,colorMap:void 0,levels:void 0,blurRadius:0,addDegrees:0,units:"",extraUnits:void 0},custom:{parent:void 0,name:"custom",fill:"gradient",isolineColor:"inverted",isolineText:!0,vectorType:"arrows",vectorColor:"inverted",streamLineColor:"#777",streamLineSpeedFactor:1,streamLineStatic:!1,showBelowMin:!0,showAboveMax:!0,colorScheme:"rainbow",colors:void 0,colorMap:void 0,levels:void 0,blurRadius:0,addDegrees:0,units:"",extraUnits:void 0}},F,O,N;function H({colorStyles:t={},units:e={},colorSchemes:n={}}={}){window.wxlogging&&console.log("WxTile lib setup: start"),F=Object.assign({},ht,e),O=Object.assign({},n,dt),N=ft(t),window.wxlogging&&console.log("WxTile lib setup: styles unrolled"),document.fonts.load("32px barbs"),document.fonts.load("32px arrows"),window.wxlogging&&console.log("WxTile lib setup is done"+JSON.stringify({colorStyles:t,units:e,colorSchemes:n}))}function k(){return N}function G(){return O}function P(t,e,n){let r=n?Object.assign({},F,n):F;if(!r||!t||!e||t===e||!r[t]||!r[e]||r[t][0]!==r[e][0]){window.wxlogging&&console.log(t===e?"Trivial converter:":"Inconvertible units. Default converter is used:",t," -> ",e);let s=l=>l;return s.trivial=!0,s}window.wxlogging&&console.log("Converter: From:",t," To:",e);let o=r[t][1]/r[e][1],i=(r[t][2]||0)/r[e][1]-(r[e][2]||0)/r[e][1];return i?s=>o*s+i:s=>o*s}function ft(t){let e=Object.assign({},Z);for(let o in t){let i=t[o];if(Array.isArray(i))for(let s=0;s<i.length;++s)e[o+"["+s+"]"]=Object.assign({},i[s]);else e[o]=Object.assign({},i)}let n=(o,i)=>{if(i==="base")return Z.base;let s=o[i];(!s.parent||!(s.parent in o))&&(s.parent="base");let l=n(o,s.parent);return Object.assign(s,Object.assign({},l,s,{parent:"base"}))},r={};for(let o in e)r[o]=n(e,o);return r}function gt(t){let e=new Map;return n=>{let r=e.get(n);return r===void 0&&(r=t(n),e.set(n,r)),r}}async function xt(t,e){let n=new Image;n.crossOrigin="anonymous";let r=()=>{n.src=""};return e.addEventListener("abort",r),n.src=t,await n.decode(),e.removeEventListener("abort",r),n}async function bt(t,e){let n=i=>{let s=i.height*i.width,l=new Uint16Array(i.data.buffer),u=new Uint16Array(s);for(let a=0;a<s;a++)u[a]=l[a*2];let d=new Uint8Array(i.data.buffer);for(let a=0;a<8;++a)d[a]=d[a*4+2];let h=new DataView(i.data.buffer),c=h.getFloat32(0,!0),m=h.getFloat32(4,!0),f=(m-c)/65535,g=yt(u);return{raw:u,dmin:c,dmax:m,dmul:f,integral:g,radius:0}},r=Object.assign(document.createElement("canvas"),{width:258,height:258,imageSmoothingEnabled:!1}).getContext("2d");if(!r)return Promise.reject();let o=await xt(t,e);return r.drawImage(o,0,0),n(r.getImageData(0,0,258,258))}function V(){let t=new AbortController,e=gt(n=>bt(n,t.signal));return e.abort=()=>t.abort(),e}function yt(t){let e=new Uint32Array(258*258),n=new Uint32Array(258*258);e[0]=t[0],n[0]=t[0]===0?0:1;for(let r=1;r<258;++r)e[r]=t[r]+e[r-1],e[258*r]=t[258*r]+e[258*r-258],n[r]=(t[r]===0?0:1)+n[r-1],n[258*r]=(t[258*r]===0?0:1)+n[258*r-258];for(let r=1,o=259;r<258;++r,++o)for(let i=1;i<258;++i,++o)e[o]=t[o]+e[o-258]+e[o-1]-e[o-258-1],n[o]=(t[o]===0?0:1)+n[o-258]+n[o-1]-n[o-258-1];return{integral:e,integralNZ:n}}function K(t,e){if(e<0||e===t.radius)return t;t.radius=e;let n=258,{integral:r,integralNZ:o}=t.integral;for(let i=1;i<n;i++)for(let s=1;s<n;s++){if(!t.raw[n*i+s])continue;let l=Math.min(e,s-1,n-1-s),u=Math.min(e,i-1,n-1-i),d=n*(i-u-1)+s,h=n*(i+u)+s,c=o[d-l-1],m=o[d+l],f=o[h-l-1],g=o[h+l],a=c+g-m-f,y=r[d-l-1],x=r[d+l],b=r[h-l-1],w=r[h+l],S=y+w-x-b;t.raw[i*n+s]=S/a}return t}function p(t){let e=t>>0&255,n=t>>8&255,r=t>>16&255,o=e.toString(16),i=n.toString(16),s=r.toString(16);return o=o.length===2?o:"0"+o,i=i.length===2?i:"0"+i,s=s.length===2?s:"0"+s,"#"+o+i+s}function C(t){if(t[0]==="#"){if(t.length===4)return+("0xff"+t[3]+t[3]+t[2]+t[2]+t[1]+t[1]);if(t.length===7)return+("0xff"+t[5]+t[6]+t[3]+t[4]+t[1]+t[2]);if(t.length===9)return+("0x"+t[7]+t[8]+t[5]+t[6]+t[3]+t[4]+t[1]+t[2])}return window.wxlogging&&console.log("wrong color format",t),0}async function T(t){return(await fetch(t)).json()}function v(t,e="",n){var o;let r=document.createElement(t);return r.className=e,n&&((o=n.appendChild)==null||o.call(n,r)),r}function U(t,e,n){let r=t>>0&255,o=t>>8&255,i=t>>16&255,s=t>>>24,l=e>>0&255,u=e>>8&255,d=e>>16&255,h=e>>>24,c=r+n*(l-r),m=o+n*(u-o),f=i+n*(d-i),g=s+n*(h-s);return c|m<<8|f<<16|g<<24}function $(t,e,n){let r=[];for(let o=0;o<n;++o)r.push(o*(e-t)/(n-1)+t);return r}function wt(t,e,n){return t>n?n:t<e?e:t}var R=class{constructor(e,n,[r,o],i){let s=o-r;this.levelIndex=new Uint32Array(65536),this.colorsI=new Uint32Array(65536);let l=[];this.DataToStyle=P(n,e.units,e.extraUnits),this.DataToStyle.trivial&&(e.units=n),i&&(this.DataToKnots=P(n,"knot"));let u=P(e.units,n,e.extraUnits),d=a=>~~(65535*wt((u(a)-r)/(o-r),0,1));if(Array.isArray(e.colorMap)){e.colorMap.sort((a,y)=>a[0]<y[0]?-1:a[0]>y[0]?1:0);for(let[a]of e.colorMap)l.push(d(a))}else{if(e.levels||(e.levels=$(this.DataToStyle(r),this.DataToStyle(o),10)),e.levels.sort((a,y)=>a<y?-1:a>y?1:0),!e.colors){let a=G();e.colorScheme&&e.colorScheme in a?e.colors=a[e.colorScheme]:e.colors=a.wb}for(let a of e.levels)l.push(d(a))}let h=65536,c=E(h,e);this.ticks=c.ticks;let m=c.ticks[0].data,g=c.ticks[c.ticks.length-1].data-m;for(let a=0;a<65536;++a){let y=s*a/65535+r,x=this.DataToStyle(y),b=Math.round((h-1)*(x-m)/g);b<=0?this.colorsI[a]=e.showBelowMin?c.colors[0]:0:b>=h?this.colorsI[a]=e.showAboveMax?c.colors[h-1]:0:this.colorsI[a]=c.colors[b]}this.colorsI[0]=0;for(let a=0;a<l[0];++a)this.levelIndex[a]=0;for(let a=0;a<l.length-1;a++)for(let y=l[a];y<l[a+1]+1;++y)this.levelIndex[y]=a;for(let a=l[l.length-1];a<65536;++a)this.levelIndex[a]=l.length-1}};function q(t){var n;if(t!==0&&-.1<t&&t<.1)return t.toExponential(2);let e=t.toString();return((n=e.split(".")[1])==null?void 0:n.length)>2?t.toFixed(2):e}function E(t,e){let n={size:t,showBelowMin:e.showBelowMin,showAboveMax:e.showAboveMax,units:e.units,colors:new Uint32Array(t),ticks:[]},{colorMap:r,levels:o,colors:i}=e,s=e.fill!=="solid";if(r){let m=r[0][0],f=r[r.length-1][0]-m;for(let[g,a]of r){let y=~~((g-m)/f*(t-1)),x={data:g,dataString:q(g),color:a,pos:y};n.ticks.push(x)}for(let g=0;g<r.length-1;g++){let a=n.ticks[g].pos,y=n.ticks[g+1].pos,x=C(r[g][1]),b=s?C(r[g+1][1]):0;for(let w=a;w<y;++w)n.colors[w]=s?U(x,b,(w-a)/(y-a)):x}return n.colors[t-1]=C(r[r.length-1][1]),n}if(!i||!o)return n;let l=0,u=0,d=-1;for(let m=0;m<t;++m){let f=m*(i.length-1)/t;d!==~~f&&(d=~~f,l=C(i[d]),u=i.length>d+1?C(i[d+1]):l),n.colors[m]=s?U(l,u,f-d):l}n.colors[t-1]=C(i[i.length-1]);let h=o[0],c=(t-1)/(o[o.length-1]-h);for(let m of o){let f=~~((m-h)*c),g={data:m,dataString:q(m),color:p(n.colors[f]),pos:f};n.ticks.push(g)}return n}var W=256,St=2*Math.PI*6378137/W,_=2*Math.PI*6378137/2;function pt(t,e){let n=t/_*180,r=e/_*180;return r=180/Math.PI*(2*Math.atan(Math.exp(r*Math.PI/180))-Math.PI/2),[r,n]}function Ct(t,e,n){let r=vt(n),o=t*r-_,i=e*r-_;return[o,i]}function vt(t){return St/Math.pow(2,t)}function z(t,e,n){let[r,o]=pt(...Ct(t,e,n));return[o,-r]}function X(t,e){return[t*W,e*W]}function Lt(t,e){if(!e)return t;let n=.9999999/Math.pow(2,e.z),r=e.x*256*n,o=e.y*256*n,i={raw:new Uint16Array(258*258),dmin:t.dmin,dmax:t.dmax,dmul:t.dmul},{raw:s}=i;for(let l=-1,u=0;l<=256;l++){let d=o+l*n,h=Math.floor(d),c=d-h;for(let m=-1;m<=256;m++,u++){let f=r+m*n,g=Math.floor(f),a=f-g,y=g+1+(h+1)*258,x=t.raw[y],b=t.raw[y+1],w=t.raw[y+258],S=t.raw[y+258+1];switch((x?1:0)|(b?2:0)|(w?4:0)|(S?8:0)){case 0:s[u]=0;continue;case 1:s[u]=x;continue;case 2:s[u]=b;continue;case 3:w=x,S=b;break;case 4:s[u]=w;continue;case 5:b=x,S=w;break;case 6:S=b+w>>1,x=S;break;case 7:S=b+w>>1;break;case 8:s[u]=S;continue;case 9:b=x+S>>1,w=b;break;case 10:x=b,w=S;break;case 11:w=x+S>>1;break;case 12:x=w,b=S;break;case 13:b=x+S>>1;break;case 14:x=b+w>>1;break}x=t.dmin+t.dmul*x,b=t.dmin+t.dmul*b,w=t.dmin+t.dmul*w,S=t.dmin+t.dmul*S;let D=j(x,b,a),L=j(w,S,a);s[u]=(j(D,L,c)-t.dmin)/t.dmul,s[u]===0&&(s[u]=1)}}return i}function j(t,e,n){let r=((e-t)%360+540)%360-180;return(t+r*n+360)%360}function Tt(t,e){if(!e)return t;let n=.9999999/Math.pow(2,e.z),r=e.x*256*n,o=e.y*256*n,i={raw:new Uint16Array(258*258),dmin:t.dmin,dmax:t.dmax,dmul:t.dmul},{raw:s}=i;for(let l=-1,u=0;l<=256;l++){let d=o+l*n,h=Math.floor(d),c=d-h;for(let m=-1;m<=256;m++,u++){let f=r+m*n,g=Math.floor(f),a=f-g,y=g+1+(h+1)*258,x=t.raw[y],b=t.raw[y+1],w=t.raw[y+258],S=t.raw[y+258+1];switch((x?1:0)|(b?2:0)|(w?4:0)|(S?8:0)){case 7:s[u]=a+c<1?a*(b-x)+c*(w-x)+x:0;continue;case 14:s[u]=a+c<1?0:a*(S-w)+c*(S-b)+b+w-S;continue;case 11:s[u]=c<a?(1-a)*(x-b)+c*(S-b)+b:0;continue;case 13:s[u]=c<a?0:(1-a)*(w-S)+c*(w-x)+x+S-w;continue;case 15:s[u]=a+c<1?a*(b-x)+c*(w-x)+x:a*(S-w)+c*(S-b)+b+w-S;continue;default:s[u]=0}}}return i}function Mt(t){let[e,n]=X(t.x,t.y),[r,o]=z(e,n,t.z),[i,s]=z(e+256,n+256,t.z);return{west:r,north:o,east:i,south:s}}function J({layer:t,coords:e,done:n}){let r=v("div","leaflet-tile s-tile");return t.dataSource?(r.wxtile=new Q({layer:t,coords:e,tileEl:r}),r.wxtile._load().then(o=>{o.draw(),n()})):setTimeout(n),r}var Q=class{constructor({layer:e,coords:n,tileEl:r}){this.data=[];this.sLines=[];this.imData=null;this.coords=n,this.layer=e,this.canvasFill=v("canvas","s-tile canvas-fill",r),this.canvasSlines=v("canvas","s-tile canvas-slines",r),this.canvasVector=this.canvasFill,this.canvasFill.width=this.canvasFill.height=this.canvasSlines.width=this.canvasSlines.height=256;function o(i){let s=i.getContext("2d");if(!s)throw"error";return s}this.canvasFillCtx=o(this.canvasFill),this.canvasSlinesCtx=o(this.canvasSlines),this.canvasVectorCtx=this.canvasFillCtx}draw(){if(!this.data.length){this.canvasFillCtx.clearRect(0,0,256,256),this.canvasSlinesCtx.clearRect(0,0,256,256);return}this._drawFillAndIsolines(),this._drawVector(),this._drawDegree(),this._drawStaticSlines()}clearSLinesCanvas(){this.canvasSlinesCtx.clearRect(0,0,256,256)}drawSLines(e){if(this.sLines.length===0)return;let n=this.canvasSlinesCtx;if(n.clearRect(0,0,256,256),this.layer.style.streamLineColor==="none"){this.sLines=[];return}let r=this.layer.style.streamLineColor.substr(0,7);e=e>>7;for(let o=0;o<this.sLines.length;++o){let i=this.sLines[o],s=i.length-1,l=(e+(1+i[0].x)*(1+i[0].y))%30;for(let u=0;u<s;++u){let d=i[u],h=i[u+1],c=1-(l-u)/s;(c<0||c>1)&&(c=0);let m=(~~(c*255)).toString(16);n.strokeStyle=r+(m.length<2?"0"+m:m);let f=1+~~((1.2-c)*5);n.lineWidth=f,n.beginPath(),n.moveTo(d.x,d.y),n.lineTo(h.x,h.y),n.stroke()}}}getData({x:e,y:n}){if(!this.data.length)return;let r=this.data[0].raw[(n+1)*258+(e+1)];return{raw:r,data:this.data[0].dmin+this.data[0].dmul*r}}async _load(){let{coords:e,layer:n}=this,{boundaries:r}=n.dataSource.meta;if(r==null?void 0:r.boundaries180){let h=Mt(e),c=m=>!(h.west>m.east||m.west>h.east||h.south>m.north||m.south>h.north);if(!r.boundaries180.some(c))return this.data=[],this.imData=null,this}let{upCoords:o,subCoords:i}=this._splitCoords(e),s=this._coordsToURLs(o),l=[];try{l=await Promise.all(s.map(n.loadData))}catch(h){return this.data=[],this.imData=null,this}let u=n.dataSource.units==="degree"?Lt:Tt,d=h=>u(K(h,this.layer.style.blurRadius),i);return this.data=l.map(d),this.imData=this.canvasFillCtx.createImageData(256,256),this.layer.vector&&(this._vectorPrepare(),this._createSLines()),this}_splitCoords(e){let n=e.z-this.layer.dataSource.meta.maxZoom;if(n<=0)return{upCoords:e};let r={x:e.x>>>n,y:e.y>>>n,z:this.layer.dataSource.meta.maxZoom},o={x:e.x&(1<<n)-1,y:e.y&(1<<n)-1,z:n};return{upCoords:r,subCoords:o}}_coordsToURLs(e){let n=this.layer.dataSource.baseURL.replace("{z}",String(e.z)).replace("{x}",String(e.x)).replace("{y}",String(e.y));return this.layer.dataSource.variables.map(r=>n.replace("{var}",r))}_vectorPrepare(){if(this.data.length!==2)throw"this.data !== 2";this.data.unshift({raw:new Uint16Array(258*258),dmin:0,dmax:0,dmul:0});let[e,n,r]=this.data;e.dmax=1.42*Math.max(-n.dmin,n.dmax,-r.dmin,r.dmax),e.dmul=(e.dmax-e.dmin)/65535;for(let o=0;o<258*258;++o){if(!n.raw[o]||!r.raw[o]){e.raw[o]=0;continue}let i=n.dmin+n.dmul*n.raw[o],s=r.dmin+r.dmul*r.raw[o];e.raw[o]=Math.sqrt(s*s+i*i)/e.dmul}}_drawFillAndIsolines(){let{imData:e}=this;if(!e)throw"_drawFillAndIsolines: !imData";let{canvasFillCtx:n}=this;n.clearRect(0,0,256,256);let r=new Uint32Array(e.data.buffer),{raw:o}=this.data[0],{clut:i,style:s}=this.layer,{levelIndex:l,colorsI:u}=i;if(s.fill!=="none"){let h=u;for(let c=0,m=0,f=259;c<256;++c,f+=2)for(let g=0;g<256;++g,++m,++f)r[m]=h[o[f]]}else r.fill(0);let d=[];if(s.isolineColor!=="none"){let h=s.isolineColor[0]==="#"?C(s.isolineColor):0;for(let c=0,m=0;c<256;c+=1)for(let f=0;f<256;f+=1){let g=(c+1)*258+(f+1),a=o[g],y=o[g+1],x=o[g+258];if(!a||!y||!x)continue;let b=l[a],w=l[y],S=l[x];if(b!==w||b!==S){let I=Math.max(b,w,S),D=Math.max(a,y,x),L=c*256+f;switch(s.isolineColor){case"inverted":r[L]=~u[D]|4278190080;break;case"fill":r[L]=u[D]|4278190080;break;default:r[L]=h;break}s.isolineText&&!(++m%255)&&f>20&&f<235&&c>20&&c<235&&d.push({x:f,y:c,d:a,dr:y,db:x,mli:I})}}}if(n.putImageData(e,0,0),!d.length){n.font="1.1em Sans-serif",n.lineWidth=2,n.strokeStyle="white",n.fillStyle="black",n.textAlign="center",n.textBaseline="middle";for(let{x:h,y:c,d:m,dr:f,db:g,mli:a}of d){let y=this.layer.clut.ticks[a].dataString,x=Math.atan2(m-f,g-m);n.save(),n.translate(h,c),n.rotate(x<-1.57||x>1.57?x+3.14:x),n.strokeText(y,0,0),n.fillText(y,0,0),n.restore()}}}_drawStaticSlines(){if(!this.sLines.length||!this.layer.style.streamLineStatic)return;let{canvasSlinesCtx:e}=this;if(e.clearRect(0,0,256,256),this.layer.style.streamLineColor==="none"){this.sLines=[];return}e.lineWidth=2,e.strokeStyle=this.layer.style.streamLineColor,e.beginPath();for(let n=this.sLines.length;n--;){let r=this.sLines[n];for(let o=0;o<r.length-1;++o){let i=r[o],s=r[o+1];e.moveTo(i.x,i.y),e.lineTo(s.x,s.y)}}e.stroke()}_drawVector(){if(!this.layer.vector||!this.layer.clut.DataToKnots||!this.layer.style.vectorColor||this.layer.style.vectorColor==="none"||!this.layer.style.vectorType||this.layer.style.vectorType==="none")return;if(this.data.length!==3)throw"this.data.length !== 3";let[e,n,r]=this.data,{canvasVectorCtx:o}=this;switch(this.layer.style.vectorType){case"barbs":o.font="40px barbs";break;case"arrows":o.font="50px arrows";break;default:o.font=this.layer.style.vectorType}o.textAlign="center",o.textBaseline="middle";let i=this.layer.style.addDegrees?.017453292519943*this.layer.style.addDegrees:0,s=32;for(let l=s/2;l<256;l+=s)for(let u=s/2;u<256;u+=s){let d=u+1+(l+1)*258;if(!e.raw[d])continue;let h=Math.atan2(n.dmin+n.raw[d]*n.dmul,r.dmin+r.raw[d]*r.dmul),c=e.dmin+e.raw[d]*e.dmul,m=this.layer.dataSource.variables[0].includes("current")?5:.2,f=Math.min(this.layer.clut.DataToKnots(c)*m,25)+65,g=String.fromCharCode(f);switch(this.layer.style.vectorColor){case"inverted":o.fillStyle=p(~this.layer.clut.colorsI[e.raw[d]]);break;case"fill":o.fillStyle=p(this.layer.clut.colorsI[e.raw[d]]);break;default:o.fillStyle=this.layer.style.vectorColor;break}o.save(),o.translate(u,l),o.rotate(h+i),o.fillText(g,0,0),o.restore()}}_drawDegree(){if(this.layer.dataSource.units!=="degree")return;let{canvasVectorCtx:e}=this,n=this.layer.style.addDegrees?.017453292519943*this.layer.style.addDegrees:0;e.font="50px arrows",e.textAlign="start",e.textBaseline="alphabetic";let r=this.data[0],o="L",i=32;for(let s=i/2;s<256;s+=i)for(let l=i/2;l<256;l+=i){let u=l+1+(s+1)*258;if(!r.raw[u])continue;let h=(r.dmin+r.raw[u]*r.dmul+180)*.01745329251;switch(this.layer.style.vectorColor){case"inverted":e.fillStyle=p(~this.layer.clut.colorsI[r.raw[u]]);break;case"fill":e.fillStyle=p(this.layer.clut.colorsI[r.raw[u]]);break;default:e.fillStyle=this.layer.style.vectorColor;break}e.save(),e.translate(l,s),e.rotate(h+n),e.fillText(o,0,0),e.restore()}}_createSLines(){if(this.data.length!==3)throw"this.data.length !== 3";if(!this.layer.style.streamLineColor||this.layer.style.streamLineColor==="none")return;let e=this.layer.style.streamLineSpeedFactor||1;this.sLines=[];let[n,r,o]=this.data,i=Math.max(this.coords.z-this.layer.dataSource.meta.maxZoom,0),s=Math.min(2**(i+5),128),l=~~(120+i*60);for(let u=0;u<=256;u+=s)for(let d=0;d<=256;d+=s){if(!n.raw[d+u*258])continue;let h=[],c=d,m=u;for(let f=0;f<=l&&c>=0&&c<=256&&m>=0&&m<=256;f++){!(f%(l/6))&&h.push({x:~~c,y:~~m});let g=~~c+1+(~~m+1)*258;if(!n.raw[g])break;c+=e*(r.dmin+r.raw[g]*r.dmul)/n.dmax,m-=e*(o.dmin+o.raw[g]*o.dmul)/n.dmax}c=d,m=u;for(let f=1;f<=l&&c>=0&&c<=256&&m>=0&&m<=256;f++){!(f%(l/6))&&h.unshift({x:~~c,y:~~m});let g=~~c+1+(~~m+1)*258;if(!n.raw[g])break;c-=e*(r.dmin+r.raw[g]*r.dmul)/n.dmax,m+=e*(o.dmin+o.raw[g]*o.dmul)/n.dmax}h.length>2&&this.sLines.push(h)}}};var Y={initializeLayer({dataSource:t,options:e={},lazy:n=!0}){if(window.wxlogging&&console.log("Creating a WxTile layer:"+JSON.stringify({dataSource:t,options:e})),!t){window.wxlogging&&console.log("dataSource is empty!");return}Object.assign(this.options,e),this.styles=k(),t.ext||(t.ext="webp"),this.wxtiles=new Map;let r=()=>{window.wxlogging&&console.log("Setup:",t.name),this.setupCompletePromise=this._setUpDataSet(t),this.setupCompletePromise.then(()=>{window.wxlogging&&console.log("Setup complete:",this.dataSource.name,this.error&&". error:"+this.error||""),this._initializeEvents(),this._map&&this._onAddL(),this.fire("setupcomplete",{layer:this})})};n?this.once("add",r):r(),this.on("remove",this._onRemoveL,this)},createTile(t,e){return this.error?(setTimeout(e),Object.assign(v("div","error-tile"),{innerHTML:this.error})):J({layer:this,coords:t,done:e})},getSetupCompletePromise(){return this.setupCompletePromise},getTile(t){if(!this._map||this.error)return;let e=this._map.getZoom(),{x:n,y:r}=this._map.project(t,e),o={x:~~(n/256),y:~~(r/256)},i=this.wxtiles.get(`${o.x}:${o.y}:${e}`);if(!i||!i.data)return;let s={x:~~(n-o.x*256),y:~~(r-o.y*256)},l=i.getData(s);if(!l)return;let{raw:u,data:d}=l,h=this.clut.colorsI[u],c=p(h),m=this.clut.DataToStyle(d);return{tile:i,data:d,raw:u,rgba:h,hexColor:c,inStyleUnits:m,tilePoint:s,units:this.style.units}},setStyle(t){if(!this.dataSource){window.wxlogging&&console.log("setStyle: failed. Lazy setup not finished yet.");return}if(!(this.dataSource.styleName===t&&t!=="custom")){if(t&&(this.dataSource.styleName=t),t==="custom"&&this.styles.custom){(!this.styles.custom.parent||!(this.styles.custom.parent in this.styles))&&(this.styles.custom.parent="base");let e=this.styles[this.styles.custom.parent];this.styles.custom=Object.assign(Object.assign({},e),this.styles.custom)}this.dataSource.styleName in this.styles?Array.isArray(this.styles[this.dataSource.styleName])&&(this.dataSource.styleName+="[0]"):(this.dataSource.styleName=this.dataSource.name+"[0]",this.dataSource.styleName in this.styles||(this.dataSource.styleName="base",window.wxlogging&&console.log(`cant find the style (${t}), default is used`)));try{let e=this.styles[this.dataSource.styleName];this.style=Object.assign({},e);let n=this.style.streamLineColor;n!=="none"&&n.length<7&&(this.style.streamLineColor="#"+n[1]+n[1]+n[2]+n[2]+n[3]+n[3]);let r=this.dataSource.minmax[0];this.clut=new R(this.style,this.dataSource.units,r,this.vector)}catch(e){this.error="setStyle: impossible error in RawCLUT",window.wxlogging&&console.log(this.error,e);return}t&&(this._checkAndStartSlinesAnimation(),this._reloadTiles()),window.wxlogging&&console.log('setStyle: "'+this.dataSource.styleName+'" for '+this.dataSource.name+" complete."),this.fire("setstyle",{layer:this})}},getStyle(){if(!this.dataSource){window.wxlogging&&console.log("getStyle: failed. Lazy setup not finished yet.");return}return this.dataSource&&this.dataSource.styleName||""},getStyleName(){if(!this.dataSource){window.wxlogging&&console.log("getStyleName: failed. Lazy setup not finished yet.");return}return this.dataSource&&this.style&&this.style.name||"no style"},setTime(t){if(!this.dataSource){window.wxlogging&&console.log("setTime: failed. Lazy setup not finished yet.");return}let e=this._getClosestTimeString(t);if(this.dataSource.time!==e){this.dataSource.time=e,this.dataSource.baseURL=this.dataSource.originURI+this.dataSource.instance+`{var}/${this.dataSource.time}/{z}/{x}/{y}.${this.dataSource.ext}`,this.fire("settime",{layer:this,layerTime:e}),window.wxlogging&&console.log("setTime: "+e+" for "+this.dataSource.name+" complete.");let n=this._reloadTiles();return n.then(()=>{let r=this.wxtiles.values().next().value;if(!(r==null?void 0:r.data.length))return;let[o,i]=this.dataSource.minmax[0],{dmin:s,dmax:l}=r.data[0];(Math.abs(s-o)>.01||Math.abs(l-i)>.01)&&(this.dataSource.minmax=r.data.map(u=>[u.dmin,u.dmax]),this._updateMinMax(),this.setStyle())}),n}return Promise.resolve()},getTime(){if(!this.dataSource){window.wxlogging&&console.log("getTime: failed. Lazy setup not finished yet.");return}return this.dataSource.time},getTimes(){if(!this.dataSource){window.wxlogging&&console.log("getTimes: failed. Lazy setup not finished yet.");return}return this.dataSource.meta.times},async checkDataChanged(){if(!this.dataSource)return window.wxlogging&&console.log("getTimes: failed. Lazy setup not finished yet."),Promise.resolve(!1);let t=await T(this.dataSource.originURI+"instances.json"),e=t[t.length-1]+"/";if(this.dataSource.instance!==e)return!0;let n=await T(this.dataSource.originURI+e+"meta.json");return this.dataSource.meta.times.toString()!==n.times.toString()},reloadData(){return this._setUpDataSet()},getLegendData(t){if(!this.error){if(!this.clut){window.wxlogging&&console.log("getLegendData: failed. Lazy setup not finished yet:"+this.dataSource.name);return}return E(t,this.style)}},setTimeAnimationMode(t=2){this.oldMaxZoom=this.dataSource.meta.maxZoom;let e=this._map.getZoom(),r=(e<this.oldMaxZoom?e:this.oldMaxZoom)-t;this.dataSource.meta.maxZoom=r<0?0:r},unsetTimeAnimationMode(){var t,e;!this.oldMaxZoom||!((e=(t=this.dataSource)==null?void 0:t.meta)==null?void 0:e.maxZoom)||(this.dataSource.meta.maxZoom=this.oldMaxZoom,this._reloadTiles())},getMinMax(){let[t,e]=this.dataSource.minmax[0];return{min:t,max:e}},async _setUpDataSet(t){if(t&&!(t.dataset&&t.variables&&Array.isArray(t.variables)&&t.variables.length>0&&t.variables.length<3)){this.error=t.name+": dataSource error",window.wxlogging&&console.log(this.error);return}t&&(this.dataSource=t),this._stopLoadingResetLoadDataFunc(),this.dataSource.originURI=this.dataSource.serverURI+"/"+this.dataSource.dataset+"/";try{let e=await T(this.dataSource.originURI+"instances.json");this.dataSource.instance=e[e.length-1]+"/"}catch{this.error=this.dataSource.name+": load instances.json error",window.wxlogging&&console.log(this.error);return}try{let e=this.dataSource.originURI+this.dataSource.instance+"meta.json";this.dataSource.meta=await T(e)}catch{this.error=this.dataSource.name+": load meta.json error",window.wxlogging&&console.log(this.error);return}this.vector=this.dataSource.variables.length===2,this.animation=this.vector,this.dataSource.units=this.dataSource.meta.variablesMeta[this.dataSource.variables[0]].units,this.dataSource.minmax=this.dataSource.variables.map(e=>[this.dataSource.meta.variablesMeta[e].min,this.dataSource.meta.variablesMeta[e].max]),this._updateMinMax(),t&&(this.setTime(Date.now()),this.setStyle())},_updateMinMax(){if(!this.vector)return;let[[t,e],[n,r]]=this.dataSource.minmax;this.dataSource.minmax.unshift([0,1.42*Math.max(-t,e,-n,r)])},_initializeEvents(){this.error||(this.on("tileload",t=>{this.wxtiles.set(`${t.coords.x}:${t.coords.y}:${t.coords.z}`,t.tile.wxtile)}),this.on("tileunload",t=>{this.wxtiles.delete(`${t.coords.x}:${t.coords.y}:${t.coords.z}`)}),this.on("add",this._onAddL,this))},_checkZoom(){(!this._map||this._map.getZoom()<this.dataSource.meta.maxZoom)&&this._stopLoadingResetLoadDataFunc()},_onAddL(){window.wxlogging&&console.log("onadd:",this.dataSource.name),this.error||this._map.on("zoomstart",this._checkZoom,this),this.setupCompletePromise.then(()=>{this.redraw(),this._checkAndStartSlinesAnimation()})},_onRemoveL(){window.wxlogging&&console.log("onremove:",this.dataSource.name),this._map.off("zoomstart",this._checkZoom,this),this.setupCompletePromise.then(()=>{this._stopLoadingResetLoadDataFunc(),this._stopSlinesAnimation()})},_stopLoadingResetLoadDataFunc(){var t;(t=this.loadData)==null||t.abort(),this.loadData=V()},_checkAndStartSlinesAnimation(){if(this.animFrame||!this.animation||!this.vector||!this.style.streamLineColor||this.style.streamLineColor==="none")return;let t=e=>{if(!this.animation||this.style.streamLineStatic){this._stopSlinesAnimation();return}this.wxtiles.forEach(n=>n.drawSLines(e)),this.animFrame=requestAnimationFrame(t)};t()},_stopSlinesAnimation(){cancelAnimationFrame(this.animFrame),this.wxtiles.forEach(t=>t.clearSLinesCanvas()),this.animFrame=0},_getClosestTimeString(t){return this.dataSource.meta.times.find(e=>new Date(e).getTime()>=t)||this.dataSource.meta.times[this.dataSource.meta.times.length-1]},_redrawTiles(){!this.wxtiles||this.animationRedrawID||(this.animationRedrawID=requestAnimationFrame(()=>{this.wxtiles.forEach(t=>t.draw()),this.animationRedrawID=null}))},_reloadTiles(){let t=[];this.wxtiles.forEach(n=>t.push(n._load()));let e=Promise.all(t);return e.then(()=>this._redrawTiles()),e}};var M=mt(et()),Dt=M.default.GridLayer.extend(Y);function nt(t){let e=new Dt;return e.initializeLayer(t),e}var At={options:{URI:""},onAdd(){let t=document.createElement("img");return t.src=this.options.URI,t.className="wxtiles-logo",t}},kt=M.default.Control.extend(At);function Pt(t){return window.wxlogging&&console.log("Add watermark:",JSON.stringify(t)),new kt(t)}var _t=M.default.GridLayer.extend({createTile(t){let e=document.createElement("div");return e.innerHTML=[t.x,t.y,t.z].join(", "),e.style.outline="1px solid red",e}});function It(){window.wxlogging&&console.log("Add WxDebugCoordsLayer:");let t=new _t;return t.setZIndex(1e3),t}function Ft(t){return M.default.layerGroup(t.map(nt))}function Ut(t){console.log(t?"Logging on":"Logging off"),window.wxlogging=t}return Rt;})();
//# sourceMappingURL=wxtiles.js.map
