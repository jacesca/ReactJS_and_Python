from rest_framework import permissions


class CreatePermission(permissions.BasePermission):
    def has_permission(self, request, view):
        if view.action == 'create':
            return True
        return request.user.is_staff
      
        # if view.action == 'list':
        #     return request.user.is_authenticated and request.user.is_staff
        # elif view.action == 'create':
        #     return True
        # elif view.action in ['retrieve', 'update', 'partial_update', 'destroy']:
        #     return True
        # else:
        #     return False
                                                                                                
    # def has_object_permission(self, request, view, obj):
    #     return obj == request.user or request.user.is_staff
        
    #     # if view.action == 'retrieve':
    #     #     return obj == request.user or request.user.is_admin
    #     # elif view.action in ['update', 'partial_update']:
    #     #     return obj == request.user or request.user.is_admin
    #     # elif view.action == 'destroy':
    #     #     return request.user.is_admin
    #     # else:
    #     #     return False 


class ViewPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        # print(view.action)
        if view.action in ['list', 'retrieve']:
            return True
        return request.user.is_staff
    
    
class RestrictedDeletePermission(permissions.BasePermission):
    def has_permission(self, request, view):
        # print(view.action)
        if view.action in ['delete']:
            return request.user.is_staff
        return request.user.is_authenticated


class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        # print(view.action)
        if view.action in ['list', 'retrieve']:
            return True
        return request.user.is_authenticated
    
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        elif view.action == 'create':
            return request.user.is_authenticated
        return obj.user == request.user
