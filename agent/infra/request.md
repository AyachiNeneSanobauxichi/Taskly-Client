# request

## v1

- 网络请求地址为 http://localhost:3000
- 每个请求都有前缀 api

## v2

- 登录安全相关的改动
- 传 X-Client-Type 一个请求头 web 告诉后端是 web 登录
- withCredentials: true
- accessToken 存内存 + 塞 Authorization 头
- refresh 时请求空 body，cookie 自动带
- 启动时静默 refresh 一次恢复登录态
