function json(sheetName, parameters, cnt) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
  const sheet = spreadsheet.getSheetByName(sheetName)
  const data = sheet.getDataRange().getValues()
  const jsonData = convertToJson(data, parameters, cnt)
  return ContentService
        .createTextOutput(JSON.stringify(jsonData))
        .setMimeType(ContentService.MimeType.JSON)
}
function convertToJson(data, parameters, cnt) {
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
  })
  json = shuffleArray(json)
  if (cnt > 0 && json.length >= cnt) {
    json = json.slice(0, cnt)
  }
  return json
}
function doGet(e) {
  const path = e.parameter.path
  const cnt = e.parameter.shuffle ? (e.parameter.cnt ? e.parameter.cnt : -1) : -1
  const params = e.parameters
  let parameters = {}
  for (const [key, value] of Object.entries(params)) {
    if (key != 'path' && key != 'cnt') {
      parameters[key] = value
    }
  }
  return json(path, parameters, cnt)
}
function shuffleArray(array) {
  var i, j, temp;
  for (i = array.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}