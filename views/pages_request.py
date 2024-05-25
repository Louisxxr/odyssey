from flask import render_template, request, jsonify, session, redirect
from flask.views import MethodView
from redis import StrictRedis
from views.utils.db_operation import *
import os
from PIL import Image

class MainPageView(MethodView):
    def get(self):
        return render_template('/general.html')

class LoginPageView(MethodView):
    def get(self):
        if session.get('username') is not None:
            return redirect('/')
        return render_template('/general.html')
    
    def post(self):
        username = request.form.get('username')
        password = request.form.get('password')

        sql = "select userid, username, password from user where username = %s"
        values = (username)
        res = query(sql, values)
        if res and password == res[0]['password'] and username == res[0]['username']:
            session['username'] = res[0]['username']
            session['userid'] = res[0]['userid']
            return jsonify({ "result": "登录成功" }), 200

        sql = "select userid, username, password from user where email = %s"
        values = (username)
        res = query(sql, values)
        if res and password == res[0]['password']:
            session['username'] = res[0]['username']
            session['userid'] = res[0]['userid']
            return jsonify({ "result": "登录成功" }), 200

        return jsonify({ "result": "用户名或密码错误" }), 200

class RegisterPageView(MethodView):
    def get(self):
        if session.get('username') is not None:
            return redirect('/')
        return render_template('/general.html')
    
    def post(self):
        email = request.form.get('email')
        authcode = request.form.get('authcode')
        username = request.form.get('username')
        password = request.form.get('password')
        
        conn = StrictRedis(host = 'localhost', port = 6379, db = 0)
        if not conn.exists(email) or not conn.get(email).decode() == authcode:
            return jsonify({ "result": "邮箱或验证码错误" }), 200
        
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

class Reset_passwordPageView(MethodView):
    def get(self):
        if session.get('username') is not None:
            return redirect('/')
        return render_template('/general.html')
    
    def post(self):
        email = request.form.get('email')
        authcode = request.form.get('authcode')
        password = request.form.get('password')

        conn = StrictRedis(host = 'localhost', port = 6379, db = 0)
        if not conn.exists(email) or not conn.get(email).decode() == authcode:
            return "邮箱或验证码错误", 200
        
        sql = "update user set password = %s where email = %s"
        values = (password, email)
        if update(sql, values):
            return "重置密码成功", 200
        return "请稍后再试", 200

class HomePageView(MethodView):
    def get(self):
        if session.get('username') is None:
            return redirect('/')
        return render_template('/general.html')

class Update_userinfoPageView(MethodView):
    def get(self, item):
        if session.get('username') is None:
            return redirect('/')
        return render_template('/general.html')
    
    def post(self, item):
        username = session.get('username')

        if item == 'head':
            head = request.form.get('head')
            
            # 裁切
            img = Image.open(os.getcwd() + head)
            width = img.size[0]
            height = img.size[1]
            if width > height:
                img_cropped = img.crop((width / 2 - height / 2, 0, width / 2 + (height - height / 2), height))
            else:
                img_cropped = img.crop((0, height / 2 - width / 2, width, height / 2 + (width - width / 2)))
            img_cropped.save(os.getcwd() + head)

            # 数据库
            sql = "update user set head = %s where username = %s"
            values = (head, username)
            if update(sql, values):
                return "保存成功", 200
            return "请稍后再试", 200

        elif item == 'username':
            username_ = request.form.get('username')

            if username_ == username:
                return "保存成功", 200
            
            sql = "select count(*) as 'count' from user where username = %s"
            values = (username_)
            res = query(sql, values)
            if res and res[0]['count'] > 0:
                return "用户名已存在", 200
            if not res:
                return "请稍后再试", 200
            
            sql = "update user set username = %s where username = %s"
            values = (username_, username)
            if update(sql, values):
                session.pop('username')
                session['username'] = username_
                return "保存成功", 200
            return "请稍后再试", 200
        
        elif item == "email":
            email = request.form.get('email')
            authcode = request.form.get('authcode')

            conn = StrictRedis(host = 'localhost', port = 6379, db = 0)
            if not conn.exists(email) or not conn.get(email).decode() == authcode:
                return "邮箱或验证码错误", 200
            
            sql = "update user set email = %s where username = %s"
            values = (email, username)
            if update(sql, values):
                return "保存成功", 200
            return "请稍后再试", 200
        
        elif item == "sex":
            sex = request.form.get('sex')

            sql = "update user set sex = %s where username = %s"
            values = (sex, username)
            if update(sql, values):
                return "保存成功", 200
            return "请稍后再试", 200

        elif item == "birthday":
            birthday = request.form.get('birthday')

            sql = "update user set birthday = %s where username = %s"
            values = (birthday, username)
            if update(sql, values):
                return "保存成功", 200
            return "请稍后再试", 200

        elif item == "signature":
            signature = request.form.get('signature')

            sql = "update user set signature = %s where username = %s"
            values = (signature, username)
            if update(sql, values):
                return "保存成功", 200
            return "请稍后再试", 200
        
        elif item == "city":
            cityid = int(request.form.get('cityid'))

            sql = "update user set city = %s where username = %s"
            values = (cityid, username)
            if update(sql, values):
                return "保存成功", 200
            return "请稍后再试", 200
        
        elif item == "job":
            job = request.form.get('job')

            sql = "update user set job = %s where username = %s"
            values = (job, username)
            if update(sql, values):
                return "保存成功", 200
            return "请稍后再试", 200
        
        elif item == "password":
            old_password = request.form.get('old_password')
            new_password = request.form.get('new_password')

            sql = "select password from user where username = %s"
            values = (username)
            res = query(sql, values)
            if not res:
                return "请稍后再试", 200
            if old_password != res[0]['password']:
                return "原密码错误", 200
            
            sql = "update user set password = %s where username = %s"
            values = (new_password, username)
            if update(sql, values):
                return "保存成功", 200
            return "请稍后再试", 200

