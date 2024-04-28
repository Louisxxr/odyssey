from flask import request, jsonify, session
from flask.views import MethodView
from redis import StrictRedis
from views.utils.db_operation import *
from views.utils.send_authcode import *
import random

class AuthcodeserviceView(MethodView):
    def get(self):
        email = request.args.get('email')
        # authcode = ''
        # for i in range(6):
        #     authcode += str(random.randint(0, 9))
        
        # if send_authcode(email, authcode):
        #     conn = StrictRedis(host = 'localhost', port = 6379, db = 0)
        #     conn.set(email, authcode, 3600) # 一小时后过期
        #     return jsonify({ "result": "已发送" }), 200
        # return jsonify({ "result": "发送失败，请稍后再试" }), 200
        authcode = '123456'
        conn = StrictRedis(host = 'localhost', port = 6379, db = 0)
        conn.set(email, authcode, 3600) # 一小时后过期
        return jsonify({ "result": "已发送" }), 200

class VerifyemailserviceView(MethodView):
    def get(self):
        email = request.args.get('email')
        sql = "select count(*) as 'count' from user where email = %s"
        values = (email) # 避免sql注入
        res = query(sql, values)
        if res and res[0]['count'] > 0:
            return "1", 200 # 提示用户邮箱已注册
        if not res:
            return "2", 200 # 查询失败，提示用户请稍后再试
        return "0", 200 # 邮箱合法

class LoginstateserviceView(MethodView):
    def get(self):
        if session.get('username') is None:
            return "0", 200 # 未登录
        return "1", 200 # 已登录

class LogoutserviceView(MethodView):
    def get(self):
        session.pop('username')
        return "", 200