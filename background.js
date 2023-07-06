console.log('background worker speaking');

chrome.extension.onMessage.addListener(function (
  request,
  sender,
  sendResponse
) {
  if (request.method == 'getSelection') {
    const selection = window.getSelection().toString();
    if (selection.length) {
      console.log('Sending text: ', selection);
      sendResponse({ data: selection });
    }
  }
  // else sendResponse({});
});

function savePage() {
  console.log('BG: we should save the page');
}
