# blogDyu
##    整体结构
###   *  用户发送http请求 => 访问url => 解析路由 => 找到匹配的规则 =>执行指定的绑定函数，返回对应的内容至客户端（用户）
###   *  如果访问的是public开头的 => 静态 => 直接读取指定目录下的文件,返回给用户     （静态）
###   *  其他 => 动态 => 处理业务逻辑，加载模板，解析模板 => 返回数据给用户          （动态）
###   




##文件目录
###db             数据库存储目录
###models         数据库模型文件目录
###node_modules   node第三方模块目录
###public         公共文件目录
###routers        文件路由
###schemas        数据库结构文件目录
###views          页面
###app.js         入口文件
###package.json        

