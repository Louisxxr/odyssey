from flask import request, jsonify, session
from flask.views import MethodView
from redis import StrictRedis
from views.utils.db_operation import *
from views.utils.send_authcode import *
import os
import time
import random

class AuthcodeServiceView(MethodView):
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

class Verify_emailServiceView(MethodView):
    def get(self):
        email = request.args.get('email')
        
        sql = "select count(*) as 'count' from user where email = %s"
        values = (email) # 避免sql注入
        res = query(sql, values)
        if res and res[0]['count'] > 0:
            return "1", 200 # 提示用户邮箱已注册
        if not res:
            return "2", 200 # 查询失败，提示用户请稍后再试
        return "0", 200 # 邮箱未注册

class Login_stateServiceView(MethodView):
    def get(self):
        username = session.get('username')
        if username is None:
            return "0", 200 # 未登录
        
        sql = "select head from user where username = %s"
        values = (username)
        res = query(sql, values)
        if res:
            return jsonify({ "head": res[0]['head'], "username": username }), 200 # 已登录
        return jsonify({ "head": "/static/img/head/default.jpg", "username": username }), 200 # 数据库错误，暂用默认头像代替

class LogoutServiceView(MethodView):
    def get(self):
        session.pop('username')
        return "", 200

class UserinfoServiceView(MethodView):
    def get(self):
        username = session.get('username')

        sql = "select sex, signature, head from user where username = %s"
        values = (username)
        res = query(sql, values)
        if res:
            return jsonify({
                "username": username,
                "sex": res[0]['sex'],
                "signature": res[0]['signature'],
                "head": res[0]['head']
            }), 200
        return jsonify({
            "username": username,
            "sex": null,
            "signature": "",
            "head": "/static/img/head/default.jpg"
        }), 200

class Upload_imgServiceView(MethodView):
    def post(self, item):
        username = session.get('username')
        img = request.files.get('file')
        path = '/static/img/' + item + '/' + username + '-' + str(time.time()) + '.' + img.content_type.split('/')[1]
        img.save(os.getcwd() + path)
        return path, 200

class Province_listServiceView(MethodView):
    def get(self):
        sql = "select * from province order by provinceid"
        res = query(sql, ())
        ret = ""
        for item in res:
            ret += str(item['provinceid']) + ' ' + item['provincename'] + ' '
        ret = ret[0 : -1]
        return ret, 200

class City_listServiceView(MethodView):
    def get(self):
        provinceid = int(request.args.get('provinceid'))

        sql = "select cityid, cityname from city where provinceid = %s order by cityid"
        values = (provinceid)
        res = query(sql, values)
        ret = ""
        for item in res:
            ret += str(item['cityid']) + ' ' + item['cityname'] + ' '
        ret = ret[0 : -1]
        return ret, 200