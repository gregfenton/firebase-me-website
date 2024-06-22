document.addEventListener("DOMContentLoaded", function () {
    // Handle browser navigation events
    window.addEventListener('popstate', function () {
        loadContent(window.location.pathname);
    });

    // Initial load
    loadContent(window.location.pathname);

    function loadContent(path) {
        // Treat index.html as the home page
        if (path === '/' || path === '/index.html') {
            path = '/';
        }

        const url = path === '/' ? 'assets/welcome.md' : `pages/${path}.md`;
        

        fetch(url)
            .then(response => {
                if (!response.ok) throw new Error('Content not found');
                return response.text();
            })
            .then(text => {
                renderMarkdown(text, url);
            })
            .catch(error => {
                console.error('Error loading content:', error);
                fetch('assets/404.md')
                    .then(response => response.text())
                    .then(text => {
                        renderMarkdown(text, 'assets/404.md');
                    });
            });
    }

    // Function to handle internal navigation
    document.querySelectorAll('nav ul.nav-list a').forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault();
            const url = link.getAttribute('href');
            history.pushState(null, null, url);
            loadContent(url);
        });
    });

    // Load welcome.md when clicking on the home link
    document.getElementById('home-link').addEventListener('click', function (event) {
        event.preventDefault();
        history.pushState(null, null, '/');
        loadContent('/');
    });
});
