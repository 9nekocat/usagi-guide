# Usagi Engine 新手教程

> 面向：完全没做过游戏、或者只写过一点代码的人。
> 依据：官网文档 <https://usagiengine.com/>（当前版本 v1.3.3）与官方书《Game Programming with Usagi》<https://book.usagiengine.com/>。
> 读完你能做到：装好引擎 → 跑起第一个项目 → 看懂并改写一个能玩的小游戏 → 加音效和存档 → 导出成网页发给朋友。

---

## 目录

1. [Usagi 是什么，适合谁](#1-usagi-是什么适合谁)
2. [安装](#2-安装)
3. [五分钟上手](#3-五分钟上手)
4. [项目结构](#4-项目结构)
5. [三个回调与游戏循环](#5-三个回调与游戏循环)
6. [坐标系与绘制](#6-坐标系与绘制)
7. [输入：别直接读按键](#7-输入别直接读按键)
8. [数据、State 与热重载这个坑](#8-数据state-与热重载这个坑)
9. [动手：一个完整的迷你游戏](#9-动手一个完整的迷你游戏)
10. [碰撞检测](#10-碰撞检测)
11. [手感（juice）：4 个函数](#11-手感juice4-个函数)
12. [美术：精灵表、调色板、字体](#12-美术精灵表调色板字体)
13. [声音](#13-声音)
14. [存档与数据文件](#14-存档与数据文件)
15. [暂停菜单与内置工具](#15-暂停菜单与内置工具)
16. [导出与发布](#16-导出与发布)
17. [快捷键速查](#17-快捷键速查)
18. [新手最容易踩的 8 个坑](#18-新手最容易踩的-8-个坑)
19. [接下来学什么](#19-接下来学什么)

---

## 1. Usagi 是什么，适合谁

一句话：**用 Lua 写 2D 像素小游戏，改代码即时生效，一条命令导出到全平台。**

作者 Brett Chalupa 做它的动机很明确：新人应该"多做小游戏"来练习，但大多数引擎让"快速做小游戏"这件事变得很痛苦。所以 Usagi 主动做减法：

| 它有的 | 它没有的（故意的） |
| --- | --- |
| 热重载：存盘即生效，**游戏状态不丢** | 不是 Love2D 替代品，不能做中大型完整项目 |
| `usagi export` 一条命令出 Linux/macOS/Windows/网页 | 不支持手机、VR |
| 内置暂停菜单 + 键位重映射 + 音量 | 没有自带关卡编辑器（用 Tiled 等外部工具） |
| 一行代码存档读档 | 只有 3 个动作键（BTN1/2/3），固定分辨率默认 320×180 |
| 固定的小 API，记住就够用 | 不是 Pico-8 那种 fantasy console（不吃 token 限制） |

**适合你如果**：想快速验证点子、参加 game jam、第一次学做游戏、被 Pico-8 的 token 限制卡住、觉得 Love2D 太自由不知从哪下手。
**不适合你如果**：目标是做商业规模的完整游戏、要上手机、要做 3D。

选它的最大理由其实是**热重载**：把 `player_speed` 从 180 改成 200，存盘，游戏里立刻变，而你正玩到第三关的位置、分数、血量全都在。这个循环一旦习惯，回不去。

---

## 2. 安装

macOS / Linux 用 Homebrew 最省事：

```sh
brew tap brettchalupa/usagi https://codeberg.org/brettchalupa/usagi
brew install usagi
```

其他方式：直接从官方渠道下载可执行文件，解压后丢进 PATH：

- Codeberg：<https://codeberg.org/brettchalupa/usagi/releases/latest>
- GitHub 镜像：<https://github.com/brettchalupa/usagi/releases/latest>
- itch.io：<https://brettchalupa.itch.io/usagi>

装完验证：

```sh
usagi --version
```

**升级**：`usagi update` 拉最新版。然后在项目目录里跑 `usagi refresh`，它会刷新 `meta/usagi.lua`、`.luarc.json`、`USAGI.md`（不会动你的 `main.lua`）。

**编辑器**：任意文本编辑器都行。推荐 VSCodium 或 Gram Editor；装上 `lua-language-server` 后，`usagi init` 生成的 `.luarc.json` 会立刻给你自动补全和参数提示——这对新手帮助极大，因为你可以直接看到 `gfx.rect_fill` 要几个参数。

---

## 3. 五分钟上手

```sh
usagi init hello_usagi     # 建项目
cd hello_usagi
usagi dev                  # 带热重载地跑起来
```

窗口弹出，黑底白字 `Hello, Usagi!`。现在打开 `main.lua`，把它改成：

```lua
function _draw(_dt)
  gfx.clear(gfx.COLOR_DARK_BLUE)
  gfx.text("Hello, Usagi!", 10, 10, gfx.COLOR_YELLOW)
end
```

**存盘，不要重启**。背景和文字颜色当场就变了。这就是全部魔法。

`usagi init` 生成的东西：

| 文件 | 作用 |
| --- | --- |
| `main.lua` | 唯一必需的入口文件 |
| `usagi.conf` | 游戏名、`game_id`、分辨率等配置（也可写在 `main.lua` 顶部的 `-- key = value` 注释里） |
| `meta/usagi.lua` | 编辑器用的 API 类型存根，**别改** |
| `.luarc.json` | 让 lua-language-server 认识 `+=` 这类 Usagi 扩展语法 |
| `USAGI.md` | 完整文档离线副本，当手册查 |

常用命令就五个：

```sh
usagi init <路径>      # 新建项目
usagi dev  [路径]      # 开发模式（热重载）
usagi run  [路径]      # 不带热重载地跑，最接近玩家体验
usagi export [路径]    # 导出全平台
usagi tools [路径]     # 打开内置工具窗口（试听音效、看精灵表）
```

不写路径就在当前目录执行。

---

## 4. 项目结构

最小项目只有一个 `main.lua`。需要更多文件时，用标准 Lua 的 `require` 拆模块，**不要**用 `loadfile` / `dofile` / `io`（它们在网页和导出包里会失效，因为 `require` 走的是引擎的虚拟文件系统）。

```
my_game/
  main.lua            -- 必需：入口
  usagi.conf          -- 配置
  sprites.png         -- 可选：16×16 网格精灵表（带 alpha 的 PNG）
  palette.png         -- 可选：自定义调色板（1 像素高，一像素一色）
  font.png            -- 可选：自定义字体（用 usagi font bake 生成）
  player.lua          -- 可选：require "player"
  scenes/
    menu.lua          -- 可选：require "scenes.menu"
  data/
    levels.json       -- 可选：usagi.read_json("levels.json")
    dialog.txt        -- 可选：usagi.read_text("dialog.txt")
  sfx/                -- 可选：.wav，文件名即音效名
    jump.wav
  music/              -- 可选：.ogg/.mp3/.wav/.flac
    overworld.ogg
  shaders/            -- 可选：后处理着色器（进阶）
    crt.fs
```

模块写法：

```lua
-- player.lua
local Player = {}
function Player.new() return { x = 0, y = 0 } end
return Player

-- main.lua
local Player = require "player"
```

`require "world.tiles"` 会解析成 `world/tiles.lua`，导出打包后同样有效，不用写任何配置。

---

## 5. 三个回调与游戏循环

引擎会去找并调用你定义的这三个全局函数：

```lua
function _init()        -- 游戏启动时跑一次；F5 重置时再跑一次
end

function _update(dt)    -- 每秒 60 次，在绘制之前
end

function _draw(dt)      -- 每秒 60 次，在更新之后
end
```

- **`_init`**：初始化数据。所有跨帧的状态都放这里。
- **`_update`**：读输入、算位置、判碰撞、跑计时器——一切"逻辑"。
- **`_draw`**：只负责画。不要在这里改状态。

**`dt`（delta time）** 是距上一帧过去的秒数，正常约 `0.016`。所有跟时间有关的量都乘它，游戏速度才不会随帧率变化：

```lua
-- 对：每秒 180 像素，60fps 或 30fps 都一样快
x = x + 180 * dt

-- 错：每帧加 3 像素，卡帧时游戏就变慢
x = x + 3
```

还有一个可选的 `_config()`，在窗口创建**之前**跑一次，返回值被缓存（改它必须重启才生效）：

```lua
function _config()
  return {
    name = "Snake",
    game_id = "com.yourname.snake",  -- 反向域名，存档靠它隔离，强烈建议写
    pixel_perfect = true,            -- 只按整数倍放大，像素不糊
    -- game_width = 320, game_height = 180,   -- 默认值
    -- sprite_size = 16,                      -- 精灵格边长
    -- pause_menu = true,                     -- 内置暂停菜单开关
    -- initial_fullscreen = false,
  }
end
```

> 版本差异提示：v1.2 的文档把配置写成 `_config()` 回调，v1.3 起推荐放在项目根的 `usagi.conf` 里。两者都能用，`usagi.conf` 更简单，新手直接用文件就好。

---

## 6. 坐标系与绘制

屏幕坐标：**左上角是 (0, 0)**，x 向右增大，y 向下增大。默认画布 **320×180**，所以 x 写到 400 的东西根本看不见。

调色板是 **Pico-8 的 16 色**，常量名就是槽位号（`gfx.COLOR_BLACK` = 1，`gfx.COLOR_RED` = 9 — 注意比 Pico-8 的 0..15 整体 +1，为了和 Lua 的 1 起始数组对齐）：

```lua
gfx.COLOR_BLACK  DARK_BLUE  DARK_PURPLE  DARK_GREEN
gfx.COLOR_BROWN  DARK_GRAY  LIGHT_GRAY   WHITE
gfx.COLOR_RED    ORANGE     YELLOW       GREEN
gfx.COLOR_BLUE   INDIGO     PINK         PEACH
```

最常用的几个：

```lua
gfx.clear(gfx.COLOR_BLACK)                        -- 每帧先清屏，否则上一帧的残留还在
gfx.text("SCORE 100", 10, 10, gfx.COLOR_WHITE)    -- 文字
gfx.rect_fill(x, y, 16, 16, gfx.COLOR_GREEN)      -- 实心矩形
gfx.rect(x, y, 16, 16, gfx.COLOR_GREEN)           -- 空心矩形
gfx.circ_fill(cx, cy, 8, gfx.COLOR_RED)           -- 实心圆
gfx.line(x1, y1, x2, y2, gfx.COLOR_WHITE)         -- 线
gfx.px(x, y, gfx.COLOR_WHITE)                     -- 单像素
```

两个必须记住的细节：

1. **矩形用左上角定位，圆用圆心定位。**`gfx.circ_fill(100, 100, 8, ...)` 的圆心是 (100,100)；`gfx.rect_fill(100, 100, ...)` 的左上角是 (100,100)。混用会让碰撞判定莫名其妙地偏。
2. **每帧都要 `gfx.clear`。**不清屏的话所有东西会拖影。

文字居中（`usagi.measure_text` 量宽高）：

```lua
local w, h = usagi.measure_text("GAME OVER")
gfx.text("GAME OVER", (usagi.GAME_W - w) / 2, (usagi.GAME_H - h) / 2, gfx.COLOR_WHITE)
```

带扩展参数的 `_ex` 版本，把"翻转、旋转、着色、透明度"打包进一个固定签名：

```lua
gfx.text_ex(text, x, y, scale, rotation, color, alpha)   -- scale 用整数才清晰
gfx.spr_ex(index, x, y, flip_x, flip_y, rotation, tint, alpha)  -- 8 个参数全要给
```

---

## 7. 输入：别直接读按键

Usagi 的核心设计之一是**动作抽象**。你只关心"上/下/左/右/三个按钮"，具体映射交给引擎，玩家还能在暂停菜单里自己改键、换手柄。

```lua
input.held(action)      -- 按住时每帧为 true（移动用）
input.pressed(action)   -- 只在这一帧按下瞬间为 true（射击、跳跃用）
input.released(action)  -- 只在这一帧松开瞬间为 true（蓄力发射用）
```

| 动作 | 键盘 | 手柄 |
| --- | --- | --- |
| `input.LEFT/RIGHT/UP/DOWN` | 方向键 / WASD | 十字键 / 左摇杆 |
| `input.BTN1` | Z 或 J | 下键位（Xbox A / PS Cross）、LB |
| `input.BTN2` | X 或 K | 右键位（Xbox B / PS Circle）、RB |
| `input.BTN3` | C 或 L | 上键位 + 左键位 |

（接 Switch 手柄时会自动对调 A/B，符合任天堂的"A 确认 B 取消"习惯，你的代码不用改。）

在 UI 里显示"按键提示"时，别硬写 "Z"：

```lua
gfx.text("Press " .. input.mapping_for(input.BTN1) .. " to restart", 10, 30, gfx.COLOR_WHITE)
```

`input.mapping_for` 会按玩家当前设备返回正确标签（键盘 `"Z"`、Xbox `"A"`、PS `"Cross"`），而且尊重玩家改过的键位。

只有在做开发者快捷键（按 F1 开调试面板）时，才用 `input.key_pressed(input.KEY_F1)` 这类原始按键读取——它绕过映射，手柄玩家按不到，别用在实际玩法里。

---

## 8. 数据、State 与热重载这个坑

新手在这一节翻车的概率最高，请慢慢看。

Lua 的基础容器是 **table**，一个结构同时充当数组和字典：

```lua
-- 数组式（1 起始）
local enemies = { { x = 100, y = 40 }, { x = 200, y = 80 } }
print(#enemies)          -- 2
print(enemies[1].x)      -- 100

-- 字典式
local player = { x = 20, y = 40, hp = 44 }
print(player.hp)         -- 44
```

遍历：

```lua
for i = 1, #enemies do          -- 按索引正序
  local e = enemies[i]
  e.x = e.x - 2
end

for i = #enemies, 1, -1 do      -- 倒序：**要删除元素时必须倒序**
  if enemies[i].x < -10 then
    table.remove(enemies, i)
  end
end

for _, e in ipairs(enemies) do  -- 只读遍历，最简洁
  gfx.circ_fill(e.x, e.y, 8, gfx.COLOR_RED)
end
```

> 为什么删除必须倒序：正序删掉第 2 个后，后面的元素整体前移，循环索引继续 +1，就会**跳过**一个元素。这是新手 bug 排行榜第一名的常客。

### 热重载的规则

Usagi 存盘时会**重新执行整个 Lua 代码块**，但**不调用 `_init`**。于是：

| 你写的东西 | 存盘后会怎样 | 该放哪 |
| --- | --- | --- |
| `_init()` 里的全局 `State` | 保留（`_init` 没重跑） | ✅ 所有可变游戏状态 |
| 文件顶部的 `local x = 20` | 每次存盘被重置成 20 | 只放常量 |
| 函数里的 `local` | 无所谓 | 随便 |

所以唯一推荐写法：**所有游戏状态塞进一个首字母大写的全局 `State`，只在 `_init` 里赋值。**

```lua
local PLAYER_SPEED = 180   -- 常量用 local + 全大写

function _init()
  State = {
    player = { x = 160, y = 120 },
    score = 0,
  }
end

function _update(dt)
  State.score = State.score + 1
end
```

这样你改 `PLAYER_SPEED` 存盘，游戏里立刻生效，而分数、位置、血量全都在。

**副作用警告**：如果你在 `_init` 里新增了一个字段（比如 `State.enemies = {}`），存盘后正在跑的游戏里那个字段是 `nil`，会报错。**按 F5 硬重置**（重跑 `_init`）即可。遇到莫名其妙的 nil 报错，第一反应永远是：先按 F5。

`.luarc.json` 默认开了 `lowercase-global` 检查：小写变量名出现在文件顶层会警告（提醒你漏了 `local`）。所以大写开头就是"我确实是全局"，是有意为之的语言约定。

> 官方书第一章用的是 `x = 20`、`enemies = {}` 这种小写全局，那是旧版本的写法，在 1.3 会被 linter 提醒。新项目请直接用 `State`。

---

## 9. 动手：一个完整的迷你游戏

目标：控制一个方块躲开从右边飞来的红球，活得越久越好。麻雀虽小，但它具备几乎所有游戏的核心结构：游戏循环、状态、输入、生成、碰撞、结束、重开。

完整代码，一个文件，直接粘进 `main.lua`：

```lua
local PLAYER_SIZE = 16
local PLAYER_SPEED = 200      -- px/s
local ENEMY_R = 8
local SPAWN_DELAY = 0.5       -- s

function _init()
  State = {
    player = { x = 20, y = 80 },
    enemies = {},
    spawn_timer = 0,
    play_time = 0,
    best = State and State.best or 0,   -- 硬重置时保留最高分
    game_over = false,
  }
end

function _update(dt)
  -- 结束状态：等 BTN1 重开
  if State.game_over then
    if input.pressed(input.BTN1) then
      local best = math.max(State.best, State.play_time)
      _init()
      State.best = best
    end
    return
  end

  -- 1. 移动（用 dt，速度与帧率无关）
  local dx, dy = 0, 0
  if input.held(input.LEFT) then dx = dx - 1 end
  if input.held(input.RIGHT) then dx = dx + 1 end
  if input.held(input.UP) then dy = dy - 1 end
  if input.held(input.DOWN) then dy = dy + 1 end
  local dir = util.vec_normalize({ x = dx, y = dy })   -- 斜向不会更快
  State.player.x = State.player.x + dir.x * PLAYER_SPEED * dt
  State.player.y = State.player.y + dir.y * PLAYER_SPEED * dt

  -- 2. 夹在屏幕内
  State.player.x = util.clamp(State.player.x, 0, usagi.GAME_W - PLAYER_SIZE)
  State.player.y = util.clamp(State.player.y, 0, usagi.GAME_H - PLAYER_SIZE)

  -- 3. 定时生成敌人
  State.spawn_timer = State.spawn_timer - dt
  if State.spawn_timer <= 0 then
    table.insert(State.enemies, {
      x = usagi.GAME_W + 10,
      y = math.random(10, usagi.GAME_H - 10),
      spd = math.random(60, 140),      -- px/s
    })
    State.spawn_timer = SPAWN_DELAY
  end

  -- 4. 更新敌人 + 判碰撞（倒序，因为要删）
  local hitbox = { x = State.player.x, y = State.player.y, w = PLAYER_SIZE, h = PLAYER_SIZE }
  for i = #State.enemies, 1, -1 do
    local e = State.enemies[i]
    e.x = e.x - e.spd * dt

    if util.circ_rect_overlap({ x = e.x, y = e.y, r = ENEMY_R }, hitbox) then
      State.game_over = true
      effect.screen_shake(0.3, 4)
      effect.flash(0.15, gfx.COLOR_RED)
    end

    if e.x < -10 then
      table.remove(State.enemies, i)
    end
  end

  -- 5. 计时
  State.play_time = State.play_time + dt
end

function _draw(_dt)
  gfx.clear(gfx.COLOR_DARK_BLUE)

  if not State.game_over then
    gfx.rect_fill(State.player.x, State.player.y, PLAYER_SIZE, PLAYER_SIZE, gfx.COLOR_GREEN)
  end

  for _, e in ipairs(State.enemies) do
    gfx.circ_fill(e.x, e.y, ENEMY_R, gfx.COLOR_RED)
  end

  gfx.text(math.floor(State.play_time) .. "s", 280, 8, gfx.COLOR_WHITE)
  gfx.text("BEST " .. math.floor(State.best) .. "s", 8, 8, gfx.COLOR_LIGHT_GRAY)

  if State.game_over then
    gfx.text("GAME OVER", 8, 40, gfx.COLOR_WHITE)
    gfx.text("Press " .. input.mapping_for(input.BTN1), 8, 60, gfx.COLOR_WHITE)
  end
end
```

逐步拆解其中的关键点：

- **移动**：先累积方向向量 (−1/0/1)，再 `util.vec_normalize` 归一化。不归一化的话，同时按"上+右"的实际速度会是单方向的 1.41 倍，走位手感很怪。
- **`util.clamp`** 一步解决边界，不用写四个 if。
- **生成**：`usagi.GAME_W + 10` 让球从屏幕右侧外面进场；`math.random` 给随机高度和随机速度，游戏才不会一成不变。
- **碰撞**：圆形用 `{x, y, r}`，矩形用 `{x, y, w, h}`，`util.circ_rect_overlap(圆, 矩形)` 直接判。
- **重开**：直接把 `_init()` 当函数再调一次，最省心。

想继续加东西的话，天然的几个方向：屏幕震动（已加）、命中音效（见第 13 节）、最高分存档（见第 14 节）、难度随时间提升——把 `SPAWN_DELAY` 改成随 `play_time` 递减的变量即可。

---

## 10. 碰撞检测

引擎只提供 4 个判定函数，覆盖绝大多数 2D 需求：

```lua
util.rect_overlap(a, b)        -- 矩形 vs 矩形（AABB）
util.circ_overlap(a, b)        -- 圆 vs 圆
util.circ_rect_overlap(c, r)   -- 圆 vs 矩形
util.point_in_rect(p, r)       -- 点在矩形内
util.point_in_circ(p, c)       -- 点在圆内
```

约定：矩形是 `{x, y, w, h}`，圆是 `{x, y, r}`，点/向量是 `{x, y}`。传错字段会直接报错并指出是你的哪一行调用，不会静默算错。

**实战技巧：判定框（hitbox）永远比图片小。**看到角色明明没被碰到就死了，或者明明碰到了却没死，九成是 hitbox 没对齐。做法是单独为玩家算一个缩小的框：

```lua
function player_hitbox(p)
  -- 16x16 的方块，实际只判中心 6x6
  return { x = p.x + 5, y = p.y + 5, w = 6, h = 6 }
end
```

弹幕游戏里这叫"判定点"，玩家会感谢你的。

其他可用的：

- `util.vec_dist(a, b)` / `util.vec_dist_sq(a, b)`（后者免开方，热循环里更快，和 `r * r` 比较）
- `gfx.get_px(x, y)` 按颜色判碰撞（把墙画进画布再查像素）——**很慢，尤其在网页上，调用一次就可能掉 10% 帧率**，慎用。
- `gfx.get_spr_px(index, x, y)` 读精灵表像素，确定性、不受绘制顺序影响，适合逐像素精确判定。

---

## 11. 手感（juice）：4 个函数

这四个函数是"看起来像玩具"和"感觉很爽"之间的差距，都只要一行：

```lua
effect.hitstop(0.06)                    -- 停帧 60ms（打击感的核心）
effect.screen_shake(0.3, 4)             -- 抖 0.3 秒，最大偏移 4 像素（2~6 比较合适）
effect.flash(0.15, gfx.COLOR_WHITE)     -- 白闪，逐渐淡出
effect.slow_mo(1.5, 0.3)                -- 1.5 秒的 30% 慢动作
effect.stop()                           -- 停掉所有效果（切场景时用）
```

叠加规则：**时长长的赢，幅度参数以最近一次调用为准**。所以疯狂调用也不会炸。

新手用它们最常见的错误是**过量**。规则：普通命中只给 hitstop，只有重击/死亡才加 shake + flash。

---

## 12. 美术：精灵表、调色板、字体

Usagi 刻意限制你：**一张图 `sprites.png` 装所有精灵**，默认 16×16 一格，网格从左到右、从上到下，**索引从 1 开始**。

```lua
gfx.spr(1, 10, 12)                -- 画第 1 格到 (10, 12)
gfx.sspr(sx, sy, 16, 16, dx, dy)  -- 从图上任意矩形区域取一块画
```

`sspr` 适合 16×16 之外的自定义尺寸（比如 32×48 的角色），`usagi tools` 里的 TilePicker 可以用右键拖出矩形，直接复制出 `sx,sy,sw,sh` 给你粘贴。

扩展版（参数全都要给，不能省）：

```lua
-- 翻转、旋转、染色、透明度
gfx.spr_ex(index, x, y, flip_x, flip_y, rotation, tint, alpha)
-- 例：被击中瞬间染红
gfx.spr_ex(1, x, y, false, false, 0, gfx.COLOR_RED, 1.0)
-- 例：水平翻转（朝向左）
gfx.spr_ex(1, x, y, true, false, 0, gfx.COLOR_TRUE_WHITE, 1.0)
```

`tint` 是**乘算**，所以 `gfx.COLOR_TRUE_WHITE` 才是"不改变颜色"的中性值；`gfx.COLOR_WHITE` 是 Pico-8 那种偏暖的白，会把精灵整体染得微微发粉。

缩放没有 `scale` 参数（`spr` 固定原生尺寸），要缩放就用 `sspr_ex` 把目标尺寸写大：

```lua
local sz = usagi.SPRITE_SIZE
gfx.sspr_ex(0, 0, sz, sz, x, y, sz * 2, sz * 2, false, false, 0, gfx.COLOR_TRUE_WHITE, 1.0)
```

**调色板**：在项目根放一张 `palette.png`（1 像素 = 1 个色槽，从左到右、从上到下读取）就能整盘换色，存盘即时生效。注意槽位号不变、颜色变了，所以换完调色板后 `gfx.COLOR_RED` 可能不是红的了——推荐自己定义一套具名常量。

**中文字体（重要）**：内置字体只覆盖拉丁/西里尔/部分希腊字母，**没有中日韩字形**，直接 `gfx.text("你好")` 会显示不出来。解决办法是烘一个自己的 `font.png`：

```sh
# Silver 字体覆盖约 8k 汉字 + 韩文，CC-BY-4.0，从 poppyworks.itch.io/silver 下载
usagi font bake Silver.ttf 18
# 生成 font.png，放到 main.lua 同级，引擎自动加载
```

`usagi font bake <ttf> <size>`：size 要用字体的**设计尺寸**（Silver 是 18，monogram 是 15，Misaki Gothic 是 8），其他尺寸会被缩放而发虚。`--scripts` 可以裁剪字符集（比如 `--scripts latin,korean`）。注意自定义字体只作用于你 `gfx.text` 画的文字，引擎自己的 UI 仍用内置字体。

**画素材的工具**：Aseprite（付费，最好用）、Piskel（免费在线）；音效 jsfxr；音乐 1BITDRAGON；地图 Tiled。素材站：opengameart.org、itch.io。

---

## 13. 声音

把 `.wav` 丢进 `sfx/`，**文件名就是音效名**。`sfx/laserShoot.wav` → `sfx.play("laserShoot")`。

```lua
sfx.play("laserShoot")
sfx.play_ex("coin", 1.0, math.random(90, 110) / 100, 0)  -- 音量、音高、左右声像
sfx.stop("laserShoot")
sfx.stop_all()
sfx.is_playing("laserShoot")
```

`sfx.play_ex` 的第三个参数（pitch）配合 `math.random` 是廉价又高级的技巧：同一个音效每次音高略有不同，连发时就不会像机关枪复读。

音乐放 `music/`，支持 `.ogg / .mp3 / .wav / .flac`，**推荐 ogg**（体积小、跨平台好）：

```lua
music.loop("overworld")   -- 循环播放
music.play("intro")       -- 只播一次
music.stop()
music.mutate(0.3, 1.0, 0) -- 实时调节当前曲目（对话时压低音量）
```

同一时刻只有一首曲子。所有 play/loop 都能在 `_init` 里调用，所以标题曲可以在窗口一打开就响，不会有一帧空隙。

试听：`usagi tools` → **Jukebox** 标签（按数字键 `1`），上下键切换自动播放。

---

## 14. 存档与数据文件

**存档**只要两个函数，整个 `State` 表序列化成 JSON 存到系统标准位置：

```lua
function _config()
  return { name = "My Game", game_id = "com.yourname.mygame" }  -- game_id 决定存档目录
end

function _init()
  State = usagi.load() or { best = 0 }   -- 首次运行 load() 返回 nil
end

-- 需要的时候存
usagi.save(State)
```

存储位置：Linux `~/.local/share/<game_id>/save.json`、macOS `~/Library/Application Support/<game_id>/`、Windows `%APPDATA%\<game_id>\`、网页版 `localStorage`。

限制：JSON 能表示的才能存——table、字符串、数字、布尔、nil。**函数、NaN、循环引用会报错**；table 的键必须"全是字符串"或"连续的 1..n 整数数组"，稀疏索引会明确报错（想用整数当键就先 `tostring`）。

**游戏数据**（关卡、对话、数值表）放 `data/` 目录，导出时会一起打包：

```lua
local levels = usagi.read_json("levels.json")     -- JSON → Lua table（数组按 1 起始）
local intro  = usagi.read_text("dialog/intro.txt") -- 原样读文本
```

放在文件顶层读，改 JSON 存盘就会热重载。

**调试打印 table**：

```lua
print(usagi.dump(State))   -- 递归美化打印，能处理循环引用
print(usagi.to_json(State))-- 输出 JSON 字符串
```

直接 `print(State)` 只会得到 `table: 0x55a...`，没用。

---

## 15. 暂停菜单与内置工具

**暂停菜单是白送的**，不用写一行代码。按 `Esc` / `P` / 手柄 Start 打开，里面有：继续、音量（音效/音乐分开）、全屏切换、清空存档、重置游戏、退出，以及**键位/手柄重映射**。玩家的设置会持久化。

暂停时 `_update` 不跑、`_draw` 照跑，所以背景画面静止但还看得见。

如果你想自己做菜单，把 `_config().pause_menu` 设为 `false`，然后用：

```lua
usagi.menu_item("Continue", function() return end)      -- 最多 3 项；回调 return true 保持菜单打开
usagi.clear_menu_items()
usagi.toggle_fullscreen()
usagi.quit()
```

**`usagi tools`** 是个 1280×720 的辅助窗口，四个标签：

| 键 | 工具 | 用途 |
| --- | --- | --- |
| `1` | Jukebox | 试听 `sfx/` 里所有音效，上下键切换自动播放 |
| `2` | TilePicker | 看 `sprites.png` 的网格和索引，左键复制 `spr` 索引、右键拖框复制 `sspr` 参数 |
| `3` | SaveInspector | 看 `save.json` 的真实内容和路径，可一键清除 |
| `4` | ColorPalette | 16 色调色板，点击复制 Lua 常量 |

TilePicker 里 `Q`/`E` 或滚轮缩放，`R` 切换网格，`B` 换背景色（透明像素在白底/黑底下的观感不同）。

---

## 16. 导出与发布

```sh
usagi export              # 全部平台
usagi export --target web # 只要网页版
```

`export/` 目录里会得到：

```
my_game-linux.zip            # Linux x86_64
my_game-linux-aarch64.zip    # Linux ARM（树莓派等）
my_game-macos.zip            # macOS 通用（Apple Silicon + Intel）
my_game-windows.zip          # Windows x86_64
my_game-web.zip              # index.html + usagi.js/wasm + game.usagi
my_game.usagi               # 便携包，usagi run my_game.usagi
```

非本机平台靠官方 runtime 模板，**首次导出需要联网**下载并校验（之后离线可用）。macOS 的 `.app` 没有签名，朋友第一次打开要**右键 → 打开**（否则会被 Gatekeeper 拦住说文件损坏）。

**发布到 itch.io**（免费、最常用）：

1. 注册后从 Dashboard 点 "Create new project"
2. **Kind of project** 选 **HTML**
3. Uploads 里上传 `export/` 下的几个 zip，按平台标注
4. 给 `my_game-web.zip` 勾上 **"This file will be played in the browser"**（不勾网页版打不开）
5. Save & view page，测试没问题再改可见性为 Public

想要自定义网页外壳：在 `main.lua` 旁放一个 `shell.html`，导出时自动使用。

如果哪天项目"毕业"了（要上手机、要 4 个以上按钮、要完整 `love.graphics`），官方提供一条迁移路径：

```sh
usagi loveify my_game my_game-love   # 生成 Love2D 11.5 项目，含 API 兼容层
```

---

## 17. 快捷键速查

开发时（`usagi dev`）：

| 键 | 作用 |
| --- | --- |
| 存盘 | 热重载，**保留游戏状态** |
| `F5` / `Ctrl+R` / `Cmd+R` | 硬重置：重跑 `_init` |
| `~` | FPS 覆盖层开关 |
| `Esc` / `P` / 手柄 Start | 暂停菜单 |
| `Shift+Esc` | 退出（仅 dev） |
| `Shift+M` | 静音切换 |
| `F8` / `Cmd+F` | 截图 PNG 到 Downloads（2 倍放大） |
| `F9` / `Cmd+G` | **录 GIF**：把最近 5 秒存成动图，发社交网络神器 |
| `Alt+Enter` | 无边框全屏 |

> GIF 是"回滚录制"：精彩时刻**发生之后**再按 F9，前面的 5 秒已经被缓存在内存里了。

调试环境变量：`USAGI_VERBOSE=1 usagi dev` 会打印启动快照和每秒帧时间统计（avg/p50/p99/max），排查"跑得动但变慢了"这类问题很有用。

---

## 18. 新手最容易踩的 8 个坑

1. **忘了 `gfx.clear`** → 画面全是拖影。
2. **用 `x = x + 3` 而不是 `x = x + speed * dt`** → 换台电脑游戏速度就变了。
3. **删数组元素时正序遍历** → 悄悄跳过元素，出现"有些敌人打不死"。必须 `for i = #t, 1, -1`。
4. **在 `_init` 里加了新字段，存盘后报 nil 错** → 热重载不跑 `_init`。按 **F5**。
5. **把游戏状态放在文件顶部的 `local` 里** → 每次存盘被重置，玩到一半全没了。状态全部进 `State`。
6. **矩形和圆的定位原点搞混**（左上角 vs 圆心）→ 碰撞判定偏移。给判定框单独写个函数最稳。
7. **判定框和图像一样大** → 看着没碰到却死了。判定框要小一圈。
8. **`gfx.spr` 索引从 0 开始数** → 画错了格子。它是 **1 起始**的（调色板同理，`COLOR_BLACK` 也是 1）。

再加两个次常见但很烦的：

- **`game_id` 没设** → 存档会落到奇怪的目录，甚至和其他项目串。
- **中文画不出来** → 内置字体没有 CJK，必须 `usagi font bake` 生成 `font.png`。

---

## 19. 接下来学什么

按这个顺序走，性价比最高：

1. **先把第 9 节的迷你游戏自己重敲一遍**（不要复制粘贴——官方书特意强调这点，敲的过程就是记住语法和 API 的过程）。然后按提示给它加音效、最高分、难度递增。
2. **做官方书的两个项目**：
   - [Dodge 'Em Up](https://book.usagiengine.com/01-dodge-em-up.html) — 基础中的基础，从 print 到发布
   - [Shoot 'Em Up](https://book.usagiengine.com/02-shoot-em-up.html) — 敌人波次、瞄准弹幕（用到 `math.atan`/`cos`/`sin`）、重构、计分、音效
3. **读 recipes 里最实用的几篇**：Scenes（场景切换）、Collision Detection、Particles、Making Dev Tools、Level Editors。
4. **翻源码**：官方示例全是公有领域，随便抄——
   - [Usagi 示例集](https://codeberg.org/brettchalupa/usagi/src/branch/main/examples)
   - [Bomberfrog](https://github.com/brettchalupa/bomberfrog) — 完整发布的横版弹幕游戏
   - [SokoWorld](https://github.com/brettchalupa/sokoworld) — 推箱子，含自定义关卡解析和存档
5. **参加一次 game jam**。这是把"会写代码"变成"能做游戏"的最快方式。

**速查卡**（贴在编辑器旁边）：

```lua
-- 生命周期
_init()  _update(dt)  _draw(dt)

-- 画
gfx.clear(color)  gfx.text(t,x,y,c)  gfx.rect_fill(x,y,w,h,c)
gfx.circ_fill(x,y,r,c)  gfx.spr(i,x,y)  gfx.sspr(sx,sy,sw,sh,dx,dy)

-- 输入
input.held(A)  input.pressed(A)  input.released(A)  input.mapping_for(A)
-- A: LEFT RIGHT UP DOWN BTN1 BTN2 BTN3

-- 声音
sfx.play(name)  music.loop(name)  music.stop()

-- 工具
util.clamp(v,lo,hi)  util.vec_normalize(v)  util.lerp(a,b,t)
util.rect_overlap(a,b)  util.circ_rect_overlap(c,r)  util.vec_dist(a,b)

-- 引擎
usagi.GAME_W  usagi.GAME_H  usagi.SPRITE_SIZE  usagi.IS_DEV
usagi.save(t)  usagi.load()  usagi.read_json(p)  usagi.elapsed
usagi.dump(t)  usagi.measure_text(s)

-- 手感
effect.hitstop(t)  effect.screen_shake(t,int)  effect.flash(t,c)  effect.slow_mo(t,scale)
```

**官方链接**

- 官网/文档：<https://usagiengine.com/>
- 官方书：<https://book.usagiengine.com/>
- 55 秒预告片：<https://assets.brettchalupa.com/usagi.mp4>
- 快速上手视频：<https://www.youtube.com/watch?v=0i1wIm6c6Rw>
- 更新日志：<https://usagiengine.com/changelog>
- 源码（Codeberg，开发主仓）：<https://codeberg.org/brettchalupa/usagi>
- Discord：<https://usagiengine.com/discord>（书有专门的 `#book` 频道，卡住了就问）
- Reddit：<https://reddit.com/r/UsagiEngine>

---

Usagi 的源码和官方书都献给了公有领域（public domain），引擎免费、书免费、视频也免费。如果你觉得有用，作者只有一个小请求：做点小游戏，把它发出来。
