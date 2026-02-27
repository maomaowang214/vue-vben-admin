"""
APScheduler 占位：可在应用启动时添加定时任务
"""
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger

scheduler = AsyncIOScheduler()


def add_jobs() -> None:
    """注册定时任务示例"""
    # 示例：每分钟打印（生产可改为清理日志、同步数据等）
    # scheduler.add_job(
    #     lambda: print("scheduled tick"),
    #     CronTrigger(minute="*"),
    #     id="tick",
    # )
    pass


def start_scheduler() -> None:
    add_jobs()
    scheduler.start()


def shutdown_scheduler() -> None:
    if scheduler.running:
        scheduler.shutdown(wait=False)
