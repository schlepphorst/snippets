let snippets = [];
// Snippet Object
// Properties: url, title, preview, (and text)

document.addEventListener('DOMContentLoaded', async () => {
  const buttonCopy = document.getElementsByClassName('far fa-copy');
  buttonCopy[0].addEventListener('click', saveButtonPressed);
  const buttonExpand = document.getElementsByClassName('expandPage');
  buttonExpand[0].addEventListener('click', expandButtonPressed);

  snippets = await SnippetController.getSnippets();

  renderSnippets();
});

async function expandButtonPressed() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tab) => {
    chrome.tabs.sendMessage(
      tab[0].id,
      { method: 'getSelection' },
      (response) => {
        // console.log(response.data);
      }
    );
  });
}

// async function saveButtonPressed() {
//   await chrome.tabs.query({ active: true, currentWindow: true }, (tab) => {
//     chrome.tabs.sendMessage(
//       tab[0].id,
//       { method: 'getSelection' },
//       (response) => {
//         console.log(
//           'Saving new entry from Page: ',
//           tab[0].title,
//           'with text',
//           response.data
//         );
//         saveSnippet(tab[0].url, tab[0].title, response.data);
//       }
//     );
//   });
// }

// async function saveSnippet(url, title, text) {
//   snippet = await SnippetController.saveSnippet(new Snippet(url, title, text));
//   renderSnippets();
// }

async function saveButtonPressed() {
  await saveSnippet();
  setTimeout(() => window.close(), 300);
}

async function saveSnippet() {
  await chrome.tabs.query({ active: true, currentWindow: true }, (tab) => {
    chrome.tabs.sendMessage(
      tab[0].id,
      { method: 'getSelection' },
      (response) => {
        setTimeout(() => {
          const selectedText = response ? response.data : '';
          console.log(
            'Saving new entry from Page: ',
            tab[0].title,
            'with text',
            selectedText
          );
          SnippetController.saveSnippet(
            new Snippet(tab[0].url, tab[0].title, selectedText)
          );
        }, 100);
      }
    );
  });
}

const renderSnippets = () => {
  const snippetMainContainer = document.querySelector('.snippets');
  const currentContainer = document.querySelector('snippetContainer');
  if (currentContainer) currentContainer.remove();
  let count = 0;
  const snippetContainer = document.createElement('div');
  snippetContainer.className = 'snippetContainer';
  snippets.forEach((snippet) => {
    count += 1;
    if (count <= 4) {
      // console.log(snippet);
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
      preview.textContent = snippet.text;

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

class Snippet {
  constructor(url, title, text) {
    this.url = url;
    this.title = title;
    if (text) {
      this.text = text;
      // this.preview = text.slice(0, 300);
      // if (this.preview.length > 90) this.preview += '...';
    }
  }
}
