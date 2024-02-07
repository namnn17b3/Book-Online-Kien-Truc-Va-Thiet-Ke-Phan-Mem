from django.core.files.uploadedfile import InMemoryUploadedFile
import os
from users.models import *


def save_uploaded_file(uploaded_file, destination, file_name):
    # Kiểm tra xem đối tượng có phải là InMemoryUploadedFile không
    if isinstance(uploaded_file, InMemoryUploadedFile):
        # Kiểm tra xem file đã tồn tại chưa
        if not os.path.exists(destination):
            # Nếu file chưa tồn tại, tạo mới file
            os.mkdir(destination)

        # Mở file đích để ghi dữ liệu
        with open(os.path.join(destination, file_name), 'wb') as destination_file:
            # Đọc dữ liệu từ InMemoryUploadedFile và ghi vào file đích
            destination_file.write(uploaded_file.read())
    else:
        # Nếu không phải là InMemoryUploadedFile, có thể xử lý tương tự tùy thuộc vào loại file
        pass
