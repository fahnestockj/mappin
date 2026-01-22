// Quick debug script to check composite time values
// Run with: node debug-time.js

const COMPOSITE_URL = "https://its-live-data.s3.amazonaws.com/composites/annual/v2-updated-september2025/S50W070/ITS_LIVE_velocity_EPSG32718_120m_X450000_Y4450000.zarr";

async function fetchAndDecode() {
  // Fetch .zarray metadata
  const zarrayRes = await fetch(`${COMPOSITE_URL}/time/.zarray`);
  const zarray = await zarrayRes.json();
  console.log("Time array metadata:", zarray);

  // Fetch compressed chunk
  const chunkRes = await fetch(`${COMPOSITE_URL}/time/0`);
  const compressedBuffer = await chunkRes.arrayBuffer();

  // Need to decompress blosc - using pako for zlib
  // Actually blosc is more complex, let's just use the zarr library approach

  console.log("\nCompressed chunk size:", compressedBuffer.byteLength, "bytes");
  console.log("Shape:", zarray.shape, "=", zarray.shape[0], "time values");
  console.log("Dtype:", zarray.dtype, "(int64 - days since 1970-01-01)");

  console.log("\n--- To see actual values, add this to getCompositeData.ts after line 66: ---");
  console.log(`
    console.log("Decoded time values:");
    timeRaw.forEach((days, i) => {
      const date = new Date(days * 86400000);
      console.log(\`  [\${i}]: \${days} days -> \${date.toISOString().split('T')[0]}\`);
    });
  `);
}

fetchAndDecode().catch(console.error);
