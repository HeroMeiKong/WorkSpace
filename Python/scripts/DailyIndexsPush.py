import datetime
import json
from operator import index
import os
import requests
import telegram
import time

host = "https://fapi.coinglass.com/api"

# 常量
DELAY = 3 * 60
LIMITTIMES = 10 # 重试次数
STARTHOUR = 8 # 开始时间
ENDHOUR = 12 # 最迟时间

flag = False # 今日查询任务是否执行
indexs = {
  "ahr999": {
    "ahr999": 0,
    "avg": 0, # 200 日均值
    "date": "",
    "value": "", # 昨日收线
    "advise": "" # 指标建议：抄底买入｜定投买入｜等待起飞｜无
  },
  "BTCmarketCap": {
    "value": 0,
    "rate": ""
  },
  "fearGreedIndex": {
    "value": 0,
    "advise": "" # 指标建议：可能是买入机会｜无
  },
  "BTCBubble": {
    "bd": 0,
    "bt": "", # BTC 推特趋势
    "c": 0,
    "gt": "", # BTC 谷歌趋势
    "hotKey": 0,
    "index": 0, # BTC 泡沫指数
    "price": "", # BTC 价格
    "sba": "", # BTC 活跃地址
    "time": "",
    "ts": "", # BTC 交易数
    "advise": "" # 指标建议：考虑买入｜无
  },
  "towYearMAMultiplier": {
    "buyQty": 0,
    "createTime": 0,
    "mA730": 0, # 两年移动平均线
    "mA730Mu5": 0, # 两年移动平均线 * 5
    "price": 0, # BTC 价格
    "sellQty": 0,
    "advise": "" # 指标建议：抄底买入｜逃顶卖出｜无
  }
}
status = 0 # 全局状态
# 0: 未开始
# 1: ahr999 success
# 2: BTCmarketCap success
# 3: fearGreedIndex success
# 4: BTCBubble success
# 5: towYearMAMultiplier success
# 100: send telegram messge success

# -1: ahr999 retry
# -2: BTCmarketCap retry
# -3: fearGreedIndex retry
# -4: BTCBubble retry
# -5: towYearMAMultiplier retry
# -100: send telegram messge retry

times = 0
telegram_id = ""

if os.path.exists("../../Privatekeys"):
  with open("../../Privatekeys", "r") as json_file:
    json_dict = json.load(json_file)
    id = json_dict.get("telegram_id")
    if id:
      telegram_id = id

def checkStatus():
  global flag

  while 1:
    year = datetime.datetime.now().year
    month = datetime.datetime.now().month if datetime.datetime.now().month > 9 else "0" + str(datetime.datetime.now().month)
    day = datetime.datetime.now().day if datetime.datetime.now().day > 9 else "0" + str(datetime.datetime.now().day)
    hour = datetime.datetime.now().hour
    minute = datetime.datetime.now().minute
    second = datetime.datetime.now().second

    if hour >= ENDHOUR and not flag:
      DailyIndexsPush(year, month, day, True)
    elif hour >= STARTHOUR and not flag:
      DailyIndexsPush(year, month, day)
    else:
      seconds = (23 - hour + STARTHOUR) * 3600 + (60 - minute) * 60 - second
      flag = False
      time.sleep(seconds)

# 每日数据推送：year：年, month：月, day：日, force：是否强制执行
def DailyIndexsPush(year, month, day, force=False):
  global status

  time.sleep(3)

  if status == 0 or status == -1:
    ahr999(year, month, day, force)
  elif status == 1 or status == -2:
    BTCmarketCap(year, month, day, force)
  elif status == 2 or status == -3:
    fearGreedIndex(year, month, day, force)
  elif status == 3 or status == -4:
    BTCBubble(year, month, day, force)
  elif status == 4 or status == -5:
    towYearMAMultiplier(year, month, day, force)
  elif status == 5 or status == -100:
    sendTelegramMessge(year, month, day)
  elif status == 100:
    status = 0
  else:
    DailyIndexsPush(year, month, day, force)

def marketCap(value):
  if value >= 10000 * 10000 * 10000 :
    return f"{round(value / 1000000000000, 2)}万亿"
  elif value >= 10000 * 10000:
    return f"{round(value / 100000000, 2)}亿"
  elif value >= 10000:
    return f"{round(value / 10000, 2)}万"
  else:
    return round(value, 2)

