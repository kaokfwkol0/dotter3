function fixNode(node) {
    const parent = node.parentElement;
    // 親要素が存在しないなら処理しない
    if (!parent) {
        return;
    }
    // 親要素がcssかjsだったら処理しない
    if (['style', 'script', 'noscript'].includes(parent.tagName.toLowerCase())) {
        return;
    }
    // そもそもテキストではない場合は処理しない
    if (node.nodeType !== Node.TEXT_NODE) {
        return;
    }
    // 空のテキストは処理しない
    if (!node.textContent.trim()) {
        return;
    }
    // すでにドット化されていたら処理しない
    if (/^[\.\n\r]+$/g.test(node.textContent)) {
        return;
    }
    console.log('Replace:', parent.tagName, node.textContent);
    node.textContent = node.textContent.replace(/./g, '.');
}

function fixNodeLoop(root) {
    for (const node of root.childNodes) {
        fixNodeLoop(node);
        fixNode(node);
    }
}

const html = document.querySelector('html');

fixNodeLoop(html);

const observer = new MutationObserver((records, observer) => {
    for (const record of records) {
        fixNodeLoop(record.target);
    }
});
observer.observe(html, {
    subtree: true,
    childList: true,
    attributes: true,
    characterData: true,
});
