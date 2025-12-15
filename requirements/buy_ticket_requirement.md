# 机票预订需求文档

本文档详细描述了携程旅行网机票预订流程的核心功能、页面元素、用户交互及系统行为。

## 1. 首页 (Home Page)

### 1.1 页面结构与元素
首页主要由顶部导航、左侧促销横幅、右侧搜索及推荐区域组成。整体页面样式参考位置: `.\frontend\src\screen_shoot\main_page\whole_page\whole_page.png`。

#### 1.1.1 核心区域
- **顶部导航 (Header)**：
    - **登录/注册入口**：未登录时显示，点击跳转至登录/注册页面。
    - **用户名**：登录后显示，点击可查看个人信息，和登录同一位置。
    - **首页**：点击跳转至首页。
    - **我的订单**：点击跳转至订单管理。
    - **客服**：作为占位符，点击无响应。
    - **参考样式位置**: `.\frontend\src\screen_shoot\main_page\main_item\header.png`。
- **促销横幅 (PromotionBanner)**：位于页面左侧，展示旅行网站可以提供的各种功能。参考样式位置: `.\frontend\src\screen_shoot\main_page\main_item\promotion_banner.png`。
- **右侧功能区**：
    - **机票搜索卡片 (FlightsSearchCard)**：核心搜索入口。
        - **标签页 (Tabs)**：`国内、国际/中国港澳台`（默认选中）、`特价机票`、`航班动态` 等。
        - **行程类型**：仅支持 **单程**（原往返/多程入口已移除）。
        - **表单项**：
            - `出发地`：支持城市/机场中文名或拼音搜索，带热门城市下拉推荐。
            - `目的地`：同出发地，支持一键互换。
            - `出发日期`：日期选择器，默认选中今天，不可选过去日期。
            - `乘客类型`：复选框 `常儿童`、`带婴儿`。
        - **搜索按钮**：点击提交搜索条件并跳转至结果页。
        - **参考样式位置**: `.\frontend\src\screen_shoot\main_page\main_item\searching_bar.png`。
    - **广告栏 (AdBanner)**：位于搜索卡片下方，展示“机票6重服务保障”等营销信息。参考样式位置: `.\frontend\src\screen_shoot\main_page\main_item\advertising_bar.png`。
    - **推荐栏 (RecommendationSection)**：位于广告栏下方，展示“周末省心游”、“爱上大草原”、“海边浪一浪”等主题特价航线列表。参考样式位置: `.\frontend\src\screen_shoot\main_page\main_item\ad_push.png`。

### 1.2 交互场景 (Gherkin)

**Scenario: 1.2.1 用户在首页发起单程机票搜索**
    Given 用户已访问携程首页
    And 搜索卡片默认选中“单程”
    And 用户输入有效的出发地（如“上海”）和目的地（如“北京”）
    And 用户选择未来的出发日期
    When 用户点击“搜索”按钮
    Then 系统验证输入有效
    And 页面跳转至 `航班搜索结果页`

---

## 2. 航班搜索结果页 (Flight Search Results Page)

### 2.1 页面结构与元素
展示符合搜索条件的航班列表，支持进一步筛选与预订。整体页面样式参考位置: `.\frontend\src\screen_shoot\flight_ticket_search\whole_page\whole_selection_page.png`。

#### 2.1.1 核心区域
- **顶部导航 (Header)**：
    - 这里的Header与首页保持一致。
    - **参考样式位置**: `.\frontend\src\screen_shoot\main_page\main_item\header.png`。
- **搜索条**：回显首页搜索条件（出发/到达地、单程、日期），支持重新修改搜索。参考样式位置: `.\frontend\src\screen_shoot\flight_ticket_search\main_item\searching_bar.png`。
- **筛选栏**：支持按 `起降时间`、`航空公司`、`机型`、`舱位` 等条件过滤。参考样式位置: `.\frontend\src\screen_shoot\flight_ticket_search\main_item\selecting_bar.png`。
- **航班列表**：
    - **航班卡片**：展示 `航空公司`、`航班号`、`机型`、`起降时间/机场`、`最低价`。
    - **订票按钮**：点击展开套餐列表。
    - **参考样式位置**: `.\frontend\src\screen_shoot\flight_ticket_search\main_item\booking_button.png.png`。
- **套餐面板 (PackagePanel)**：
    - 展开后显示不同价格等级的套餐（如经济舱、头等舱）。
    - 每个套餐包含 `价格`、`退改规则`、`行李额`。
    - **“预订”按钮**：点击进入订单填写流程。
    - **参考样式位置**: `.\frontend\src\screen_shoot\flight_ticket_search\main_item\ticket_pulldown_slection.png`。

### 2.2 交互场景 (Gherkin)

**Scenario: 2.2.1 正常加载并展示航班列表**
    Given 用户从首页跳转至结果页
    When 系统根据 URL 参数请求后端搜索接口
    Then 页面显示符合条件的航班卡片列表
    And 列表顶部仅显示“单程”标签（无往返选项）

**Scenario: 2.2.2 筛选航班**
    Given 航班列表已加载
    When 用户勾选“仅看直飞”或特定航空公司、起降时间等
    Then 列表实时过滤，仅展示符合条件的航班

**Scenario: 2.2.3 选择套餐预订**
    Given 用户点击某航班的“订票”按钮
    And 套餐面板已展开
    When 用户点击某经济舱套餐的“预订”按钮
    Then 系统将航班信息与套餐信息存入 Session
    And 页面跳转至 `订单填写页`

---

