const resultsList = document.getElementById('resultsBlock')
const validate = document.getElementById('validate')
const load = document.getElementById('csvData')
let manifest = ""

const all_headers = [
  "Bibliographic ID", "Bibliographic ID Label", "Other Identifier", "Other Identifier Type",
  "Title", "Creator", "Contributor", "Genre", "Publisher", "Date Created", "Date Issued",
  "Abstract", "Language", "Physical Description", "Related Item URL", "Related Item Label",
  "Topical Subject", "Geographic Subject", "Temporal Subject", "Terms of Use",
  "Table of Contents", "Statement of Responsibility", "Note", "Note Type",
  "Publish", "Hidden", "File", "Label", "Offset", "Skip Transcoding",
  "Absolute Location", "Date Ingested"
]

const req_headers = ["Title", "Date Issued", "File"]

const unique_headers = [
  "Bibliographic ID", "Bibliographic ID Label", "Title", "Date Created", "Date Issued",
  "Abstract", "Physical Description", "Terms of Use"
]

let opsCols = []
let fileCols = []

function checkPairs(header2) {
  header2.forEach(e => {
    if (e == "Other Identifier Type") {
      if (!header2.includes("Other Identifier")) { 
        sendText("Other Identifier Type field missing its required pair.")
      }
    }
    if (e == "Related Item Label") {
      if (!header2.includes("Related Item URL")) { sendText("Related Item Label field missing its required pair.") }
    }
    if (e == "Note Type") {
      if (!header2.includes("Note")) { sendText("Note Type field missing its required pair.")}
    }
  })
}

function checkOpsCols(manifest, opsCols) {
  manifest.data.forEach((row, ri) => {
    if (!row[ri] == 0 && !row[ri] == 1) {
      opsCols.forEach(column => {
        if (row[column] && row[column].toLowerCase() !== "yes" || row[column] && row[column].toLowerCase() !== "no") {
          sendText("Publish/Hidden fields must have boolean value (yes or no). See Row " + ri + ", Column " + column)
        }
      })
    }
  })
}

function checkFileCols(manifest, fileCols) {
  manifest.data.forEach(row => {
    fileCols.forEach(column =>{
      dotCheck = row[column].match(/\./g)
      rezCaveat = row[column].match(/(.low.|.medium.|.high.)/g)
      if (dotCheck != null && rezCaveat != null  ) {
        if (dotCheck.length > 1) {
          sendText("Filepath contains more than one period.")
        }
      }
    })
  })
}

function checkAdminData(header1) {
  clean = header1.filter(Boolean)
  if (clean.length < 2 || clean.length > 2) {
    sendText("Error")
  }
}

function checkHeaderData(header2) {

  header2.forEach(el => {
    if (el[0] == " " || el[el.length - 1] == " ") {
      sendText("Header fields cannot have leading or trailing blanks")
    }
  })

  dupes = header2.filter((item, index) => header2.indexOf(item) != index)
  if (dupes.some(r => unique_headers.indexOf(r) >= 0)) {
    sendText("A non-repeatable header field is repeated")
  }


  if (!header2.includes("Bibliographic ID")) {
    if (!header2.some(r => req_headers.indexOf(r) >= 0)) {
      sendText("One of the required headers is missing: Title, Date Issued, File.")
    }
  }

  if (!header2.some(r => all_headers.indexOf(r) >= 0)) {
    sendText("Manifest includes invalid metadata field(s)")
  }
}

function validateCSV(manifest) {
  document.getElementById("resultsBlock").innerHTML = ''
  let header1 = manifest.data[0]
  checkAdminData(header1)
  let header2 = manifest.data[1]
  checkHeaderData(header2)
  checkPairs(header2)

  header2.forEach((el, i) => {
    if (el == "Publish" || el == "Hidden") {
      opsCols.push(i)
    }
    if (el == "File") {
      fileCols.push(i)
    }
  })

  if (opsCols) { checkOpsCols(manifest, opsCols) }
  if (fileCols) { checkFileCols(manifest, fileCols) }

  sendText("Validation check complete")
}

function sendText(msg) {
  p = document.createElement("p")
  resultsList.appendChild(p)
  p.appendChild(document.createTextNode(msg))
}

// Listening

load.addEventListener("change", (e) => {
  Papa.parse(document.getElementById('csvData').files[0], {
    complete: function (results) {
      sendText("Parsing complete")
      manifest = results
    },
    error: function (results) {
      sendText("Could not parse manifest")
    },
    skipEmptyLines: true
  })
})

validate.addEventListener('click', (e) => {
  let result = validateCSV(manifest);
})
