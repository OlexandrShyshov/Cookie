import { isMobile, uniqArray, FLS } from "../moduls/functions.js";
import { flsModules } from "../files/modules.js";

class ScrollWatcher {
	constructor(props) {
		let defaultConfig = {
			logging: true,
		}
		this.config = Object.assign(defaultConfig, props);
		this.observer;
		!document.documentElement.classList.contains('watcher') ? this.scrollWatcherRun() : null;
	}
	//Updating the constructor //Оновлюємо конструктор
	scrollWatcherUpdate() {
		this.scrollWatcherRun();
	}
	//Launching the constructor //Запускаємо конструктор
	scrollWatcherRun() {
		document.documentElement.classList.add('watcher');
		this.scrollWatcherConstructor(document.querySelectorAll('[data-watch]'));
	}
	//Observer constructor //Конструктор спостерігачів
	scrollWatcherConstructor(items) {
		if (items.length) {
			this.scrollWatcherLogging(`Прокинувся, стежу за об'єктами (${items.length})...`);
			//Making parameters unique //Унікалізуємо параметри
			let uniqParams = uniqArray(Array.from(items).map(function (item) {
				//Automatic Threshold Calculation //Обчислення автоматичного Threshold
				if (item.dataset.watch === 'navigator' && !item.dataset.watchThreshold) {
					let valueOfThreshold;
					if (item.clientHeight > 2) {
						valueOfThreshold =
							window.innerHeight / 2 / (item.clientHeight - 1);
						if (valueOfThreshold > 1) {
							valueOfThreshold = 1;
						}
					} else {
						valueOfThreshold = 1;
					}
					item.setAttribute(
						'data-watch-threshold',
						valueOfThreshold.toFixed(2)
					);
				}
				return `${item.dataset.watchRoot ? item.dataset.watchRoot : null}|${item.dataset.watchMargin ? item.dataset.watchMargin : '0px'}|${item.dataset.watchThreshold ? item.dataset.watchThreshold : 0}`;
			}));
			// Отримуємо групи об'єктів з однаковими параметрами, створюємо налаштування, ініціалізуємо спостерігач 
			// //We get groups of objects with the same parameters, create settings, initialize the observer
			uniqParams.forEach(uniqParam => {
				let uniqParamArray = uniqParam.split('|');
				let paramsWatch = {
					root: uniqParamArray[0],
					margin: uniqParamArray[1],
					threshold: uniqParamArray[2]
				}
				let groupItems = Array.from(items).filter(function (item) {
					let watchRoot = item.dataset.watchRoot ? item.dataset.watchRoot : null;
					let watchMargin = item.dataset.watchMargin ? item.dataset.watchMargin : '0px';
					let watchThreshold = item.dataset.watchThreshold ? item.dataset.watchThreshold : 0;
					if (
						String(watchRoot) === paramsWatch.root &&
						String(watchMargin) === paramsWatch.margin &&
						String(watchThreshold) === paramsWatch.threshold
					) {
						return item;
					}
				});

				let configWatcher = this.getScrollWatcherConfig(paramsWatch);

				//Initializing the observer with its settings //Ініціалізація спостерігача зі своїми налаштуваннями
				this.scrollWatcherInit(groupItems, configWatcher);
			});
		} else {
			this.scrollWatcherLogging("Сплю, немає об'єктів для стеження. ZzzZZzz");
		}
	}
	//Customization function //Функція створення налаштувань
	getScrollWatcherConfig(paramsWatch) {
		//Create settings //Створюємо налаштування
		let configWatcher = {}
		//Parent element under observation //Батько, у якому ведеться спостереження
		if (document.querySelector(paramsWatch.root)) {
			configWatcher.root = document.querySelector(paramsWatch.root);
		} else if (paramsWatch.root !== 'null') {
			this.scrollWatcherLogging(`Эмм... батьківського об'єкта ${paramsWatch.root} немає на сторінці`);
		}
		//Triggering offset //Відступ спрацьовування
		configWatcher.rootMargin = paramsWatch.margin;
		if (paramsWatch.margin.indexOf('px') < 0 && paramsWatch.margin.indexOf('%') < 0) {
			this.scrollWatcherLogging(`йой, налаштування data-watch-margin потрібно задавати в PX або %`);
			return
		}
		//Trigger points //Точки спрацьовування
		if (paramsWatch.threshold === 'prx') {
			//Parallax mode //Режим паралаксу
			paramsWatch.threshold = [];
			for (let i = 0; i <= 1.0; i += 0.005) {
				paramsWatch.threshold.push(i);
			}
		} else {
			paramsWatch.threshold = paramsWatch.threshold.split(',');
		}
		configWatcher.threshold = paramsWatch.threshold;

		return configWatcher;
	}
	//Function to create a new observer with your own settings //Функція створення нового спостерігача зі своїми налаштуваннями
	scrollWatcherCreate(configWatcher) {
		console.log(configWatcher);
		this.observer = new IntersectionObserver((entries, observer) => {
			entries.forEach(entry => {
				this.scrollWatcherCallback(entry, observer);
			});
		}, configWatcher);
	}
	//Observer initialization function with its settings //Функція ініціалізації спостерігача зі своїми налаштуваннями
	scrollWatcherInit(items, configWatcher) {
		//Creating a new observer with your own settings //Створення нового спостерігача зі своїми налаштуваннями
		this.scrollWatcherCreate(configWatcher);
		//Transferring elements to the observer //Передача спостерігачеві елементів
		items.forEach(item => this.observer.observe(item));
	}
	//Basic action processing function of trigger points //Функція обробки базових дій точок спрацьовування
	scrollWatcherIntersecting(entry, targetElement) {
		if (entry.isIntersecting) {
			//We see the object //Бачимо об'єкт
			//Adding a class //Додаємо клас
			!targetElement.classList.contains('_watcher-view') ? targetElement.classList.add('_watcher-view') : null;
			this.scrollWatcherLogging(`Я бачу ${targetElement.classList}, додав клас _watcher-view`);
		} else {
			//We don't see the object //Не бачимо об'єкт
			//Removing the class //Забираємо клас
			targetElement.classList.contains('_watcher-view') ? targetElement.classList.remove('_watcher-view') : null;
			this.scrollWatcherLogging(`Я не бачу ${targetElement.classList}, прибрав клас _watcher-view`);
		}
	}
	//Object tracking disable function //Функція відключення стеження за об'єктом
	scrollWatcherOff(targetElement, observer) {
		observer.unobserve(targetElement);
		this.scrollWatcherLogging(`Я перестав стежити за ${targetElement.classList}`);
	}
	//Console output function //Функція виведення в консоль
	scrollWatcherLogging(message) {
		this.config.logging ? FLS(`[Спостерігач]: ${message}`) : null;
	}
	//Observation processing function //Функція обробки спостереження
	scrollWatcherCallback(entry, observer) {
		const targetElement = entry.target;
		//Basic trigger point action processing //Обробка базових дій точок спрацьовування
		this.scrollWatcherIntersecting(entry, targetElement);
		//If there is a data-watch-once attribute, remove the watch //Якщо є атрибут data-watch-once прибираємо стеження
		targetElement.hasAttribute('data-watch-once') && entry.isIntersecting ? this.scrollWatcherOff(targetElement, observer) : null;
		//Creating our feedback event //Створюємо свою подію зворотного зв'язку
		document.dispatchEvent(new CustomEvent("watcherCallback", {
			detail: {
				entry: entry
			}
		}));

		/*
		//We select the necessary objects //Вибираємо потрібні об'єкти
		if (targetElement.dataset.watch === 'some value') {
			//we write unique specifics //пишемо унікальну специфіку
		}
		if (entry.isIntersecting) {
			//We see the object //Бачимо об'єкт
		} else {
			//We don't see the object //Не бачимо об'єкт
		}
		*/
	}
}

//Launch and add modules to the object //Запускаємо та додаємо в об'єкт модулів
flsModules.watcher = new ScrollWatcher({});