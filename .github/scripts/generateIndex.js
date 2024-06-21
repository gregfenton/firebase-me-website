const fs = require('fs');
const path = require('path');
const structure = JSON.parse(fs.readFileSync('structure.json', 'utf8'));

function generateNavigation(structure, parentPath = '') {
    let html = '<ul>';
    structure.forEach(item => {
        if (item.type === 'dir') {
            html += `<li><span class="nav-item">${item.name}</span>`;
            html += generateNavigation(item.children, `${parentPath}${item.name}/`);
            html += '</li>';
        } else if (item.type === 'file' && item.name.endsWith('.md')) {
            const filePath = `${parentPath}${item.name}`;
            html += `<li><a href="${filePath.replace('.md', '.html')}">${item.name.replace('.md', '')}</a></li>`;
        }
    });
    html += '</ul>';
    return html;
}

const navigationHtml = generateNavigation(structure);

// Read the template file
const templatePath = path.join(__dirname, 'template.html');
const template = fs.readFileSync(templatePath, 'utf8');

// Replace the placeholder with the generated navigation HTML
const outputHtml = template.replace('<!-- NAVIGATION_PLACEHOLDER -->', navigationHtml);

// Write the output to index.html
fs.writeFileSync('index.html', outputHtml);
