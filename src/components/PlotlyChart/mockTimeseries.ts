import { ITimeseries } from "../../types";
import { blueX, blueY, greenX, greenY, redX, redY, yellowX, yellowY } from "./mockData";

export const malaspinaTimerseries: Array<ITimeseries> = [
  {
    marker: {
      id: "blueMalaspinaTimeseries",
      color: "blue",
      latLon: {
        lat: 60.11,
        lon: -140.45
      }
    },
    data: {
      midDateArray: blueX,
      velocityArray: blueY
    }
  },
  {
    marker: {
      id: "greenMalaspinaTimeseries",
      color: "green",
      latLon: {
        lat: 60.02,
        lon: -140.54
      }
    },
    data: {
      midDateArray: greenX,
      velocityArray: greenY
    }
  },
  {
    marker: {
      id: "redMalaspinaTimeseries",
      color: "red",
      latLon: {
        lat: 59.92,
        lon: -140.65
      }
    },
    data: {
      midDateArray: redX,
      velocityArray: redY
    }
  },
  {
    marker: {
      id: "yellowMalaspinaTimeseries",
      color: "yellow",
      latLon: {
        lat: 59.83,
        lon: -140.78
      }
    },
    data: {
      midDateArray: yellowX,
      velocityArray: yellowY
    }
  },
]