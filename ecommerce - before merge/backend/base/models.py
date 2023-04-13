from django.db import models
from django.contrib.auth.models import User
from django.conf import settings
from django.db.models import Sum, F

from base.utils import OrderCalculations


# Create your models here.
class Product(models.Model):
    user = models.ForeignKey(User, related_name='products', on_delete=models.SET_NULL, null=True)
    name = models.CharField(max_length=200, null=True, blank=True)
    image = models.ImageField(null=True, blank=True, default='placeholder.png')
    brand = models.CharField(max_length=200, null=True, blank=True)
    category = models.CharField(max_length=200, null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    rating = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True)
    numReviews = models.IntegerField(null=True, blank=True, default=0)
    price = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True)
    countInStock = models.IntegerField(null=True, blank=True, default=0)
    createdAt = models.DateTimeField(auto_now_add=True)
    _id = models.AutoField(primary_key=True, editable=False)
    
    class Meta:
        ordering = ['name', 'brand']
    
    def __str__(self):
        return self.name
    
    def delete(self, *args, **kwargs):
        # Get the image field
        image_field = self.image

        # Call parent class's delete() method
        super(Product, self).delete(*args, **kwargs)

        # Delete the associated image file
        if image_field and image_field.name != 'placeholder.png':
            image_field.delete()


class Review(models.Model):
    product = models.ForeignKey(Product, related_name='productreviews', on_delete=models.SET_NULL, null=True)
    user = models.ForeignKey(User, related_name='userreviews', on_delete=models.SET_NULL, null=True)
    name = models.CharField(max_length=200, null=True, blank=True)
    rating = models.IntegerField(null=True, blank=True, default=0)
    comment = models.TextField(null=True, blank=True)
    createdAt = models.DateTimeField(auto_now_add=True)
    _id = models.AutoField(primary_key=True, editable=False)

    class Meta:
        ordering = ['-createdAt']
        
    def __str__(self):
        return str(self.rating)


class Order(models.Model):
    user = models.ForeignKey(User, related_name='orders', on_delete=models.SET_NULL, null=True)
    paymentMethod = models.CharField(max_length=200, null=True, blank=True)
    itemsPrice = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True)
    taxPrice = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True)
    shippingPrice = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True)
    totalPrice = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True)
    isPaid = models.BooleanField(default=False)
    paidAt = models.DateTimeField(auto_now_add=False, null=True, blank=True)
    isDelivered = models.BooleanField(default=False)
    deliveredAt = models.DateTimeField(auto_now_add=False, null=True, blank=True)
    createdAt = models.DateTimeField(auto_now_add=True)
    _id = models.AutoField(primary_key=True, editable=False)

    class Meta:
        ordering = ['-createdAt']
        
    def __str__(self):
        return str(self.createdAt)
    
    def update_total_summaries(self) -> None:
        """
        Calculate and save the totalPrice, shippingPrice, and taxPrice of the current order.
        """
        itemsPrice = float(OrderItem.objects.filter(
            order_id=self._id
        ).aggregate(
            totalPriceCalculated = Sum(F('qty') * F('price'))
        )['totalPriceCalculated'])
        
        self.itemsPrice = itemsPrice
        self.shippingPrice = OrderCalculations.shipping_price(itemsPrice)
        self.taxPrice = OrderCalculations.tax_price(itemsPrice)
        self.totalPrice = self.itemsPrice + self.shippingPrice + self.taxPrice
        self.save()
        
        ShippingAddress.objects.filter(order_id=self._id).update(shippingPrice=self.shippingPrice)

    @property
    def user_fullname(self):
        return self.user.first_name + ' ' + self.user.last_name


class OrderItem(models.Model):
    product = models.ForeignKey(Product, related_name='orderProducts', on_delete=models.SET_NULL, null=True)
    order = models.ForeignKey(Order,  related_name='orderItems', on_delete=models.SET_NULL, null=True)
    name = models.CharField(max_length=200, null=True, blank=True)
    qty = models.IntegerField(null=True, blank=True, default=0)
    price = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True)
    image = models.CharField(max_length=200, null=True, blank=True)
    _id = models.AutoField(primary_key=True, editable=False)

    class Meta:
        ordering = ['order', 'name']
        
    def __str__(self):
        return str(self.name)
    
    def save(self, *args, **kwargs):
      self.image = Product.objects.get(pk=self.product_id).full_url
      super().save(*args, **kwargs)
      
    def update(self, *args, **kwargs):
      self.image = Product.objects.get(pk=self.product_id).full_url
      super().update(*args, **kwargs)


class ShippingAddress(models.Model):
    order = models.OneToOneField(Order, related_name='shippingAddresses', on_delete=models.CASCADE, null=True, blank=True)
    address = models.CharField(max_length=200, null=True, blank=True)
    city = models.CharField(max_length=200, null=True, blank=True)
    postalCode = models.CharField(max_length=200, null=True, blank=True)
    country = models.CharField(max_length=200, null=True, blank=True)
    shippingPrice = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True)
    _id = models.AutoField(primary_key=True, editable=False)

    class Meta:
        ordering = ['order']
        
    def __str__(self):
        return str(self.address)
