"""
Pytest 配置檔案

這個檔案用來定義：
1. Fixtures - 可重複使用的測試設定
2. 全域配置
3. 測試前後的 setup/teardown 邏輯

Pytest 會自動載入這個檔案
"""

import pytest
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager


# Fixture 範例：稍後會使用到
# @pytest.fixture 是一個裝飾器（decorator），用來標記這是一個 fixture
@pytest.fixture
def browser():
    """
    建立並返回一個 Chrome 瀏覽器實例

    這是一個 fixture，測試函式可以直接使用它
    測試結束後會自動關閉瀏覽器

    更新：現在支援 headless 模式和多種選項
    """
    # 設定 Chrome 選項
    chrome_options = Options()

    # === 重要選項說明 ===

    # 1. Headless 模式：不顯示瀏覽器視窗（背景執行）
    # 優點：速度快、不需要真實 Chrome
    # 如果想看到瀏覽器操作，註解掉下面這行
    chrome_options.add_argument("--headless=new")  # 新版 headless 模式

    # 2. 禁用 GPU 加速（在某些環境中避免問題）
    chrome_options.add_argument("--disable-gpu")

    # 3. 無沙盒模式（Docker/CI 環境需要）
    chrome_options.add_argument("--no-sandbox")

    # 4. 禁用 /dev/shm 使用（避免資源限制問題）
    chrome_options.add_argument("--disable-dev-shm-usage")

    # 5. 設定視窗大小（即使在 headless 模式也很重要！）
    chrome_options.add_argument("--window-size=1920,1080")

    # 6. 禁用瀏覽器的自動化檢測（避免某些網站封鎖）
    chrome_options.add_experimental_option("excludeSwitches", ["enable-automation"])
    chrome_options.add_experimental_option('useAutomationExtension', False)

    # Setup: 建立瀏覽器
    driver = webdriver.Chrome(
        service=Service(ChromeDriverManager().install()),
        options=chrome_options
    )

    # 返回給測試使用
    yield driver

    # Teardown: 清理資源
    driver.quit()
