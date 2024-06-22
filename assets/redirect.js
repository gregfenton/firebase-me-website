document.addEventListener("DOMContentLoaded", function () {
    // Handle browser navigation events
    window.addEventListener('popstate', function () {
        loadContent(window.location.pathname);
    });

    // Initial load
    loadContent(window.location.pathname);

    function loadContent(path) {
        let restore = getQueryParams('path');
        if(restore&& restore.startsWith('/'))
            restore = restore.slice(1);

        let source;
        switch (restore) {
            case 'privacy':
                source = 'assets/privacy.md'
                break;
            case '404':
                source = 'assets/404.md'
                break;
            case '':
            case null:
                source = 'assets/welcome.md'
                break;
            default:
                source = `pages/${restore}.md`
                break;
        }
        if (!source) return;
        source = source.replace('//', '/');

        const current = `${window.location.origin}/${restore}`.replace('//', '/');
        const target = `${window.location.origin}/${source}`;
        console.log("Restoring url:", restore)
        console.log("source url:", source)
        console.log("current location:", current)
        console.log("current target:", target)

        history.replaceState(null, '',restore);
        fetch(`${window.location.origin}/${source}`)
            .then(response => {
                if (!response.ok) throw new Error('Content not found');
                return response.text();
            })
            .then(text => {
                renderMarkdown(text, source);
            })
            .catch(error => {
                console.error('Error loading content:', error);
                fetch('assets/404.md')
                    .then(response => response.text())
                    .then(text => {
                        renderMarkdown(text, 'assets/404.md');
                    });
            });
        // select path from navication
        // set category
        // set node
    }

    // // Function to handle internal navigation
    // document.querySelectorAll('nav ul.nav-list a').forEach(link => {
    //     link.addEventListener('click', function (event) {
    //         event.preventDefault();
    //         const url = link.getAttribute('href');
    //         history.pushState(null, null, url);
    //         loadContent(url);
    //     });
    // });

    // // Load welcome.md when clicking on the home link
    // document.getElementById('home-link').addEventListener('click', function (event) {
    //     event.preventDefault();
    //     history.pushState(null, null, '/');
    //     loadContent('/');
    // });
});
