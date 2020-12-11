const resultsList = document.getElementById('resultsBlock')
const validate = document.getElementById('validate')


document.getElementById("startOver").addEventListener('click', (e) => {
  location.reload()
})

function sendText(msg, warning) {
  li = document.createElement("li")
  resultsList.appendChild(li)
  if (warning) { li.classList.add("warning") }
  li.innerHTML += msg
}

function liftText(msg, warning) {
  p = document.createElement("p")
  document.getElementById('encodingWarning').appendChild(p)
  if (warning) { p.classList.add("warning") }
  p.innerHTML += msg
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

    if (encoding != "UTF-8" && encoding != "ascii") {
      liftText("This CSV's encoding looks to be: " + encoding + " (est. " + confidence.slice(2,4) +"% accurate) (and that is bad). It should be UTF-8.", true)
    } else {
      liftText("Encoding looks OK. CSV is UTF-8 or ASCII.")
    }

    // Check for unusual UTF-8 parsing
    if (string != string.normalize()) {
      liftText("There may be an issue with your data that makes it non-UTF-8-compliant.", true)
    }
  };
  fileReader.readAsArrayBuffer(file);
}
