// Redirect is for updating the content and url location
// for a page load we check if there is a path redirect (?path=value)
// for a user click event, we repeat the process for the new path click
// after both these conditions, we inform the navigation.js that we have moved
function loadContent(input) {
    let restore = getQueryParams('path');
    const source = getSource(input)

    const current = `${window.location.origin}/${restore}`.replace('//', '/');
    const target = `${window.location.origin}/${source}`;
    console.log("Restoring url:", restore)
    console.log("source url:", source)
    console.log("current location:", current)
    console.log("current target:", target)

    history.replaceState(null, '', restore);
    fetch(target)
        .then(response => {
            if (!response.ok) throw new Error('Content not found');
            return response.text();
        })
        .then(text => {
            renderMarkdown(text, source);
        })
        .catch(error => {
            console.error('Error loading content:', error);
            fetch(getSource("404"))
                .then(response => response.text())
                .then(text => {
                    renderMarkdown(text, 'assets/404.md');
                });
        });
    // select path from navication
    // set category
    // set node
}
function getSource(path) {
    if (path && path.startsWith('/'))
        path = path.slice(1);
    console.log("GET SOURCE", path)

    let source;
    switch (path) {
        case 'privacy':
        case 'policy':
            source = 'assets/privacy.md'
            break;
        case 'contact':
            source = 'assets/contact.md'
            break;
        case '404':
            source = 'assets/404.md'
            break;
        case 'index.html':
        case '':
        case null:
            source = 'assets/welcome.md'
            break;
        default:
            source = `pages/${path}.md`
            break;
    }
    if (!source) throw new Error("No source found for path: " + path);
    return source.replace('//', '/');
}
document.addEventListener("DOMContentLoaded", function () {
    // Handle browser navigation events
    // window.addEventListener('popstate', function () {
    //     loadContent(window.location.pathname);
    // });

    // Initial load
    loadContent(window.location.pathname);

});
