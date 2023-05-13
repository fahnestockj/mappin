import { ITimeseries } from "../../types";
import { blueX, blueY, greenX, greenY, redX, redY, yellowX, yellowY } from "./mockData";

export const malaspinaTimerseries: Array<ITimeseries> = [
  {
    marker: {
      id: "blueMalaspinaTimeseries",
      color: "blue",
      latLng: {
        lat: 60.11,
        lng: -140.45
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
      latLng: {
        lat: 60.02,
        lng: -140.54
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
      latLng: {
        lat: 59.92,
        lng: -140.65
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
      latLng: {
        lat: 59.83,
        lng: -140.78
      }
    },
    data: {
      midDateArray: yellowX,
      velocityArray: yellowY
    }
  },
]