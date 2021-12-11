import os
import sys
import time

import requests

# clientKey：在个人中心获取
clientKey = "7ac506e45f275409e2b2e71bb7c6aa71048df1af1115"
websiteKey = "6Lcmk0kcAAAAAG-dUsJJUbEOf2Ph2ZdGLMCojehi"
websiteURL = "https://pbqc.quotabooking.gov.hk/"
task_type = "RecaptchaV2EnterpriseTaskProxyless"
url = "https://api.yescaptcha.com/createTask"

data = {
    "clientKey": clientKey,
    "task": {
        "websiteURL": websiteURL,
        "websiteKey": websiteKey,
        "type": task_type
    }
}


def create_task() -> str:
    # """
    # 第一步，创建验证码任务
    # :param
    # :return taskId : string 创建成功的任务ID
    # """
    try:
        # 发送JSON格式的数据
        result = requests.post(url, json=data).json()
        taskId = result.get('taskId')
        if taskId is not None:
            return taskId
        print(result)

    except Exception as e:
        print(e)


def get_response(taskID: str):
    # 循环请求识别结果，3秒请求一次
    print(f"taskId:{str}")
    times = 0
    while times < 120:
        try:
            url = f"https://api.yescaptcha.com/getTaskResult"
            data = {
                "clientKey": clientKey,
                "taskId": taskID
            }
            result = requests.post(url, json=data).json()
            solution = result.get('solution', {})
            if solution:
                response = solution.get('gRecaptchaResponse')
                if response:
                    return response
            print(result)
        except Exception as e:
            print(e)

        times += 3
        time.sleep(3)
    return None


def pathutil(fileName) -> str:
    debug_vars = dict((a, b) for a, b in os.environ.items()
                      if a.find('IPYTHONENABLE') >= 0)
    # 根据不同场景获取根目录
    if len(debug_vars) > 0:
        """当前为debug运行时"""
        rootPath = sys.path[2]
    elif getattr(sys, 'frozen', False):
        """当前为exe运行时"""
        rootPath = os.getcwd()
    else:
        """正常执行"""
        rootPath = sys.path[1]
    # 替换斜杠
    rootPath = rootPath.replace("\\", "/")
    """按照文件名拼接资源文件路径"""
    filePath = "%s/docs/%s" % (rootPath, fileName)
    return filePath
