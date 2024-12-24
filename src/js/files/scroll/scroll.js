import { isMobile, getHash, menuClose, getDigFormat } from "../../moduls/functions.js";
import { flsModules } from "../modules.js";
//Scroll to block module //Модуль прокручування до блоку
import { gotoBlock } from "./gotoBlock.js";
//Variable to control the addition of a window scroll event //Змінна контролю додавання події window scroll
let addWindowScrollEvent = false;

//Smooth page navigation //Плавна навігація по сторінці
export function pageNavigation() {
	// data-goto - specify block ID //вказати ID блоку
	// data-goto-header - consider header //враховувати header
	// data-goto-top - undertighten to the specified size //недокрутити на вказаний розмір
	// data-goto-speed - speed (only if additional plugin is used) //швидкість (тільки якщо використовується додатковий плагін)
	//We work when you click on the item //Працюємо при натисканні на пункт
	document.addEventListener("click", pageNavigationAction);
	//If scrollWatcher is connected, highlight the current menu item //Якщо підключено scrollWatcher, підсвічуємо поточний пункт меню
	document.addEventListener("watcherCallback", pageNavigationAction);
	//Main function //Основна функція
	function pageNavigationAction(e) {
		if (e.type === "click") {
			const targetElement = e.target;
			if (targetElement.closest('[data-goto]')) {
				const gotoLink = targetElement.closest('[data-goto]');
				const gotoLinkSelector = gotoLink.dataset.goto ? gotoLink.dataset.goto : '';
				const noHeader = gotoLink.hasAttribute('data-goto-header') ? true : false;
				const gotoSpeed = gotoLink.dataset.gotoSpeed ? gotoLink.dataset.gotoSpeed : 500;
				const offsetTop = gotoLink.dataset.gotoTop ? parseInt(gotoLink.dataset.gotoTop) : 0;
				if (flsModules.fullpage) {
					const fullpageSection = document.querySelector(`${gotoLinkSelector}`).closest('[data-fp-section]');
					const fullpageSectionId = fullpageSection ? +fullpageSection.dataset.fpId : null;
					if (fullpageSectionId !== null) {
						flsModules.fullpage.switchingSection(fullpageSectionId);
						document.documentElement.classList.contains("menu-open") ? menuClose() : null;
					}
				} else {
					gotoBlock(gotoLinkSelector, noHeader, gotoSpeed, offsetTop);
				}
				e.preventDefault();
			}
		} else if (e.type === "watcherCallback" && e.detail) {
			const entry = e.detail.entry;
			const targetElement = entry.target;
			//Processing navigation items: if a value for navigator is specified, highlight the current menu item //Обробка пунктів навігації, якщо вказано значення navigator, підсвічуємо поточний пункт меню
			if (targetElement.dataset.watch === 'navigator') {
				const navigatorActiveItem = document.querySelector(`[data-goto]._navigator-active`);
				let navigatorCurrentItem;
				if (targetElement.id && document.querySelector(`[data-goto="#${targetElement.id}"]`)) {
					navigatorCurrentItem = document.querySelector(`[data-goto="#${targetElement.id}"]`);
				} else if (targetElement.classList.length) {
					for (let index = 0; index < targetElement.classList.length; index++) {
						const element = targetElement.classList[index];
						if (document.querySelector(`[data-goto=".${element}"]`)) {
							navigatorCurrentItem = document.querySelector(`[data-goto=".${element}"]`);
							break;
						}
					}
				}
				if (entry.isIntersecting) {
					//We see the object //Бачимо об'єкт
					// navigatorActiveItem ? navigatorActiveItem.classList.remove('_navigator-active') : null;
					navigatorCurrentItem ? navigatorCurrentItem.classList.add('_navigator-active') : null;
					//const activeItems = document.querySelectorAll('._navigator-active');
					//activeItems.length > 1 ? chooseOne(activeItems) : null
				} else {
					//We don't see the object //Не бачимо об'єкт
					navigatorCurrentItem ? navigatorCurrentItem.classList.remove('_navigator-active') : null;
				}
			}
		}
	}
	function chooseOne(activeItems) {

	}
	//Scrolling by hash //Прокручування по хешу
	if (getHash()) {
		let goToHash;
		if (document.querySelector(`#${getHash()}`)) {
			goToHash = `#${getHash()}`;
		} else if (document.querySelector(`.${getHash()}`)) {
			goToHash = `.${getHash()}`;
		}
		goToHash ? gotoBlock(goToHash, true, 500, 20) : null;
	}
}
//Working with the scrolling hader //Робота з шапкою при скролі 
export function headerScroll() {
	addWindowScrollEvent = true;
	const header = document.querySelector('header.header');
	const headerShow = header.hasAttribute('data-scroll-show');
	const headerShowTimer = header.dataset.scrollShow ? header.dataset.scrollShow : 500;
	const startPoint = header.dataset.scroll ? header.dataset.scroll : 1;
	let scrollDirection = 0;
	let timer;
	document.addEventListener("windowScroll", function (e) {
		const scrollTop = window.scrollY;
		clearTimeout(timer);
		if (scrollTop >= startPoint) {
			!header.classList.contains('_header-scroll') ? header.classList.add('_header-scroll') : null;
			if (headerShow) {
				if (scrollTop > scrollDirection) {
					//downscroll code //код прокручування вниз
					header.classList.contains('_header-show') ? header.classList.remove('_header-show') : null;
				} else {
					//upscroll code //код прокрутки вгору
					!header.classList.contains('_header-show') ? header.classList.add('_header-show') : null;
				}
				timer = setTimeout(() => {
					!header.classList.contains('_header-show') ? header.classList.add('_header-show') : null;
				}, headerShowTimer);
			}
		} else {
			header.classList.contains('_header-scroll') ? header.classList.remove('_header-scroll') : null;
			if (headerShow) {
				header.classList.contains('_header-show') ? header.classList.remove('_header-show') : null;
			}
		}
		scrollDirection = scrollTop <= 0 ? 0 : scrollTop;
	});
}
//Digital counter animation module //Модуль анімація цифрового лічильника
export function digitsCounter() {
	//Initialization function //Функція ініціалізації
	function digitsCountersInit(digitsCountersItems) {
		let digitsCounters = digitsCountersItems ? digitsCountersItems : document.querySelectorAll("[data-digits-counter]");
		if (digitsCounters.length) {
			digitsCounters.forEach(digitsCounter => {
				//Reset 
				if (digitsCounter.hasAttribute('data-go')) return;
				digitsCounter.setAttribute('data-go', '');
				digitsCounter.dataset.digitsCounter = digitsCounter.innerHTML;
				digitsCounter.innerHTML = `0`;
				//Animation
				digitsCountersAnimate(digitsCounter);
			});
		}
	}
	//Animation function //Функція анімації
	function digitsCountersAnimate(digitsCounter) {
		let startTimestamp = null;
		const duration = parseFloat(digitsCounter.dataset.digitsCounterSpeed) ? parseFloat(digitsCounter.dataset.digitsCounterSpeed) : 1000;
		const startValue = parseFloat(digitsCounter.dataset.digitsCounter);
		const format = digitsCounter.dataset.digitsCounterFormat ? digitsCounter.dataset.digitsCounterFormat : ' ';
		const startPosition = 0;
		const step = (timestamp) => {
			if (!startTimestamp) startTimestamp = timestamp;
			const progress = Math.min((timestamp - startTimestamp) / duration, 1);
			const value = Math.floor(progress * (startPosition + startValue));
			digitsCounter.innerHTML = typeof digitsCounter.dataset.digitsCounterFormat !== 'undefined' ? getDigFormat(value, format) : value;
			if (progress < 1) {
				window.requestAnimationFrame(step);
			} else {
				digitsCounter.removeAttribute('data-go');
			}
		};
		window.requestAnimationFrame(step);
	}
	function digitsCounterAction(e) {
		const entry = e.detail.entry;
		const targetElement = entry.target;
		if (targetElement.querySelectorAll("[data-digits-counter]").length) {
			digitsCountersInit(targetElement.querySelectorAll("[data-digits-counter]"));
		}
	}

	document.addEventListener("watcherCallback", digitsCounterAction);
}
//When the module is connected, the event handler will start automatically //При підключенні модуля обробник події запуститься автоматично
setTimeout(() => {
	if (addWindowScrollEvent) {
		let windowScroll = new Event("windowScroll");
		window.addEventListener("scroll", function (e) {
			document.dispatchEvent(windowScroll);
		});
	}
}, 0);