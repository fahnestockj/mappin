export function findClosestIndex(xArr: Float64Array, yArr: Float64Array, coordinate: [number, number]): [number, number] {

  // find the index of the first element in the array that is greater than the coordinate
  //NOTE: xArr is sorted in ascending order, yArr is sorted in descending order
  const xIndex = xArr.findIndex((element) => coordinate[0] < element)
  const yIndex = yArr.findIndex((element) => coordinate[1] > element)

  // if an index is 0, then that index is closest
  if (xIndex === 0 || yIndex === 0) {
    return [xIndex, yIndex]
  }

  //perform distance formula to find the distance from the coordinate to the point
  const xDistance = Math.abs(coordinate[0] - xArr[xIndex])
  const yDistance = Math.abs(coordinate[1] - yArr[yIndex])
  const distance = Math.sqrt(xDistance ** 2 + yDistance ** 2)

  //perform distance formula on previous point 
  const xDistancePrev = Math.abs(coordinate[0] - xArr[xIndex - 1])
  const yDistancePrev = Math.abs(coordinate[1] - yArr[yIndex - 1])
  const distancePrev = Math.sqrt(xDistancePrev ** 2 + yDistancePrev ** 2)

  //return the index of the closest point
  if (distance < distancePrev) {
    return [xIndex, yIndex]
  }
  return [xIndex - 1, yIndex - 1]

}