# -*- coding: utf-8 -*-

import pandas as pd
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from splinter import Browser

from core import user
from core.pdqcbookingstep import HandleChain

windows_size = 1
url = 'https://pbqc.quotabooking.gov.hk/booking/hk/index_tc.jsp'
path = '/Users/xingxingzi/mulin/project/python/pbqcbooking/docs/user.csv'
chromeOptions = webdriver.ChromeOptions()
is_proxy = True


def get_result(args):
    print(args)


# 初始化浏览器
def initBrowser():
    try:
        retry = 2
        chrome_options = Options()
        # chrome_options.add_argument('--no-sandbox')
        # chrome_options.add_argument('--disable-dev-shm-usage')
        # chrome_options.add_argument('--headless')

        browser = Browser(driver_name='chrome', options=chrome_options)
        while --retry > 0:
            browser.visit(url)
            if url == browser.url:
                return browser

        # browser.quit()
        return None
    except BaseException as e:
        print("访问异常 %s" % e)
        return None


class hackPdqc(object):
    # 启动浏览器访问页面
    def start(self):
        df = pd.read_csv(path,
                         sep=",(?=([^\"]*\"[^\"]*\")*[^\"]*$)", engine='python')
        users = user.genUsers(df)
        if len(users) == 0:
            print("用户列表不存在")
            return

        print("启动浏览器")
        browser = initBrowser()
        if browser is not None:
            chain = HandleChain(browser, users)
            chain.process()
        browser.quit()
