"""
Dynamically load configuration based on APP_ENV
"""

from importlib import import_module

from .base import BaseConfig


Config = import_module(f'.{BaseConfig.APP_ENV}', package=__name__).Config
__all__ = ['Config']
