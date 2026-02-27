#!/usr/bin/env bash
# QA Admin 一键部署脚本（在 qa-admin 根目录执行）
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "[deploy] 检查 backend/.env ..."
if [ ! -f backend/.env ]; then
  echo "[deploy] 未找到 backend/.env，请从 backend/.env.example 复制并修改后重试"
  exit 1
fi

echo "[deploy] 启动 Docker 编排 (backend + mysql + redis) ..."
docker-compose up -d

echo "[deploy] 等待 MySQL 就绪 ..."
sleep 10

echo "[deploy] 执行数据库迁移与种子数据 ..."
docker-compose exec -T backend alembic upgrade head 2>/dev/null || true
docker-compose exec -T backend python -m scripts.seed_data 2>/dev/null || true

echo "[deploy] 完成。"
echo "  - 后端 API: http://localhost:8000"
echo "  - API 文档: http://localhost:8000/docs"
echo "  - 前端请单独启动: cd frontend && pnpm dev"
