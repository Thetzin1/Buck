"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[6782],{3905:(e,t,r)=>{r.r(t),r.d(t,{MDXContext:()=>c,MDXProvider:()=>m,mdx:()=>g,useMDXComponents:()=>u,withMDXComponents:()=>p});var n=r(67294);function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function l(){return l=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(e[n]=r[n])}return e},l.apply(this,arguments)}function o(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function d(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?o(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):o(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function i(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},l=Object.keys(e);for(n=0;n<l.length;n++)r=l[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(n=0;n<l.length;n++)r=l[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var c=n.createContext({}),p=function(e){return function(t){var r=u(t.components);return n.createElement(e,l({},t,{components:r}))}},u=function(e){var t=n.useContext(c),r=t;return e&&(r="function"==typeof e?e(t):d(d({},t),e)),r},m=function(e){var t=u(e.components);return n.createElement(c.Provider,{value:t},e.children)},s="mdxType",b={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},f=n.forwardRef((function(e,t){var r=e.components,a=e.mdxType,l=e.originalType,o=e.parentName,c=i(e,["components","mdxType","originalType","parentName"]),p=u(r),m=a,s=p["".concat(o,".").concat(m)]||p[m]||b[m]||l;return r?n.createElement(s,d(d({ref:t},c),{},{components:r})):n.createElement(s,d({ref:t},c))}));function g(e,t){var r=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var l=r.length,o=new Array(l);o[0]=f;var d={};for(var i in t)hasOwnProperty.call(t,i)&&(d[i]=t[i]);d.originalType=e,d[s]="string"==typeof e?e:a,o[1]=d;for(var c=2;c<l;c++)o[c]=r[c];return n.createElement.apply(null,o)}return n.createElement.apply(null,r)}f.displayName="MDXCreateElement"},80850:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>i,contentTitle:()=>o,default:()=>u,frontMatter:()=>l,metadata:()=>d,toc:()=>c});var n=r(87462),a=(r(67294),r(3905));const l={},o="label",d={unversionedId:"generated/native/label",id:"generated/native/label",title:"label",description:"A label is used to represent a configured target.",source:"@site/../docs/generated/native/label.md",sourceDirName:"generated/native",slug:"/generated/native/label",permalink:"/docs/generated/native/label",draft:!1,tags:[],version:"current",frontMatter:{},sidebar:"manualSidebar",previous:{title:"regex",permalink:"/docs/generated/native/extension/regex"},next:{title:"promise",permalink:"/docs/generated/native/promise"}},i={},c=[{value:"cell : <code>str.type</code>",id:"cell--strtype",level:2},{value:"cell_root : <code>&quot;&quot;</code>",id:"cell_root--",level:2},{value:"configured_target",id:"configured_target",level:2},{value:"name : <code>str.type</code>",id:"name--strtype",level:2},{value:"package : <code>str.type</code>",id:"package--strtype",level:2},{value:"path : <code>&quot;&quot;</code>",id:"path--",level:2},{value:"raw_target",id:"raw_target",level:2},{value:"sub_target : <code>[None, [str.type]]</code>",id:"sub_target--none-strtype",level:2}],p={toc:c};function u(e){let{components:t,...r}=e;return(0,a.mdx)("wrapper",(0,n.Z)({},p,r,{components:t,mdxType:"MDXLayout"}),(0,a.mdx)("h1",{id:"label"},"label"),(0,a.mdx)("p",null,"A label is used to represent a configured target."),(0,a.mdx)("h2",{id:"cell--strtype"},"cell : ",(0,a.mdx)("inlineCode",{parentName:"h2"},"str.type")),(0,a.mdx)("p",null,"For the label ",(0,a.mdx)("inlineCode",{parentName:"p"},"fbcode//buck2/hello:world (ovr_config//platform/linux:x86_64-fbcode-46b26edb4b80a905)")," this gives back ",(0,a.mdx)("inlineCode",{parentName:"p"},"fbcode")),(0,a.mdx)("hr",null),(0,a.mdx)("h2",{id:"cell_root--"},"cell_root : ",(0,a.mdx)("inlineCode",{parentName:"h2"},'""')),(0,a.mdx)("hr",null),(0,a.mdx)("h2",{id:"configured_target"},"configured_target"),(0,a.mdx)("pre",null,(0,a.mdx)("code",{parentName:"pre",className:"language-python"},'def configured_target() -> "configured_target_label"\n')),(0,a.mdx)("p",null,"Returns the underlying configured target label, dropping the sub target"),(0,a.mdx)("hr",null),(0,a.mdx)("h2",{id:"name--strtype"},"name : ",(0,a.mdx)("inlineCode",{parentName:"h2"},"str.type")),(0,a.mdx)("p",null,"For the label ",(0,a.mdx)("inlineCode",{parentName:"p"},"fbcode//buck2/hello:world (ovr_config//platform/linux:x86_64-fbcode-46b26edb4b80a905)")," this gives back ",(0,a.mdx)("inlineCode",{parentName:"p"},"world")),(0,a.mdx)("hr",null),(0,a.mdx)("h2",{id:"package--strtype"},"package : ",(0,a.mdx)("inlineCode",{parentName:"h2"},"str.type")),(0,a.mdx)("p",null,"For the label ",(0,a.mdx)("inlineCode",{parentName:"p"},"fbcode//buck2/hello:world (ovr_config//platform/linux:x86_64-fbcode-46b26edb4b80a905)")," this gives back ",(0,a.mdx)("inlineCode",{parentName:"p"},"buck2/hello")),(0,a.mdx)("hr",null),(0,a.mdx)("h2",{id:"path--"},"path : ",(0,a.mdx)("inlineCode",{parentName:"h2"},'""')),(0,a.mdx)("p",null,"For the label ",(0,a.mdx)("inlineCode",{parentName:"p"},"fbcode//buck2/hello:world (ovr_config//platform/linux:x86_64-fbcode-46b26edb4b80a905)")," this gives back ",(0,a.mdx)("inlineCode",{parentName:"p"},"fbcode/buck2/hello")),(0,a.mdx)("hr",null),(0,a.mdx)("h2",{id:"raw_target"},"raw_target"),(0,a.mdx)("pre",null,(0,a.mdx)("code",{parentName:"pre",className:"language-python"},'def raw_target() -> "target_label"\n')),(0,a.mdx)("p",null,"For the label ",(0,a.mdx)("inlineCode",{parentName:"p"},"fbcode//buck2/hello:world (ovr_config//platform/linux:x86_64-fbcode-46b26edb4b80a905)")," this returns the unconfigured underlying target label (",(0,a.mdx)("inlineCode",{parentName:"p"},"fbcode//buck2/hello:world"),")"),(0,a.mdx)("hr",null),(0,a.mdx)("h2",{id:"sub_target--none-strtype"},"sub_target : ",(0,a.mdx)("inlineCode",{parentName:"h2"},"[None, [str.type]]")))}u.isMDXComponent=!0}}]);