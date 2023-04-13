from django.contrib.auth.models import User
from django.db.models import Avg
# from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from rest_framework import renderers, viewsets, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework.filters import SearchFilter
# from rest_framework.reverse import reverse
from django_filters.rest_framework import DjangoFilterBackend

from time import time
from datetime import datetime

from base.models import Product, Review, Order, OrderItem, ShippingAddress
from base.serializers import ProductSerializer, ReviewSerializer
from base.serializers import UserSerializer, UserCreationSerializer
from base.serializers import OrderSerializer, OrderItemSerializer, ShippingAddressSerializeer
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from base.permissions import CreatePermission, ViewPermission, RestrictedDeletePermission, IsOwnerOrReadOnly
from base.utils import OrderCalculations
from base.filters import UserOwnerFilter
from base.pagination import PageNumberPaginationWithTotalPages


# @api_view(['GET', 'POST', 'PUT', 'DELETE'])
# def api_root(request, format=None):
#     return Response({
#         'users': reverse('user-list', request=request, format=format),
#         'products': reverse('product-list', request=request, format=format),
#         'reviews': reverse('review-list', request=request, format=format),
#         'orders': reverse('order-list', request=request, format=format),
#         'orderitems': reverse('orderitem-list', request=request, format=format),
#     })
    

# Create your views here.
class UserViewSet(viewsets.ModelViewSet):
    """
    This viewset automatically provides `list`, `create`, `retrieve`,
    `update` and `destroy` actions.
    """
    queryset = User.objects.all()
    permission_classes = [CreatePermission]
    filterset_fields = ['username']
    pagination_class = None
    
    @action(detail=True, renderer_classes=[renderers.JSONRenderer])
    def token(self, request, *args, **kwargs):
        instance = self.get_object()
        token = RefreshToken.for_user(instance)
        access = AccessToken.for_user(instance)
        content = {
            'refresh': str(token),
            'access': str(access)
        }
        return Response(content)
    
    def get_serializer_class(self):
        if self.action == 'create': # list, create, retrieve, update, partial_update, destroy
            return UserCreationSerializer
        else:
            return UserSerializer

    # def destroy(self, request, *args, **kwargs):
    #     instance = self.get_object()
    #     self.perform_destroy(instance)
    #     return Response({"message":"Order deleted successfully"},
    #                      status=status.HTTP_200_OK)


