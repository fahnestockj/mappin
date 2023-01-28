import time
from flask import Flask, request, make_response
import gzip
import json
import itslive
import math


app = Flask(__name__)

@app.route("/timeseries")
def get_timeseries():
  latList = (request.args.getlist("lat"))
  lngList = (request.args.getlist("lng"))
  if not (latList and lngList):
    raise Exception("lat and lng are required")
  points = []
  for lat, lng in zip(latList, lngList):
    print("lat: ", lat)
    print("lng: ", lng)
    points.append((float(lng), float(lat)))

  list_of_timeseries = itslive.cubes.get_time_series(points=points,variables = ['v', 'date_dt']) 
  
  list_of_timeseries_dict = {}

  for timeseries in list_of_timeseries:
    mid_date_arr = timeseries['time_series']['date_dt']['mid_date'].data # np arrays
    v_arr = timeseries['time_series']['v'].data

    timeseries_tupleArray = []
    # timeseries_dict = {} # put in a dict for easier conversion to json
    for A, B in zip(mid_date_arr, v_arr):
      if(math.isnan(B)): # remove NaNs
        continue
      timeseries_tupleArray.append([str(A), str(B)]) 
    lng = timeseries['coordinates'][0]
    lat = timeseries['coordinates'][1]
    list_of_timeseries_dict[str(lat) + "," + str(lng)] = timeseries_tupleArray

  content = gzip.compress(json.dumps(list_of_timeseries_dict).encode('utf8'), 5)
  response = make_response(content)
  response.headers['Content-length'] = len(content)
  response.headers['Content-Encoding'] = 'gzip'
  return response