# 给 Telegram 发送消息
def sendTelegramMessge(year, month, day):
  global flag

  flag = True

  # 你的机器人token
  bot = telegram.Bot(token=telegram_id)
  # 不加ensure_ascii=False 结果会是ASCII编码，我们需要用中文正常显示
  msg = f"* {year}-{month}-{day} 数据推送(08:00 - 12:00)*\n\n"
  # ahr999 囤币指标
  msg = msg + f'*ahr999 囤币指标*\n - ahr999：*{round(indexs["ahr999"]["ahr999"], 2)}*\n - BTC 价格：${indexs["ahr999"]["value"]}\n - 200日定投成本：${round(indexs["ahr999"]["avg"], 2)}\n - 指标建议：*{indexs["ahr999"]["advise"]}*\n\n' if indexs["ahr999"] else msg + '* ahr999 囤币指标*\n - 今日数据获取失败\n\n'
  # BTC 市值占比
  msg = msg + f'*BTC市值占比*\n - 市值：${indexs["BTCmarketCap"]["value"]}\n - 市值占比：*{round(indexs["BTCmarketCap"]["rate"], 2)}%*\n\n' if indexs["BTCmarketCap"] else msg + "* BTC市值占比*\n - 今日数据获取失败\n\n"
  # 贪婪与恐惧指数
  msg = msg + f'*贪婪与恐惧指数*\n - 指数：*{indexs["fearGreedIndex"]["value"]}*\n - 指标建议：*{indexs["fearGreedIndex"]["advise"]}*\n\n' if indexs["fearGreedIndex"] else msg + '* 贪婪与恐惧指数 *：\n - 今日数据获取失败\n\n'
  # BTC 泡沫指数
  msg = msg + f'*BTC 泡沫指数*\n - BTC 泡沫指数：{indexs["BTCBubble"]["index"]}\n - BTC 推特趋势：{indexs["BTCBubble"]["bt"]}\n - BTC 谷歌趋势：{indexs["BTCBubble"]["gt"]}\n - BTC 活跃地址：{indexs["BTCBubble"]["sba"]}\n - BTC 交易数：{indexs["BTCBubble"]["ts"]}\n - 指标建议：*{indexs["BTCBubble"]["advise"]}*\n\n' if indexs["BTCBubble"] else msg + '* BTC 泡沫指数 *\n - 今日数据获取失败\n\n'
  # BTC 逃顶指数：两年MA乘数指标
  msg = msg + f'*BTC 逃顶指数*\n - 两年移动平均线：{round(indexs["towYearMAMultiplier"]["mA730"], 2)}\n - BTC 价格：{round(indexs["towYearMAMultiplier"]["price"], 2)}\n - 两年移动平均线 × 5：{round(indexs["towYearMAMultiplier"]["mA730Mu5"], 2)}\n - 指标建议：*{indexs["towYearMAMultiplier"]["advise"]}*\n\n' if indexs["towYearMAMultiplier"] else msg + '* BTC 逃顶指数：两年MA乘数指标 *\n - 今日数据获取失败\n\n'
  # 修改群ID和机器人
  bot.send_message(chat_id="@HeroMeiKong_DIP", text=msg, parse_mode="Markdown")

# ahr999 囤币指标
def ahr999(year, month, day, force):
  global indexs
  global status
  global times

  try:
    response = requests.get(host + "/index/ahr999", timeout=10, verify=False)
    data = response.json()
    target = data.get("data")[-1]

    if str(year) + "/" + str(month) + "/" + str(day) == target.get("date"):
      indexs["ahr999"] = target
      ahr999 = indexs["ahr999"]["ahr999"]
      advise = ""
      if ahr999 < 0.45:
        advise = "抄底买入"
      elif ahr999 <= 1.2:
        advise = "定投买入"
      elif ahr999 <= 5:
        advise = "等待起飞"
      else:
        advise = "无"
      indexs["ahr999"]["advise"] = advise
      status = 1
      times = 0
    else:
      if times >= LIMITTIMES or force:
        indexs["ahr999"] = ""
        status = 1
        times = 0
      else:
        status = -1
        times += 1
        time.sleep(DELAY)
  except:
    if times >= LIMITTIMES or force:
      indexs["ahr999"] = ""
      status = 1
      times = 0
    else:
      status = -1
      times += 1

