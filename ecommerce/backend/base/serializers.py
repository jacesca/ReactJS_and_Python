from rest_framework import serializers
from base.models import Product, Review, Order, OrderItem, ShippingAddress
from django.contrib.auth.models import User
from django.db import transaction

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from rest_framework.fields import CurrentUserDefault


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    # @classmethod
    # def get_token(cls, user):
    #     # Code this values in the returned token
    #     token = super().get_token(user)

    #     # Add custom claims
    #     token['username'] = user.username
    #     token['name'] = f"{user.first_name} {user.last_name}"
    #     token['email'] = user.email

    #     return token
    def validate(self, attrs):
        # To add the values to the response and exclude it from the coded token
        data = super().validate(attrs)
        # data['username'] = self.user.username
        # data['first_name'] = self.user.first_name
        # data['last_name'] = self.user.last_name
        # data['email'] = self.user.email    
        
        serializer = UserSerializer(instance=self.user, context={'request': None}).data #context={'id': self.user.id}
        data.update(dict(serializer.items()))     
        
        data['id'] = data['_id'] = self.user.id  
        
        return data
    

class UserSerializer(serializers.ModelSerializer):
    _id = serializers.SerializerMethodField(read_only=False)
    full_name = serializers.SerializerMethodField(read_only=False)
    refresh = serializers.SerializerMethodField('get_auth_refresh')
    access = serializers.SerializerMethodField('get_auth_access')
    
    token = serializers.HyperlinkedIdentityField(view_name='user-token')
    products = serializers.HyperlinkedRelatedField(many=True, view_name='product-detail', read_only=True)
    userreviews = serializers.HyperlinkedRelatedField(many=True, view_name='review-detail', read_only=True)
    orders = serializers.HyperlinkedIdentityField(many=True, view_name='order-detail', read_only=True)

    class Meta:
        model = User
        # fields = '__all__'
        exclude = ('password', 'groups', 'user_permissions')
    
    def get__id(self, obj):
        return obj.id

    def get_full_name(self, obj):
        full_name = obj.first_name + ' ' + obj.last_name
        return full_name
    
    def get_auth_refresh(self, obj):
        refresh = RefreshToken.for_user(obj)
        return str(refresh)
    
    def get_auth_access(self, obj):
        access = AccessToken.for_user(obj)
        return str(access)
    
    def create(self, data):
        user = super().create(data)
        user.set_password(data['password'])
        user.save()
        return user


class UserCreationSerializer(UserSerializer):
    class Meta:
        model = User
        # fields = '__all__'
        exclude = ('groups', 'user_permissions')


class SimpleUserSerializer(serializers.ModelSerializer):
    _id = serializers.SerializerMethodField(read_only=False)
    full_name = serializers.SerializerMethodField(read_only=False)
    
    class Meta:
        model = User
        fields = ['_id', 'username', 'email', 'full_name', 'is_staff']
    
    def get__id(self, obj):
        return obj.id

    def get_full_name(self, obj):
        full_name = obj.first_name + ' ' + obj.last_name
        return full_name
    
    def create(self, data):
        return None


class ReviewSerializer(serializers.ModelSerializer):
    user = SimpleUserSerializer(many=False, read_only=True)
    class Meta:
        model = Review
        fields = '__all__' 
    
    
    def create(self, data):
        user = self.context.get('request').user
        data['user'] = user
        data['name'] = f'{user.first_name} {user.last_name}'
        review = super().create(data)
        return review
        

class ProductSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.username')
    # productreviews = serializers.HyperlinkedRelatedField(many=True, view_name='review-detail', read_only=True)
    productreviews = ReviewSerializer(many=True)
    orders = serializers.HyperlinkedIdentityField(many=True, view_name='orderitem-detail', read_only=True)
    
    class Meta:
        model = Product
        fields = '__all__' 
  

class OrderItemSerializer(serializers.ModelSerializer):
    """
    Serializer to create a new order item in DB
    """
    class Meta:
        model = OrderItem
        fields = '__all__'  
        extra_kwargs = {
            'product': {'required': True},
            'qty': {'required': True},
            'price': {'required': True}
        }


class ShippingAddressSerializeer(serializers.ModelSerializer):
    class Meta:
        model = ShippingAddress
        fields = '__all__'       
        
        
class OrderSerializer(serializers.ModelSerializer):
    """
    Serializer to create new orders in DB.
    """
    username = serializers.ReadOnlyField(source='user.username')
    # user = SimpleUserSerializer(many=False)
    orderItems = OrderItemSerializer(many=True)
    shippingAddresses = ShippingAddressSerializeer(many=False)
    # user_fullname = serializers.SerializerMethodField(read_only=False, allow_null=True)
    
    class Meta:
        model = Order
        fields = '__all__'  
        
    def create(self, validated_data):
        orderItems = validated_data.pop('orderItems')
        shippingAddresses = validated_data.pop('shippingAddresses')
        # validated_data['user'] = self.context['request'].user
        # print(CurrentUserDefault())
        # print(self.context['request'].user)

        with transaction.atomic():
            order = Order.objects.create(**validated_data)
            for item in orderItems:
                product = Product.objects.get(_id=item.get('product')._id)
                item['image'] = product.full_url
                OrderItem.objects.create(order=order, **item)
                product.countInStock -= item['qty']
                product.save()
            ShippingAddress.objects.create(order=order, **shippingAddresses)
            order.update_total_summaries()
            
        return order           
    
    # def get_user_fullname(self, obj):
    #     full_name = obj.user.first_name + ' ' + obj.user.last_name
    #     return full_name                
    
    # # def update(self, instance, validated_data):
    #     currentUser = self.context['request'].user
    #     if 'orderItems' in validated_data.keys():
    #         _ = validated_data.pop('orderItems')
    #     if 'shippingAddresses' in validated_data.keys():
    #         shippingAddresses = validated_data.pop('shippingAddresses')
    #         ShippingAddress.objects.filter(order_id=instance._id).update(**shippingAddresses) 
        
    #     if currentUser.is_staff:
    #         Order.objects.filter(_id=instance._id).update(**validated_data)
        
    #     elif 'isPaid' in validated_data.keys():
    #         instance.isPaid = validated_data['isPaid']
    #         instance.paidAt = (datetime.now() if validated_data['isPaid'] else None)
    #         instance.save()
        
    #     return instance 
    