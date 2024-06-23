// navigation handles all click events and the navigation stack
// when the user clicks a link, we update the location
// redirect.js will handle the content
function goto(dest, stub = false) {
    if (window.location.hostname === 'localhost') {
        if (dest == '/' || dest == 'home')
            dest = 'index.html'
    }
    const loc = dest.startsWith('pages/') ? dest.match(/pages\/(.+)\.md/)[1] : dest
    // this triggers redirect to load the page content
    if (stub) {
        history.pushState(null, window.location.hostname, loc);
    }
    else {
        history.pushState(null, window.location.hostname, '/' + loc);
    }
}
document.addEventListener("DOMContentLoaded", function () {
    fetch('structure.json')
        .then(response => {
            if (!response.ok)
                throw new Error(`HTTP error! status: ${response.status}`);
            return response.json();
        })
        .then(data => {
            if (Array.isArray(data)) {
                populateCategories(data);
                const initialCategory = data[0];
                if (initialCategory && initialCategory.children) {
                    populateNavigation(initialCategory.children);
                }
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
        const navList = document.getElementById('subject-list');
        navList.innerHTML = '';
        children.forEach(child => {
            const listItem = createNavItem(child);
            navList.appendChild(listItem);
        });
    }

    function createNavItem(item) {
        const listItem = document.createElement('li');
        switch (item.type) {
            case 'dir':
            case 'category':

                const span = document.createElement('span');
                span.classList.add('nav-item');
                span.textContent = formatFileName(item.name);
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
                break;
            case 'file':
                const link = document.createElement('a');
                
                link.href = '#';
                link.textContent = formatFileName(item.name);
                link.addEventListener('click', function (event) {
                    // event.preventDefault();
                    goto(item.path)
                });
                listItem.appendChild(link);
                break;

            default:
                break;
        }
        return listItem;
    }
});
