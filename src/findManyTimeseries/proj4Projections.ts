import proj4 from "proj4"

const proj4Projections = {
  "32725": "+proj=utm +zone=25 +south +datum=WGS84 +units=m +no_defs +type=crs",
  "32639": "+proj=utm +zone=39 +datum=WGS84 +units=m +no_defs +type=crs",
  "32646": "+proj=utm +zone=46 +datum=WGS84 +units=m +no_defs +type=crs",
  "32643": "+proj=utm +zone=43 +datum=WGS84 +units=m +no_defs +type=crs",
  "32611": "+proj=utm +zone=11 +datum=WGS84 +units=m +no_defs +type=crs",
  "32648": "+proj=utm +zone=48 +datum=WGS84 +units=m +no_defs +type=crs",
  "32719": "+proj=utm +zone=19 +south +datum=WGS84 +units=m +no_defs +type=crs",
  "32735": "+proj=utm +zone=35 +south +datum=WGS84 +units=m +no_defs +type=crs",
  "32647": "+proj=utm +zone=47 +datum=WGS84 +units=m +no_defs +type=crs",
  "32614": "+proj=utm +zone=14 +datum=WGS84 +units=m +no_defs +type=crs",
  "32720": "+proj=utm +zone=20 +south +datum=WGS84 +units=m +no_defs +type=crs",
  "32637": "+proj=utm +zone=37 +datum=WGS84 +units=m +no_defs +type=crs",
  "32612": "+proj=utm +zone=12 +datum=WGS84 +units=m +no_defs +type=crs",
  "3413": "+proj=stere +lat_0=90 +lat_ts=70 +lon_0=-45 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs +type=crs",
  "32753": "+proj=utm +zone=53 +south +datum=WGS84 +units=m +no_defs +type=crs",
  "32636": "+proj=utm +zone=36 +datum=WGS84 +units=m +no_defs +type=crs",
  "32737": "+proj=utm +zone=37 +south +datum=WGS84 +units=m +no_defs +type=crs",
  "32603": "+proj=utm +zone=3 +datum=WGS84 +units=m +no_defs +type=crs",
  "32642": "+proj=utm +zone=42 +datum=WGS84 +units=m +no_defs +type=crs",
  "32743": "+proj=utm +zone=43 +south +datum=WGS84 +units=m +no_defs +type=crs",
  "32742": "+proj=utm +zone=42 +south +datum=WGS84 +units=m +no_defs +type=crs",
  "32718": "+proj=utm +zone=18 +south +datum=WGS84 +units=m +no_defs +type=crs",
  "32759": "+proj=utm +zone=59 +south +datum=WGS84 +units=m +no_defs +type=crs",
  "32644": "+proj=utm +zone=44 +datum=WGS84 +units=m +no_defs +type=crs",
  "3031": "+proj=stere +lat_0=-90 +lat_ts=-71 +lon_0=0 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs +type=crs",
  "32613": "+proj=utm +zone=13 +datum=WGS84 +units=m +no_defs +type=crs",
  "32645": "+proj=utm +zone=45 +datum=WGS84 +units=m +no_defs +type=crs",
  "32610": "+proj=utm +zone=10 +datum=WGS84 +units=m +no_defs +type=crs",
  "32724": "+proj=utm +zone=24 +south +datum=WGS84 +units=m +no_defs +type=crs",
  "32758": "+proj=utm +zone=58 +south +datum=WGS84 +units=m +no_defs +type=crs",
  "32658": "+proj=utm +zone=58 +datum=WGS84 +units=m +no_defs +type=crs",
  "32618": "+proj=utm +zone=18 +datum=WGS84 +units=m +no_defs +type=crs",
  "32638": "+proj=utm +zone=38 +datum=WGS84 +units=m +no_defs +type=crs",
  "32602": "+proj=utm +zone=2 +datum=WGS84 +units=m +no_defs +type=crs",
  "32657": "+proj=utm +zone=57 +datum=WGS84 +units=m +no_defs +type=crs",
  "32632": "+proj=utm +zone=32 +datum=WGS84 +units=m +no_defs +type=crs",
  "32633": "+proj=utm +zone=33 +datum=WGS84 +units=m +no_defs +type=crs",
  "32619": "+proj=utm +zone=19 +datum=WGS84 +units=m +no_defs +type=crs",
  "32609": "+proj=utm +zone=9 +datum=WGS84 +units=m +no_defs +type=crs"
}

for(const [key, value] of Object.entries(proj4Projections)) {
  proj4.defs(`EPSG:${key}`, value)
}

export const appProj4 = proj4