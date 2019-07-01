var validate = document.getElementById('validate');

var schemaData;

fetch('assets/pbcore-2.1.xsd')
  .then(response => response.text())
  .then(data => schemaData = data)

validate.addEventListener('click', function(e){
  var Params = {
    xml: document.getElementById('xmlData').value,
    schema: schemaData,
    arguments: ["--noout", "--schema", "pbcore-2.1.xsd", "input.xml"]
  };
  var result = validateXML(Params);
  if (result.search("xml validates") > 0) {
    document.getElementById('resultConsole').innerHTML = "Valid!"
  } else {
    document.getElementById('resultConsole').innerHTML = ("NOT so valid!\n\n" + result)
  }
});
