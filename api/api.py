import time
from flask import Flask, request
import json
import itslive


app = Flask(__name__)

@app.route("/timeseries")
def get_timeseries():
  latList = (request.args.getlist("lat"))
  lngList = (request.args.getlist("lng"))
  if not (latList and lngList):
    raise Exception("lat and lng are required")
  for lat, lng in zip(latList, lngList):
    print("lat: ", lat)
    print("lng: ", lng)

  return {}

  # list_of_timeseries = itslive.cubes.get_time_series(points=[(lng,lat)],variables = [ 'v', 'date_dt']) 
  # response_for_first_point = list_of_timeseries[0]

  # mid_date_arr = response_for_first_point['time_series']['date_dt']['mid_date'].data # np arrays
  # v_arr = response_for_first_point['time_series']['v'].data

  # timeseries_dict = {} # put in a dict 
  # for A, B in zip(mid_date_arr, v_arr):
  #     timeseries_dict[str(A)] = str(B) # convert np datetime & float32 to str for json
  # return json.dumps(timeseries_dict)
