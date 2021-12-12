import datetime
import logging
from operator import mod

formatter = logging.Formatter(
    fmt='%(asctime)s %(filename)s[line:%(lineno)d] %(levelname)s %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S')

logger = logging.getLogger(__file__)
logger.setLevel(logging.DEBUG)
ch = logging.StreamHandler()
ch.setFormatter(formatter)
fh = logging.FileHandler("__file__" + ".log")
fh.setFormatter(formatter)
logger.addHandler(ch)
logger.addHandler(fh)

import threading
import time
from abc import ABC, abstractmethod
from concurrent.futures import ThreadPoolExecutor
from threading import RLock

import requests
from selenium.webdriver.common.keys import Keys
from splinter import Browser

from core import helper

url = 'https://pbqc.quotabooking.gov.hk/booking/hk/index_tc.jsp'
##chrome 窗口数（上线需填10）
max_windows_size = 1
##chrome 机器编号（上线需根据机器填 ）
machine_no = 1
machine_size = 5

CBP_ID = ''
##预定日期（上线需填 2022-01-03 ）
bookingDate = "2021-12-25"
##日期是否开放（上线需填1）
avalible_num = 0
##开放日期（上线需填 2021-12-13 09:00:00）
avalible_date = '2021-12-13 09:00:00'

futures = []
pool = ThreadPoolExecutor(max_workers=16)
lock = RLock()
wins = {}


class Handler(ABC):
    @abstractmethod
    def set_next(self, handler):
        pass

    @abstractmethod
    def handle(self, request):
        pass


class AbstractHandler(Handler):
    """
    The default chaining behavior can be implemented inside a base handler
    class.
    """

    _next_handler: Handler = None

    def __init__(self, user, browser, users) -> None:
        self.user = user
        self.browser = browser
        self.users = users

    def set_next(self, handler: Handler) -> Handler:
        self._next_handler = handler
        return handler

    def handle(self, win):
        if self._next_handler:
            return self._next_handler.handle(win)

        return None


"""
All Concrete Handlers either handle a request or pass it to the next handler in
the chain.
"""


class StepOneHandler(AbstractHandler):

    def set_next(self, handler: Handler) -> Handler:
        self._next_handler = handler
        return handler

    def handle(self, win):
        with lock:
            self.browser.windows.current = win
            try:
                # print("填充外傭身份證明文件類型")
                logger.info(f"窗口:{win.index}，执行步骤一，线程ID:{threading.current_thread().ident}")

                while self.browser.is_element_not_present_by_id('step_1_other_documentId', .1):
                    continue

                while True:
                    if self.browser.find_by_id('step_1_other_documentId', 1).first.visible:
                        break

                self.browser.select('step_1_documentId_Type', self.user.step_1_documentId_Type)
                # print("填充外傭身份證明文件號碼")
                self.browser.find_by_id('step_1_other_documentId', 1).first.fill(self.user.step_1_other_documentId)

                def respCallback(resp):
                    with lock:
                        try:
                            if resp is not None:
                                self.browser.windows.current = win
                                self.browser.execute_script(
                                    f'document.getElementById("g-recaptcha-response").value="{resp.result()}"')
                                self.browser.find_by_id('step_1_other_documentId', 1).first.type(Keys.ENTER)

                                if self._next_handler is not None:
                                    self._next_handler.handle(win)
                            else:
                                with lock:
                                    print(f'窗口:{win.index},步骤一, 获取任务结果失败')
                                    self.browser.windows.current = win
                                    self.browser.reload()
                                    wins[win.index] = (True, win)
                        except BaseException as ex:
                            logger.error(f"步骤一回调执行异常，异常窗口:{win.index}, 异常：{ex}")
                            with lock:
                                self.browser.windows.current = win
                                self.browser.reload()
                                wins[win.index] = (True, win)

                def taskCallBack(resp):
                    taskId = resp.result()
                    if taskId is not None:
                        f1 = pool.submit(lambda p: helper.get_response(*p), [taskId])
                        f1.add_done_callback(respCallback)
                        print(f'创建任务:{resp.result}')
                    else:
                        with lock:
                            print(f'窗口:{win.index}, 创建任务失败')
                            self.browser.windows.current = win
                            self.browser.reload()
                            wins[win.index] = (True, win)

                f = pool.submit(helper.create_task)
                f.add_done_callback(taskCallBack)

            except BaseException as e:
                logger.error(f"步骤一执行异常，异常窗口:{win.index}, 异常：{e}")
                with lock:
                    self.browser.windows.current = win
                    self.browser.reload()
                    wins[win.index] = (True, win)


