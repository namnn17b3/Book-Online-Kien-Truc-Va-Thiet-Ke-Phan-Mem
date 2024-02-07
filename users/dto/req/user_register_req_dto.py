import re


def valid_util(regex: str, sample: str) -> bool:
    if sample == None:
        return False

    result = re.findall(regex, sample)
    if len(result) != 1:
        return False

    return result[0] == sample


class UserRegisterRequestDTO:
    def __init__(self, email, username, password, phone, address, avatar):
        self.email = email
        self.username = username
        self.password = password
        self.phone = phone
        self.address = address
        self.avatar = avatar


    def is_valid(self) -> str:
        if valid_util(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b', self.email) == False:
            return 'Error email format'

        if valid_util(r'^.+$', self.username) == False:
            return 'Length of username greater than 1'

        if valid_util(r'^(?=.*[A-Z])(?=.*[a-z])(?=.*[@#$%^&+=!])(?=.*[0-9]).{8,}$', self.password) == False:
            return 'Error password format'

        if valid_util(r'^0\d{9,9}$', self.phone) == False:
            return 'Error phone number format'

        if valid_util(r'^.+$', self.address) == False:
            return 'Length of address greater than 1'

        if self.avatar == '':
            return 'OK'

        if self.avatar.endswith('.jpg') == False and self.avatar.endswith('.jpeg') == False and self.avatar.endswith('.png') == False:
            return 'Only accept image extend file as jpg, jpeg, png'

        return 'OK'
