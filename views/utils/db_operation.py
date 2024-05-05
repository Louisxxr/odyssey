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

def insert(sql, values):
    conn = connect_database()
    cursor = conn.cursor()

    try:
        cursor.execute(sql, values)
        conn.commit()
    except Exception as e:
        conn.rollback()
        print(e)
        cursor.close()
        conn.close()
        return False
    else:
        cursor.close()
        conn.close()
        return True

def update(sql, values):
    conn = connect_database()
    cursor = conn.cursor()

    try:
        cursor.execute(sql, values)
        conn.commit()
    except Exception as e:
        conn.rollback()
        print(e)
        cursor.close()
        conn.close()
        return False
    else:
        cursor.close()
        conn.close()
        return True

def delete(sql, values):
    conn = connect_database()
    cursor = conn.cursor()

    try:
        cursor.execute(sql, values)
        conn.commit()
    except Exception as e:
        conn.rollback()
        print(e)
        cursor.close()
        conn.close()
        return False
    else:
        cursor.close()
        conn.close()
        return True
    

def query(sql, values):
    conn = connect_database()
    cursor = conn.cursor()
    
    data = []

    try:
        cursor.execute(sql, values)
        data = cursor.fetchall()
    except Exception as e:
        conn.rollback()
        print(e)
        data = []
    finally:
        cursor.close()
        conn.close()
        return data