# whistle.FPlug
whistle插件，提供vConsole注入、禁止缓存、console日志、JS注入（[Fiddler版FPlug](https://github.com/Ke1992/Fiddler-FPlug)）
# 版本
v1.1.0
# 安装
## 安装whistle
请参考：[https://github.com/avwo/whistle#whistle](https://github.com/avwo/whistle#whistle)  
## 安装FPlug
```
$ npm install -g whistle.fplug
```
# 特性
* vConsole注入
* 禁止缓存
* console日志
* JS注入
* 文件映射
# 基础配置说明
## 插件启用/关闭
<img src="https://raw.githubusercontent.com/Ke1992/whistle.FPlug/master/docs/assets/switch.gif" width="800" alt="插件启用/关闭" />

# 特性功能说明
## vConsole注入
开启后，会往Content-Type包含text/html，并且，包含&lt;html&gt;或者&lt;html 的请求中注入vConsole  
<img src="https://raw.githubusercontent.com/Ke1992/whistle.FPlug/master/docs/assets/vconsole.gif" width="800" alt="vConsole" />

## 禁止缓存
开启后会主动修改Request和Response头的相关字段，来禁止缓存  
#### Request头：  
* 删除Expires
* 删除If-None-Match
* 删除If-Modified-Since
* 强制修改Pragma为no-cache
* 强制修改Cache-Control为no-cache
#### Response头：  
* 删除Expires
* 强制修改Pragma为no-cache
* 强制修改Cache-Control为no-cache

<img src="https://raw.githubusercontent.com/Ke1992/whistle.FPlug/master/docs/assets/cache.gif" width="800" alt="禁止缓存" />

## console日志
1、开启后会主动往网页中注入JS脚本，修改console方法，捕获日志后发起POST请求  
2、日志输出的顺序请以序号为准  
3、开启后需要重新刷新已经打开的页面才能捕获日志  
4、仅会往Content-Type包含text/html，并且，包含&lt;html&gt;或者&lt;html 的请求中注入脚本  
<img src="https://raw.githubusercontent.com/Ke1992/whistle.FPlug/master/docs/assets/console.gif" width="800" alt="console" />

## JS注入
1、开启后，在输入框中键入JavaScript脚本，然后点击发送，会主动向代理中的网页注入对应的脚本  
2、开启后需要重新刷新已经打开的页面才能捕获日志  
3、仅对Content-Type包含text/html，并且，包含&lt;html&gt;或者&lt;html 的请求有效  
4、会每隔2S请求一次 www.example.com，请忽略！！！  
<img src="https://raw.githubusercontent.com/Ke1992/whistle.FPlug/master/docs/assets/invade.gif" width="800" alt="js注入" />

## 文件映射
1、如果URL中携带callback或者cb，会自动替换文件里面第一个callback字符串  
2、如果URL中携带callback或者cb，并且本地文件内容为JSON数据，则会自动包裹一层callback  
<img src="https://raw.githubusercontent.com/Ke1992/whistle.FPlug/master/docs/assets/file.gif" width="800" alt="文件映射" />
