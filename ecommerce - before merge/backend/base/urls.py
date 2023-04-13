from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenVerifyView
from base import views

# Create a router and register our viewsets with it.
router = DefaultRouter()
router.register(r'products', views.ProductViewSet, basename="product")
router.register(r'top', views.TopProductViewSet, basename='top')
router.register(r'reviews', views.ReviewViewSet, basename="review")
router.register(r'orders', views.OrderViewSet, basename="order")
router.register(r'orderitems', views.OrderItemViewSet, basename='orderitem')
router.register(r'shippingaddress', views.ShippingAddressViewSet, basename='shippingaddress')
router.register(r'users', views.UserViewSet, basename="user")
router.register(r'userprofile', views.CurrentUserProfileViewSet, basename="userprofile")


# The API URLs are now determined automatically by the router.
urlpatterns = [
    path('', include(router.urls)),
    path('auth/', include('rest_framework.urls')),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('orderCalculations/', views.getOrdersCalculations, name='getOrdersCalculations'),
    path('upload/', views.uploadImage, name='image_upload'),
]

