import requests
import datetime as dt
from yahoo_fin import stock_info as sf
import time

def getVar(data, target):
    try:
        return data[target]
    except:
        return None

base_url = 'http://209.97.160.87:8000/api/'
login_url = f'{base_url}auth/login/'
asset_details_url = f'{base_url}assets/details/'
asset_history_url = f'{base_url}assets/history/'

user = {
    'username': 'astra',
    'password': 'astra',
}
token = requests.post(url=login_url, data=user).json()['key']
headers = {'Authorization': f'Token {token}'}

while True:
    end_date = dt.date.today()
    start_date = end_date - dt.timedelta(1)
    print(start_date)
    response = requests.get(url=asset_details_url, headers=headers).json()
    count = response['count']
    data = response['results']

    for i in range(count):
        put_asset_data = data[i]
        if start_date != dt.datetime.strptime(put_asset_data['price_date'], '%Y-%m-%dT%H:%M:%SZ').date():
            try:
                updated_asset_data = sf.get_data(
                        ticker=put_asset_data['asset_id'], 
                        start_date=start_date, 
                        end_date=end_date
                    ).reset_index(drop=True).to_dict()
                
                put_asset_data['price_date'] = start_date
                put_asset_data['open_price'] = getVar(getVar(updated_asset_data, 'open'), 0)
                put_asset_data['close_price'] = getVar(getVar(updated_asset_data, 'close'), 0)
                put_asset_data['low_price'] = getVar(getVar(updated_asset_data, 'low') , 0)
                put_asset_data['high_price'] = getVar(getVar(updated_asset_data, 'high') , 0)
                put_asset_data['adjusted_close_price'] = getVar(getVar(updated_asset_data, 'adjclose') , 0)
                put_asset_data['volume'] = getVar(getVar(updated_asset_data, 'volume') , 0)
                requests.put(url=asset_details_url + f'{put_asset_data["id"]}/', headers=headers, data=put_asset_data)
                post_history_data = {
                    'asset_id': put_asset_data['asset_id'],
                    'time': start_date,
                    'open_price': getVar(getVar(updated_asset_data, 'open'), 0),
                    'close_price': getVar(getVar(updated_asset_data, 'close'), 0),
                    'low_price': getVar(getVar(updated_asset_data, 'low') , 0),
                    'high_price': getVar(getVar(updated_asset_data, 'high') , 0),
                    'adjusted_close_price': getVar(getVar(updated_asset_data, 'adjclose') , 0),
                    'volume': getVar(getVar(updated_asset_data, 'volume') , 0),
                    }
                requests.post(url=asset_history_url, data=post_history_data, headers=headers)
                print(put_asset_data)
                print(post_history_data)
            except:
                print(f'no change to {put_asset_data["asset_id"]} on {start_date}')
                pass
        else:
            print(f'{put_asset_data["asset_id"]} already updated for {start_date}')
    
    time.sleep(24 * 60 * 60)