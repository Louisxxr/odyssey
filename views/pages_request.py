from flask import render_template, request, jsonify
from flask.views import MethodView
from redis import StrictRedis
from views.utils.db_operation import *

class MainpageView(MethodView):
    def get(self):
        return render_template('/general.html')

class LoginpageView(MethodView):
    def get(self):
        # 验证登录
        return render_template('/general.html')

class RegisterpageView(MethodView):
    def get(self):
        # 验证登录
        return render_template('/general.html')
    
    def post(self):
        email = request.form.get('email')
        authcode = request.form.get('authcode')
        username = request.form.get('username')
        password = request.form.get('password')
        
        conn = StrictRedis(host = 'localhost', port = 6379, db = 0)
        if not conn.exists(email) or not conn.get(email).decode() == authcode:
            return jsonify({ "result": "验证码错误" }), 200
        
        sql = "select count(*) as 'count' from user where username = %s"
        values = (username)
        res = query(sql, values)
        if res and res[0]['count'] > 0:
            return jsonify({ "result": "用户名已存在" }), 200
        if not res:
            return jsonify({ "result": "请稍后再试" }), 200

        sql = "insert into user(username, email, password) values (%s, %s, %s)"
        values = (username, email, password)
        if insert(sql, values):
            return jsonify({ "result": "注册成功" }), 200
        return jsonify({ "result": "请稍后再试" }), 200