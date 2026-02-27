"""Initial schema

Revision ID: 001
Revises:
Create Date: 2025-01-01 00:00:00

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "001"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "sys_user",
        sa.Column("id", sa.CHAR(36), primary_key=True),
        sa.Column("username", sa.String(64), nullable=False, index=True),
        sa.Column("password_hash", sa.String(255), nullable=False),
        sa.Column("nickname", sa.String(64), nullable=True),
        sa.Column("avatar", sa.String(512), nullable=True),
        sa.Column("status", sa.Integer(), nullable=False, server_default="1"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=True),
    )
    op.create_table(
        "sys_role",
        sa.Column("id", sa.CHAR(36), primary_key=True),
        sa.Column("name", sa.String(64), nullable=False, index=True),
        sa.Column("remark", sa.String(255), nullable=True),
        sa.Column("status", sa.Integer(), nullable=False, server_default="1"),
        sa.Column("permissions", sa.JSON(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=True),
    )
    op.create_table(
        "sys_user_role",
        sa.Column("user_id", sa.CHAR(36), primary_key=True),
        sa.Column("role_id", sa.CHAR(36), primary_key=True),
    )
    op.create_table(
        "sys_menu",
        sa.Column("id", sa.CHAR(36), primary_key=True),
        sa.Column("name", sa.String(64), nullable=False, index=True),
        sa.Column("path", sa.String(255), nullable=False, server_default=""),
        sa.Column("pid", sa.CHAR(36), nullable=False, server_default="0", index=True),
        sa.Column("type", sa.String(20), nullable=False, server_default="menu"),
        sa.Column("component", sa.String(255), nullable=True),
        sa.Column("redirect", sa.String(255), nullable=True),
        sa.Column("auth_code", sa.String(64), nullable=True),
        sa.Column("status", sa.Integer(), nullable=False, server_default="1"),
        sa.Column("meta", sa.JSON(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=True),
    )
    op.create_table(
        "sys_dept",
        sa.Column("id", sa.CHAR(36), primary_key=True),
        sa.Column("name", sa.String(64), nullable=False, index=True),
        sa.Column("pid", sa.CHAR(36), nullable=False, server_default="0", index=True),
        sa.Column("remark", sa.String(255), nullable=True),
        sa.Column("status", sa.Integer(), nullable=False, server_default="1"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=True),
    )


def downgrade() -> None:
    op.drop_table("sys_dept")
    op.drop_table("sys_menu")
    op.drop_table("sys_user_role")
    op.drop_table("sys_role")
    op.drop_table("sys_user")
