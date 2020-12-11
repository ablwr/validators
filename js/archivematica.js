
let manifest = ""

const dc_headers = [
  "filename", "dc.title", "dc.creator", "dc.subject", "dc.description", "dc.publisher", 
  "dc.contributor","dc.date", "dc.type", "dc.format", "dc.identifier", "dc.source", 
  "dc.language", "dc.relation", "dc.coverage", "dc.rights",
  "dcterms.abstract", "dcterms.accessRights", "dcterms.accrualMethod",
  "dcterms.accrualPeriodicity", "dcterms.accrualPolicy", "dcterms.alternative",
  "dcterms.audience", "dcterms.available", "dcterms.bibliographicCitation",
  "dcterms.conformsTo", "dcterms.contributor", "dcterms.coverage", "dcterms.created",
  "dcterms.creator", "dcterms.date", "dcterms.dateAccepted", "dcterms.dateCopyrighted",
  "dcterms.dateSubmitted", "dcterms.description", "dcterms.educationLevel",
  "dcterms.extent", "dcterms.format", "dcterms.hasFormat", "dcterms.hasPart",
  "dcterms.hasVersion", "dcterms.identifier", "dcterms.instructionalMethod",
  "dcterms.isFormatOf", "dcterms.isPartOf", "dcterms.isReferencedBy",
  "dcterms.isReplacedBy", "dcterms.isRequiredBy", "dcterms.issued",
  "dcterms.isVersionOf", "dcterms.language", "dcterms.license", "dcterms.mediator",
  "dcterms.medium", "dcterms.modified", "dcterms.provenance", "dcterms.publisher",
  "dcterms.references", "dcterms.relation", "dcterms.replaces", "dcterms.requires",
  "dcterms.rights", "dcterms.rightsHolder", "dcterms.source", "dcterms.spatial",
  "dcterms.subject", "dcterms.tableOfContents", "dcterms.temporal", "dcterms.title",
  "dcterms.type", "dcterms.valid"
]

const req_headers = ["filename"]

function checkFilename(manifest) {

  manifest.data.forEach((row, ri) => {
    if (!ri == 0) {

      dotCheck = row[0].match(/\./g)
      if (dotCheck != null) {
        if (dotCheck.length > 1) {
          sendText("Filepath contains more than one period.")
        }
      }

      let checkBox = document.getElementById("bag") 
      if (checkBox.checked && dotCheck != null) {
        // Bagged AND object-level must start with "data/"
        if (!row[0].startsWith("data/")) {
          sendText("Because this is a bagged transfer with object-level metadata, filename path (the first column) must start with 'data/'")
          sendText("Check " + row[0], true)
        }
      } else {
        // Standard either way, or bagged dir level
        if (!row[0].startsWith("objects/")) {
          sendText("Filename path (the first column) must start with 'objects/'")
          sendText("Check " + row[0], true)
        }
      }

    }
  })
}


function checkHeaderData(header) {

  if (!header.some(r => req_headers.indexOf(r) >= 0)) {
    sendText("Required header column is missing: filename.", true)
  }

  header.forEach(el => {
    if (el.indexOf(" ") >= 0) {
      sendText("Column headers fields should not have blank spaces. Check this header: " + el, true)
    }
  })

  if (header.filter(x => !dc_headers.includes(x)).length > 0) {
      sendText("Your metadata.csv contains custom metadata. Is that ok? These custom columns will get written to the METS but not be included in uploaded DIP metadata.")
      sendText("Custom columns are: "+ header.filter(x => !dc_headers.includes(x)) )
  }
}


function validateCSV(manifest) {
  document.getElementById("resultsBlock").innerHTML = ''

  let header = manifest.data[0]
  checkHeaderData(header)

  checkFilename(manifest)

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
  checkChardet()
  let result = validateCSV(manifest);
})


