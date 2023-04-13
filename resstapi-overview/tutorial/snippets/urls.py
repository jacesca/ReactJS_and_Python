###########################################################
## FIRST VERSION
###########################################################
# from django.urls import path
# from snippets import views

# urlpatterns = [
#     path('snippets/', views.snippet_list),
#     path('snippets/<int:pk>/', views.snippet_detail),
# ]


###########################################################
## SECOND VERSION
###########################################################
# from django.urls import path
# from rest_framework.urlpatterns import format_suffix_patterns
# from snippets import views
# 
# urlpatterns = [
#     path('snippets/', views.snippet_list),
#     path('snippets/<int:pk>/', views.snippet_detail),
# ]
# 
# urlpatterns = format_suffix_patterns(urlpatterns)


###########################################################
## THIRD, FOURTH & FIFTH VERSION
###########################################################
# from django.urls import path
# from rest_framework.urlpatterns import format_suffix_patterns
# from snippets import views
# 
# urlpatterns = [
#     path('snippets/', views.SnippetList.as_view()),
#     path('snippets/<int:pk>/', views.SnippetDetail.as_view()),
# ]
# 
# urlpatterns = format_suffix_patterns(urlpatterns)


###########################################################
## SIXTH VERSION (ADDING USER CONTROL)
###########################################################
# from django.urls import path, include
# from rest_framework.urlpatterns import format_suffix_patterns
# from snippets import views
# 
# urlpatterns = [
#     path('users/', views.UserList.as_view()),
#     path('users/<int:pk>/', views.UserDetail.as_view()),
#     path('snippets/', views.SnippetList.as_view()),
#     path('snippets/<int:pk>/', views.SnippetDetail.as_view()),
#     path('api-auth/', include('rest_framework.urls')),
# ]
# 
# urlpatterns = format_suffix_patterns(urlpatterns)


###########################################################
## SEVENTH VERSION (ADDING USER CONTROL)
###########################################################
# from django.urls import path, include
# from rest_framework.urlpatterns import format_suffix_patterns
# from snippets import views
# 
# urlpatterns = [
#     path('', views.api_root),
#     path('users/', views.UserList.as_view(), name='user-list'),
#     path('users/<int:pk>/', views.UserDetail.as_view(), name='user-detail'),
#     path('snippets/', views.SnippetList.as_view(), name='snippet-list'),
#     path('snippets/<int:pk>/', views.SnippetDetail.as_view(), name='snippet-detail'),
#     path('snippets/<int:pk>/highlight/', views.SnippetHighlight.as_view(), name='snippet-highlight'),
#     path('api-auth/', include('rest_framework.urls')),
# ]
# 
# urlpatterns = format_suffix_patterns(urlpatterns)


###########################################################
## EIGHTH VERSION (OPTION 1)
###########################################################
# from django.urls import path, include
# from rest_framework.urlpatterns import format_suffix_patterns
# from snippets.views import SnippetViewSet, UserViewSet, api_root
# from rest_framework import renderers
#
# snippet_list = SnippetViewSet.as_view({'get': 'list', 'post': 'create'})
# snippet_detail = SnippetViewSet.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'})
# snippet_highlight = SnippetViewSet.as_view({'get': 'highlight'}, renderer_classes=[renderers.StaticHTMLRenderer])
# user_list = UserViewSet.as_view({'get': 'list'})
# user_detail = UserViewSet.as_view({'get': 'retrieve'})
#
# urlpatterns = [
#     path('', api_root),
#     path('snippets/', snippet_list, name='snippet-list'),
#     path('snippets/<int:pk>/', snippet_detail, name='snippet-detail'),
#     path('snippets/<int:pk>/highlight/', snippet_highlight, name='snippet-highlight'),
#     path('users/', user_list, name='user-list'),
#     path('users/<int:pk>/', user_detail, name='user-detail'),
#     path('api-auth/', include('rest_framework.urls')),
# ]
#
# urlpatterns = format_suffix_patterns(urlpatterns)


###########################################################
## EIGHTH VERSION (OPTION 2)
###########################################################
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from snippets import views

# Create a router and register our viewsets with it.
router = DefaultRouter()
router.register(r'snippets', views.SnippetViewSet,basename="snippet")
router.register(r'users', views.UserViewSet,basename="user")

# The API URLs are now determined automatically by the router.
urlpatterns = [
    path('', include(router.urls)),
]
