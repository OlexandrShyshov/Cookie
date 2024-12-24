/* importing functions */
import { addLoadedClass, addTouchClass, menuInit } from "./moduls/functions.js";
import { headerScroll, digitsCounter, pageNavigation } from "./files/scroll/scroll.js";

/* importing libs */
//import './libs/wNumb.js';
import './libs/watcher.js';
import './libs/dynamic_adapt.js';


/* ==== Adding the touch class to HTML if the browser is mobile ==== */
//addTouchClass()

/* ==== Adding the loaded class to HTML after the page is fully loaded ==== */
addLoadedClass()

/* ==== Adding a menu (burger) to a page ==== */
menuInit()

/* ==== Adding classes to the header while scrolling ==== */
headerScroll()

/* ==== Digital counter animations ==== */
//digitsCounter()

/* ==== Smooth page navigation ==== */
//pageNavigation()