import pymysql

def connect_database():
    conn = pymysql.connect(
        user = 'root',
        host = '127.0.0.1',
        database = 'odyssey',
        password = 'odyssey',
        charset = 'utf8mb4',
        cursorclass = pymysql.cursors.DictCursor
    )
    return conn

def insert(sql):
    pass

def update(sql):
    pass

def delete(sql):
    pass

def query(sql):
    conn = connect_database()
    cursor = conn.cursor()
    
    cursor.execute(sql)
    conn.commit()

    data = cursor.fetchall()
    return data