"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[4614],{3905:(e,t,n)=>{n.r(t),n.d(t,{MDXContext:()=>s,MDXProvider:()=>p,mdx:()=>b,useMDXComponents:()=>d,withMDXComponents:()=>m});var a=n(67294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function l(){return l=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var a in n)Object.prototype.hasOwnProperty.call(n,a)&&(e[a]=n[a])}return e},l.apply(this,arguments)}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function u(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},l=Object.keys(e);for(a=0;a<l.length;a++)n=l[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(a=0;a<l.length;a++)n=l[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var s=a.createContext({}),m=function(e){return function(t){var n=d(t.components);return a.createElement(e,l({},t,{components:n}))}},d=function(e){var t=a.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},p=function(e){var t=d(e.components);return a.createElement(s.Provider,{value:t},e.children)},c="mdxType",h={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},f=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,l=e.originalType,o=e.parentName,s=u(e,["components","mdxType","originalType","parentName"]),m=d(n),p=r,c=m["".concat(o,".").concat(p)]||m[p]||h[p]||l;return n?a.createElement(c,i(i({ref:t},s),{},{components:n})):a.createElement(c,i({ref:t},s))}));function b(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var l=n.length,o=new Array(l);o[0]=f;var i={};for(var u in t)hasOwnProperty.call(t,u)&&(i[u]=t[u]);i.originalType=e,i[c]="string"==typeof e?e:r,o[1]=i;for(var s=2;s<l;s++)o[s]=n[s];return a.createElement.apply(null,o)}return a.createElement.apply(null,n)}f.displayName="MDXCreateElement"},61457:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>u,contentTitle:()=>o,default:()=>d,frontMatter:()=>l,metadata:()=>i,toc:()=>s});var a=n(87462),r=(n(67294),n(3905));const l={},o="Value Representation",i={unversionedId:"generated/starlark_rust_docs/values",id:"generated/starlark_rust_docs/values",title:"Value Representation",description:"Some of the information in this page is outdated. However, the explanation of the problem, and thought process behind it, remains useful. Of particular note is that a garbage collected heap is now used for Value.",source:"@site/../docs/generated/starlark_rust_docs/values.md",sourceDirName:"generated/starlark_rust_docs",slug:"/generated/starlark_rust_docs/values",permalink:"/docs/generated/starlark_rust_docs/values",draft:!1,tags:[],version:"current",frontMatter:{},sidebar:"manualSidebar",previous:{title:"Starlark Types",permalink:"/docs/generated/starlark_rust_docs/types"},next:{title:"Starlark Language Specification",permalink:"/docs/developers/starlark_language_spec"}},u={},s=[{value:"Frozen vs unfrozen values",id:"frozen-vs-unfrozen-values",level:2},{value:"Thaw-on-write",id:"thaw-on-write",level:2},{value:"Immutable containers of mutable data",id:"immutable-containers-of-mutable-data",level:2},{value:"Implementation in Rust",id:"implementation-in-rust",level:2}],m={toc:s};function d(e){let{components:t,...n}=e;return(0,r.mdx)("wrapper",(0,a.Z)({},m,n,{components:t,mdxType:"MDXLayout"}),(0,r.mdx)("h1",{id:"value-representation"},"Value Representation"),(0,r.mdx)("admonition",{type:"warning"},(0,r.mdx)("p",{parentName:"admonition"},"Some of the information in this page is outdated. However, the explanation of the problem, and thought process behind it, remains useful. Of particular note is that a garbage collected heap is now used for ",(0,r.mdx)("inlineCode",{parentName:"p"},"Value"),".")),(0,r.mdx)("p",null,"This page explains how values are represented in the Starlark interpreter, ignoring some incidental details."),(0,r.mdx)("p",null,"Importantly, in Starlark, any identifiers from modules that you import are 'frozen', which means that, if you have a module that defines a list, then once you have imported the module, the list is now immutable. This design means that you can safely share imports with multiple users, without any expensive copying, and use the imports in parallel."),(0,r.mdx)("h2",{id:"frozen-vs-unfrozen-values"},"Frozen vs unfrozen values"),(0,r.mdx)("p",null,"Values that are frozen are segregated from those that are not:"),(0,r.mdx)("ul",null,(0,r.mdx)("li",{parentName:"ul"},"Frozen values are those you import, and (assuming no GC) are to be ref-counted atomically (so they can be shared by multiple threads) and never changed."),(0,r.mdx)("li",{parentName:"ul"},"Unfrozen values are those which are local to the module, and, since modules execute single threaded, can be non-atomically ref-counted and mutated.")),(0,r.mdx)("p",null,"Once a module has finished executing, it's values are frozen and can be reused freely."),(0,r.mdx)("h2",{id:"thaw-on-write"},"Thaw-on-write"),(0,r.mdx)("p",null,"It's not uncommon to return list literals from functions."),(0,r.mdx)("p",null,"For example:"),(0,r.mdx)("pre",null,(0,r.mdx)("code",{parentName:"pre",className:"language-python"},"def my_list(x):\n   return ([1,2,3], x)\n")),(0,r.mdx)("p",null,"This above code returns the unfrozen list ",(0,r.mdx)("inlineCode",{parentName:"p"},"[1,2,3]"),". But while the list is unfrozen, and could be mutated by the caller, it probably won't be. To optimise this pattern, construct a frozen list when compiling ",(0,r.mdx)("inlineCode",{parentName:"p"},"my_list")," and insert a shared reference to it in the result. If anyone tries to mutate the list, it's explicitly unfrozen by copying it into a mutable variant (known as thawing the value)."),(0,r.mdx)("h2",{id:"immutable-containers-of-mutable-data"},"Immutable containers of mutable data"),(0,r.mdx)("p",null,"There are some data types (such as functions and tuples) that are themselves immutable but contain mutable data. Importantly, all types that can be invoked as functions (for example, ",(0,r.mdx)("inlineCode",{parentName:"p"},"lambda"),", ",(0,r.mdx)("inlineCode",{parentName:"p"},"def"),", and ",(0,r.mdx)("inlineCode",{parentName:"p"},"a.b()"),") fall into this category. These types can be non-atomically ref-counted but can't be mutated."),(0,r.mdx)("h2",{id:"implementation-in-rust"},"Implementation in Rust"),(0,r.mdx)("p",null,"Putting all these above concepts together results in the following:"),(0,r.mdx)("pre",null,(0,r.mdx)("code",{parentName:"pre",className:"language-rust"},"enum FrozenValue {\n    None(NoneType),\n    Bool(bool),\n    Int(i64),\n    Obj(Arc<dyn StarlarkValue>),\n}\n\nenum Value {\n    Immutable(FrozenValue),\n    Pseudo(Rc<dyn ComplexValue>)\n    Mutable(Rc<RefCell<Mutable>>),\n}\n\nenum Mutable {\n    Mutable(Box<dyn ComplexValue>),\n    ThawOnWrite(Arc<dyn StarlarkValue>),\n}\n")),(0,r.mdx)("p",null,"In the above code, both of the traits ",(0,r.mdx)("inlineCode",{parentName:"p"},"dyn SimpleValue")," ",(0,r.mdx)("inlineCode",{parentName:"p"},"and dyn ComplexValue")," enable you to convert to the other and have shared general value-like methods."),(0,r.mdx)("p",null,"There are four types of value:"),(0,r.mdx)("ul",null,(0,r.mdx)("li",{parentName:"ul"},(0,r.mdx)("inlineCode",{parentName:"li"},"Immutable")),(0,r.mdx)("li",{parentName:"ul"},(0,r.mdx)("inlineCode",{parentName:"li"},"Pseudo")," - immutable containers of mutable values."),(0,r.mdx)("li",{parentName:"ul"},(0,r.mdx)("inlineCode",{parentName:"li"},"Mutable"),"/",(0,r.mdx)("inlineCode",{parentName:"li"},"Mutable")),(0,r.mdx)("li",{parentName:"ul"},(0,r.mdx)("inlineCode",{parentName:"li"},"Mutable"),"/",(0,r.mdx)("inlineCode",{parentName:"li"},"ThawOnWrite")," - immutable now but can be replaced with ",(0,r.mdx)("inlineCode",{parentName:"li"},"Mutable"),"/",(0,r.mdx)("inlineCode",{parentName:"li"},"Mutable")," if needed.")),(0,r.mdx)("p",null,"There are two root types:"),(0,r.mdx)("ul",null,(0,r.mdx)("li",{parentName:"ul"},(0,r.mdx)("inlineCode",{parentName:"li"},"FrozenValue")," - imported."),(0,r.mdx)("li",{parentName:"ul"},(0,r.mdx)("inlineCode",{parentName:"li"},"Value")," - defined locally.")))}d.isMDXComponent=!0}}]);