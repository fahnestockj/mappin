export function downloadBlob(blob: Blob, fileName: string) {

  // Creating an object for downloading url
  const url = window.URL.createObjectURL(blob)

  // Creating an anchor(a) tag of HTML
  const a = document.createElement('a')

  // Passing the blob downloading url
  a.setAttribute('href', url)

  // Setting the anchor tag attribute for downloading
  // and passing the download file name
  a.setAttribute('download', fileName)

  // Performing a download with click
  a.click()
}