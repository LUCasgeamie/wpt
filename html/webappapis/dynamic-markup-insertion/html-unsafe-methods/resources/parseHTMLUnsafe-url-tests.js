const loadPromise = new Promise(resolve => { window.resolveLoadPromise = resolve; });

function assertURL(doc, expectedBaseURI) {
  assert_equals(doc.URL, "about:blank", "document.URL");
  assert_equals(doc.documentURI, "about:blank", "document.documentURI");
  assert_equals(doc.baseURI, expectedBaseURI, "document.baseURI");
}

const invalidXML = `<span x:test="testing">1</span>`;
const inputs = {
  valid: "<html></html>",
  "invalid XML": invalidXML
};

for (const [inputName, input] of Object.entries(inputs)) {
  test(() => {
    const doc = Document.parseHTMLUnsafe(input);

    assertURL(doc, document.baseURI);
  }, `${inputName}: created normally`);

  promise_test(async () => {
    await loadPromise;

    const doc = frames[0].Document.parseHTMLUnsafe(input);

    assertURL(doc, frames[0].document.baseURI);
  }, `${inputName}: created using another iframe's parseHTMLUnsafe from this frame`);

  promise_test(async () => {
    await loadPromise;

    const doc = frames[0].doParse(input);

    assertURL(doc, frames[0].document.baseURI);
  }, `${inputName}: created using another iframe's parseHTMLUnsafe from that frame`);
}
