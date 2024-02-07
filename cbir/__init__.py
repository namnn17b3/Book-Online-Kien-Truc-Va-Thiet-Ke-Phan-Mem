import math
import os
from pathlib import Path

from django.core.files.uploadedfile import InMemoryUploadedFile
from tensorflow.keras.preprocessing import image
from tensorflow.keras.applications.vgg16 import VGG16, preprocess_input
from tensorflow.keras.models import Model

from PIL import Image
import pickle
import numpy as np
from io import BytesIO
import matplotlib.pyplot as plt


# Ham tao model
def get_extract_model():
    vgg16_model = VGG16(weights="imagenet")
    extract_model = Model(inputs=vgg16_model.inputs, outputs=vgg16_model.get_layer("fc1").output)
    return extract_model


VECTOR_FILE = 'vectors.pkl'
PATH_FILE = 'paths.pkl'
BASE_DIR = Path(__file__).resolve().parent.parent


class CBIR:
    def __init__(self):
        pass

    model = get_extract_model()

    # Ham tien xu ly, chuyen doi hinh anh thanh tensor
    @staticmethod
    def image_preprocess(img):
        img = img.resize((224, 224))
        img = img.convert("RGB")
        x = image.img_to_array(img)
        x = np.expand_dims(x, axis=0)
        x = preprocess_input(x)
        return x

    @staticmethod
    def extract_vector(model, image):
        if isinstance(image, InMemoryUploadedFile):
            image = BytesIO(image.read())
        else:
            print("Xu ly : ", image)
        img = Image.open(image)
        img_tensor = CBIR.image_preprocess(img)

        # Trich dac trung
        vector = model.predict(img_tensor)[0]
        # Chuan hoa vector = chia chia L2 norm (tu google search)
        vector = vector / np.linalg.norm(vector)
        return vector

    @staticmethod
    def save(data_set, property: str, data_folder_parent: str, data_folder_children: str):
        # Dinh nghia thu muc data

        # data_folder = "dataset"

        # Khoi tao model
        # model = CBIR.get_extract_model()

        vectors = []
        paths = []

        for item in data_set:
            # Noi full path
            image_path = item.__dict__[property].split('/')[-1]
            image_path_full = os.path.join(BASE_DIR, 'static', data_folder_parent, data_folder_children, image_path)
            # Trich dac trung
            image_vector = CBIR.extract_vector(CBIR.model, image_path_full)
            # Add dac trung va full path vao list
            vectors.append(image_vector)
            paths.append(item.id)

        # save vao file
        # vector_file = "vectors.pkl"
        # path_file = "paths.pkl"

        pickle.dump(vectors, open(VECTOR_FILE, "wb"))
        pickle.dump(paths, open(PATH_FILE, "wb"))

    @staticmethod
    def search(search_image: str | InMemoryUploadedFile, k: int, T: type):
        # Trich dac trung anh search
        search_vector = CBIR.extract_vector(CBIR.model, search_image)

        # Load vector tu vectors.pkl ra bien
        vectors = pickle.load(open(VECTOR_FILE, "rb"))
        paths = pickle.load(open(PATH_FILE, "rb"))

        # Tinh khoang cach tu search_vector den tat ca cac vector
        distance = np.linalg.norm(vectors - search_vector, axis=1)

        # Tao oputput
        ids = np.argsort(distance)[:k]

        # Tao oputput
        nearest_image = [(T.objects.get(id=paths[id]), distance[id]) for id in ids]

        return nearest_image

    @staticmethod
    def plot(nearest_image: list, k: int, property: str, data_folder_parent: str, data_folder_children: str):
        axes = []
        grid_size = int(math.ceil(math.sqrt(k)))
        fig = plt.figure(figsize=(10, 5))

        for id in range(k):
            draw_image = nearest_image[id]
            axes.append(fig.add_subplot(grid_size, grid_size, id + 1))

            axes[-1].set_title(draw_image[1])
            image_path = draw_image[0].__dict__[property].split('/')[-1]
            plt.imshow(Image.open(os.path.join(BASE_DIR, 'static', data_folder_parent, data_folder_children, image_path)))

        fig.tight_layout()
        plt.show()
