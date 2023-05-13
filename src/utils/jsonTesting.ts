
import fetch, {
  Headers,
  Request,
  Response
} from 'node-fetch'

async function main() {
  console.log('start');
  if (!globalThis.fetch) {
    // @ts-ignore
    globalThis.fetch = fetch
    // @ts-ignore
    globalThis.Headers = Headers
    // @ts-ignore
    globalThis.Request = Request
    // @ts-ignore
    globalThis.Response = Response
  }
  

  const json = await fetch('http://its-live-data.s3.amazonaws.com/datacubes/v02')
    .then((json) => {
      console.log(json);
    }
  )
  console.log(json);
  

  




}

main()
  .catch((e) => {
    console.log(e);
    process.exit(1)
  })
  .finally(async () => {
    process.exit(0)
  })
