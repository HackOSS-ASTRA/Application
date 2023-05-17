from django.contrib import admin
from portfolio.models import Portfolio, PortfolioItem, TransactionItem

# Register your models here.
admin.site.register([
    Portfolio,
    PortfolioItem,
    TransactionItem,
])
