"""Add online users menu

Revision ID: 003
Revises: 002
Create Date: 2025-02-27

"""
import uuid
from typing import Sequence, Union

from alembic import op
from sqlalchemy import text

revision: str = "003"
down_revision: Union[str, None] = "002"
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
        text("SELECT id FROM sys_menu WHERE path = '/system/online' LIMIT 1")
    ).fetchone()
    if existing:
        return

    menu_id = str(uuid.uuid4())
    meta_json = '{"title": "system.online.title", "icon": "mdi:account-multiple"}'

    conn.execute(
        text("""
            INSERT INTO sys_menu (id, name, path, pid, type, component, status, auth_code, meta, created_at, updated_at)
            VALUES (:id, 'SystemOnline', '/system/online', :pid, 'menu', '/views/system/online/list', 1, 'system:online',
                    :meta, NOW(), NULL)
        """),
        {"id": menu_id, "pid": parent_id, "meta": meta_json},
    )

    conn.execute(
        text("""
            UPDATE sys_role SET permissions = JSON_ARRAY_APPEND(
                COALESCE(permissions, '[]'), '$', :menu_id
            )
            WHERE name = '超级管理员'
        """),
        {"menu_id": menu_id},
    )


def downgrade() -> None:
    conn = op.get_bind()
    conn.execute(text("DELETE FROM sys_menu WHERE path = '/system/online'"))
