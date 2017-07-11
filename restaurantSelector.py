import requests
import json
import pprint
import jsbeautifier
import argparse
import sys
from math import sin, cos, sqrt, atan2, radians
# To suppress Insecure warnings - to be dealt with later
from requests.packages.urllib3.exceptions import InsecureRequestWarning


def calculateRestaurantPosition(rest_list,lati1,long1):
    distances = []
    for i in rest_list:
        lat2 = i[1]
        lon2 = i[2]
        R = 6373.0              #Radius of earth
        lat1 = radians(lati1)
        lon1 = radians(long1)
        lat2 = radians(lat2)
        lon2 = radians(lon2)
        dlon = lon2 - lon1
        dlat = lat2 - lat1
        a = sin(dlat / 2)**2 + cos(lat1) * cos(lat2) * sin(dlon / 2)**2
        c = 2 * atan2(sqrt(a), sqrt(1 - a))
        distance = R * c
        distances.append(distance)
    return distances.index(min(distances))

def getRestaurant(latitude,longitude):
    req_url = 'https://eventshop.ics.uci.edu:8004/search/restaurant/location?lat='+str(latitude)+'&lon='+str(longitude)+'&rad=0.1'
    auth = ('INDIA','SHINING')
    options = jsbeautifier.default_options()
    options.brace_style = 'expand'
    rest_list = []
    # Just a hack to get past the verification
    r = requests.get(req_url, auth=auth,verify=False)
    record = json.loads(r.text)
    for i in record:
        rest_list.append((i['restaurantName'],i['latitude'],i['longitude']))
    pos = calculateRestaurantPosition(rest_list,latitude,longitude)
    return rest_list[pos][0]


def main(latlon):
    latlon = latlon.strip("()")
    lat = latlon.split(',')[0]
    lon = latlon.split(',')[1]
    requests.packages.urllib3.disable_warnings(InsecureRequestWarning)
    restaurant = getRestaurant(float(lat),float(lon))
    print(restaurant)

if __name__ == '__main__':
    main(sys.argv[1])