class StepTwoHandler(AbstractHandler):

    def handle(self, win):
        with lock:
            self.browser.windows.current = win
            try:
                logger.info(f"窗口:{win.index}，执行步骤二，线程ID:{threading.current_thread().ident}")

                while self.browser.is_element_not_present_by_id('note_2_confirm', .1):
                    continue

                self.browser.execute_script("document.getElementById('pics_consent').checked=true;"
                                            "document.getElementById('nr_consent').checked=true;"
                                            "document.getElementById('gr_consent').checked=true;"
                                            "document.getElementById('note_2_confirm').click()")

            except BaseException as e:
                logger.error(f"步骤二执行异常，异常窗口:{win.index}, 异常：{e}")
                with lock:
                    self.browser.windows.current = win
                    self.browser.reload()
                    wins[win.index] = (True, win)

        super().handle(win)


class StepThreeHandler(AbstractHandler):

    def handle(self, win):
        with lock:
            self.browser.windows.current = win
            try:
                logger.info(f"窗口:{win.index}，执行步骤三，线程ID:{threading.current_thread().ident}")
                while self.browser.is_element_not_present_by_id('step_2_form_control_confirm', 1):
                    continue

                self.browser.find_by_id('step_2_fdh_name', 1).first.fill(self.user.step_2_fdh_name)
                self.browser.select('step_2_fdh_meal_preference', self.user.step_2_fdh_meal_preference)
                if self.user.step_2_communicate_in_english:
                    self.browser.find_by_id('step_2_communicate_in_english_yes', 1).first.click()
                else:
                    self.browser.find_by_id('step_2_communicate_in_english_no', 1).first.click()
                if self.user.step_2_communicate_in_cantonese:
                    self.browser.find_by_id('step_2_communicate_in_cantonese_yes', 1).first.click()
                else:
                    self.browser.find_by_id('step_2_communicate_in_cantonese_no', 1).first.click()
                if self.user.step_2_communicate_in_putonghua:
                    self.browser.find_by_id('step_2_communicate_in_putonghua_yes', 1).first.click()
                else:
                    self.browser.find_by_id('step_2_communicate_in_putonghua_no', 1).first.click()
                self.browser.find_by_id('step_2_name_of_contact_person', 1).first.fill(
                    self.user.step_2_name_of_contact_person)
                self.browser.find_by_id('step_2_email_of_contact_person', 1).first.fill(
                    self.user.step_2_email_of_contact_person)
                self.browser.find_by_id('step_2_tel_for_sms_notif', 1).first.fill(self.user.step_2_tel_for_sms_notif)
                self.browser.find_by_id('step_2_tel_for_sms_notif_confirm', 1).first.fill(
                    self.user.step_2_tel_for_sms_notif)
                self.browser.find_by_id('step_2_tel_for_sms_notif_confirm', 1).first.fill(
                    self.user.step_2_tel_for_sms_notif)
                # 测试代码，使得某个开始日期可选
                # todo

                # print("強制檢疫開始日期")
                flag = True
                cbps = self.browser.find_by_name('step_2_CBP_ID', 5)
                for cbp in cbps:
                    if self.user.step_1_documentId_Type == 'Indonesian Passport':
                        break
                    if cbp.outer_html and cbp.outer_html.count('disable') <= 0:
                        cbp.click()
                        flag = False
                        break

                if flag:
                    self.browser.execute_script(f"document.getElementById('booking_period_{CBP_ID}').disabled='';"
                                                f"document.getElementById('booking_period_{CBP_ID}').checked = true;")

                self.browser.find_by_id('step_2_form_control_confirm', 1).first.click()
                user = self.user
                browser = self.browser

                def respCallback(resp):
                    with lock:
                        try:
                            if resp is not None:
                                self.browser.windows.current = win
                                self.browser.execute_script(
                                    f'document.getElementById("g-recaptcha-response-1").value="{resp.result()}"')
                                while self.browser.is_element_not_present_by_value('確認', .1):
                                    continue
                                self.browser.find_by_value('確認', 1).first.click()
                                print(f"执行成功:{user.step_2_fdh_name}")
                            else:
                                with lock:
                                    print(f'窗口:{win.index}, 步骤三,获取任务结果失败')
                                    self.browser.windows.current = win
                                    self.browser.reload()
                                    wins[win.index] = (True, win)
                        except BaseException as ex:
                            logger.error(f"步骤三回调执行异常，异常窗口:{win.index}, 异常：{ex}")
                            with lock:
                                self.browser.windows.current = win
                                self.browser.reload()
                                wins[win.index] = (True, win)

                    times = 0
                    while times < 60:
                        with lock:
                            browser.windows.current = win
                            if browser.is_element_present_by_id('booking_result') and \
                                    browser.find_by_id('booking_result', 1).first.visible:
                                logging.info(f"执行结果:{browser.find_by_id('booking_result', 1).first.html}")
                                break
                            elif browser.is_element_present_by_xpath('//*[@class="reg_app"]') and \
                                    browser.find_by_xpath('//*[@class="reg_app"]', 1).first.visible:
                                logging.info("执行结果:" + browser.find_by_xpath('//*[@class="reg_app"]', 1).first.html)
                                break

                        times += 3
                        time.sleep(2)

                    with lock:
                        browser.windows.current = win
                        browser.reload()
                        wins[win.index] = (True, win)

                def taskCallBack(resp):
                    taskId = resp.result()
                    if taskId is not None:
                        f1 = pool.submit(lambda p: helper.get_response(*p), [taskId])
                        f1.add_done_callback(respCallback)
                        print(f'创建任务:{resp.result}')
                    else:
                        with lock:
                            print(f'窗口:{win.index}, 步骤三,创建任务失败')
                            self.browser.windows.current = win
                            self.browser.reload()
                            wins[win.index] = (True, win)

                f = pool.submit(helper.create_task)
                f.add_done_callback(taskCallBack)
            except BaseException as e:
                logger.error(f"步骤三执行异常，异常窗口:{win.index}, 异常：{e}")
                with lock:
                    self.browser.windows.current = win
                    self.browser.reload()
                    wins[win.index] = (True, win)


