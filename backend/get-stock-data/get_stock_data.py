import requests
import datetime as dt
import pandas as pd
from yahoo_fin import stock_info as sf

base_url = 'http://astra-trade.live:8000/api/'
login_url = f'{base_url}auth/login/'
asset_details_url = f'{base_url}assets/details/'
asset_history_url = f'{base_url}assets/history/'

user = {
    'username': 'astra',
    'password': 'astra',
}
token = requests.post(url=login_url, data=user).json()['key']
headers = {'Authorization': f'Token {token}'}

all_tickers = pd.read_csv('.\essential_tickers.csv').drop(columns=['Unnamed: 0']).sort_values('Symbol').reset_index(drop=True).to_dict(orient='index')
end = dt.date.today()
start = end - dt.timedelta(days=(365 * 3))

def get_quote_data(ticker):
    headers = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Ma'}
    url = 'https://query1.finance.yahoo.com/v6/finance/quote'
    params = {'symbols': ticker}
    response = requests.get(url=url, params=params, headers=headers).json()['quoteResponse']['result'][0]
    return response

def getVar(data, target):
    try:
        return data[target]
    except:
        return None

for index in range(len(all_tickers)):
    ticker = all_tickers[index]['Symbol']
    company_name = all_tickers[index]['Security']
    try:
        company_data = get_quote_data(ticker)
        stock_data = sf.get_data(ticker, start_date=start, end_date=end, index_as_date=False)
        stock_data['change_amt'] = stock_data['close'].diff()
        stock_data['change_pct'] = stock_data['close'].pct_change()
        stock_data = stock_data.drop(columns=['ticker'])[1:].sort_values('date', ascending=False).reset_index(drop=True).to_dict(orient='index')
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
            'change_amount': getVar(recent_price, 'change_amt'),
            'change_proportion': getVar(recent_price, 'change_pct'),
            }
        requests.post(url=asset_details_url, data=post_assets_data, headers=headers)
        print(post_assets_data)
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
                'change_amount': getVar(getVar(stock_data, hindex), 'change_amt'),
                'change_proportion': getVar(getVar(stock_data, hindex), 'change_pct'),
                }
            requests.post(url=asset_history_url, data=post_history_data, headers=headers)
            print(post_history_data)
    except:
        continue
