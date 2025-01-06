let intervalId;

const openItems = document.querySelectorAll('.open__item');
const openTexts = document.querySelectorAll('.open__text');

//Open the last item by default
if (openTexts.length > 0) {
    const lastElement = openTexts[openTexts.length - 1];
    lastElement.classList.add('menu-active');
    setTimeout(() => {
        lastElement.classList.add('open');
    }, 0);

    const lastElementIcon = openItems[openItems.length - 1];
    lastElementIcon.classList.add('svg-rotate');
}

//Adding an event handler for clicks
openItems.forEach(e => {
    e.addEventListener('click', e => {
        const menu = e.currentTarget.dataset.path;
        const targetElement = document.querySelector(`[data-target=${menu}]`);

        // Remove svg-rotate from all items except the current one
        openItems.forEach(item => {
            if (item !== e.currentTarget) {
                item.classList.remove('svg-rotate');
            }
        });

        // Toggle svg-rotate on the clicked item
        e.currentTarget.classList.toggle('svg-rotate');

        // Handling opening/closing elements
        openTexts.forEach(el => {
            if (el !== targetElement) {
                el.classList.remove('menu-active', 'open');
            }
        });

        if (!targetElement.classList.contains('open')) {
            targetElement.classList.add('menu-active');
            intervalId = setTimeout(() => {
                targetElement.classList.add('open');
            }, 0);
        } else {
            clearTimeout(intervalId);
            targetElement.classList.remove('menu-active');
            intervalId = setTimeout(() => {
                targetElement.classList.remove('open');
            }, 0);
        }
    });
});
