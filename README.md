![哥玛兽](./gomamon.jpg)

# gomamon

Transform Markdown(and other static files with transformers) into a SPA website using React.

# 在线演示

[demo](https://gomamon.tiyee.com.cn)

## 动机

gomamon 是我在微博开发微博新鲜事项目的时候，为了解决跟前端或客户端沟通问题而开发的一个小工具，当时主要的诉求有几点

- 可以离线用客户端工具书写
- 速度快，不卡顿
- 可以追溯所有的变化

但是当时找了所有的工具，基本不符合上诉三条，一般都需要在线书写，所以决定自己造一个。第一版是用 Python 实现的，但是后来考虑到依赖越少越好，所以改成 shell 了。

## 使用方法

1. `git clone git@github.com:tiyee/gomamon.git`
2. cd gomamon
3. sh ./build
4. 将 nginx 的根目录指向 gomamon
5. md 文档放在 docs 目录

## 注意事项

1. 请参考 docs 里的文件书写，因为在拆分接口的时候，是按 h2 拆的，所以一定要有 h2 标签。
2. h2 下面的那四项一定要有，格式一定要与 demo 里的一摸一样
3. 安全考虑，请在内网使用，使用私有仓库
4. 修改文档后，需要重新执行 sh ./build.sh
5. 配合 git hooks 使用效果更佳

## feature

1. 搜索
2. 直接在页面查看接口的变化
3. 如果你有任何疑问，请提 issue
