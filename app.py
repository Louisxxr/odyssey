from flask import Flask
from views.pages_request import *
from views.services import *

app = Flask(__name__)

# 注册视图
# 页面
app.add_url_rule('/', view_func = MainpageView.as_view('mainpage'))
app.add_url_rule('/login', view_func = LoginpageView.as_view('loginpage'))
app.add_url_rule('/register', view_func = RegisterpageView.as_view('registerpage'))
# 服务
app.add_url_rule('/service/authcode', view_func = AuthcodeserviceView.as_view('authcodeservice'))
app.add_url_rule('/service/verifyemail', view_func = VerifyemailserviceView.as_view('verifyemailservice'))

if __name__ == '__main__':
    app.run()