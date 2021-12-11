import logging
import time
from abc import ABC, abstractmethod
from typing import Any, Optional
from concurrent.futures import ThreadPoolExecutor
from threading import RLock

from selenium.webdriver.common.keys import Keys
from splinter import Browser

from core import helper

url = 'https://pbqc.quotabooking.gov.hk/booking/hk/index_tc.jsp'
max_windows_size = 2

futures = []
pool = ThreadPoolExecutor(max_workers=16)
lock = RLock()


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

    def __init__(self, user, browser) -> None:
        self.user = user
        self.browser = browser

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
                print(self.user.step_1_documentId_Type)

                while self.browser.is_element_not_present_by_id('step_1_other_documentId', .1):
                    continue

                self.browser.select('step_1_documentId_Type', self.user.step_1_documentId_Type)
                # print("填充外傭身份證明文件號碼")
                self.browser.find_by_id('step_1_other_documentId', 1).first.fill(self.user.step_1_other_documentId)

                def callback(resp):
                    with lock:
                        if resp is not None:
                            self.browser.windows.current = win
                            self.browser.execute_script(
                                f'document.getElementById("g-recaptcha-response").value="{resp.result()}"')
                            self.browser.find_by_id('step_1_other_documentId', 1).first.type(Keys.ENTER)

                            if self._next_handler is not None:
                                self._next_handler.handle(win)

                taskId = helper.create_task()
                if taskId is not None:
                    f = pool.submit(lambda p: helper.get_response(*p), [taskId])
                    f.add_done_callback(callback)

                print('创建任务:', taskId)
            except BaseException as e:
                print(e)


class StepTwoHandler(AbstractHandler):

    def __init__(self, user, browser) -> None:
        super().__init__(user, browser)

    def handle(self, win):
        with lock:
            self.browser.windows.current = win
            try:
                while self.browser.is_element_not_present_by_id('note_2_confirm', .1):
                    continue
                self.browser.execute_script("document.getElementById('pics_consent').checked=true;"
                                            "document.getElementById('nr_consent').checked=true;"
                                            "document.getElementById('gr_consent').checked=true;"
                                            "document.getElementById('note_2_confirm').click()")

            except BaseException as e:
                logging.error(e)

        super().handle(win)


class StepThreeHandler(AbstractHandler):
    def __init__(self, user, browser) -> None:
        super().__init__(user, browser)

    def handle(self, win):
        with lock:
            self.browser.windows.current = win
            try:
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
                self.browser.execute_script("document.getElementById('booking_period_115').disabled='';")
                # print("強制檢疫開始日期")
                cbps = self.browser.find_by_name('step_2_CBP_ID', 5)
                for cbp in cbps:
                    if cbp.outer_html and cbp.outer_html.count('disable') <= 0:
                        cbp.click()
                        break

                self.browser.find_by_id('step_2_form_control_confirm', 1).first.click()
                user = self.user

                def callback(resp):
                    with lock:
                        if resp is not None:
                            self.browser.windows.current = win
                            self.browser.execute_script(
                                f'document.getElementById("g-recaptcha-response-1").value="{resp.result()}"')
                            while self.browser.is_element_not_present_by_value('確認', .1):
                                continue
                            self.browser.find_by_value('確認', 1).first.click()
                            print(f"执行成功:{user.step_2_fdh_name}")

                taskId = helper.create_task()
                if taskId is not None:
                    f = pool.submit(lambda p: helper.get_response(*p), [taskId])
                    f.add_done_callback(callback)

                print(f'创建任务:{taskId}', )

            except BaseException as e:
                print(e)

class StepFourHandler(AbstractHandler):
    def __init__(self, user, browser) -> None:
        super().__init__(user, browser)

    def handle(self, win):
        with lock:
            self.browser.windows.current = win
            try:
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
                self.browser.execute_script("document.getElementById('booking_period_115').disabled='';")
                # print("強制檢疫開始日期")
                cbps = self.browser.find_by_name('step_2_CBP_ID', 5)
                for cbp in cbps:
                    if cbp.outer_html and cbp.outer_html.count('disable') <= 0:
                        cbp.click()
                        break

                self.browser.find_by_id('step_2_form_control_confirm', 1).first.click()
                user = self.user

                def callback(resp):
                    with lock:
                        if resp is not None:
                            self.browser.windows.current = win
                            self.browser.execute_script(
                                f'document.getElementById("g-recaptcha-response-1").value="{resp.result()}"')
                            while self.browser.is_element_not_present_by_value('確認', .1):
                                continue
                            self.browser.find_by_value('確認', 1).first.click()
                            print(f"执行成功:{user.step_2_fdh_name}")

                taskId = helper.create_task()
                if taskId is not None:
                    f = pool.submit(lambda p: helper.get_response(*p), [taskId])
                    f.add_done_callback(callback)

                print(f'创建任务:{taskId}', )

            except BaseException as e:
                print(e)


class HandleChain(object):

    def __init__(self, browser: Browser, users) -> None:
        self.last = None
        self.first = None
        self.browser = browser
        self.users = users

    def process(self):
        wins = {}
        for i in range(min(len(self.users), max_windows_size) - 1):
            self.browser.execute_script(f"window.open('{url}');")

        while True:
            for win in self.browser.windows:
                wins[win.index] = (True, win)

            for k, v in wins.items():
                idx = k
                flag = v[0]
                win = v[1]
                if flag and len(self.users) > 0 and url == win.url:
                    user = self.users.pop()
                    stepone = StepOneHandler(browser=self.browser, user=user)
                    steptwo = StepTwoHandler(browser=self.browser, user=user)
                    stepthree = StepThreeHandler(browser=self.browser, user=user)

                    stepone.set_next(steptwo)
                    steptwo.set_next(stepthree)
                    self.first = stepone
                    self.last = stepthree

                    try:
                        wins[idx] = (False, win)
                        time.sleep(1)
                        self.first.handle(win)

                    except BaseException as e:
                        print(e)
