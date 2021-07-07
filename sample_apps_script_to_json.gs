function json(sheetName, parameters) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
  const sheet = spreadsheet.getSheetByName(sheetName)
  const data = sheet.getDataRange().getValues()
  const jsonData = convertToJson(data, parameters)
  return ContentService
        .createTextOutput(JSON.stringify(jsonData))
        .setMimeType(ContentService.MimeType.JSON)
}
function convertToJson(data, parameters) {
  const headers = data[0]
  const raw_data = data.slice(1,)
  let json = []
  raw_data.forEach(d => {
      let object = {}
      let skipRow = false
      for (let i = 0; i < headers.length; i++) {
        object[headers[i]] = d[i].toString()
        if (headers[i] in parameters && parameters[headers[i]].indexOf(d[i].toString()) == -1) {
          skipRow = true
          break
        }
      }
      if (!skipRow) json.push(object)
  });
  return json
}
function doGet(e) {
  const path = e.parameter.path
  const params = e.parameters
  let parameters = {}
  for (const [key, value] of Object.entries(params)) {
    if (key != 'path') {
      parameters[key] = value
    }
  }
  return json(path, parameters)
}