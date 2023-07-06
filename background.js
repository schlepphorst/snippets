chrome.commands.onCommand.addListener(function (command) {
  switch (command) {
    case 'save-page':
      savePage();
      break;
    default:
      console.log(`Command ${command} not found`);
  }
});

function savePage() {
  alert('We should save the page!');
}
