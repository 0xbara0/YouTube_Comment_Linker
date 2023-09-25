function linkifyTextNode(textNode) {
  // 画像ファイルへのURLを除外する正規表現
  const urlRegex = /(https?:\/\/[^\s]+(?<!\.(jpg|jpeg|png|gif|bmp)))/g;

  const parentNode = textNode.parentNode;
  let textContent = textNode.nodeValue;

  let lastIndex = 0;
  let match;
  const fragment = document.createDocumentFragment();

  while ((match = urlRegex.exec(textContent)) !== null) {
    const text = textContent.slice(lastIndex, match.index);
    const url = match[0];

    fragment.appendChild(document.createTextNode(text));

    const aTag = document.createElement('a');
    aTag.href = url;
    aTag.target = '_blank';
    aTag.textContent = url;
    fragment.appendChild(aTag);

    lastIndex = urlRegex.lastIndex;
  }

  fragment.appendChild(document.createTextNode(textContent.slice(lastIndex)));
  parentNode.replaceChild(fragment, textNode);
}

function processElement(element) {
  const childNodes = element.childNodes;
  for (let i = 0, len = childNodes.length; i < len; i++) {
    const node = childNodes[i];
    if (node.nodeType === Node.TEXT_NODE) {
      linkifyTextNode(node);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      processElement(node);
    }
  }
}

const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node.querySelector('yt-formatted-string[id="content-text"]');
        if (element) {
          processElement(element);
        }
      }
    });
  });
});

const targetNode = document.body;
const config = {
  childList: true,
  subtree: true,
};
observer.observe(targetNode, config);