class HandleChain(object):

    def __init__(self, browser: Browser, users) -> None:
        self.last = None
        self.first = None
        self.browser = browser
        userList = []
        n = 0
        for i, val in enumerate(users):
            if i == (machine_no + n * 5):
                userList.append(val)
                n += 1
        self.users = userList

    def process(self):
        for i in range(min(len(self.users), max_windows_size) - 1):
            self.browser.execute_script(f"window.open('{url}');")

        for win in self.browser.windows:
            self.browser.windows.current = win
            while len(self.browser.html) <= 0:
                continue
            print("初始化窗口")
            wins[win.index] = (True, win)

        d_time = datetime.datetime.strptime(f"{avalible_date}", '%Y-%m-%d %H:%M:%S')
        flag = True
        while flag:
            avalible_booking_periods = detect()
            if avalible_booking_periods and len(avalible_booking_periods) > 0:
                global CBP_ID
                for avalible in avalible_booking_periods:
                    if avalible['CBP_START_DATE'] == bookingDate:
                        CBP_ID = avalible['CBP_ID']
                    if (avalible['value'] == avalible_num) or (datetime.datetime.now() > d_time):
                        flag = False
                if not flag:
                    break
            time.sleep(1)

        while True:
            # 范围时间
            # 当前时间
            n_time = datetime.datetime.now()

            # 判断当前时间是否在范围时间内
            if n_time > d_time:
                break

        while True:
            for k, v in wins.items():
                idx = k
                flag = v[0]
                if flag and len(self.users) > 0 and url == v[1].url:
                    with lock:
                        self.browser.windows.current = v[1]
                        print(flag)
                        user = self.users.pop()
                        stepone = StepOneHandler(browser=self.browser, user=user, users=self.users)
                        steptwo = StepTwoHandler(browser=self.browser, user=user, users=self.users)
                        stepthree = StepThreeHandler(browser=self.browser, user=user, users=self.users)

                        stepone.set_next(steptwo)
                        steptwo.set_next(stepthree)
                        self.first = stepone
                        self.last = stepthree

                        try:
                            wins[idx] = (False, v[1])
                            self.first.handle(v[1])

                        except BaseException as e:
                            print(e)
            if len(self.users) == 0:
                time.sleep(60)
                break


# 检测酒店日期是否开放
def detect() -> list:
    times = 0
    while times < 120:
        try:
            bookingUrl = f"https://pbqc.quotabooking.gov.hk/booking/available_booking_period_pbqc?departure_from=1"
            result = requests.get(bookingUrl).json()
            avalible_bookings = result.get('avalible_bookings', {})
            if avalible_bookings and len(avalible_bookings):
                avalible_booking = avalible_bookings[0]
                avalible_booking_period = avalible_booking.get('avalible_booking_period', {})
                if avalible_booking_period:
                    return avalible_booking_period
            print(result)
        except Exception as e:
            print(e)

        times += 3
        time.sleep(3)
    return None
