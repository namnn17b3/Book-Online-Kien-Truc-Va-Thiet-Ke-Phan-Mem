from hashlib import sha256
import bcrypt


def generate_sha256_hash(input_string):
    # Chuyển đổi chuỗi thành bytes trước khi băm
    input_bytes = input_string.encode('utf-8')

    # Tạo đối tượng sha256
    hash_object = sha256()

    # Cập nhật đối tượng băm với dữ liệu
    hash_object.update(input_bytes)

    # Lấy giá trị băm dưới dạng hexdigest
    hash_result = hash_object.hexdigest()

    return hash_result


ROUND_SALT = 10
SALT = bcrypt.gensalt(ROUND_SALT)


class Bcrypt:
    @staticmethod
    def hashpw(password: str) -> str:
        return bcrypt.hashpw(password.encode('utf-8'), SALT).decode('utf-8')

    @staticmethod
    def checkpw(password: str, hashpw: str) -> bool:
        return bcrypt.checkpw(password.encode('utf-8'), hashpw.encode('utf-8'))
