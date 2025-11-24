"""
測試加密貨幣列表載入功能

這個測試會驗證：
1. 加密貨幣列表是否正確從 API 載入
2. 列表項是否正確顯示
3. 每個列表項是否包含必要的資訊

這是一個「真實」的 E2E 測試，會測試：
- 前端 React 應用
- API 調用
- 數據渲染
- WebSocket 連接（如果有）
"""

import time
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


# ============ 測試 1：驗證加密貨幣列表是否載入 ============
def test_crypto_list_loads(browser):
    """
    測試首頁是否成功載入加密貨幣列表

    學習重點：
    1. 如何等待 API 數據載入
    2. 如何使用 CSS Selector 定位元素
    3. 如何驗證動態內容
    """
    # Step 1: 開啟首頁
    browser.get("http://localhost:5173")
    print("\nOpened homepage")

    # Step 2: 等待頁面基本結構載入
    WebDriverWait(browser, 10).until(
        lambda driver: driver.execute_script("return document.readyState") == "complete"
    )
    print("Page DOM loaded")

    # Step 3: 等待加密貨幣卡片出現
    # 這很重要！因為數據需要從 API 載入，會有延遲
    # 使用 CSS Selector 來找到卡片元素
    wait = WebDriverWait(browser, 15)  # 最多等 15 秒（API 可能較慢）

    try:
        # 等待至少一張卡片出現
        # CSS Selector: .card 表示找有 "card" class 的元素
        wait.until(
            EC.presence_of_element_located((By.CSS_SELECTOR, ".card"))
        )
        print("Crypto cards detected")

    except Exception as e:
        print(f"Timeout waiting for cards: {e}")
        # 列印頁面內容方便除錯
        print(f"Current page body: {browser.find_element(By.TAG_NAME, 'body').text[:200]}")
        raise

    # Step 4: 給 React 和 API 一點時間完成所有渲染
    # 實務上，最好使用明確的等待條件，而不是 sleep
    # 但這裡為了學習，先用 sleep 確保所有卡片都載入了
    time.sleep(2)

    # Step 5: 找出所有的加密貨幣卡片
    crypto_cards = browser.find_elements(By.CSS_SELECTOR, ".card")
    card_count = len(crypto_cards)

    print(f"Found {card_count} crypto cards")

    # Step 6: 驗證至少有一些卡片
    assert card_count > 0, "Should have at least one crypto card"
    print(f"Test passed: Successfully loaded {card_count} cryptocurrencies")


# ============ 測試 2：驗證卡片內容的完整性 ============
def test_crypto_card_content(browser):
    """
    測試每張加密貨幣卡片是否包含必要的資訊

    學習重點：
    1. 如何檢查元素內的子元素
    2. 如何驗證文字內容
    3. 如何檢查圖片是否載入
    """
    # 開啟首頁並等待載入
    browser.get("http://localhost:5173")

    # 等待卡片出現
    wait = WebDriverWait(browser, 15)
    wait.until(
        EC.presence_of_element_located((By.CSS_SELECTOR, ".card"))
    )
    time.sleep(2)  # 確保所有內容都渲染完成

    # 找出第一張卡片來檢查
    first_card = browser.find_element(By.CSS_SELECTOR, ".card")
    print("\nChecking first crypto card content...")

    # === 檢查 1：加密貨幣名稱 ===
    try:
        # 名稱在 <h3> 標籤中，且有特定的 class
        name_element = first_card.find_element(By.CSS_SELECTOR, "h3.font-semibold")
        crypto_name = name_element.text

        assert len(crypto_name) > 0, "加密貨幣名稱不應該是空的"
        print(f"  Name: {crypto_name}")

    except Exception as e:
        print(f"  Failed to find crypto name: {e}")
        raise

    # === 檢查 2：加密貨幣符號（symbol）===
    try:
        # 符號是大寫的，在 <p> 標籤中
        symbol_element = first_card.find_element(By.CSS_SELECTOR, "p.uppercase")
        crypto_symbol = symbol_element.text

        assert len(crypto_symbol) > 0, "加密貨幣符號不應該是空的"
        print(f"  Symbol: {crypto_symbol}")

    except Exception as e:
        print(f"  Failed to find crypto symbol: {e}")
        raise

    # === 檢查 3：價格 ===
    try:
        # 價格在大字體的 <p> 標籤中
        price_element = first_card.find_element(By.CSS_SELECTOR, "p.text-2xl")
        crypto_price = price_element.text

        assert "$" in crypto_price or len(crypto_price) > 0, "價格應該包含 $ 符號或有內容"
        print(f"  Price: {crypto_price}")

    except Exception as e:
        print(f"  Failed to find price: {e}")
        raise

    # === 檢查 4：24 小時漲跌幅 ===
    try:
        # 漲跌幅在 span 中，且有 font-medium class
        change_element = first_card.find_element(By.CSS_SELECTOR, "span.font-medium")
        price_change = change_element.text

        # 漲跌幅應該包含 % 符號
        assert "%" in price_change, "24h 漲跌幅應該包含 % 符號"
        print(f"  24h Change: {price_change}")

    except Exception as e:
        print(f"  Failed to find 24h change: {e}")
        raise

    # === 檢查 5：市值 (Market Cap) ===
    try:
        # 市值有 "Market Cap" 文字標籤
        market_cap_elements = first_card.find_elements(By.CSS_SELECTOR, "p.text-sm")

        # 應該至少有一個包含市值的元素
        assert len(market_cap_elements) > 0, "應該要有市值資訊"
        print(f"  Market cap info found")

    except Exception as e:
        print(f"  Failed to find market cap: {e}")
        raise

    # === 檢查 6：加密貨幣圖標 ===
    try:
        # 圖標是 <img> 標籤
        img_element = first_card.find_element(By.CSS_SELECTOR, "img")
        img_src = img_element.get_attribute("src")

        assert img_src and len(img_src) > 0, "圖片應該要有 src 屬性"
        assert img_src.startswith("http"), "圖片 URL 應該是有效的"
        print(f"  Icon URL: {img_src[:50]}...")

    except Exception as e:
        print(f"  Failed to find icon: {e}")
        raise

    print("\nAll content checks passed")