class CurrentUserProfileViewSet(UserViewSet, viewsets.ReadOnlyModelViewSet):
    """
    Lists information related to the current user.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = None
    
    def list(self, request, *args, **kwargs):
        instance = request.user
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    
class ProductViewSet(viewsets.ModelViewSet):
    """
    This viewset automatically provides `list`, `create`, `retrieve`,
    `update` and `destroy` actions.
    """
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [ViewPermission] # IsAuthenticatedOrReadOnly
    filter_backends = [SearchFilter]
    search_fields = ['name', 'category', 'description', 'brand']
    pagination_class = PageNumberPaginationWithTotalPages
    # def perform_create(self, serializer):
    #     serializer.save(user=self.request.user)
        
    def create(self, request, *args, **kwargs):
        product = Product.objects.create(
            user=request.user,
            name='Sample Name',
            price=0,
            brand='Sample Brand',
            countInStock=0,
            category='Sample Category',
            description=''
        )
        serializer = ProductSerializer(product, many=False)
        return Response(serializer.data)
        # return super().create(request, *args, **kwargs)
        
        
class TopProductViewSet(viewsets.ReadOnlyModelViewSet):
    """
    This viewset automatically provides `list`.
    """
    queryset = Product.objects.filter(rating__gt=4).order_by('-rating')[:5]
    serializer_class = ProductSerializer
    permission_classes = [ViewPermission] # IsAuthenticatedOrReadOnly
    pagination_class = None
        
        
@api_view(['POST'])
@permission_classes([IsAdminUser])
def uploadImage(request):
    data = request.data
    
    product_id = data['product_id']
    product = Product.objects.get(_id=product_id)
    
    # Get the uploaded file   
    image_file = request.FILES.get('image')
    
    # Get the original extension and prepare the new name of the file
    extension = image_file.name.split('.')[-1]
    filename = f'img_{product_id}.{extension}'
    
    # Delete the existing image
    if product.image and product.image.name != 'placeholder.png':
        product.image.delete()
    
    # Set the image field to the new uploaded file with the new filename
    product.image.save(filename, image_file)
    return Response({'url': f'{product.full_url}?time={time()}'})
      
        
class ReviewViewSet(viewsets.ModelViewSet):
    """
    This viewset automatically provides `list`, `create`, `retrieve`,
    `update` and `destroy` actions.
    """
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [IsOwnerOrReadOnly]
    pagination_class = None
    
    def create(self, request, *args, **kwargs):
        user = request.user
        print(request.data)
        product = Product.objects.get(pk=request.data.get('product'))
        reviews = product.productreviews.all()
        
        # Review already exist
        if reviews.filter(user=user).exists():
            content = {'detail': 'Product already reviewed.'}
            return Response(content, status=status.HTTP_400_BAD_REQUEST)
        
        # No rating or 0
        elif request.data.get('rating') == 0:
            content = {'detail': 'Rating can not be 0.'}
            return Response(content, status=status.HTTP_400_BAD_REQUEST)
        
        # Create a review
        else:
            result = super().create(request, *args, **kwargs)
            product.numReviews = len(reviews)
            product.rating = reviews.aggregate(rating=Avg('rating'))['rating'] 
            product.save()
            return result

    # def perform_create(self, serializer):
    #     serializer.save(user=self.request.user)
    

class OrderViewSet(viewsets.ModelViewSet):
    """
    This viewset automatically provides `list`, `create`, `retrieve`,
    `update` and `destroy` actions.
    """
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [RestrictedDeletePermission]
    filter_backends = [UserOwnerFilter, DjangoFilterBackend] # If it was just [DjangoFilterBackend], It was not required because it is a default in REST_FRAMEWORK in settings.
    filterset_fields = '__all__' # 'orderItems___id' --> Remember id is _id
    pagination_class = None
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
        
    def partial_update(self, request, *args, **kwargs):
        currentUser = request.user
        instance = self.get_object()
        data = request.data
        
        if 'shippingAddresses' in data.keys():
            shippingAddresses = data.pop('shippingAddresses')
            ShippingAddress.objects.filter(order_id=instance._id).update(**shippingAddresses)
        
        if currentUser.is_staff:
            if 'isDelivered' in data.keys():
                data['deliveredAt'] = (datetime.now() if data['isDelivered'] else None)
            Order.objects.filter(_id=instance._id).update(**data)
        
        elif 'isPaid' in data.keys():
            data = {k: data[k] for k in data.keys() if k in ['isPaid', 'paymentMethod']}
            data['paidAt'] = (datetime.now() if data['isPaid'] else None)
            Order.objects.filter(_id=instance._id).update(**data)
        serializer = OrderSerializer(Order.objects.get(_id=instance._id), partial=True)
        return Response(serializer.data)
    
    # def get_serializer_class(self):
    #     print(self.action)
    #     return super().get_serializer_class()
    
    # def get_queryset(self):
    #     queryset = super().get_queryset()
    #     if not self.request.user.is_staff:
    #         return queryset.filter(user=self.request.user)
    #     return queryset
   
        
class OrderItemViewSet(viewsets.ModelViewSet):
    """
    This viewset automatically provides `list`, `create`, `retrieve`,
    `update` and `destroy` actions.
    """
    queryset = OrderItem.objects.all()
    serializer_class = OrderItemSerializer
    permission_classes = [CreatePermission]
    pagination_class = None 
        
class ShippingAddressViewSet(viewsets.ModelViewSet):
    """
    This viewset automatically provides `list`, `create`, `retrieve`,
    `update` and `destroy` actions.
    """
    queryset = ShippingAddress.objects.all()
    serializer_class = ShippingAddressSerializeer
    permission_classes = [CreatePermission]
    pagination_class = None   
        
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getOrdersCalculations(request):
    totalPrice = float(request.GET.get('totalPrice', 0))
    orderCalculationsResult = dict(
        taxPrice = OrderCalculations.tax_price(totalPrice),
        shippingPrice = OrderCalculations.shipping_price(totalPrice),
    )
    return Response(orderCalculationsResult)
