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

function highlightCurrentCategory(link) {
    document.querySelectorAll('nav ul.nav-list > li').forEach(item => item.classList.remove('active'));
    const parentLi = link.closest('li');
    parentLi.classList.add('active');
}