# ============ 測試 3：驗證多個加密貨幣 ============
def test_multiple_cryptos_loaded(browser):
    """
    測試是否載入了多個加密貨幣（而不只是一個）

    實際應用場景：確保 API 返回了完整的列表
    """
    browser.get("http://localhost:5173")

    # 等待載入
    wait = WebDriverWait(browser, 15)
    wait.until(
        EC.presence_of_element_located((By.CSS_SELECTOR, ".card"))
    )
    time.sleep(2)

    # 取得所有卡片
    crypto_cards = browser.find_elements(By.CSS_SELECTOR, ".card")
    card_count = len(crypto_cards)

    print(f"\nTotal cryptocurrencies loaded: {card_count}")

    # 驗證數量合理
    # 至少有 10-20 個加密貨幣
    assert card_count >= 5, f"加密貨幣數量太少，只有 {card_count} 個"
    print(f"Test passed: Loaded sufficient cryptocurrencies")

    # 額外檢查：列出前 3 個加密貨幣的名稱
    print("\nFirst 3 cryptocurrencies:")
    for i, card in enumerate(crypto_cards[:3]):
        try:
            name = card.find_element(By.CSS_SELECTOR, "h3.font-semibold").text
            symbol = card.find_element(By.CSS_SELECTOR, "p.uppercase").text
            print(f"  {i+1}. {name} ({symbol})")
        except:
            print(f"  {i+1}. [Failed to read name]")


# ============ 測試 4：測試收藏按鈕存在 ============
def test_favorite_button_exists(browser):
    """
    測試每張卡片是否都有收藏按鈕

    學習重點：
    1. 如何找到按鈕元素
    2. 如何檢查元素屬性
    """
    browser.get("http://localhost:5173")

    # 等待載入
    wait = WebDriverWait(browser, 15)
    wait.until(
        EC.presence_of_element_located((By.CSS_SELECTOR, ".card"))
    )
    time.sleep(2)

    # 取得第一張卡片
    first_card = browser.find_element(By.CSS_SELECTOR, ".card")

    # 找收藏按鈕
    # 根據你的代碼，收藏按鈕是一個 <button> 標籤
    try:
        favorite_button = first_card.find_element(By.CSS_SELECTOR, "button")
        print("\nFavorite button found")

        # 檢查按鈕是否可見
        assert favorite_button.is_displayed(), "收藏按鈕應該要顯示"
        print("Favorite button is visible")

        # 檢查按鈕裡面是否有星星圖示
        # Lucide React 的 Star 組件會渲染成 <svg>
        star_icon = favorite_button.find_element(By.CSS_SELECTOR, "svg")
        assert star_icon is not None, "收藏按鈕應該要有星星圖示"
        print("Favorite button contains star icon")

    except Exception as e:
        print(f"Failed to find favorite button: {e}")
        raise


"""
知識小筆記：

1. **CSS Selector 語法**
   - `.card` : 選擇 class="card" 的元素
   - `h3.font-semibold` : 選擇 class="font-semibold" 的 <h3> 元素
   - `p.uppercase` : 選擇 class="uppercase" 的 <p> 元素
   - `button svg` : 選擇 <button> 裡面的 <svg> 元素

2. **等待策略**
   - `EC.presence_of_element_located()` : 等待元素出現在 DOM 中
   - `time.sleep()` : 固定等待時間（不建議過度使用）
   - 最佳實務：使用明確的等待條件

3. **find_element vs find_elements**
   - `find_element()` : 找到第一個符合的元素，找不到會拋出異常
   - `find_elements()` : 找到所有符合的元素，返回列表（可能是空列表）

4. **在元素內搜尋**
   - `card.find_element()` : 在 card 元素內搜尋子元素
   - 這比全域搜尋更精確，避免找到錯的元素

5. **斷言技巧**
   - 加上清楚的錯誤訊息：`assert condition, "錯誤說明"`
   - 這樣測試失敗時更容易理解原因

下一步可以繼續做：
   - 如何點擊按鈕（測試收藏功能）
   - 如何輸入文字並搜尋
   - 如何測試頁面導航
   - 如何處理 API 載入失敗的情況
"""
