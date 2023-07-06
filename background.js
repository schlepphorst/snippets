console.log('background worker speaking');
let respondedToRequest = false;

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
      respondedToRequest = true; // don't respond again
      setTimeout(() => {
        respondedToRequest = false;
      }, 1000); // reset responder
    } else {
      if (!respondedToRequest) {
        // Maybe we should respond
        setTimeout(() => {
          if (!respondedToRequest) {
            sendResponse({});
            respondedToRequest = true;
            setTimeout(() => {
              respondedToRequest = false;
            }, 1000); // reset responder
          }
        }, 500);
      }
    }
  } else if (request.method == 'clipPageNow') {
    console.log('Clipper sent a request!');
  }
  // else sendResponse({});
});

function savePage() {
  console.log('BG: we should save the page');
}
