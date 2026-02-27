# 部署配置 (DevOps)

本目录存放与部署相关的配置，便于与业务代码分离管理。

## 目录说明

- **nginx/**：Nginx 配置（可选，用于生产环境反向代理前端静态资源与 API）
- **env/**：各环境 `.env` 示例或模板（可选）

## 使用根目录编排

生产或测试环境建议使用项目根目录的 `docker-compose.yaml` 一键启动：

```bash
# 在 qa-admin 根目录
docker-compose up -d
```

后端首次启动后需执行数据库迁移与种子数据（见根目录 `README.md` 或 `deploy.sh`）。