class Edit_questionPageView(MethodView):
    def get(self):
        if session.get('username') is None:
            return redirect('/')
        return render_template('/general.html')
    
    def post(self):
        userid = session.get('userid')
        title = request.form.get('title')
        description = request.form.get('description')

        sql = "insert into question(userid, title, description, issue_time) values (%s, %s, %s, now())"
        values = (userid, title, description)
        if insert(sql, values):
            questionid = query("select max(questionid) as 'questionid' from question", ())[0]['questionid']
            return str(questionid), 200
        return "", 400

class QuestionPageView(MethodView):
    def get(self, questionid):
        questionid = int(questionid)

        update("update question set views = views + 1 where questionid = %s", (questionid)) # 要注意确认真实值
        return render_template('/general.html')
    
    def post(self, questionid):
        questionid = int(questionid)
        userid = session.get('userid')
        content = request.form.get('content')

        if query("select * from answer where userid = %s and questionid = %s", (userid, questionid)):
            sql = "update answer set content = %s where userid = %s and questionid = %s"
            values = (content, userid, questionid)
            if update(sql, values):
                return "", 200
            return "", 400
        else:
            sql = "insert into answer(questionid, userid, content, issue_time, update_time) values (%s, %s, %s, now(), now())"
            values = (questionid, userid, content)
            if insert(sql, values):
                return "", 200
            return "", 400

class Edit_articlePageView(MethodView):
    def get(self):
        if session.get('username') is None:
            return redirect('/')
        return render_template('/general.html')
    
    def post(self):
        userid = session.get('userid')
        title = request.form.get('title')
        content = request.form.get('content')

        sql = "insert into article(userid, title, content, issue_time, update_time) values (%s, %s, %s, now(), now())"
        values = (userid, title, content)
        if insert(sql, values):
            articleid = query("select max(articleid) as 'articleid' from article", ())[0]['articleid']
            return str(articleid), 200
        return "", 400

class ArticlePageView(MethodView):
    def get(self, articleid):
        articleid = int(articleid)

        update("update article set views = views + 1 where articleid = %s", (articleid))
        return render_template('/general.html')

class Update_articlePageView(MethodView):
    def get(self, articleid):
        userid = session.get('userid')
        articleid = int(articleid)

        if userid is None:
            return redirect('/')
        if query("select userid from article where articleid = %s", (articleid))[0]['userid'] != userid:
            return redirect('/')
        return render_template('/general.html')
    
    def post(self, articleid):
        articleid = int(articleid)
        title = request.form.get('title')
        content = request.form.get('content')

        if update("update article set title = %s, content = %s, update_time = now() where articleid = %s", (title, content, articleid)):
            return "", 200
        return "", 400

class UserPageView(MethodView):
    def get(self, userid):
        if session.get('userid') == int(userid):
            return redirect('/homepage')
        return render_template('/general.html')