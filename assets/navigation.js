document.addEventListener("DOMContentLoaded", function() {
    fetch('structure.json')
        .then(response => response.json())
        .then(data => {
            populateCategories(data);
            const initialCategory = data[0];
            if (initialCategory && initialCategory.children) {
                populateNavigation(initialCategory.children);
            }
        })
        .catch(error => console.error('Error loading structure.json:', error));

    function populateCategories(data) {
        const categoryList = document.getElementById('category-list');
        categoryList.innerHTML = '';
        data.forEach(category => {
            const link = document.createElement('a');
            link.href = '#';
            link.textContent = category.name;
            link.addEventListener('click', (event) => {
                event.preventDefault();
                populateNavigation(category.children);
            });
            categoryList.appendChild(link);
        });
    }

    function populateNavigation(children) {
        const navList = document.getElementById('nav-list');
        navList.innerHTML = '';
        children.forEach(child => {
            const listItem = createNavItem(child);
            navList.appendChild(listItem);
        });
    }

    function createNavItem(item) {
        const listItem = document.createElement('li');
        if (item.type === 'dir') {
            const span = document.createElement('span');
            span.classList.add('nav-item');
            span.textContent = item.name;
            span.addEventListener('click', function () {
                listItem.classList.toggle('active');
                const childList = listItem.querySelector('ul');
                if (childList) {
                    childList.classList.toggle('hidden');
                }
            });
            listItem.appendChild(span);
            if (item.children) {
                const childList = document.createElement('ul');
                childList.classList.add('submenu', 'hidden');
                item.children.forEach(child => {
                    const childItem = createNavItem(child);
                    childList.appendChild(childItem);
                });
                listItem.appendChild(childList);
            }
        } else if (item.type === 'file') {
            const link = document.createElement('a');
            link.href = item.path;
            link.textContent = item.name;
            link.addEventListener('click', function (event) {
                event.preventDefault();
                fetch(item.path)
                    .then(response => response.text())
                    .then(text => {
                        renderMarkdown(text, item.path);
                    })
                    .catch(error => console.error('Error fetching the markdown file:', error));
            });
            listItem.appendChild(link);
        }
        return listItem;
    }

    // Load welcome.md by default
    fetch('assets/welcome.md')
        .then(response => response.text())
        .then(text => {
            renderMarkdown(text, 'assets/welcome.md');
        })
        .catch(error => console.error('Error loading welcome.md:', error));

    // Load welcome.md when clicking on the home link
    document.getElementById('home-link').addEventListener('click', function(event) {
        event.preventDefault();
        fetch('assets/welcome.md')
            .then(response => response.text())
            .then(text => {
                renderMarkdown(text, 'assets/welcome.md');
            })
            .catch(error => console.error('Error loading welcome.md:', error));
    });
});
