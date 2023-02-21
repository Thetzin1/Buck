"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[5141],{3905:(e,t,n)=>{n.r(t),n.d(t,{MDXContext:()=>p,MDXProvider:()=>m,mdx:()=>f,useMDXComponents:()=>d,withMDXComponents:()=>c});var i=n(67294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(){return a=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var i in n)Object.prototype.hasOwnProperty.call(n,i)&&(e[i]=n[i])}return e},a.apply(this,arguments)}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);t&&(i=i.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,i)}return n}function l(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,i,r=function(e,t){if(null==e)return{};var n,i,r={},a=Object.keys(e);for(i=0;i<a.length;i++)n=a[i],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(i=0;i<a.length;i++)n=a[i],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var p=i.createContext({}),c=function(e){return function(t){var n=d(t.components);return i.createElement(e,a({},t,{components:n}))}},d=function(e){var t=i.useContext(p),n=t;return e&&(n="function"==typeof e?e(t):l(l({},t),e)),n},m=function(e){var t=d(e.components);return i.createElement(p.Provider,{value:t},e.children)},u="mdxType",y={inlineCode:"code",wrapper:function(e){var t=e.children;return i.createElement(i.Fragment,{},t)}},b=i.forwardRef((function(e,t){var n=e.components,r=e.mdxType,a=e.originalType,o=e.parentName,p=s(e,["components","mdxType","originalType","parentName"]),c=d(n),m=r,u=c["".concat(o,".").concat(m)]||c[m]||y[m]||a;return n?i.createElement(u,l(l({ref:t},p),{},{components:n})):i.createElement(u,l({ref:t},p))}));function f(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var a=n.length,o=new Array(a);o[0]=b;var l={};for(var s in t)hasOwnProperty.call(t,s)&&(l[s]=t[s]);l.originalType=e,l[u]="string"==typeof e?e:r,o[1]=l;for(var p=2;p<a;p++)o[p]=n[p];return i.createElement.apply(null,o)}return i.createElement.apply(null,n)}b.displayName="MDXCreateElement"},37779:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>s,contentTitle:()=>o,default:()=>d,frontMatter:()=>a,metadata:()=>l,toc:()=>p});var i=n(87462),r=(n(67294),n(3905));const a={id:"visibility",title:"Visibility"},o=void 0,l={unversionedId:"concepts/visibility",id:"concepts/visibility",title:"Visibility",description:'Determines whether a target can reference another target in its attributes. In a large project, you may want to prevent developers from "reaching across" the project and pulling in additional code. Reducing the visibility of targets can help prevent that type of behavior.',source:"@site/../docs/concepts/visibility.md",sourceDirName:"concepts",slug:"/concepts/visibility",permalink:"/docs/concepts/visibility",draft:!1,tags:[],version:"current",frontMatter:{id:"visibility",title:"Visibility"},sidebar:"manualSidebar",previous:{title:"Target Pattern",permalink:"/docs/concepts/target_pattern"},next:{title:"Daemon (buckd)",permalink:"/docs/concepts/daemon"}},s={},p=[{value:"Examples",id:"examples",level:2}],c={toc:p};function d(e){let{components:t,...n}=e;return(0,r.mdx)("wrapper",(0,i.Z)({},c,n,{components:t,mdxType:"MDXLayout"}),(0,r.mdx)("p",null,"Determines whether a ",(0,r.mdx)("a",{parentName:"p",href:"/docs/concepts/glossary#target"},"target")," can reference another target in its ",(0,r.mdx)("a",{parentName:"p",href:"/docs/concepts/glossary#attribute"},"attributes"),'. In a large project, you may want to prevent developers from "reaching across" the project and pulling in additional code. Reducing the visibility of targets can help prevent that type of behavior.'),(0,r.mdx)("p",null,"There are two types of visibility attributes available, each of which takes a list of ",(0,r.mdx)("a",{parentName:"p",href:"/docs/concepts/glossary#target-pattern"},"target patterns"),": ",(0,r.mdx)("inlineCode",{parentName:"p"},"visibility"),", which determines what other targets can depend on a target, and ",(0,r.mdx)("inlineCode",{parentName:"p"},"within_view"),", which determines what other targets a target can depend on."),(0,r.mdx)("p",null,"Both attributes act as allowlists, with some exceptions. In general, if a target is not listed, there may be no dependency relationship. If the ",(0,r.mdx)("inlineCode",{parentName:"p"},"within_view")," list is empty or unset, however, its check is bypassed. Similarly, targets defined in the same ",(0,r.mdx)("a",{parentName:"p",href:"/docs/concepts/glossary#build-file"},"build file")," always act as if they were members of their siblings' ",(0,r.mdx)("inlineCode",{parentName:"p"},"visibility")," lists."),(0,r.mdx)("p",null,"There is also a special value for ",(0,r.mdx)("inlineCode",{parentName:"p"},"visibility")," attribute: ",(0,r.mdx)("inlineCode",{parentName:"p"},"'PUBLIC'"),", which makes a build rule visible to all targets."),(0,r.mdx)("p",null,"In case of logically-conflicting lists, ",(0,r.mdx)("inlineCode",{parentName:"p"},"within_view")," takes precedence over ",(0,r.mdx)("inlineCode",{parentName:"p"},"visibility"),". If ",(0,r.mdx)("inlineCode",{parentName:"p"},"//foo:bar")," defines ",(0,r.mdx)("inlineCode",{parentName:"p"},"//hello:world")," in its ",(0,r.mdx)("inlineCode",{parentName:"p"},"visibility")," list, but ",(0,r.mdx)("inlineCode",{parentName:"p"},"//hello:world")," does not define ",(0,r.mdx)("inlineCode",{parentName:"p"},"//foo:bar")," in its ",(0,r.mdx)("inlineCode",{parentName:"p"},"within_view")," list, then ",(0,r.mdx)("inlineCode",{parentName:"p"},"//hello:world")," may not depend on ",(0,r.mdx)("inlineCode",{parentName:"p"},"//foo:bar"),"."),(0,r.mdx)("h2",{id:"examples"},"Examples"),(0,r.mdx)("p",null,"A common library like Guava should be able to be included by any build rule:"),(0,r.mdx)("pre",null,(0,r.mdx)("code",{parentName:"pre"},"prebuilt_jar(\n  name = 'guava',\n  binary_jar = 'guava-14.0.1.jar',\n  visibility = ['PUBLIC']\n)\n")),(0,r.mdx)("p",null,"It is common to restrict the visibility of Android resources to the Java code that uses it:"),(0,r.mdx)("pre",null,(0,r.mdx)("code",{parentName:"pre"},"android_resource(\n  name = 'ui_res',\n  res = 'res',\n  package = 'com.example',\n  visibility = ['//java/com/example/ui:ui']\n)\n")),(0,r.mdx)("p",null,"Or it may be simpler to make it visible to the entire directory in case additional build rules are added to ",(0,r.mdx)("inlineCode",{parentName:"p"},"java/com/example/ui/BUCK"),":"),(0,r.mdx)("pre",null,(0,r.mdx)("code",{parentName:"pre"},"android_resource(\n  name = 'ui_res',\n  res = 'res',\n  package = 'com.example',\n  visibility = ['//java/com/example/ui:']\n)\n")),(0,r.mdx)("p",null,"Also, it is common to limit code for testing to be visible only to tests. If you define all of your Java unit tests in a folder named ",(0,r.mdx)("inlineCode",{parentName:"p"},"javatests/")," in the root of your project, then you could define the following rule to ensure that only allow build rules under ",(0,r.mdx)("inlineCode",{parentName:"p"},"javatests/")," can depend on JUnit:"),(0,r.mdx)("pre",null,(0,r.mdx)("code",{parentName:"pre"},"prebuilt_jar(\n  name = 'junit',\n  binary_jar = 'junit-4.11.jar',\n  visibility = ['//javatests/...']\n)\n")),(0,r.mdx)("p",null,"Finally, restricting the view of a target can be useful for preventing dependency creep:"),(0,r.mdx)("pre",null,(0,r.mdx)("code",{parentName:"pre"},"java_library(\n  name = 'example',\n  visibility = ['PUBLIC',],\n  within_view = ['//foo:bar','//hello:world']\n)\n")))}d.isMDXComponent=!0}}]);