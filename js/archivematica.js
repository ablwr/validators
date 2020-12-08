const resultsList = document.getElementById('resultsBlock')
const validate = document.getElementById('validate')
const load = document.getElementById('csvData')
let manifest = ""

const all_headers = [
  "filename", "dc.title", "dc.creator", "dc.subject", "dc.description", "dc.publisher", 
  "dc.contributor","dc.date", "dc.type", "dc.format", "dc.identifier", "dc.source", 
  "dc.language", "dc.relation", "dc.coverage", "dc.rights"
]

const req_headers = ["filename"]

const unique_headers = [
  "filename"
]

let fnCol = []


function sendText(msg, warning) {
  p = document.createElement("p")
  resultsList.appendChild(p)
  if (warning) { p.classList.add("warning") }
  p.innerHTML += msg
}

function checkFilename(manifest, fnCol) {
  manifest.data.forEach((row, ri) => {
    if (!ri == 0) {
      fnCol.forEach(column => {
        if (!row[column].startsWith("objects/")) {
          sendText("Filename path must start with 'objects/'")
          sendText("Check " + row[column])
        }
      })
      fnCol.forEach(column =>{
      dotCheck = row[column].match(/\./g)
      rezCaveat = row[column].match(/(.low.|.medium.|.high.)/g)
      if (dotCheck != null && rezCaveat != null  ) {
        if (dotCheck.length > 1) {
          sendText("Filepath contains more than one period.")
        }
      }
    })
    }
  })
}


function checkHeaderData(header) {

  header.forEach(el => {
    if (el[0] == " " || el[el.length - 1] == " ") {
      sendText("Column headers fields cannot have leading or trailing blank spaces", true)
    }
  })

  if (!header.some(r => req_headers.indexOf(r) >= 0)) {
    sendText("One of the required column headers is missing: filename.", true)
  }

  if (header.filter(x => !all_headers.includes(x)).length > 0) {
      sendText("Your metadata.csv contains custom metadata. Is that ok?")
      sendText("Custom columns are: "+ header.filter(x => !all_headers.includes(x)), true )
  }
}

function checkChardet() {
  var file = document.getElementById('csvData').files[0];
  var fileReader = new FileReader();
  fileReader.onload = function() {
    var array = new Uint8Array(fileReader.result);
    var string = "";
    for (var i = 0; i < array.length; ++i) {
      string += String.fromCharCode(array[i]);
    }

    let encoding = jschardet.detect(string).encoding
    let confidence = jschardet.detect(string).confidence.toString()

    if (encoding != "UTF-8") {
      sendText("This CSV's encoding looks to be: " + encoding + " (est. " + confidence.slice(2,4) +"%) ...... and that is bad. It should be UTF-8.", true)
    } else {
      sendText("CSV is UTF-8 (and that's gr8)")
    }
  };
  fileReader.readAsArrayBuffer(file);
}


function validateCSV(manifest) {
  document.getElementById("resultsBlock").innerHTML = ''
  checkChardet()

  let header = manifest.data[0]
  checkHeaderData(header)


  header.forEach((el, i) => {
    if (el == "filename") {
        fnCol.push(i)
    }
  })

 if (fnCol) { checkFilename(manifest, fnCol) }
  sendText("Validation check complete")
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
    skipEmptyLines: true,
    delimiter: ",",
  })
})

validate.addEventListener('click', (e) => {
  let result = validateCSV(manifest);
})


