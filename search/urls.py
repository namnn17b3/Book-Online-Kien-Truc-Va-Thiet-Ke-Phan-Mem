from django.urls import path
from search import views

app_name = 'search'

urlpatterns = [
    path('api/search/product/', view=views.SearchProductNormal.as_view(), name='search-product-normal'),
    path('api/search/product/image', view=views.SearchProductByImageView.as_view(), name='search-product-by-image'),
    path('api/search/product/voice', view=views.SearchProductByVoiceView.as_view(), name='search-product-by-voice'),
]
