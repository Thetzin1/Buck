"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[1978],{3905:(e,t,r)=>{r.r(t),r.d(t,{MDXContext:()=>i,MDXProvider:()=>d,mdx:()=>b,useMDXComponents:()=>p,withMDXComponents:()=>u});var n=r(67294);function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function l(){return l=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(e[n]=r[n])}return e},l.apply(this,arguments)}function o(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function s(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?o(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):o(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function c(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},l=Object.keys(e);for(n=0;n<l.length;n++)r=l[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(n=0;n<l.length;n++)r=l[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var i=n.createContext({}),u=function(e){return function(t){var r=p(t.components);return n.createElement(e,l({},t,{components:r}))}},p=function(e){var t=n.useContext(i),r=t;return e&&(r="function"==typeof e?e(t):s(s({},t),e)),r},d=function(e){var t=p(e.components);return n.createElement(i.Provider,{value:t},e.children)},m="mdxType",g={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},f=n.forwardRef((function(e,t){var r=e.components,a=e.mdxType,l=e.originalType,o=e.parentName,i=c(e,["components","mdxType","originalType","parentName"]),u=p(r),d=a,m=u["".concat(o,".").concat(d)]||u[d]||g[d]||l;return r?n.createElement(m,s(s({ref:t},i),{},{components:r})):n.createElement(m,s({ref:t},i))}));function b(e,t){var r=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var l=r.length,o=new Array(l);o[0]=f;var s={};for(var c in t)hasOwnProperty.call(t,c)&&(s[c]=t[c]);s.originalType=e,s[m]="string"==typeof e?e:a,o[1]=s;for(var i=2;i<l;i++)o[i]=r[i];return n.createElement.apply(null,o)}return n.createElement.apply(null,r)}f.displayName="MDXCreateElement"},59063:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>c,contentTitle:()=>o,default:()=>p,frontMatter:()=>l,metadata:()=>s,toc:()=>i});var n=r(87462),a=(r(67294),r(3905));const l={},o="target_set",s={unversionedId:"generated/bxl/target_set",id:"generated/bxl/target_set",title:"target_set",description:"Members",source:"@site/../docs/generated/bxl/target_set.md",sourceDirName:"generated/bxl",slug:"/generated/bxl/target_set",permalink:"/docs/generated/bxl/target_set",draft:!1,tags:[],version:"current",frontMatter:{},sidebar:"manualSidebar",previous:{title:"target_node",permalink:"/docs/generated/bxl/target_node"},next:{title:"unconfigured_target_node",permalink:"/docs/generated/bxl/unconfigured_target_node"}},c={},i=[{value:"Members",id:"members",level:3},{value:"target_set",id:"target_set-1",level:2},{value:"Details",id:"details",level:3}],u={toc:i};function p(e){let{components:t,...r}=e;return(0,a.mdx)("wrapper",(0,n.Z)({},u,r,{components:t,mdxType:"MDXLayout"}),(0,a.mdx)("h1",{id:"target_set"},"target_set"),(0,a.mdx)("h3",{id:"members"},"Members"),(0,a.mdx)("table",{class:"starlark_table starlark_members_table"},(0,a.mdx)("thead",null,(0,a.mdx)("tr",null,(0,a.mdx)("th",null,"Member"),(0,a.mdx)("th",null,"Description"),(0,a.mdx)("th",null,"Type"))),(0,a.mdx)("tbody",null,(0,a.mdx)("tr",null,(0,a.mdx)("td",null,(0,a.mdx)("p",null,"target_set")),(0,a.mdx)("td",null,(0,a.mdx)("p",null,"Creates an empty target set.")),(0,a.mdx)("td",null,(0,a.mdx)("pre",null,(0,a.mdx)("code",{parentName:"pre",className:"language-python"},'() -> "target_set"\n')))))),(0,a.mdx)("h2",{id:"target_set-1"},"target_set"),(0,a.mdx)("pre",null,(0,a.mdx)("code",{parentName:"pre",className:"language-python"},'def target_set() -> "target_set"\n')),(0,a.mdx)("p",null,"Creates an empty target set."),(0,a.mdx)("h3",{id:"details"},"Details"),(0,a.mdx)("p",null,"Sample usage:"),(0,a.mdx)("pre",null,(0,a.mdx)("code",{parentName:"pre",className:"language-text"},"def _impl_target_set(ctx):\n    targets = target_set()\n    ctx.output.print(type(targets))\n    ctx.output.print(len(targets))\n")))}p.isMDXComponent=!0}}]);