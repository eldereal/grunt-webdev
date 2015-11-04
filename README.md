
前端自动构建系统
===

本系统主要功能是自动构建前端代码，包括HTML、样式表、脚本与其他资源。本系统将前端的开发代码和网页服务器使用的代码分离，提供一系列构建模式。在方便开发的前提下，增加前端代码的质量。

本系统以一个网页为一个构建的单位。在这个系统里，将一个网页称作一个app，它可以包含一个主网页，以及许多资源文件，比如脚本、样式表、图片、字体等。

系统功能
---

1. 相对路径自动转换：开发的时候，所有资源都使用相对路径引用，这样的好处是可以方便的移动代码，而且不需要关注服务器端文件结构。

2. js文件的合并：我建议大家在开发的时候，把功能尽量分成小块代码。可重用的部分放在`dev/common/js`中，没什么重用价值的就放在每个页面自身的目录下。这样带来一个问题就是一个页面js会非常多，像试题编辑这种复杂页面，会有几十个js。build系统可以自动将这些js合并成一个文件，使加载的速度增加。

3. 管理中间文件：build系统中增加了对sass样式表的支持。可以自动将其编译成css文件再合并。虽然现在不支持，但是可以很快增加对less、coffeescript等文件的支持。

4. 管理资源文件：sass和css文件中引用的图像（仅限相对路径）会自动被放到合适的地方。

5. 压缩文件：build系统有不同的build方式，如果使用release或publish，js、css、angular模板文件会被自动压缩。

6. 上传静态文件到CDN：使用publish方式构建的时候，会把静态资源文件(js、css、图像、字体等)上传到阿里云oss服务，以加速页面访问。

7. 测试框架：你需要编写测试case，build系统就会自动添加依赖的文件（文件中引用到的所有js文件）。我们使用karma作为测试框架。

前端项目目录结构
---
为了使用前端构建系统，建议构造如下的目录结构
```
ROOT
|- Gruntfile.js //引用构建系统，配置app
|- package.json //node依赖项管理
|- bower.json //js模块依赖项管理
|- app //app根目录
    |- app1
    |   |- main.html //主html
    |   |- js        //脚本
    |   |   |- ...
    |   |- css       //样式表
    |   |   |- ...
    |   |- sass      //sass样式表
    |   |   |- ...
    |   |- template  //angular模板   
    |- ... //其它app     
```
其中app目录包含了所有网页，每一个子目录是一个独立的构建单元。

使用方法
---
###App主网页
为了使用build系统，你需要在引用样式表或脚本时添加一个特殊标记，如下所示：

    <!-- build:compass /static/build/css/angular-example.compass.css -->
    <link href="sass/main.scss" rel="stylesheet" type="text/sass" />
    <!-- endbuild -->


`build:compass`说明这一段使用compass文件处理器去处理，除了comapss，目前还有css、js、ngtemplate几种。后面跟的就是一个绝对地址，从build到endbuild之间所有的link或script标记会被合成一个文件，放在指定的地址上。

其它的资源都在主网页中通过相对地址引用。如果该页面是一个纯本地页面，不需要访问API，应该可以直接在浏览器中打开，所有资源路径都应该是正确的。

###Gruntfile.js
该文件中配置了app的路径，以及其它运行的必要参数。

```js
{
    //阿里云OSS的配置，用于上传静态文件
    ossconfig: {
        accessKeyId: "...",
        accessKeySecret: "...",
        bucket: "bucket-name",
        region: "oss-cn-hangzhou",
        url: "//bucket-name.oss-cn-hangzhou.aliyuncs.com/"
    },
    app: {
        options: {
            //静态文件生成的根目录
            resourcePath: '<%= path.serverPath %>',
        },
        'app1': {
            //与key相同
            name: 'app1',
            //HTML源文件位置
            src: 'app/app1/main.html',
            //生成的HTML放在哪
            dest: '<%= path.templatePath %>/base_template.html'
        },
    },
    useminConfig: {
        options: {
            oss: {
                //引用OSS配置
                options: {      
                    accessKeyId: "<%= ossconfig.accessKeyId %>",
                    accessKeySecret: "<%= ossconfig.accessKeySecret %>",
                    bucket: "<%= ossconfig.bucket %>",
                    region: "<%= ossconfig.bucket %>",
                    url: "<%= ossconfig.url %>"
                }
            },
            karma: {
                options: {
                    //测试时要添加的额外文件
                    files: [...]
                }
            }
        },
    },
    oss: {
        //引用OSS配置
        options: {      
            accessKeyId: "<%= ossconfig.accessKeyId %>",
            accessKeySecret: "<%= ossconfig.accessKeySecret %>",
            bucket: "<%= ossconfig.bucket %>",
            region: "<%= ossconfig.bucket %>",
            url: "<%= ossconfig.url %>"
        }
    }
}
```

###命令行使用方式

该系统有三种构建模式：

* `dev` 代码未压缩未混淆，会自动启动开发服务器，监控代码修改并重新构建。
* `release` 代码已压缩与混淆，会自动启动开发服务器，监控代码修改并重新构建。
* `publish` 代码已压缩与混淆，资源链接会替换成OSS链接。

可以使用命令：`grunt dev`、`grunt release`、`grunt publish`来启动每一种构建模式。
每一种命令都可以指定具体的app，例如`grunt dev:angular-example`只会生成angular-example这一个app。这种方式在开发一个app时非常有用。

在`dev`或`release`模式下，系统会自动启动服务器，并且监控代码修改。每当相关代码发生变化，就会重启构建过程。这样可以在开发过程中使生成代码一直与开发代码保持一致。

还有一个重要的命令`upload`，这个命令可以配合`publish`命令来使用，在`publish`模式中，生成的文件已经为上传准备好，但是还没上传，此时只要运行`upload`命令就可以上传文件。

常用命令：
`grunt dev:app-example` 开发app-example页面时使用
`grunt dev` 重新构建全部页面
`grunt release:app-example` 测试在代码压缩模式下页面是否有问题。有的时候代码混淆的步骤会引入错误，此时你需要修复此问题，或者禁用代码混淆（在`<script>`标记上写上`no-compress`属性）。
`grunt publish upload`生成发布版本并上传到OSS。

> 一个常见的问题是Angular的Injector如果接受一个函数，会解析函数的参数名，作为依赖的模块名字。
> 例如`angular.module('...').factory('name', function ($scope){})`，此时`$scope`会在压缩时变成别的名字，就会出错。解决方法是使用数组型的依赖，将上述代码变成`angular.module('...').factory('name', ['$scope', function ($scope){}])`可以解决这个问题。
