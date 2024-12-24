let intervalId;

const openItems = document.querySelectorAll('.open__item');
const openTexts = document.querySelectorAll('.open__text');

//Open the last item by default //Відкриваємо останній елемент за замовчуванням
if (openTexts.length > 0) {
    const lastElement = openTexts[openTexts.length - 1];
    lastElement.classList.add('menu-active');
    setTimeout(() => {
        lastElement.classList.add('open');
    }, 0);
}

//Adding an event handler for clicks //Додаємо обробник подій для кліків
openItems.forEach(e => {
    e.addEventListener('click', e => {
        const menu = e.currentTarget.dataset.path;
        const targetElement = document.querySelector(`[data-target=${menu}]`);

        e.currentTarget.classList.toggle('svg-rotate');

        //Handling opening/closing elements //Обробка відкриття/закриття елементів
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

