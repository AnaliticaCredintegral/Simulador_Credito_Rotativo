function doGet() {
  return HtmlService.createTemplateFromFile("Prueba")
    .evaluate()
    .setTitle("Simulador Rotativo")
    .addMetaTag("viewport", "width=device-width, initial-scale=1, viewport-fit=cover");
}

function include(fileName) {
  return HtmlService.createHtmlOutputFromFile(fileName).getContent();
}