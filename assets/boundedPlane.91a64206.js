import{s as rn,ai as S,hp as O,h5 as u,ac as l,hc as p,p as P,h4 as an,ab as $,h8 as cn,h7 as un,h6 as m,ha as Y,hn as V,hh as gn,kh as bn,hi as d,iT as fn,hb as C,iL as J,n as N}from"./index.3255d2a5.js";import{s as j,c as r,g as ln,b as M,n as _}from"./sphere.67ec4acb.js";import{e as H}from"./mat4f64.9070f685.js";import{v as pn,A as R,M as hn}from"./lineSegment.1a0fd96e.js";import{p as v,E as dn,A as mn,O as L,F as $n,x as In,U as Pn,w as Nn,B as W,J as Mn,Y as w,L as wn}from"./plane.a0a08b54.js";const E=rn.getLogger("esri.views.3d.support.geometryUtils.boundedPlane");class Tn{constructor(){this.plane=v(),this.origin=N(),this.basis1=N(),this.basis2=N()}}const vn=Tn;function I(n=en){return{plane:v(n.plane),origin:O(n.origin),basis1:O(n.basis1),basis2:O(n.basis2)}}function An(n,o,i){const t=qn.get();return t.origin=n,t.basis1=o,t.basis2=i,t.plane=dn(0,0,0,0),x(t),t}function A(n,o=I()){return X(n.origin,n.basis1,n.basis2,o)}function xn(n,o){u(o.origin,n.origin),u(o.basis1,n.basis1),u(o.basis2,n.basis2),mn(o.plane,n.plane)}function X(n,o,i,t=I()){return u(t.origin,n),u(t.basis1,o),u(t.basis2,i),x(t),Un(t,"fromValues()"),t}function x(n){L(n.basis2,n.basis1,n.origin,n.plane)}function Z(n,o,i){n!==i&&A(n,i);const t=l(r.get(),f(n),o);return p(i.origin,i.origin,t),i.plane[3]-=o,i}function yn(n,o,i){return D(o,i),Z(i,k(n,n.origin),i),i}function D(n,o=I()){const i=(n[2]-n[0])/2,t=(n[3]-n[1])/2;return P(o.origin,n[0]+i,n[1]+t,0),P(o.basis1,i,0,0),P(o.basis2,0,t,0),$n(0,0,1,0,o.plane),o}function B(n,o,i){return!!In(n.plane,o,i)&&tn(n,i)}function Sn(n,o,i){if(B(n,o,i))return i;const t=K(n,o,r.get());return p(i,o.origin,l(r.get(),o.direction,an(o.origin,t)/$(o.direction))),i}function K(n,o,i){const t=T.get();sn(n,o,t,T.get());let s=Number.POSITIVE_INFINITY;for(const e of z){const a=q(n,e,y.get()),g=r.get();if(Pn(t,a,g)){const c=cn(r.get(),o.origin,g),b=Math.abs(un(m(o.direction,c)));b<s&&(s=b,u(i,g))}}return s===Number.POSITIVE_INFINITY?Q(n,o,i):i}function Q(n,o,i){if(B(n,o,i))return i;const t=T.get(),s=T.get();sn(n,o,t,s);let e=Number.POSITIVE_INFINITY;for(const a of z){const g=q(n,a,y.get()),c=r.get();if(Nn(t,g,c)){const b=ln(o,c);if(!W(s,c))continue;b<e&&(e=b,u(i,c))}}return U(n,o.origin)<e&&nn(n,o.origin,i),i}function nn(n,o,i){const t=Mn(n.plane,o,r.get()),s=R(G(n,n.basis1),t,-1,1,r.get()),e=R(G(n,n.basis2),t,-1,1,r.get());return Y(i,p(r.get(),s,e),n.origin),i}function on(n,o,i){const{origin:t,basis1:s,basis2:e}=n,a=Y(r.get(),o,t),g=M(s,a),c=M(e,a),b=M(f(n),a);return P(i,g,c,b)}function U(n,o){const i=on(n,o,r.get()),{basis1:t,basis2:s}=n,e=$(t),a=$(s),g=Math.max(Math.abs(i[0])-e,0),c=Math.max(Math.abs(i[1])-a,0),b=i[2];return g*g+c*c+b*b}function On(n,o){return Math.sqrt(U(n,o))}function Vn(n,o){let i=Number.NEGATIVE_INFINITY;for(const t of z){const s=q(n,t,y.get()),e=hn(s,o);e>i&&(i=e)}return Math.sqrt(i)}function _n(n,o){return W(n.plane,o)&&tn(n,o)}function En(n,o,i,t){return Bn(n,i,t)}function k(n,o){const i=-n.plane[3];return M(f(n),o)-i}function Fn(n,o,i,t){const s=k(n,o),e=l(kn,f(n),i-s);return p(t,o,e),t}function Ln(n,o){return V(n.basis1,o.basis1)&&V(n.basis2,o.basis2)&&V(n.origin,o.origin)}function Yn(n,o,i){return n!==i&&A(n,i),gn(h,o),bn(h,h),d(i.basis1,n.basis1,h),d(i.basis2,n.basis2,h),d(w(i.plane),w(n.plane),h),d(i.origin,n.origin,o),wn(i.plane,i.plane,i.origin),i}function jn(n,o,i,t){return n!==t&&A(n,t),fn(F,o,i),d(t.basis1,n.basis1,F),d(t.basis2,n.basis2,F),x(t),t}function f(n){return w(n.plane)}function Bn(n,o,i){switch(o){case _.X:u(i,n.basis1),C(i,i);break;case _.Y:u(i,n.basis2),C(i,i);break;case _.Z:u(i,f(n))}return i}function tn(n,o){const i=Y(r.get(),o,n.origin),t=J(n.basis1),s=J(n.basis2),e=m(n.basis1,i),a=m(n.basis2,i);return-e-t<0&&e-t<0&&-a-s<0&&a-s<0}function G(n,o){const i=y.get();return u(i.origin,n.origin),u(i.vector,o),i}function q(n,o,i){const{basis1:t,basis2:s,origin:e}=n,a=l(r.get(),t,o.origin[0]),g=l(r.get(),s,o.origin[1]);p(i.origin,a,g),p(i.origin,i.origin,e);const c=l(r.get(),t,o.direction[0]),b=l(r.get(),s,o.direction[1]);return l(i.vector,p(c,c,b),2),i}function Un(n,o){Math.abs(m(n.basis1,n.basis2)/($(n.basis1)*$(n.basis2)))>1e-6&&E.warn(o,"Provided basis vectors are not perpendicular"),Math.abs(m(n.basis1,f(n)))>1e-6&&E.warn(o,"Basis vectors and plane normal are not perpendicular"),Math.abs(-m(f(n),n.origin)-n.plane[3])>1e-6&&E.warn(o,"Plane offset is not consistent with plane origin")}function sn(n,o,i,t){const s=f(n);L(s,o.direction,o.origin,i),L(w(i),s,o.origin,t)}const en={plane:v(),origin:S(0,0,0),basis1:S(1,0,0),basis2:S(0,1,0)},T=new j(v),y=new j(pn),kn=N(),qn=new j(()=>I()),z=[{origin:[-1,-1],direction:[1,0]},{origin:[1,-1],direction:[0,1]},{origin:[1,1],direction:[-1,0]},{origin:[-1,1],direction:[0,-1]}],h=H(),F=H();Object.freeze(Object.defineProperty({__proto__:null,BoundedPlaneClass:vn,UP:en,altitudeAt:k,axisAt:En,closestPoint:Q,closestPointOnSilhouette:K,copy:A,copyWithoutVerify:xn,create:I,distance:On,distance2:U,distanceToSilhouette:Vn,elevate:Z,equals:Ln,extrusionContainsPoint:_n,fromAABoundingRect:D,fromValues:X,intersectRay:B,intersectRayClosestSilhouette:Sn,normal:f,projectPoint:nn,projectPointLocal:on,rotate:jn,setAltitudeAt:Fn,setExtent:yn,transform:Yn,updateUnboundedPlane:x,wrap:An},Symbol.toStringTag,{value:"Module"}));export{D as $,x as J,I as W,A as Z,On as a};