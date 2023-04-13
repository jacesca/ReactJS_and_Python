from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response

class PageNumberPaginationWithTotalPages(PageNumberPagination):
  def get_paginated_response(self, data):
    # response = super().get_paginated_response(data)
    # response.data['totalPages'] = self.page.paginator.num_pages
    custom_pagination = {
      'pagination': {
        'page': self.page.number,
        'next': self.get_next_link(),
        'previous': self.get_previous_link(),
        'totalPages': self.page.paginator.num_pages,
        'count': self.page.paginator.count,
      },
      'results': data
    }
    return Response(custom_pagination)
  