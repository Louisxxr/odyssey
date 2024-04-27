from flask import Flask
from views.pages_request import *

app = Flask(__name__)

# 注册视图
app.add_url_rule('/', view_func = MainpageView.as_view('mainpage'))
app.add_url_rule('/login', view_func = LoginpageView.as_view('loginpage'))

if __name__ == '__main__':
    app.run()