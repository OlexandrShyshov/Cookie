//Check if the browser is mobile //Перевірка чи браузер є мобільний 
export let isMobile = {
    Android: function () {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function () {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function () {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function () {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function () {
        return navigator.userAgent.match(/IEMobile/i);
    },
    any: function () {
        return isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows();
    },
};
//Adding the touch class to HTML if the browser is mobile //Додавання сенсорного класу до HTML, якщо браузер мобільний
export function addTouchClass() {
	if (isMobile.any()) document.documentElement.classList.add('touch');
}
//Adding loaded to HTML after the page is fully loaded //Додавання завантажується в HTML після повного завантаження сторінки
export function addLoadedClass() {
	if (!document.documentElement.classList.contains('loading')) {
		window.addEventListener("load", function () {
			setTimeout(function () {
				document.documentElement.classList.add('loaded');
			}, 0);
		});
	}
}
//Getting a hash of a website address //Отримання хешу адреси сайту
export function getHash() {
	if (location.hash) { return location.hash.replace('#', ''); }
}
//Scroll and jump blocking helper modules //Допоміжні модулі блокування прокручування та стрибка
export let bodyLockStatus = true
export let bodyLockToggle = (delay = 500) => {
	if (document.documentElement.classList.contains('lock')) {
		bodyUnlock(delay)
	} else {
		bodyLock(delay)
	}
}
export let bodyUnlock = (delay = 500) => {
	if (bodyLockStatus) {
		const lockPaddingElements = document.querySelectorAll("[data-lp]");
		setTimeout(() => {
			lockPaddingElements.forEach(lockPaddingElement => {
				lockPaddingElement.style.paddingRight = ''
			});
			document.body.style.paddingRight = ''
			document.documentElement.classList.remove("lock")
		}, delay)
		bodyLockStatus = false
		setTimeout(function () {
			bodyLockStatus = true
		}, delay)
	}
}
export let bodyLock = (delay = 500) => {
	if (bodyLockStatus) {
		const lockPaddingElements = document.querySelectorAll("[data-lp]")
		const lockPaddingValue = window.innerWidth - document.body.offsetWidth + 'px'
		lockPaddingElements.forEach(lockPaddingElement => {
			lockPaddingElement.style.paddingRight = lockPaddingValue
		});

		document.body.style.paddingRight = lockPaddingValue
		document.documentElement.classList.add("lock")

		bodyLockStatus = false
		setTimeout(function () {
			bodyLockStatus = true
		}, delay)
	}
}
//Menu module (burger) //Модуль роботи з меню (бургер)
export function menuInit() {
	if (document.querySelector(".icon-menu")) {
		document.addEventListener("click", function (e) {
			if (bodyLockStatus && e.target.closest('.icon-menu')) {
				bodyLockToggle();
				document.documentElement.classList.toggle("menu-open");
			}
		});
	};
}
export function menuOpen() {
	bodyLock();
	document.documentElement.classList.add("menu-open");
}
export function menuClose() {
	bodyUnlock();
	document.documentElement.classList.remove("menu-open");
}
// FLS (Full Logging System)
export function FLS(message) {
	setTimeout(() => {
		if (window.FLS) {
			console.log(message);
		}
	}, 0);
}
//Array uniqueness //Унікалізація масиву
export function uniqArray(array) {
	return array.filter(function (item, index, self) {
		return self.indexOf(item) === index;
	});
}
//Formatting numbers like 100,000,000 //Форматування цифр типу 100 000 000
export function getDigFormat(item, sepp = ' ') {
	return item.toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, `$1${sepp}`);
}
