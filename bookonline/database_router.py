class UsersRouter:
    def db_for_read(self, model, **hints):
        if model._meta.app_label == 'users':
            return 'mongodb'
        return None

    def db_for_write(self, model, **hints):
        if model._meta.app_label == 'users':
            return 'mongodb'
        return None

    def allow_relation(self, obj1, obj2, **hints):
        if obj1._meta.app_label == 'users' and obj2._meta.app_label == 'users':
            return 'mongodb'
        return None

    def allow_migrate(self, db, app_label, model_name=None, **hints):
        if app_label == 'users':
            return 'mongodb'
        return None


class ProductRouter:
    def db_for_read(self, model, **hints):
        if model._meta.app_label == 'product':
            return 'mongodb'
        return None

    def db_for_write(self, model, **hints):
        if model._meta.app_label == 'product':
            return 'mongodb'
        return None

    def allow_relation(self, obj1, obj2, **hints):
        if obj1._meta.app_label == 'product' and obj2._meta.app_label == 'product':
            return 'mongodb'
        return None

    def allow_migrate(self, db, app_label, model_name=None, **hints):
        if app_label == 'product':
            return 'mongodb'
        return None


class CatalogRouter:
    def db_for_read(self, model, **hints):
        if model._meta.app_label == 'catalog':
            return 'mongodb'
        return None

    def db_for_write(self, model, **hints):
        if model._meta.app_label == 'catalog':
            return 'mongodb'
        return None

    def allow_relation(self, obj1, obj2, **hints):
        if obj1._meta.app_label == 'catalog' and obj2._meta.app_label == 'catalog':
            return 'mongodb'
        return None

    def allow_migrate(self, db, app_label, model_name=None, **hints):
        if app_label == 'catalog':
            return 'mongodb'
        return None


class CartRouter:
    def db_for_read(self, model, **hints):
        if model._meta.app_label == 'cart':
            return 'mysql'
        return None

    def db_for_write(self, model, **hints):
        if model._meta.app_label == 'cart':
            return 'mysql'
        return None

    def allow_relation(self, obj1, obj2, **hints):
        if obj1._meta.app_label == 'cart' and obj2._meta.app_label == 'cart':
            return 'mysql'
        return None

    def allow_migrate(self, db, app_label, model_name=None, **hints):
        if app_label == 'cart':
            return 'mysql'
        return None
