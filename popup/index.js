let snippets = [];
// Snippet Object
// Properties: url, title, preview, (and text)

document.addEventListener('DOMContentLoaded', async () => {
  const buttonCopy = document.getElementsByClassName('far fa-copy');
  buttonCopy[0].addEventListener('click', saveButtonPressed);
  const buttonExpand = document.getElementsByClassName('expandPage');
  buttonExpand[0].addEventListener('click', expandButtonPressed);

  // const currentTab = await getTab();
  // // const newSnippet = new Snippet(currentTab.url, currentTab.title);
  // snippets = await SnippetController.saveSnippet(newSnippet);
  snippets = await SnippetController.getSnippets();
  console.log('snippets: ', snippets);

  renderSnippets();
});

async function expandButtonPressed() {
  // Make a new Markdown page]
  const currentTab = await getTab();
  snippets = await SnippetController.saveSnippet(
    new Snippet(
      currentTab.url,
      currentTab.title,
      "In my Stackoverflow folder, I have stackoverflow.ico and 2 bellow files. When importing it to Chrome, it shows the icon in address bar, but when I click on it, Chrome doesn't open any new tab. What am I doing wrong?"
    )
  );
}

async function saveButtonPressed() {
  const currentTab = await getTab();
  console.log(currentTab);
  // let selectedResult;
  // [{ result }] = await chrome.scripting.executeScript({
  //   target: { tabId: currentTab.id },
  //   function: () => {
  //     console.log('Hi we made it');
  //     return getSelection().toString();
  //   },
  // });
  // console.log(result);
  savePage(currentTab);
}

async function savePage(currentTab) {
  // const currentTab = await getTab();
  // console.log(
  //   'current tab: ',
  //   currentTab.url,
  //   '\nCurrent text: ',
  //   SnippetController.currentText()
  // );
  snippets = await SnippetController.saveSnippet(
    new Snippet(currentTab.url, currentTab.title)
  );
}

const renderSnippets = () => {
  const snippetMainContainer = document.querySelector('.snippets');
  let count = 0;
  const snippetContainer = document.createElement('div');
  snippetContainer.className = 'snippetContainer';
  snippets.forEach((snippet) => {
    count += 1;
    if (count <= 4) {
      console.log(snippet);
      const snippetLink = document.createElement('a');
      snippetLink.href = snippet.url;
      snippetLink.target = '_blank';
      snippetContainer.appendChild(snippetLink);

      const snippetDiv = document.createElement('div');
      snippetDiv.className = `snippets${count}`;

      const name = document.createElement('h4');
      name.textContent = snippet.title;

      // const url = document.createElement('a');
      // url.textContent = 'URL: ' + snippet.url;
      // url.href = snippet.url;

      const preview = document.createElement('p');
      preview.textContent = snippet.preview;

      snippetDiv.addEventListener('click', () => {
        window.location.href = snippet.url;
      });

      snippetDiv.appendChild(name);
      // snippetDiv.appendChild(url);
      snippetDiv.appendChild(preview);
      snippetLink.appendChild(snippetDiv);
      snippetMainContainer.appendChild(snippetContainer);
    } else {
      count = 0;
    }
  });
};

const getTab = async () => {
  const getCurrentTab = new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      resolve(tabs[0]);
    });
  });
  return getCurrentTab;
};

const saveTabsToLocal = () => {
  // chrome.storage.local
  //   .set({ storage: snippets })
  //   .then(() => {
  //     console.log('Tried to save data');
  //   })
  //   .then(() => {
  //     chrome.storage.local.get(['storage']).then((result) => {
  //       console.log('Loaded snippets: ', result);
  //     });
  //   });
};

const loadSnippets = async () => {
  // chrome.storage.local.get(['storage']).then((result) => {
  //   console.log('Loaded snippets: ', result);
  // });
  // Placeholder tabs
  const snip1 = new Snippet('google.com', 'Google');
  const snip2 = new Snippet(
    'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes',
    'Classes - MDN',
    'Classes are a template for creating objects. They encapsulate data with code to work on that data. Classes in JS are built on prototypes but also have some syntax and semantics that are unique to classes.'
  );
  const snip3 = new Snippet(
    'https://www.w3schools.com/js/js_classes.asp',
    'Javascript Classes - W3',
    'If you do not define a constructor method, JavaScript will add an empty constructor method.'
  );
  await SnippetController.saveSnippet(snip1);
  await SnippetController.saveSnippet(snip2);
  await SnippetController.saveSnippet(snip3);
};

// function currentText() {
//   let txt;
//   if (window.getSelection) {
//     txt = window.getSelection();
//   } else if (window.document.getSelection) {
//     txt = window.document.getSelection();
//   } else if (window.document.selection) {
//     txt = window.document.selection.createRange().text;
//   }
//   return txt;
// }

class Snippet {
  constructor(url, title, text) {
    this.url = url;
    this.title = title;
    if (text) {
      this.text = text;
      this.preview = text.slice(0, 300);
      if (this.preview.length > 90) this.preview += '...';
    }
  }
}