# BTC 市值占比
def BTCmarketCap(year, month, day, force):
  global indexs
  global status
  global times

  try:
    response = requests.get(host + "/marketCapRank/history", timeout=10, verify=False, params={ "symbol": "BTC" })
    data = response.json()

    date = time.strftime("%Y/%m/%d", time.localtime(data.get("data").get("dateList")[-1] / 1000))
    if str(year) + "/" + str(month) + "/" + str(day) == date:
      indexs["BTCmarketCap"] = {
        "value": marketCap(data.get("data").get("marketCapList")[-1]),
        "rate": data.get("data").get("marketCapRateList")[-1] * 100
      }
      status = 2
      times = 0
    else:
      if times >= LIMITTIMES or force:
        indexs["BTCmarketCap"] = ""
        status = 2
        times = 0
      else:
        status = -2
        times += 1
        time.sleep(DELAY)
  except:
    if times >= LIMITTIMES or force:
      indexs["BTCmarketCap"] = ""
      status = 1
      times = 0
    else:
      status = -2
      times += 1

# 贪婪与恐惧指数
def fearGreedIndex(year, month, day, force):
  global indexs
  global status
  global times
  
  try:
    response = requests.get(host + "/index/history", timeout=10, verify=False, params={ "size": "" })
    data = response.json()

    date = time.strftime("%Y/%m/%d", time.localtime(data.get("data")[0].get("dates")[-1] / 1000))
    if str(year) + "/" + str(month) + "/" + str(day) == date:
      value = data.get("data")[0].get("values")[-1]
      advise = ""
      if value <= 10:
        advise = "可能是买入机会"
      else:
        advise = "无"
      indexs["fearGreedIndex"] = {
        "value": value,
        "advise": advise
      }
      status = 3
      times = 0
    else:
      if times >= LIMITTIMES or force:
        indexs["fearGreedIndex"] = ""
        status = 3
        times = 0
      else:
        status = -3
        times += 1
        time.sleep(DELAY)
  except:
    if times >= LIMITTIMES or force:
      indexs["fearGreedIndex"] = ""
      status = 3
      times = 0
    else:
      status = -3
      times += 1
      time.sleep(DELAY)

# BTC 泡沫指数
def BTCBubble(year, month, day, force):
  global indexs
  global status
  global times

  try:
    response = requests.get(host + "/index/bitcoinBubbleIndex", timeout=10, verify=False)
    data = response.json()
    target = data.get("data")[-1]

    if str(year) + "-" + str(month) + "-" + str(day) == target.get("time"):
      indexs["BTCBubble"] = target
      BTCBubble = target["index"]
      advise = ""
      if BTCBubble < 0:
        advise = "考虑买入"
      else:
        advise = "无"
      indexs["BTCBubble"]["advise"] = advise
      status = 4
      times = 0
    else:
      if times >= LIMITTIMES or force:
        indexs["BTCBubble"] = ""
        status = 4
        times = 0
      else:
        status = -4
        times += 1
        time.sleep(DELAY)
  except:
    if times >= LIMITTIMES or force:
      indexs["BTCBubble"] = ""
      status = 4
      times = 0
    else:
      status = -4
      times += 1

# BTC 逃顶指数：两年MA乘数指标
def towYearMAMultiplier(year, month, day, force):
  global indexs
  global status
  global times

  try:
    response = requests.get(host + "/index/towYearMAMultiplier", timeout=10, verify=False)
    data = response.json()
    target = data.get("data")[-1]
    date = time.strftime("%Y/%m/%d", time.localtime(target.get("createTime") / 1000))

    if str(year) + "/" + str(month) + "/" + str(day) == date:
      indexs["towYearMAMultiplier"] = target
      advise = ""
      if target["price"] < target["mA730"]:
        advise = "抄底买入"
      elif target["price"] > target["mA730Mu5"]:
        advise = "逃顶卖出"
      else:
        advise = "无"
      indexs["towYearMAMultiplier"]["advise"] = advise
      status = 5
      times = 0
    else:
      if times >= LIMITTIMES or force:
        indexs["towYearMAMultiplier"] = ""
        status = 5
        times = 0
      else:
        status = -5
        times += 1
        time.sleep(DELAY)
  except:
    if times >= LIMITTIMES or force:
      indexs["towYearMAMultiplier"] = ""
      status = 5
      times = 0
    else:
      status = -5
      times += 1

checkStatus()