## 3. 订单填写与支付 (Order Filling & Payment)

### 3.1 订单填写页 (Booking Page)

#### 3.1.1 页面结构与元素
整体页面样式参考位置: `.\frontend\src\screen_shoot\buy_ticket\whole_page\whole_page.png`。

- **全局进度条**：显示当前处于“1 乘机信息”阶段。
- **乘机人信息**：
    - `姓名`、`证件类型`（身份证/护照）、`证件号码`、`手机号`。
    - 支持从“常用旅客”列表快速勾选填入。
    - **参考样式位置**: `.\frontend\src\screen_shoot\buy_ticket\main_item\passenger.png`。
- **联系人信息**：`国家码`、`手机号`。参考样式位置: `.\frontend\src\screen_shoot\buy_ticket\main_item\contacts.png`。
- **价格明细**：右侧悬浮展示 `成人票价`、`机建燃油费`、`服务费` 及 `总价`。参考样式位置: `.\frontend\src\screen_shoot\buy_ticket\main_item\ticket_information.png`。
- **“下一步”按钮**：校验通过后跳转至增值服务页。

#### 3.1.2 交互场景 (Gherkin)

**Scenario: 3.1.3 填写并提交乘机人信息**
    Given 用户进入订单填写页
    And 用户输入合法的乘机人姓名与身份证号
    And 用户输入合法的联系人手机号
    When 用户点击“下一步”按钮
    Then 系统校验通过
    And 在后台创建“待支付”状态订单（status: pending_payment）
    And 页面跳转至 `/booking/services`

**Scenario: 3.1.4 输入校验失败**
    Given 用户输入了错误的身份证格式
    When 用户点击“下一步”
    Then 输入框下方显示红色错误提示“证件号码格式不正确”
    And 页面不跳转

### 3.2 增值服务页 (Services Page)

#### 3.2.1 页面结构与元素
整体页面样式参考位置: `.\frontend\src\screen_shoot\improved_service\whole_page\whole_page.png`。

- **全局进度条**：高亮“2 增值服务”。
- **服务选项**：`航意险`、`延误险`、`接送机券` 等（可选）。参考样式位置: `.\frontend\src\screen_shoot\improved_service\main_item\service_information.png`。
- **价格明细**：右侧悬浮展示当前总价（含选购的服务）。参考样式位置: `.\frontend\src\screen_shoot\improved_service\main_item\ticket_information.png`。
- **“下一步”按钮**：确认服务后进入支付页。

### 3.3 支付页 (Payment Page)

#### 3.3.1 页面结构与元素
整体页面样式参考位置: `.\frontend\src\screen_shoot\pay_page\whole_page\whole_page.png`。

- **全局进度条**：高亮“3 支付”。
- **订单摘要**：`订单金额`、`剩余支付时间倒计时`（15分钟）、`航班信息`。参考样式位置: `.\frontend\src\screen_shoot\pay_page\main_item\information.png`。
- **支付方式**：
    - `银行卡支付`（默认选中）。
    - `新卡支付`（输入卡号、姓名、有效期、CVV）。
    - `支付宝`、`微信` 等其他方式。
    - **参考样式位置**: `.\frontend\src\screen_shoot\pay_page\main_item\pay_selection.png`。
- **“支付”按钮**：显示支付金额。

#### 3.3.2 交互场景 (Gherkin)

**Scenario: 3.3.3 完成支付**
    Given 用户选择“银行卡支付”或输入有效新卡信息
    And 倒计时未结束
    When 用户点击“支付”按钮
    Then 系统调用支付接口更新订单状态
    And 页面跳转至 `/booking/complete`

**Scenario: 3.3.4 支付超时**
    Given 用户在支付页停留超过 15 分钟
    When 倒计时归零
    Then 弹出提示“超出时间，请重新开始订单”
    And 支付按钮不可用

---

## 4. 订单完成 (Order Completion)

### 4.1 完成页 (Completion Page)

#### 4.1.1 页面元素
- **全局进度条**：高亮“4 完成”。
- **状态提示**：大号字体显示“出票成功”或“支付成功”。
- **订单摘要**：显示生成的 `订单号`、`总金额`、`行程概览`。
- **操作入口**：`查看订单详情`、`返回首页`。

#### 4.1.2 交互场景 (Gherkin)

**Scenario: 4.1.3 查看完成状态**
    Given 用户支付成功跳转至完成页
    Then 页面显示“支付成功”及订单号
    And 用户可点击“返回首页”开始新行程

---

## 5. 订单中心 (Order Center)

### 5.1 订单列表与状态逻辑
用户可在“我的订单”中查看历史订单。

#### 5.1.1 订单分类逻辑
- **未出行 (Pending Travel)**：
    - 定义：订单状态为有效且 `出发时间 > 当前时间`。
    - 展示：在“未出行”Tab 下显示。
- **待点评 (Pending Review)**：
    - 定义：订单状态为有效且 `出发时间 <= 当前时间`。
    - 展示：在“待点评”Tab 下显示（即使后端状态仍为 `pending_travel`，前端根据时间动态归类）。

### 5.2 交互场景 (Gherkin)

**Scenario: 5.2.1 查看未出行订单**
    Given 用户已预订明天的航班
    When 用户访问订单中心“未出行”Tab
    Then 列表显示该订单

**Scenario: 5.2.2 查看已出行订单（待点评）**
    Given 用户有一笔昨天的已支付订单
    When 用户访问订单中心“待点评”Tab
    Then 列表显示该订单
    And 状态显示为“待点评”
