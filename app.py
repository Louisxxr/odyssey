from flask import Flask
from datetime import timedelta
from views.pages_request import *
from views.services import *
from views.utils.secret import session_secret_key

app = Flask(__name__)
app.secret_key = session_secret_key
app.permanent_session_lifetime = timedelta(days = 30) # session_id在30天后过期

# 注册视图
# 页面
app.add_url_rule('/', view_func = MainpageView.as_view('mainpage'))
app.add_url_rule('/login', view_func = LoginpageView.as_view('loginpage'))
app.add_url_rule('/register', view_func = RegisterpageView.as_view('registerpage'))
# 服务
app.add_url_rule('/service/authcode', view_func = AuthcodeserviceView.as_view('authcodeservice'))
app.add_url_rule('/service/verifyemail', view_func = VerifyemailserviceView.as_view('verifyemailservice'))
app.add_url_rule('/service/loginstate', view_func = LoginstateserviceView.as_view('loginstateservice'))
app.add_url_rule('/service/logout', view_func = LogoutserviceView.as_view('logoutservice'))

if __name__ == '__main__':
    app.run()