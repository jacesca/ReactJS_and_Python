from django_filters.rest_framework import DjangoFilterBackend


class UserOwnerFilter(DjangoFilterBackend):
  def filter_queryset(self, request, queryset, view):
    queryset = super().filter_queryset(request, queryset, view)
    user_filter = request.query_params.get('user_id')
    authenticated_user = request.user
    if not authenticated_user.is_staff and user_filter and str(authenticated_user.id) != user_filter:
      # If the authenticated user is not a superuser and the user filter is present
      # but not the authenticated user's ID, return an empty queryset.
      return queryset.none()
    elif user_filter:
      # If a user filter is present and the authenticated user is a superuser,
      # filter the queryset to include only orders belonging to the specified user.
      return queryset.filter(user__id=user_filter)
    elif not authenticated_user.is_staff:
      # If the authenticated user is not a superuser and no user filter is present,
      # filter the queryset to include only orders belonging to the authenticated user.
      return queryset.filter(user=authenticated_user)
    
    return queryset
  
  