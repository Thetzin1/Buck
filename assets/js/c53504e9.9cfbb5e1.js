"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[851],{3905:(e,t,n)=>{n.r(t),n.d(t,{MDXContext:()=>c,MDXProvider:()=>m,mdx:()=>b,useMDXComponents:()=>s,withMDXComponents:()=>u});var r=n(67294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function l(){return l=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},l.apply(this,arguments)}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function d(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},l=Object.keys(e);for(r=0;r<l.length;r++)n=l[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(r=0;r<l.length;r++)n=l[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var c=r.createContext({}),u=function(e){return function(t){var n=s(t.components);return r.createElement(e,l({},t,{components:n}))}},s=function(e){var t=r.useContext(c),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},m=function(e){var t=s(e.components);return r.createElement(c.Provider,{value:t},e.children)},p="mdxType",x={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},f=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,l=e.originalType,o=e.parentName,c=d(e,["components","mdxType","originalType","parentName"]),u=s(n),m=a,p=u["".concat(o,".").concat(m)]||u[m]||x[m]||l;return n?r.createElement(p,i(i({ref:t},c),{},{components:n})):r.createElement(p,i({ref:t},c))}));function b(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var l=n.length,o=new Array(l);o[0]=f;var i={};for(var d in t)hasOwnProperty.call(t,d)&&(i[d]=t[d]);i.originalType=e,i[p]="string"==typeof e?e:a,o[1]=i;for(var c=2;c<l;c++)o[c]=n[c];return r.createElement.apply(null,o)}return r.createElement.apply(null,n)}f.displayName="MDXCreateElement"},52302:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>d,contentTitle:()=>o,default:()=>s,frontMatter:()=>l,metadata:()=>i,toc:()=>c});var r=n(87462),a=(n(67294),n(3905));const l={},o="ctx",i={unversionedId:"generated/native/ctx",id:"generated/native/ctx",title:"ctx",description:"The starting type, usually bound as ctx",source:"@site/../docs/generated/native/ctx.md",sourceDirName:"generated/native",slug:"/generated/native/ctx",permalink:"/docs/generated/native/ctx",draft:!1,tags:[],version:"current",frontMatter:{},sidebar:"manualSidebar",previous:{title:"ctx.actions",permalink:"/docs/generated/native/ctx.actions"},next:{title:"function",permalink:"/docs/generated/native/extension/function"}},d={},c=[{value:"Members",id:"members",level:3},{value:"actions : <code>&quot;actions&quot;</code>",id:"actions--actions",level:2},{value:"attrs : <code>&quot;&quot;</code>",id:"attrs--",level:2},{value:"label : <code>&quot;&quot;</code>",id:"label--",level:2}],u={toc:c};function s(e){let{components:t,...n}=e;return(0,a.mdx)("wrapper",(0,r.Z)({},u,n,{components:t,mdxType:"MDXLayout"}),(0,a.mdx)("h1",{id:"ctx"},"ctx"),(0,a.mdx)("p",null,"The starting type, usually bound as ",(0,a.mdx)("inlineCode",{parentName:"p"},"ctx")),(0,a.mdx)("h3",{id:"members"},"Members"),(0,a.mdx)("table",{class:"starlark_table starlark_members_table"},(0,a.mdx)("thead",null,(0,a.mdx)("tr",null,(0,a.mdx)("th",null,"Member"),(0,a.mdx)("th",null,"Description"),(0,a.mdx)("th",null,"Type"))),(0,a.mdx)("tbody",null,(0,a.mdx)("tr",null,(0,a.mdx)("td",null,(0,a.mdx)("p",null,"actions")),(0,a.mdx)("td",null,(0,a.mdx)("p",null,"Returns ",(0,a.mdx)("inlineCode",{parentName:"p"},"actions")," allowing you to define actions")),(0,a.mdx)("td",null,(0,a.mdx)("pre",null,(0,a.mdx)("code",{parentName:"pre",className:"language-python"},'"actions"\n')))),(0,a.mdx)("tr",null,(0,a.mdx)("td",null,(0,a.mdx)("p",null,"attrs")),(0,a.mdx)("td",null,(0,a.mdx)("p",null,"Returns the attributes of the target as a Starlark struct with a field for each attribute, which varies per rule")),(0,a.mdx)("td",null,(0,a.mdx)("pre",null,(0,a.mdx)("code",{parentName:"pre",className:"language-python"},'""\n')))),(0,a.mdx)("tr",null,(0,a.mdx)("td",null,(0,a.mdx)("p",null,"label")),(0,a.mdx)("td",null,(0,a.mdx)("p",null,"Returns a ",(0,a.mdx)("inlineCode",{parentName:"p"},"label")," representing the target")),(0,a.mdx)("td",null,(0,a.mdx)("pre",null,(0,a.mdx)("code",{parentName:"pre",className:"language-python"},'""\n')))))),(0,a.mdx)("h2",{id:"actions--actions"},"actions : ",(0,a.mdx)("inlineCode",{parentName:"h2"},'"actions"')),(0,a.mdx)("p",null,"Returns ",(0,a.mdx)("inlineCode",{parentName:"p"},"actions")," allowing you to define actions"),(0,a.mdx)("hr",null),(0,a.mdx)("h2",{id:"attrs--"},"attrs : ",(0,a.mdx)("inlineCode",{parentName:"h2"},'""')),(0,a.mdx)("p",null,"Returns the attributes of the target as a Starlark struct with a field for each attribute, which varies per rule"),(0,a.mdx)("hr",null),(0,a.mdx)("h2",{id:"label--"},"label : ",(0,a.mdx)("inlineCode",{parentName:"h2"},'""')),(0,a.mdx)("p",null,"Returns a ",(0,a.mdx)("inlineCode",{parentName:"p"},"label")," representing the target"))}s.isMDXComponent=!0}}]);