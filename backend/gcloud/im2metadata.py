import requests
from datetime import datetime
from PIL import Image
from PIL.ExifTags import TAGS, GPSTAGS

"""
PURPOSE: Get photo metadata, convert coords to real location, //push to google storage

"""

# how to call places API on an address
# https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=8801%20Roosevelt%20Way%20NE,%20Seattle,%20WA%2098115,%20USA&inputtype=textquery&fields=photos,formatted_address,name,rating,opening_hours,geometry&key=AIzaSyBn-zIEHePvJCxIVbb1brW7Hy1myDe3DYU

API_KEY = 'AIzaSyBn-zIEHePvJCxIVbb1brW7Hy1myDe3DYU'

def get_address(lat, lon):
    url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=40.714224,-73.961452&key=AIzaSyBn-zIEHePvJCxIVbb1brW7Hy1myDe3DYU'
    base_url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng='
    url = base_url + str(lat) + ',' + str(lon)
    url = url + '&key=' + API_KEY
    # print(url)

    response = requests.get(url=url)
    data = response.json()
    # formatted_address = data['results'][0]['formatted_address']
    city = ''
    state = ''
    if (len(data['results'][0]['address_components']) > 2 ):
        city = data['results'][0]['address_components'][2]["short_name"]
    if (len(data['results'][0]['address_components']) > 4):
        state = data['results'][0]['address_components'][4]["short_name"]

    loc_prompt = "in " + city + ", " + state
    return loc_prompt
    # I learned the hierarchy from just trying this url in broswer
    # https://maps.googleapis.com/maps/api/geocode/json?latlng=40.714224,-73.961452&key=AIzaSyBn-zIEHePvJCxIVbb1brW7Hy1myDe3DYU


# @param pill image item
def get_exif_data(image):
    """Returns a dictionary from the exif data of an PIL Image item. Also converts the GPS Tags"""
    exif_data = {}
    info = image._getexif()
    if info:
        for tag, value in info.items():
            decoded = TAGS.get(tag, tag)
            if decoded == "GPSInfo":
                gps_data = {}
                for t in value:
                    sub_decoded = GPSTAGS.get(t, t)
                    gps_data[sub_decoded] = value[t]

                exif_data[decoded] = gps_data
            else:
                exif_data[decoded] = value

    return exif_data

def _get_if_exist(data, key):
    if key in data:
        return data[key]

    return None

def _convert_to_degress(value):
    """Helper function to convert the GPS coordinates stored in the EXIF to degress in float format"""
    d0 = value[0][0]
    d1 = value[0][1]
    d = float(d0) / float(d1)

    m0 = value[1][0]
    m1 = value[1][1]
    m = float(m0) / float(m1)

    s0 = value[2][0]
    s1 = value[2][1]
    s = float(s0) / float(s1)

    return d + (m / 60.0) + (s / 3600.0)

def get_lat_lon(exif_data):
    """Returns the latitude and longitude, if available, from the provided exif_data (obtained through get_exif_data above)"""
    lat = None
    lon = None

    if "GPSInfo" in exif_data:
        gps_info = exif_data["GPSInfo"]

        gps_latitude = _get_if_exist(gps_info, "GPSLatitude")
        gps_latitude_ref = _get_if_exist(gps_info, 'GPSLatitudeRef')
        gps_longitude = _get_if_exist(gps_info, 'GPSLongitude')
        gps_longitude_ref = _get_if_exist(gps_info, 'GPSLongitudeRef')

        if gps_latitude and gps_latitude_ref and gps_longitude and gps_longitude_ref:
            lat = _convert_to_degress(gps_latitude)
            if gps_latitude_ref != "N":
                lat = 0 - lat

            lon = _convert_to_degress(gps_longitude)
            if gps_longitude_ref != "E":
                lon = 0 - lon

    return lat, lon


####### TIME STUFF:

# todo DELETE, not used
class FancyDateTimeDelta(object):
    """
    Format the date / time difference between the supplied date and
    the current time using approximate measurement boundaries
    """

    def __init__(self, dt):
        now = datetime.datetime.now()
        delta = now - dt
        self.year = delta.days / 365
        self.month = delta.days / 30 - (12 * self.year)
        if self.year > 0:
            self.day = 0
        else:
            self.day = delta.days % 30
        self.hour = delta.seconds / 3600
        self.minute = delta.seconds / 60 - (60 * self.hour)

    def format(self):
        fmt = []
        for period in ['year', 'month', 'day', 'hour', 'minute']:
            value = getattr(self, period)
            if value:
                if value > 1:
                    period += "s"
                fmt.append("%s %s" % (value, period))
        return ", ".join(fmt) + " ago"

def getTimeOfDay(hour): # the hour [24 hr time] of the photo was taken
    if (22 <= hour < 24 or 0 <= hour < 4):
        return 'in the late evening'
    elif 4 <= hour < 7:
        return 'in the early morning'
    elif 7 <= hour < 12:
        return 'in the morning'
    elif 12 <= hour < 13:
        return 'at midday'
    elif 13 <= hour < 17:
        return 'in the afternoon'
    elif 17 <= hour < 22:
        return 'in the evening'

def pillowImageToAddress(image):
    exif_data = get_exif_data(image)
    lat, lon = get_lat_lon(exif_data)
    return get_address(lat, lon)

def im2date_time_addr(photoPath):
    # GET THE ADDRESS
    image = Image.open(photoPath)
    exif_data = get_exif_data(image)
    lat, lon = get_lat_lon(exif_data)
    address_nl = get_address(lat, lon)

    # GET THE TIME
    date_str = exif_data.get('DateTime')
    # format: 2018:08:29 18:47:49
    datetime_object = datetime.strptime(date_str, '%Y:%m:%d %H:%M:%S')
    time_nl = getTimeOfDay(datetime_object.hour)

    if(datetime_object.hour >=12 ):
        ampm = "PM"
        hour = datetime_object.hour - 12
    else:
        ampm = "AM"
        hour = datetime_object.hour
    time_12hr_str = (str(hour) + ":" + str(datetime_object.minute) + " " + ampm)
        
    # ex: 22, Nov 2008'
    date_nl = datetime_object.strftime('%d, %b %Y')

    return date_str, date_nl, time_nl, time_12hr_str, address_nl


"""
if __name__ == "__main__":

    image = Image.open("../resources/cloudCity.jpg") 
    # print(pillowImageToAddress(image))
    # exif_data = get_exif_data(image)
    # lat, lon = get_lat_lon(exif_data)
    # address = get_address(lat, lon)
    date_str, date_nl, time_nl, time_12hr_str, address_nl = im2date_time_addr("../resources/cloudCity.jpg")
    # print ("time_12hr_str: " + time_12hr_str)

    # GET the TIME

    # time_str = exif_data.get('DateTime')
    # format: 2018:08:29 18:47:49
    # format: year month day --- hour min sec
    # datetime_object = datetime.strptime('2018:08:29 18:47', '%Y:%m:%d %H:%M')
    # print(datetime_object)

    # time_of_day = getTimeOfDay(datetime_object.hour)
    # print("Running " + str(address) + " " + time_of_day)
    # print (get_lat_lon(exif_data))

"""
