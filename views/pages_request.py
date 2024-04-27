from flask.views import MethodView
from flask import render_template
from views.utils.db_operation import *

class MainpageView(MethodView):
    def get(self):
        return render_template('/general.html')

class LoginpageView(MethodView):
    def get(self):
        # 验证未登录
        return render_template('/general.html')

# 其他：需要验证登录，需要验证未登录