## React16 + mobx + koa 前后端同构（SSR）

开发模式，前后端同步热重载
```cmd
yarn dev:client
yarn dev:server
```

生产打包
```cmd
yarn build

# 单独打包前端代码
yarn build:client
# 打包后端代码
yarn build:server

# 启动后端程序
yarn start
```

* 开发模式下前后端同构，HMR
* Mobx状态前后端同步
* SEO增强
