import { HTTPStore, openArray, slice } from "@fahnestockj/zarr-fork";
declare enum HTTPMethod {
  GET = "GET",
}
/**
 * Fetches a single satellite image URL for a specific data point.
 *
 * @param zarrUrl - The zarr URL for the marker's timeseries data
 * @param originalIndex - The original zarr index (before filtering) for the data point
 * @returns Promise that resolves to the image URL string
 *
 * TODO: Implement this function to:
 * 1. Open zarr store at zarrUrl
 * 2. Read the imageUrl array at the path (you'll need to find the correct path)
 * 3. Fetch just imageUrl[originalIndex] from the zarr array
 * 4. Return the URL string
 */
export async function getImageUrl(
  zarrUrl: string,
  originalIndex: number
): Promise<string> {
  console.log("Fetching image URL for:", { zarrUrl, originalIndex });

  const store = new HTTPStore(zarrUrl, {
    fetchOptions: {},
    supportedMethods: ["GET" as HTTPMethod],
  });
  const imageUrlZarr = await openArray({
    store,
    path: "/granule_url",
    mode: "r",
  });
  console.log(imageUrlZarr);
  
  
  // Need to fetch the raw chunk and manually extract the bytes
  // Calculate which chunk contains our index
  const chunkSize = imageUrlZarr.meta.chunks[0]; // 84 elements per chunk
  const chunkIndex = Math.floor(originalIndex / chunkSize);
  const indexInChunk = originalIndex % chunkSize;

  console.log('Chunk info:', { chunkSize, chunkIndex, indexInChunk });

  // Fetch the entire chunk as raw data
  const chunkKey = `${imageUrlZarr.keyPrefix}${chunkIndex}`;
  console.log('Fetching chunk:', chunkKey);

  const chunkData = await store.getItem(chunkKey);
  console.log('Raw chunk data:', chunkData);

  // Decode the chunk (handles compression)
  const decodedBytes = await (imageUrlZarr as any).decodeChunk(chunkData);
  console.log('Decoded bytes:', decodedBytes);
  console.log('Decoded byteLength:', decodedBytes.byteLength);

  // Each element is 4096 bytes (1024 UTF-32 chars)
  const bytesPerElement = 1024 * 4; // 4096
  const startByte = indexInChunk * bytesPerElement;
  const endByte = startByte + bytesPerElement;

  const imageUrlRawData = new Uint8Array(decodedBytes, startByte, bytesPerElement);
  console.log('imageUrlRawData:', imageUrlRawData);

  // Process UTF-32 encoded data (4 bytes per character, 1024 characters total = 4096 bytes)
  const offset = 0;
  const bytesPerChar = 4; // UTF-32 encoding
  const maxChars = 1024;
  const totalBytes = maxChars * bytesPerChar; // 4096 bytes

  // imageUrlRawData is already a Uint8Array of the right size
  const uintArray = imageUrlRawData;
  let imageUrl = "";

  // Process 4 bytes at a time for UTF-32
  for (let i = 0; i < uintArray.length; i += bytesPerChar) {
    // Read 4 bytes as little-endian UTF-32
    const codePoint =
      uintArray[i] |
      (uintArray[i + 1] << 8) |
      (uintArray[i + 2] << 16) |
      (uintArray[i + 3] << 24);

    // Stop at null terminator
    if (codePoint === 0) {
      break;
    }

    imageUrl += String.fromCharCode(codePoint);
  }
  console.log('Decoded URL:', imageUrl);

  // Replace .nc extension with .png
  const pngUrl = imageUrl.replace(/\.nc$/, '.png');
  console.log('PNG URL:', pngUrl);

  return pngUrl;
}
