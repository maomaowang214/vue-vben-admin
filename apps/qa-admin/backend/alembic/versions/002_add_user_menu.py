"""Add user management menu

Revision ID: 002
Revises: 001
Create Date: 2025-01-01 00:01:00

"""
import uuid
from typing import Sequence, Union

from alembic import op
from sqlalchemy import text

revision: str = "002"
down_revision: Union[str, None] = "001"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    conn = op.get_bind()
    parent = conn.execute(
        text("SELECT id FROM sys_menu WHERE path = '/system' AND pid = '0' LIMIT 1")
    ).fetchone()
    if not parent:
        return

    parent_id = parent[0]
    existing = conn.execute(
        text("SELECT id FROM sys_menu WHERE path = '/system/user' LIMIT 1")
    ).fetchone()
    if existing:
        return

    menu_id = str(uuid.uuid4())
    meta_json = '{"title": "system.user.title", "icon": "mdi:account"}'

    conn.execute(
        text("""
            INSERT INTO sys_menu (id, name, path, pid, type, component, status, auth_code, meta, created_at, updated_at)
            VALUES (:id, 'SystemUser', '/system/user', :pid, 'menu', '/views/system/user/list', 1, 'system:user',
                    :meta, NOW(), NULL)
        """),
        {"id": menu_id, "pid": parent_id, "meta": meta_json}
    )

    # 追加新菜单 id 到超级管理员权限
    conn.execute(
        text("""
            UPDATE sys_role SET permissions = JSON_ARRAY_APPEND(
                COALESCE(permissions, '[]'), '$', :menu_id
            )
            WHERE name = '超级管理员'
        """),
        {"menu_id": menu_id}
    )


def downgrade() -> None:
    conn = op.get_bind()
    conn.execute(text("DELETE FROM sys_menu WHERE path = '/system/user'"))
    # 注意：downgrade 时难以从 permissions JSON 中精确移除一项，可简化处理
