"""
种子数据：创建数据库、执行迁移、插入模拟数据
使用方式（在 qa-py 目录下）：
  python -m scripts.seed_data
或先创建库再迁移再种子：
  mysql -h127.0.0.1 -P13307 -uroot -proot -e "CREATE DATABASE IF NOT EXISTS qa_admin;"
  alembic upgrade head
  python -m scripts.seed_data
"""
import asyncio
import sys
from pathlib import Path

# 保证 app 可导入
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.config import settings
from app.core.security import hash_password
from app.database import AsyncSessionLocal, init_db
from app.models.base import Base
from app.models.user import User
from app.models.role import Role
from app.models.user import UserRole
from app.models.menu import Menu
from app.models.dept import Dept
from app.models.message import Message


async def seed() -> None:
    await init_db()
    async with AsyncSessionLocal() as db:
        from sqlalchemy import select

        # 是否已有管理员
        r = await db.execute(select(User).where(User.username == "admin"))
        if r.scalars().first():
            print("admin user already exists, skip seed.")
            return

        # 1. 角色
        admin_role = Role(
            name="超级管理员",
            remark="拥有所有权限",
            status=1,
            permissions=[],  # 空表示不按菜单过滤，全部可见；或后面填菜单 id
        )
        db.add(admin_role)
        await db.flush()

        user_role = Role(name="普通用户", remark="普通用户", status=1, permissions=[])
        db.add(user_role)
        await db.flush()

        # 2. 菜单（树形）
        m_system = Menu(
            name="system",
            path="/system",
            pid="0",
            type="catalog",
            status=1,
            meta={"title": "system.title", "icon": "ion:settings-outline", "order": 9997},
        )
        db.add(m_system)
        await db.flush()

        m_role = Menu(
            name="SystemRole",
            path="/system/role",
            pid=m_system.id,
            type="menu",
            component="/views/system/role/list",
            status=1,
            auth_code="system:role",
            meta={"title": "system.role.title", "icon": "mdi:account-group"},
        )
        db.add(m_role)
        await db.flush()

        m_menu = Menu(
            name="SystemMenu",
            path="/system/menu",
            pid=m_system.id,
            type="menu",
            component="/views/system/menu/list",
            status=1,
            auth_code="system:menu",
            meta={"title": "system.menu.title", "icon": "mdi:menu"},
        )
        db.add(m_menu)
        await db.flush()

        m_dept = Menu(
            name="SystemDept",
            path="/system/dept",
            pid=m_system.id,
            type="menu",
            component="/views/system/dept/list",
            status=1,
            auth_code="system:dept",
            meta={"title": "system.dept.title", "icon": "charm:organisation"},
        )
        db.add(m_dept)
        await db.flush()

        m_user = Menu(
            name="SystemUser",
            path="/system/user",
            pid=m_system.id,
            type="menu",
            component="/views/system/user/list",
            status=1,
            auth_code="system:user",
            meta={"title": "system.user.title", "icon": "mdi:account"},
        )
        db.add(m_user)
        await db.flush()

        m_online = Menu(
            name="SystemOnline",
            path="/system/online",
            pid=m_system.id,
            type="menu",
            component="/views/system/online/list",
            status=1,
            auth_code="system:online",
            meta={"title": "system.online.title", "icon": "mdi:account-multiple"},
        )
        db.add(m_online)
        await db.flush()

        m_message = Menu(
            name="SystemMessage",
            path="/system/message",
            pid=m_system.id,
            type="menu",
            component="/views/system/message/list",
            status=1,
            auth_code="system:message",
            meta={"title": "system.message.title", "icon": "mdi:message-badge"},
        )
        db.add(m_message)
        await db.flush()

        # 超级管理员拥有所有菜单权限（用菜单 id）
        admin_role.permissions = [m_system.id, m_role.id, m_menu.id, m_dept.id, m_user.id, m_online.id, m_message.id]
        # 普通用户只给部分
        user_role.permissions = [m_system.id, m_role.id]

        # 3. 部门
        d_root = Dept(name="总公司", pid="0", status=1, remark="根部门")
        db.add(d_root)
        await db.flush()

        d_tech = Dept(name="技术部", pid=d_root.id, status=1, remark="技术研发")
        db.add(d_tech)
        d_product = Dept(name="产品部", pid=d_root.id, status=1, remark="产品")
        db.add(d_product)

        # 4. 用户
        admin = User(
            username="admin",
            password_hash=hash_password("admin123"),
            nickname="管理员",
            status=1,
        )
        db.add(admin)
        await db.flush()

        user1 = User(
            username="user",
            password_hash=hash_password("user123"),
            nickname="测试用户",
            status=1,
        )
        db.add(user1)
        await db.flush()

        db.add(UserRole(user_id=admin.id, role_id=admin_role.id))
        db.add(UserRole(user_id=user1.id, role_id=user_role.id))

        # 5. 示例消息
        msg1 = Message(
            user_id=admin.id,
            title="欢迎使用 QA Admin",
            message="这是您的第一条系统消息。",
            is_read=0,
        )
        db.add(msg1)
        msg2 = Message(
            user_id=admin.id,
            title="系统通知",
            message="系统已成功启动，您可以开始使用了。",
            is_read=0,
        )
        db.add(msg2)

        await db.commit()
        print("Seed done. admin / admin123, user / user123")
        print("Menus and depts created. Run backend: uvicorn app.main:app --reload")


if __name__ == "__main__":
    asyncio.run(seed())
