/* importing functions */
import { addLoadedClass, addTouchClass, menuInit } from "./moduls/functions.js";
import { headerScroll, digitsCounter, pageNavigation } from "./files/scroll/scroll.js";

/* importing libs */
//import './libs/wNumb.js';
import './libs/watcher.js';
import './libs/dynamic_adapt.js';


/* ==== Додавання класу touch для HTML, якщо браузер мобільний ==== */
//addTouchClass()

/* ==== Додавання класу loaded для HTML після повного завантаження сторінки ==== */
addLoadedClass()

/* ==== Додавання меню (бургер) на сторінку ==== */
menuInit()

/* ==== Додавання класів до хедеру під час прокручування ==== */
headerScroll()

/* ==== Анімації цифрового лічильника ==== */
//digitsCounter()

/* ==== Плавна навігація по сторінці ==== */
//pageNavigation()