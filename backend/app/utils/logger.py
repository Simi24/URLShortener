from datetime import datetime, timezone
from typing import Optional
from enum import Enum
import sys
from pathlib import Path
import asyncio
import aiofiles
from asyncio import Queue
from os import getenv


class LogLevel(Enum):
    INFO = "\033[94m"  # Blue
    SUCCESS = "\033[92m"  # Green
    WARNING = "\033[93m"  # Yellow
    ERROR = "\033[91m"  # Red
    DEBUG = "\033[95m"  # Purple


class Logger:
    _instance: Optional["Logger"] = None
    RESET = "\033[0m"

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._setup()
        return cls._instance

    def _setup(self):
        self._setup_log_file()
        self.queue: Queue = Queue()
        self.running = True
        self.task = asyncio.create_task(self._process_logs())

    def _setup_log_file(self):
        log_dir = Path(getenv("LOG_PATH", "/app/logs"))
        log_dir.mkdir(exist_ok=True)

        timestamp = datetime.now(timezone.utc).strftime("%Y%m%d")
        self.log_file = log_dir / f"url_shortener_{timestamp}.log"
        print(f"Log file path: {self.log_file.absolute()}")

    async def _process_logs(self):
        while self.running:
            try:
                level, message = await self.queue.get()
                timestamp = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S")
                log_message = f"[{timestamp}] {level.name}: {message}"

                # Console output with colors
                print(f"{level.value}{log_message}{self.RESET}", file=sys.stderr)

                # File output without colors
                async with aiofiles.open(self.log_file, "a") as f:
                    await f.write(f"{log_message}\n")

                self.queue.task_done()
            except Exception as e:
                print(f"Error processing log: {e}", file=sys.stderr)

    async def stop(self):
        """Cleanup method to be called on application shutdown"""
        self.running = False
        if not self.queue.empty():
            await self.queue.join()
        self.task.cancel()
        try:
            await self.task
        except asyncio.CancelledError:
            pass

    def _log(self, level: LogLevel, message: str):
        asyncio.create_task(self.queue.put((level, message)))

    def info(self, message: str):
        self._log(LogLevel.INFO, message)

    def success(self, message: str):
        self._log(LogLevel.SUCCESS, message)

    def warning(self, message: str):
        self._log(LogLevel.WARNING, message)

    def error(self, message: str):
        self._log(LogLevel.ERROR, message)

    def debug(self, message: str):
        self._log(LogLevel.DEBUG, message)
