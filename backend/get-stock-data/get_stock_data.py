import requests
import datetime as dt
import pandas as pd
from yahoo_fin import stock_info as sf
import os

base_url = 'http://127.0.0.1:8000/api/'
login_url = f'{base_url}auth/login/'
asset_details_url = f'{base_url}assets/details/'
asset_history_url = f'{base_url}assets/history/'

user = {
    'username': 'admin',
    'password': 'admin',
}
token = requests.post(url=login_url, data=user).json()['key']
headers = {'Authorization': f'Token {token}'}

try:
    nasdaq_tickers = sf.tickers_nasdaq(include_company_data=True).rename(columns={'Security Name': 'Security'})[['Symbol', 'Security']][:-1]
    snp500_tickers = sf.tickers_sp500(include_company_data=True)[['Symbol', 'Security']]
    ftse100_tickers = sf.tickers_ftse100(include_company_data=True).rename(columns={'Ticker': 'Symbol', 'Company': 'Security'})[['Symbol', 'Security']]
    other_tickers = sf.tickers_other(include_company_data=True).rename(columns={'ACT Symbol': 'Symbol', 'Security Name': 'Security'})[['Symbol', 'Security']][:-1]
    all_tickers = pd.concat([nasdaq_tickers, snp500_tickers, ftse100_tickers, other_tickers]).sort_values('Symbol').drop_duplicates(subset=['Symbol']).dropna().reset_index(drop=True).to_dict(orient='index')
except:
    all_tickers = pd.read_csv('tickers/all_asset_tickers.csv').drop(columns=['Unnamed: 0']).to_dict(orient='index')


end = dt.date.today()
start = end - dt.timedelta(days=(365 * 3))

def getVar(data, target):
    try:
        return data[target]
    except:
        return None

for index in range(len(all_tickers)):
    ticker = all_tickers[index]['Symbol']
    company_name = all_tickers[index]['Security']
    try:
        company_data = sf.get_quote_data(ticker)
        stock_data = stock_data = sf.get_data('aapl', start_date=start, end_date=end, index_as_date=False).drop(columns=['ticker']).sort_values('date', ascending=False).reset_index(drop=True).to_dict(orient='index')
        recent_price = getVar(stock_data, 0)
        post_assets_data = {
            'asset_id': ticker,
            'asset_name': company_name,
            'asset_type': getVar(company_data, 'quoteType'),
            'primary_exchange': getVar(company_data, 'fullExchangeName'),
            'price_date': getVar(recent_price, 'date'),
            'open_price': getVar(recent_price, 'open'),
            'close_price': getVar(recent_price, 'close'),
            'low_price': getVar(recent_price, 'low'),
            'high_price': getVar(recent_price, 'high'),
            'adjusted_close_price': getVar(recent_price, 'adjclose'),
            'volume': getVar(recent_price, 'volume'),
            'currency': getVar(company_data, 'financialCurrency'),
            }
        requests.post(url=asset_details_url, data=post_assets_data, headers=headers)
        for hindex in range(len(stock_data)):
            post_history_data = {
                'asset_id': ticker,
                'time': getVar(getVar(stock_data, hindex), 'date'),
                'open_price': getVar(getVar(stock_data, hindex), 'open'),
                'close_price': getVar(getVar(stock_data, hindex), 'close'),
                'low_price': getVar(getVar(stock_data, hindex), 'low'),
                'high_price': getVar(getVar(stock_data, hindex), 'high'),
                'adjusted_close_price': getVar(getVar(stock_data, hindex), 'adjclose'),
                'volume': getVar(getVar(stock_data, hindex), 'volume'),
                }
            requests.post(url=asset_history_url, data=post_history_data, headers=headers)
    except:
        continue
