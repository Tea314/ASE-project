import bcrypt

passwords = ["alice123", "bob456", "charlie789"]

for pw in passwords:
    hashed = bcrypt.hashpw(pw.encode("utf-8"), bcrypt.gensalt())
    print(hashed.decode("utf-8"))
