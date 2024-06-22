document.querySelectorAll('nav ul.nav-list .nav-item').forEach(item => {
    item.addEventListener('click', function (event) {
        const parent = item.parentElement;
        parent.classList.toggle('active');
        event.stopPropagation();
    });
});

document.querySelectorAll('nav ul.nav-list a').forEach(link => {
    link.addEventListener('click', function (event) {
        event.preventDefault();
        const url = link.getAttribute('href');
        fetch(url)
            .then(response => response.text())
            .then(text => {
                renderMarkdown(text, url);
                highlightCurrentCategory(link);
            })
            .catch(error => console.error('Error fetching the markdown file:', error));
    });
});

let currentLanguage = 'js'; // Default language

function renderMarkdown(text, url) {
    const container = document.getElementById('markdown-content');
    const titleContainer = document.getElementById('document-title');

    // Extract and set the document title
    const titleMatch = text.match(/^#\s(.+)/m);
    if (titleMatch) {
        titleContainer.textContent = titleMatch[1];
    } else {
        titleContainer.textContent = 'Document';
    }

    // Process the markdown content
    const lines = text.split('\n');
    const finalText = [];
    let inCodeGroup = false;
    let groupContent = '';

    lines.forEach(line => {
        if (line.trim() === '{{group:code}}') {
            inCodeGroup = true;
            groupContent = '';
        } else if (line.trim() === '{{endgroup}}') {
            inCodeGroup = false;
            finalText.push(renderCodeGroup(groupContent));
        } else if (inCodeGroup) {
            groupContent += line + '\n';
        } else {
            finalText.push(line);
        }
    });

    container.innerHTML = marked.parse(finalText.join('\n'));

    // Generate TOC from custom anchors
    const tocContainer = document.querySelector('.toc');
    tocContainer.innerHTML = '';
    const anchorRegex = /{{anchor:([^}]+)}}/g;
    let match;
    while ((match = anchorRegex.exec(text)) !== null) {
        const label = match[1].trim();
        const anchorId = label.toLowerCase().replace(/\s+/g, '-');
        const anchorLink = document.createElement('a');
        anchorLink.href = `#${anchorId}`;
        anchorLink.textContent = label;
        anchorLink.addEventListener('click', function () {
            document.querySelectorAll('.toc li a').forEach(a => a.classList.remove('active'));
            anchorLink.classList.add('active');
        });
        const listItem = document.createElement('li');
        listItem.appendChild(anchorLink);
        tocContainer.appendChild(listItem);

        const anchorElement = document.createElement('a');
        anchorElement.id = anchorId;
        container.innerHTML = container.innerHTML.replace(match[0], anchorElement.outerHTML);
    }

    // Highlight code blocks
    document.querySelectorAll('pre code').forEach(block => {
        hljs.highlightElement(block);
    });

    // Initialize code group visibility
    document.querySelectorAll('.code-group').forEach(group => {
        const selector = group.querySelector('.language-selector');
        selector.value = currentLanguage; // Set the current global language
        selector.addEventListener('change', function () {
            currentLanguage = this.value; // Update the global language
            updateCodeGroupVisibility();
        });
        updateCodeGroupVisibility();
    });
}

function renderCodeGroup(groupContent) {
    const languages = ['js', 'node', 'python'];
    const languageOptions = languages.map(lang => `<option value="${lang}">${lang.toUpperCase()}</option>`).join('');
    let result = `<div class="code-group"><select class="language-selector">${languageOptions}</select>\n`;

    languages.forEach(lang => {
        const regex = new RegExp(`^\\s*\\\`\\\`\\\`${lang}([\\s\\S]*?)\\\`\\\`\\\``, 'm');
        const match = groupContent.match(regex);
        if (match) {
            result += `<pre><code class="language-${lang}" style="display: none;">${match[1].trim()}</code></pre>\n`;
        }
    });

    result += `<div class="language-warning" style="display: none;"></div></div>`;
    return result;
}

function updateCodeGroupVisibility() {
    document.querySelectorAll('.code-group').forEach(group => {
        const codeBlocks = group.querySelectorAll('pre code');
        let languageFound = false;

        codeBlocks.forEach(block => {
            if (block.className.includes(`language-${currentLanguage}`)) {
                block.style.display = 'block';
                languageFound = true;
            } else {
                block.style.display = 'none';
            }
        });

        const warning = group.querySelector('.language-warning');
        if (languageFound) {
            warning.style.display = 'none';
        } else {
            warning.style.display = 'block';
            warning.textContent = `${currentLanguage.toUpperCase()} does not support this feature.`;
        }
    });

    document.querySelectorAll('.language-selector').forEach(selector => {
        selector.value = currentLanguage;
    });
}

function highlightCurrentCategory(link) {
    document.querySelectorAll('nav ul.nav-list > li').forEach(item => item.classList.remove('active'));
    const parentLi = link.closest('li');
    parentLi.classList.add('active');
}
