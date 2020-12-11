const load = document.getElementById('csvData')
let myCSV = ""

function checkHeaderData(header) {
  sendText("<strong>Total list of columns</strong>: "+ header.join(", ") )
}

function findPipes(myCSV) {
  if (myCSV.data[1].includes("|")) {
    sendText("These columns contain pipe characters:")
  }
  myCSV.data[1].forEach((col, ci) => {
    if (col.includes("|")) {
      sendText("<strong>" + myCSV.data[0][ci] + "</strong> has " + col.match(/\|/g).length + " pipe(s)")
    }
  })
}

function validateCSV(myCSV) {
  document.getElementById("resultsBlock").innerHTML = ''
  let header = myCSV.data[0]
  sendText("Rows: " + (myCSV.data.length+1))
  sendText("Columns: " + (myCSV.data[0].length+1))
  findPipes(myCSV)
  checkHeaderData(header)
  sendText("Validation check complete")
}

// Listening

load.addEventListener("change", (e) => {
  Papa.parse(document.getElementById('csvData').files[0], {
    complete: function (results) {
      sendText("Parsing complete")
      myCSV = results
    },
    error: function (results) {
      sendText("Could not parse myCSV")
    },
    skipEmptyLines: true,
    delimiter: ",",
    newline: "\n",
  })
})

validate.addEventListener('click', (e) => {
  checkChardet()
  let result = validateCSV(myCSV);
})


