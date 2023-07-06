//onclick/command of icon transpose selected text into storage.storageArea.set()

const SNIPPETS_KEY = 'snippets';

class SnippetController {
  static getSnippets = () => {
    return toPromise((resolve, reject) => {
      chrome.storage.local.get([SNIPPETS_KEY], (result) => {
        if (chrome.runtime.lastError) reject(chrome.runtime.lastError);
        // console.log('Load result: ', result.snippets);
        const loadedSnippets =
          result.snippets != undefined ? result.snippets : [];
        // console.log('Loaded snippets: ', loadedSnippets);
        resolve(loadedSnippets);
      });
    });
  };
  
  static saveSnippet = async (newSnippet) => {
    const oldSnippets = await this.getSnippets();
    // console.log('Loaded snippets to save: ', oldSnippets);
    const updatedSnippets = [newSnippet, ...oldSnippets];
    return toPromise((resolve, reject) => {
      chrome.storage.local.set({ [SNIPPETS_KEY]: updatedSnippets }, () => {
        if (chrome.runtime.lastError) reject(chrome.runtime.lastError);
        console.log('Saved to Snippets, updated list: ', updatedSnippets);
        resolve(updatedSnippets);
      });
    });
  };

  static clearSnippets = () => {
    return toPromise((resolve, reject) => {
      chrome.storage.local.remove([SNIPPETS_KEY], () => {
        if (chrome.runtime.lastError) reject(chrome.runtime.lastError);
        resolve();
      });
    });
  };

  static currentText = () => {
    let txt;
    if (window.getSelection) {
      txt = window.getSelection();
    } else if (window.document.getSelection) {
      txt = window.document.getSelection();
    } else if (window.document.selection) {
      txt = window.document.selection.createRange().text;
    }
    console.log('Text Selection: ', txt);
    return txt;
  };
}

const toPromise = (callback) => {
  const promise = new Promise((resolve, reject) => {
    try {
      callback(resolve, reject);
    } catch (err) {
      reject(err);
    }
  });
  return promise;
};
