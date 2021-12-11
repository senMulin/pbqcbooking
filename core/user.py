# 生成用户列表
from pandas import DataFrame

meal_dic = {
    '中餐': 'Chinese',
    '西餐': 'Western',
    '素食餐': 'Vegetarian',
    '低糖低鹽餐': 'Low-sugar and salt',
    '清真餐': 'Halal',
    '印度餐': 'Indian',
    '糖尿病餐': 'Diabetic',
    '麩質特製餐': 'Gluten-Friendly'
}


def genUsers(df: DataFrame):
    users = []
    for row in df.iterrows():
        user = User()
        user.step_1_documentId_Type = row[1]['身份證明文件類型']
        user.step_1_other_documentId = row[1]['身份證明文件號碼']
        user.step_2_fdh_name = row[1]['外傭姓名']
        user.step_2_fdh_meal_preference = row[1]['外傭飲食偏好']
        user.step_2_communicate_in_english = row[1]['英語溝通']
        user.step_2_communicate_in_cantonese = row[1]['廣東話溝通']
        user.step_2_communicate_in_putonghua = row[1]['普通話溝通']
        user.step_2_name_of_contact_person = row[1]['聯絡人姓名']
        user.step_2_email_of_contact_person = row[1]['聯絡人電郵地址']
        user.step_2_tel_for_sms_notif = row[1]['聯絡人手提電話號碼']
        users.append(user)
    return users


class User:
    # 文件類型
    @property
    def step_1_documentId_Type(self):
        return self._step_1_documentId_Type

    @step_1_documentId_Type.setter
    def step_1_documentId_Type(self, value):
        self._step_1_documentId_Type = value

    # 身份證明文件號碼
    @property
    def step_1_other_documentId(self):
        return self._step_1_other_documentId

    @step_1_other_documentId.setter
    def step_1_other_documentId(self, value):
        self._step_1_other_documentId = value

    # 外傭姓名
    @property
    def step_2_fdh_name(self):
        return self._step_2_fdh_name

    @step_2_fdh_name.setter
    def step_2_fdh_name(self, value):
        if value:
            self._step_2_fdh_name = value.strip('"')

    # 外傭飲食偏好
    @property
    def step_2_fdh_meal_preference(self):
        return self._step_2_fdh_meal_preference

    @step_2_fdh_meal_preference.setter
    def step_2_fdh_meal_preference(self, value):
        if meal_dic.__contains__(value):
            self._step_2_fdh_meal_preference = meal_dic[value]
        else:
            self._step_2_fdh_meal_preference = 'No special preference'

    # 英語溝通
    @property
    def step_2_communicate_in_english(self):
        return self._step_2_communicate_in_english

    @step_2_communicate_in_english.setter
    def step_2_communicate_in_english(self, value):
        if value and value.lower() == 'yes':
            self._step_2_communicate_in_english = True
        else:
            self._step_2_communicate_in_english = False

    # 普通話溝通
    @property
    def step_2_communicate_in_putonghua(self):
        return self._step_2_communicate_in_putonghua

    @step_2_communicate_in_putonghua.setter
    def step_2_communicate_in_putonghua(self, value):
        if value and value.lower() == 'yes':
            self._step_2_communicate_in_putonghua = True
        else:
            self._step_2_communicate_in_putonghua = False

    # 廣東話溝通
    @property
    def step_2_communicate_in_cantonese(self):
        return self._step_2_communicate_in_cantonese

    @step_2_communicate_in_cantonese.setter
    def step_2_communicate_in_cantonese(self, value):
        if value and value.lower() == 'yes':
            self._step_2_communicate_in_cantonese = True
        else:
            self._step_2_communicate_in_cantonese = False

    # 聯絡人姓名
    @property
    def step_2_name_of_contact_person(self):
        return self._step_2_name_of_contact_person

    @step_2_name_of_contact_person.setter
    def step_2_name_of_contact_person(self, value):
        self._step_2_name_of_contact_person = value

    # 聯絡人電郵地址
    @property
    def step_2_email_of_contact_person(self):
        return self._step_2_email_of_contact_person

    @step_2_email_of_contact_person.setter
    def step_2_email_of_contact_person(self, value):
        self._step_2_email_of_contact_person = value

    # 聯絡人手提電話號碼
    @property
    def step_2_tel_for_sms_notif(self):
        return self._step_2_tel_for_sms_notif

    @step_2_tel_for_sms_notif.setter
    def step_2_tel_for_sms_notif(self, value):
        self._step_2_tel_for_sms_notif = value
    #
    # @property
    # def step_2_communicate_in_whatsapp_no(self):
    #     return self._step_2_communicate_in_whatsapp_no
    #
    # @step_2_communicate_in_whatsapp_no.setter
    # def step_2_communicate_in_whatsapp_no(self, value):
    #     self._step_2_communicate_in_whatsapp_no = value
