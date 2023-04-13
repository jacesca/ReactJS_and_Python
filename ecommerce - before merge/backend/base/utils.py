from django.conf import settings


class OrderCalculations:
  
  @staticmethod
  def tax_price(total_price: float) -> float:
    return total_price * settings.TAXES

  @staticmethod
  def shipping_price(amount: float) -> float:
    return 0 if amount > settings.SHIPPING_FREE_LIMIT_AMOUNT else settings.SHIPPING_COST
