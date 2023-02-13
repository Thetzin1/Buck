"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[8127],{3905:(e,n,t)=>{t.r(n),t.d(n,{MDXContext:()=>s,MDXProvider:()=>p,mdx:()=>b,useMDXComponents:()=>u,withMDXComponents:()=>m});var a=t(67294);function i(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function o(){return o=Object.assign||function(e){for(var n=1;n<arguments.length;n++){var t=arguments[n];for(var a in t)Object.prototype.hasOwnProperty.call(t,a)&&(e[a]=t[a])}return e},o.apply(this,arguments)}function r(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);n&&(a=a.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,a)}return t}function l(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?r(Object(t),!0).forEach((function(n){i(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):r(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function d(e,n){if(null==e)return{};var t,a,i=function(e,n){if(null==e)return{};var t,a,i={},o=Object.keys(e);for(a=0;a<o.length;a++)t=o[a],n.indexOf(t)>=0||(i[t]=e[t]);return i}(e,n);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(a=0;a<o.length;a++)t=o[a],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(i[t]=e[t])}return i}var s=a.createContext({}),m=function(e){return function(n){var t=u(n.components);return a.createElement(e,o({},n,{components:t}))}},u=function(e){var n=a.useContext(s),t=n;return e&&(t="function"==typeof e?e(n):l(l({},n),e)),t},p=function(e){var n=u(e.components);return a.createElement(s.Provider,{value:n},e.children)},c="mdxType",h={inlineCode:"code",wrapper:function(e){var n=e.children;return a.createElement(a.Fragment,{},n)}},f=a.forwardRef((function(e,n){var t=e.components,i=e.mdxType,o=e.originalType,r=e.parentName,s=d(e,["components","mdxType","originalType","parentName"]),m=u(t),p=i,c=m["".concat(r,".").concat(p)]||m[p]||h[p]||o;return t?a.createElement(c,l(l({ref:n},s),{},{components:t})):a.createElement(c,l({ref:n},s))}));function b(e,n){var t=arguments,i=n&&n.mdxType;if("string"==typeof e||i){var o=t.length,r=new Array(o);r[0]=f;var l={};for(var d in n)hasOwnProperty.call(n,d)&&(l[d]=n[d]);l.originalType=e,l[c]="string"==typeof e?e:i,r[1]=l;for(var s=2;s<o;s++)r[s]=t[s];return a.createElement.apply(null,r)}return a.createElement.apply(null,t)}f.displayName="MDXCreateElement"},9888:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>d,contentTitle:()=>r,default:()=>u,frontMatter:()=>o,metadata:()=>l,toc:()=>s});var a=t(87462),i=(t(67294),t(3905));const o={},r="Getting Started",l={unversionedId:"legacy/basics/getting-started",id:"legacy/basics/getting-started",title:"Getting Started",description:"Note: If you are a member of an organization that is using Buck, please consult with your colleagues to see if your organization has site-specific documentation for Buck. Buck is flexible and configurable, and many organizations have created their own Buck documentation, which is specific to their use cases\u2014in addition to the documentation here.",source:"@site/../docs/legacy/basics/getting-started.md",sourceDirName:"legacy/basics",slug:"/legacy/basics/getting-started",permalink:"/docs/legacy/basics/getting-started",draft:!1,tags:[],version:"current",frontMatter:{}},d={},s=[{value:"Quick Starts for various target platforms",id:"quick-starts-for-various-target-platforms",level:2},{value:"Install with Homebrew",id:"install-with-homebrew",level:2},{value:"Prerequisites",id:"prerequisites",level:3},{value:"Brew install",id:"brew-install",level:3},{value:"Build from Source",id:"build-from-source",level:2},{value:"Prerequisites",id:"prerequisites-1",level:3},{value:"Build",id:"build",level:3},{value:"Set Location of Android SDK and NDK",id:"set-location-of-android-sdk-and-ndk",level:3},{value:"Trying Buck",id:"trying-buck",level:2},{value:"Clone Buck samples repo",id:"clone-buck-samples-repo",level:3},{value:"Key Android Files",id:"key-android-files",level:3},{value:"Configure the environment",id:"configure-the-environment",level:3},{value:"Build the Android sample",id:"build-the-android-sample",level:3},{value:"Run the built Android App",id:"run-the-built-android-app",level:3},{value:"Success!",id:"success",level:3}],m={toc:s};function u(e){let{components:n,...t}=e;return(0,i.mdx)("wrapper",(0,a.Z)({},m,t,{components:n,mdxType:"MDXLayout"}),(0,i.mdx)("h1",{id:"getting-started"},"Getting Started"),(0,i.mdx)("p",null,(0,i.mdx)("strong",{parentName:"p"},"Note:")," If you are a member of an organization that is using Buck, please consult with your colleagues to see if your organization has ",(0,i.mdx)("em",{parentName:"p"},"site-specific documentation")," for Buck. Buck is flexible and configurable, and many organizations have created their own Buck documentation, which is specific to their use cases\u2014in addition to the documentation here."),(0,i.mdx)("h2",{id:"quick-starts-for-various-target-platforms"},"Quick Starts for various target platforms"),(0,i.mdx)("table",null,(0,i.mdx)("thead",{parentName:"table"},(0,i.mdx)("tr",{parentName:"thead"},(0,i.mdx)("th",{parentName:"tr",align:null},(0,i.mdx)("strong",{parentName:"th"},"Platform:")),(0,i.mdx)("th",{parentName:"tr",align:null},"AndroidiOSJavaOther"))),(0,i.mdx)("tbody",{parentName:"table"},(0,i.mdx)("tr",{parentName:"tbody"},(0,i.mdx)("td",{parentName:"tr",align:null},(0,i.mdx)("strong",{parentName:"td"},"Development OS:")),(0,i.mdx)("td",{parentName:"tr",align:null},"macOSLinuxWindows")))),(0,i.mdx)("blockquote",null,(0,i.mdx)("p",{parentName:"blockquote"},"While not a prerequisite for installing Buck itself, to build Android applications, you will also need at least the ",(0,i.mdx)("a",{parentName:"p",href:"https://developer.android.com/studio/index.html"},"Android SDK")," and the ",(0,i.mdx)("a",{parentName:"p",href:"https://developer.android.com/ndk/index.html"},"Android NDK"),", which can be installed via ",(0,i.mdx)("a",{parentName:"p",href:"http://brewformulas.org/Android-sdk"},"Homebrew")," or manually downloaded and installed.")),(0,i.mdx)("p",null,"The commands in this guide are designed to be copy-pasteable, idempotent, and usable on its representative operating system (macOS, Linux, Windows). Sometimes this results in some unusual constructions (such as using ",(0,i.mdx)("inlineCode",{parentName:"p"},"echo")," instead of ",(0,i.mdx)("inlineCode",{parentName:"p"},"vi")," or ",(0,i.mdx)("inlineCode",{parentName:"p"},"Emacs")," to create a file). Bear in mind that this is a ",(0,i.mdx)("em",{parentName:"p"},"quick")," start guide, and few things are quicker than copy-and-paste!"),(0,i.mdx)("h2",{id:"install-with-homebrew"},"Install with Homebrew"),(0,i.mdx)("p",null,"Buck is available as a bottle on ",(0,i.mdx)("a",{parentName:"p",href:"http://brew.sh/"},"Homebrew"),"."),(0,i.mdx)("h3",{id:"prerequisites"},"Prerequisites"),(0,i.mdx)("ul",null,(0,i.mdx)("li",{parentName:"ul"},(0,i.mdx)("a",{parentName:"li",href:"https://developer.apple.com/xcode/features/"},"Command Line Tools")),(0,i.mdx)("li",{parentName:"ul"},(0,i.mdx)("a",{parentName:"li",href:"https://java.com/en/download/"},"Java Runtime Environment version 11")," (support for future versions is in the works)\nIf you have multiple installations of Java on your development computer, you might get warnings from Buck that you are using an unsupported version of Java. To resolve this issue, set the ",(0,i.mdx)("inlineCode",{parentName:"li"},"JAVA_HOME")," environment variable to the directory for ",(0,i.mdx)("strong",{parentName:"li"},"version 8")," of the Java Development Kit (JDK). Note that the directory that ",(0,i.mdx)("inlineCode",{parentName:"li"},"JAVA_HOME")," points to should contain a ",(0,i.mdx)("inlineCode",{parentName:"li"},"bin")," subdirectory which in turn contains binaries for the Java compiler (",(0,i.mdx)("inlineCode",{parentName:"li"},"javac"),") and Java runtime (",(0,i.mdx)("inlineCode",{parentName:"li"},"java"),").")),(0,i.mdx)("pre",null,(0,i.mdx)("code",{parentName:"pre"},"# Install command line tools. NOTE: If you have Xcode installed, these may\n# already be installed.\nxcode-select --install\n# Download and Install Java SE 8 from:\n+# https://www.oracle.com/technetwork/java/javase/downloads/index.html.\n+# This installs the JDK 8, a superset of the JRE.\n+# Alternatively, install AdoptOpenJDK 8 with Homebrew:\n+brew tap AdoptOpenJDK/openjdk\n+brew install --cask adoptopenjdk8\n")),(0,i.mdx)("h3",{id:"brew-install"},"Brew install"),(0,i.mdx)("p",null,"You have two choices when using Homebrew. You can choose to get the latest binary ",(0,i.mdx)("a",{parentName:"p",href:"https://github.com/facebook/buck/releases/latest"},"release"),":"),(0,i.mdx)("pre",null,(0,i.mdx)("code",{parentName:"pre"},"brew tap facebook/fb\nbrew install buck\n")),(0,i.mdx)("p",null,"Or, you can get the latest code and build it locally:"),(0,i.mdx)("pre",null,(0,i.mdx)("code",{parentName:"pre"},"brew update\nbrew tap facebook/fb\nbrew install --HEAD buck\n")),(0,i.mdx)("h2",{id:"build-from-source"},"Build from Source"),(0,i.mdx)("h3",{id:"prerequisites-1"},"Prerequisites"),(0,i.mdx)("p",null,"To manually build Buck, download and install the following prerequisites:"),(0,i.mdx)("ul",null,(0,i.mdx)("li",{parentName:"ul"},(0,i.mdx)("a",{parentName:"li",href:"https://developer.apple.com/xcode/features/"},"Command Line Tools")),(0,i.mdx)("li",{parentName:"ul"},(0,i.mdx)("a",{parentName:"li",href:"http://www.oracle.com/technetwork/java/javase/downloads/index.html"},"Oracle Java Development Kit version 8")," (support for future versions is in the works)"),(0,i.mdx)("li",{parentName:"ul"},(0,i.mdx)("a",{parentName:"li",href:"http://ant.apache.org/"},"Apache Ant 1.9 (or newer)")),(0,i.mdx)("li",{parentName:"ul"},(0,i.mdx)("a",{parentName:"li",href:"https://www.python.org/downloads/"},"Python 2.7")),(0,i.mdx)("li",{parentName:"ul"},(0,i.mdx)("a",{parentName:"li",href:"http://git-scm.com/download"},"Git")),(0,i.mdx)("li",{parentName:"ul"},(0,i.mdx)("a",{parentName:"li",href:"https://facebook.github.io/watchman/docs/install"},"Watchman"))),(0,i.mdx)("blockquote",null,(0,i.mdx)("p",{parentName:"blockquote"},"We strongly recommended that you install Watchman. With watchman, Buck uses a daemon (",(0,i.mdx)("a",{parentName:"p",href:"https://buck.build/command/buckd.html"},"buckd"),") which prevents Buck from needing to parse all of your ",(0,i.mdx)("a",{parentName:"p",href:"https://buck.build/concept/build_file.html"},"build files")," every time you build\u2014and it caches some other components of your build as well.")),(0,i.mdx)("p",null,"You can use ",(0,i.mdx)("a",{parentName:"p",href:"http://homebrew.sh/"},"Homebrew")," to install many of the prerequisites on a Mac."),(0,i.mdx)("pre",null,(0,i.mdx)("code",{parentName:"pre"},"# Install Command Line tools first. NOTE: If you have Xcode installed, these may\n# already be installed.\nxcode-select --install\n# Then the JDK (superset of the JRE)\nbrew update\nbrew tap caskroom/cask\nbrew tap caskroom/versions\nbrew cask install java8\n# Then...\nbrew install ant python git watchman\n")),(0,i.mdx)("h3",{id:"build"},"Build"),(0,i.mdx)("p",null,"Once you have the above tools installed, you can build Buck as follows:"),(0,i.mdx)("pre",null,(0,i.mdx)("code",{parentName:"pre"},"git clone https://github.com/facebook/buck.git\ncd buck\nant\n./bin/buck build --show-output buck\nbuck-out/gen/programs/buck.pex --help\n")),(0,i.mdx)("p",null,"If everything worked correctly, you should see something like:"),(0,i.mdx)("pre",null,(0,i.mdx)("code",{parentName:"pre"},"buck build tool\nusage:\n  buck [options]\n  buck command --help\n  buck command [command-options]\navailable commands:\n  audit       lists the inputs for the specified target\n  build       builds the specified target\n  cache       makes calls to the artifact cache\n  clean       deletes any generated files\n  fetch       downloads remote resources to your local machine\n  install     builds and installs an application\n  kill        kill buckd for the current project\n  killall     kill all buckd processes\n  project     generates project configuration files for an IDE\n  query       provides facilities to query information about the configured target nodes graph\n  root        prints the absolute path to the root of the current buck project\n  run         runs a target as a command\n  server      query and control the http server\n  targets     prints the list of buildable targets\n  test        builds and runs the tests for the specified target\n  uninstall   uninstalls an APK\n  uquery      provides facilities to query information about the unconfigured target nodes graph\noptions:\n --help         : Shows this screen and exits.\n --version (-V) : Show version number.\n")),(0,i.mdx)("p",null,"Because you will likely be running ",(0,i.mdx)("inlineCode",{parentName:"p"},"./bin/buck")," often, you should add it to your path so that you can simply run ",(0,i.mdx)("inlineCode",{parentName:"p"},"buck")," from the command line."),(0,i.mdx)("h3",{id:"set-location-of-android-sdk-and-ndk"},"Set Location of Android SDK and NDK"),(0,i.mdx)("p",null,"You will need to tell Buck where to find the Android SDK and NDK.\nTo find the location of the ",(0,i.mdx)("strong",{parentName:"p"},"Android SDK"),", Buck looks at the following values ",(0,i.mdx)("em",{parentName:"p"},"in the following order"),":"),(0,i.mdx)("ul",null,(0,i.mdx)("li",{parentName:"ul"},(0,i.mdx)("inlineCode",{parentName:"li"},"ANDROID_SDK")," environment variable"),(0,i.mdx)("li",{parentName:"ul"},(0,i.mdx)("inlineCode",{parentName:"li"},"ANDROID_HOME")," environment variable"),(0,i.mdx)("li",{parentName:"ul"},(0,i.mdx)("inlineCode",{parentName:"li"},"ANDROID_SDK_ROOT")," environment variable"),(0,i.mdx)("li",{parentName:"ul"},"The value of the ",(0,i.mdx)("a",{parentName:"li",href:"https://buck.build/files-and-dirs/buckconfig.html#android.sdk_path"},(0,i.mdx)("inlineCode",{parentName:"a"},"[android].sdk_path"))," property in ",(0,i.mdx)("inlineCode",{parentName:"li"},".buckconfig"),".")),(0,i.mdx)("p",null,"To find the location of a specific ",(0,i.mdx)("strong",{parentName:"p"},"NDK"),", Buck looks at the following values ",(0,i.mdx)("em",{parentName:"p"},"in the following order"),":"),(0,i.mdx)("ul",null,(0,i.mdx)("li",{parentName:"ul"},(0,i.mdx)("inlineCode",{parentName:"li"},"ANDROID_NDK")," environment variable."),(0,i.mdx)("li",{parentName:"ul"},(0,i.mdx)("inlineCode",{parentName:"li"},"NDK_HOME")," environment variable."),(0,i.mdx)("li",{parentName:"ul"},"The value of the ",(0,i.mdx)("a",{parentName:"li",href:"https://buck.build/files-and-dirs/buckconfig.html#ndk.ndk_path"},(0,i.mdx)("inlineCode",{parentName:"a"},"[ndk].ndk_path"))," property in ",(0,i.mdx)("inlineCode",{parentName:"li"},".buckconfig"),".")),(0,i.mdx)("p",null,"If you have ",(0,i.mdx)("strong",{parentName:"p"},"multiple NDKs")," installed into a single enclosing directory, you can specify this directory to Buck using either of the following values:"),(0,i.mdx)("ul",null,(0,i.mdx)("li",{parentName:"ul"},(0,i.mdx)("inlineCode",{parentName:"li"},"ANDROID_NDK_REPOSITORY")," environment variable."),(0,i.mdx)("li",{parentName:"ul"},"The ",(0,i.mdx)("a",{parentName:"li",href:"https://buck.build/files-and-dirs/buckconfig.html#ndk.ndk_repository_path"},(0,i.mdx)("inlineCode",{parentName:"a"},"[ndk].ndk_repository_path"))," property in ",(0,i.mdx)("inlineCode",{parentName:"li"},".buckconfig"),".")),(0,i.mdx)("p",null,"If you specify ",(0,i.mdx)("em",{parentName:"p"},"both")," the environment variable and the ",(0,i.mdx)("inlineCode",{parentName:"p"},".buckconfig")," setting, the environment variable takes precedence.\nIf you specify an NDK repository, Buck selects the NDK based on the version that you specify in the ",(0,i.mdx)("a",{parentName:"p",href:"https://buck.build/files-and-dirs/buckconfig.html#ndk.ndk_version"},(0,i.mdx)("inlineCode",{parentName:"a"},"[ndk].ndk_version"))," property of ",(0,i.mdx)("inlineCode",{parentName:"p"},".buckconfig"),"."),(0,i.mdx)("h2",{id:"trying-buck"},"Trying Buck"),(0,i.mdx)("p",null,"Now that Buck is installed, it is time to use Buck in a sample project."),(0,i.mdx)("h3",{id:"clone-buck-samples-repo"},"Clone ",(0,i.mdx)("a",{parentName:"h3",href:"https://github.com/fbsamples/bucksamples/"},"Buck samples repo")),(0,i.mdx)("pre",null,(0,i.mdx)("code",{parentName:"pre"},"git clone https://github.com/fbsamples/bucksamples.git\ncd bucksamples/cross-platform-scale-2015-demo/\n")),(0,i.mdx)("h3",{id:"key-android-files"},"Key Android Files"),(0,i.mdx)("p",null,"This sample app has all the files necessary to use Buck to build an Android project. From the root directory, you will find:"),(0,i.mdx)("ul",null,(0,i.mdx)("li",{parentName:"ul"},(0,i.mdx)("inlineCode",{parentName:"li"},"android/java/com/facebook/buck/demo/Hello.java"),": The main Java file supported by other associated resources."),(0,i.mdx)("li",{parentName:"ul"},(0,i.mdx)("inlineCode",{parentName:"li"},"android/BUCK"),": The ",(0,i.mdx)("a",{parentName:"li",href:"https://buck.build/concept/build_file.html"},"build file")," is what makes Buck work. It defines all the ",(0,i.mdx)("a",{parentName:"li",href:"https://buck.build/concept/build_rule.html"},"build rule"),"s for your source code. A ",(0,i.mdx)("a",{parentName:"li",href:"https://buck.build/concept/build_rule.html"},"build rule")," can also include dependencies (generally via ",(0,i.mdx)("inlineCode",{parentName:"li"},"deps"),"), which may be from other ",(0,i.mdx)("a",{parentName:"li",href:"https://buck.build/concept/build_file.html"},"build file"),"s, as in the case of this app."),(0,i.mdx)("li",{parentName:"ul"},(0,i.mdx)("inlineCode",{parentName:"li"},".buckconfig"),": A ",(0,i.mdx)("a",{parentName:"li",href:"https://buck.build/files-and-dirs/buckconfig.html"},(0,i.mdx)("inlineCode",{parentName:"a"},".buckconfig"))," file allows for various flag and alias settings for any project (even beyond Android) within the root directory.")),(0,i.mdx)("h3",{id:"configure-the-environment"},"Configure the environment"),(0,i.mdx)("p",null,"Before building an app you need to configure environment variables to let Buck know the locations of Android SDK and Android NDK.\nFirst of all, check for existing variables:"),(0,i.mdx)("pre",null,(0,i.mdx)("code",{parentName:"pre"},"$ env | grep ANDROID_\nANDROID_HOME=<path-to-sdk>\nANDROID_NDK_REPOSITORY=<path-to-ndk>\nANDROID_SDK=<path-to-sdk>\nANDROID_SDK_ROOT=<path-to-sdk>\n")),(0,i.mdx)("p",null,"Set the missing variables to the locations of Android SDK and Android NDK or set the paths in your ",(0,i.mdx)("a",{parentName:"p",href:"https://buck.build/files-and-dirs/buckconfig.html"},(0,i.mdx)("inlineCode",{parentName:"a"},".buckconfig"))," file.\nBefore building make sure you installed correct build tools and a target in Android SDK and correct version of Android NDK. You can find the required versions of these tools in ",(0,i.mdx)("a",{parentName:"p",href:"https://buck.build/files-and-dirs/buckconfig.html"},(0,i.mdx)("inlineCode",{parentName:"a"},".buckconfig")),":"),(0,i.mdx)("ul",null,(0,i.mdx)("li",{parentName:"ul"},"See ",(0,i.mdx)("a",{parentName:"li",href:"https://buck.build/files-and-dirs/buckconfig.html#android.build_tools_version"},(0,i.mdx)("inlineCode",{parentName:"a"},"[android].build_tools_version"))," to get the version of build tools in Android SDK."),(0,i.mdx)("li",{parentName:"ul"},(0,i.mdx)("a",{parentName:"li",href:"https://buck.build/files-and-dirs/buckconfig.html#android.compile_sdk_version"},(0,i.mdx)("inlineCode",{parentName:"a"},"[android].compile_sdk_version"))," points to the Android SDK to build against."),(0,i.mdx)("li",{parentName:"ul"},(0,i.mdx)("a",{parentName:"li",href:"https://buck.build/files-and-dirs/buckconfig.html#ndk.ndk_version"},(0,i.mdx)("inlineCode",{parentName:"a"},"[ndk].ndk_version"))," points to the version of Android NDK.")),(0,i.mdx)("p",null,"Optionally:"),(0,i.mdx)("ul",null,(0,i.mdx)("li",{parentName:"ul"},(0,i.mdx)("a",{parentName:"li",href:"https://buck.build/files-and-dirs/buckconfig.html#android.sdk_path"},(0,i.mdx)("inlineCode",{parentName:"a"},"[android].sdk_path"))," is an absolute path to the Android SDK."),(0,i.mdx)("li",{parentName:"ul"},(0,i.mdx)("a",{parentName:"li",href:"https://buck.build/files-and-dirs/buckconfig.html#ndk.ndk_path"},(0,i.mdx)("inlineCode",{parentName:"a"},"[ndk].ndk_path"))," is an absolute path to the Android NDK."),(0,i.mdx)("li",{parentName:"ul"},(0,i.mdx)("a",{parentName:"li",href:"https://buck.build/files-and-dirs/buckconfig.html#ndk.ndk_repository_path"},(0,i.mdx)("inlineCode",{parentName:"a"},"[ndk].ndk_repository_path"))," is an absolute path to a directory that contains multiple Android NDKs in subdirectories. Buck selects which NDK to use based on the value of the ",(0,i.mdx)("a",{parentName:"li",href:"https://buck.build/files-and-dirs/buckconfig.html#ndk.ndk_version"},(0,i.mdx)("inlineCode",{parentName:"a"},"[ndk].ndk_version"))," property in ",(0,i.mdx)("inlineCode",{parentName:"li"},".buckconfig"),".")),(0,i.mdx)("h3",{id:"build-the-android-sample"},"Build the Android sample"),(0,i.mdx)("p",null,"In order to build the app, you use the ",(0,i.mdx)("a",{parentName:"p",href:"https://buck.build/command/build.html"},(0,i.mdx)("inlineCode",{parentName:"a"},"buck build")),"command, specifying your app as the target. The target may be defined in the ",(0,i.mdx)("a",{parentName:"p",href:"https://buck.build/files-and-dirs/buckconfig.html#alias"},(0,i.mdx)("inlineCode",{parentName:"a"},"[alias]"))," section in the ",(0,i.mdx)("a",{parentName:"p",href:"https://buck.build/files-and-dirs/buckconfig.html"},(0,i.mdx)("inlineCode",{parentName:"a"},".buckconfig"))," file or it would be the name of your Android project prepended by ",(0,i.mdx)("inlineCode",{parentName:"p"},"//[the directory where your project is located]:")," (e.g., ",(0,i.mdx)("inlineCode",{parentName:"p"},"//android:demo-app"),")."),(0,i.mdx)("pre",null,(0,i.mdx)("code",{parentName:"pre"},"# From the root `cross-platform-scale-2015-demo/` directory\n# demo_app_android is an alias in .buckconfig for //android:demo-app. Either works.\nbuck build demo_app_android\n")),(0,i.mdx)("p",null,"You should see output similar to:"),(0,i.mdx)("pre",null,(0,i.mdx)("code",{parentName:"pre"},"export ANDROID_NDK=$HOME/android-sdk\nbuck build demo_app_android\n[-] PROCESSING BUCK FILES...FINISHED 0.0s [100%]\n[-] DOWNLOADING... (0.00 B/S AVG, TOTAL: 0.00 B, 0 Artifacts)\n[-] BUILDING...FINISHED 0.7s [100%] (1/1 JOBS, 0 UPDATED, 0 [0.0%] CACHE MISS)\n")),(0,i.mdx)("blockquote",null,(0,i.mdx)("p",{parentName:"blockquote"},"The first time you build, you will most likely see a longer time and cache misses. Subsequent builds should be much faster, with minimal cache misses.")),(0,i.mdx)("p",null,"Buck outputs its results in the ",(0,i.mdx)("inlineCode",{parentName:"p"},"buck-out/")," directory."),(0,i.mdx)("h3",{id:"run-the-built-android-app"},"Run the built Android App"),(0,i.mdx)("p",null,"Now that you know your app has built successfully, you can install and run the app with ",(0,i.mdx)("a",{parentName:"p",href:"https://buck.build/command/install.html"},(0,i.mdx)("inlineCode",{parentName:"a"},"buck install")),". This command both compiles and installs the application on the Android emulator. Using the ",(0,i.mdx)("inlineCode",{parentName:"p"},"--run")," flag will launch the emulator as well."),(0,i.mdx)("pre",null,(0,i.mdx)("code",{parentName:"pre"},"buck install --run demo_app_android\nInstalling apk on emulator-5554 (android-emulator).\n[-] PROCESSING BUCK FILES...FINISHED 0.1s [100%]\n[-] DOWNLOADING... (0.00 B/S AVG, TOTAL: 0.00 B, 0 Artifacts)\n[-] BUILDING...FINISHED 0.8s [100%] (1/1 JOBS, 0 UPDATED, 0 [0.0%] CACHE MISS)\n[+] INSTALLING...0.9s\nSuccessfully ran install apk //android:demo-app on 1 device(s)\nStarting activity com.facebook.buck.demo/.App...\nSuccessfully ran start activity on 1 device(s)\n")),(0,i.mdx)("blockquote",null,(0,i.mdx)("p",{parentName:"blockquote"},"If you get an error either that you do not have certain Android add-ons (e.g., Google APIs) or that there is no emulator to run, you should launch the Android SDK Manager (e.g., ",(0,i.mdx)("inlineCode",{parentName:"p"},"android sdk"),") and install the appropriate packages and/or run your emulator (usually found under ",(0,i.mdx)("inlineCode",{parentName:"p"},"Tools | Manage AVDs"),").")),(0,i.mdx)("h3",{id:"success"},"Success!"),(0,i.mdx)("p",null,"If all goes well, you should see something similar to:"))}u.isMDXComponent=!0}}]);