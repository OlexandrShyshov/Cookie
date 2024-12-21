import gulp from 'gulp';

// Tasks
import { cleanDistDev, htmlDev, stylesDev, imagesDev, svgStackDev, svgSymbolDev, fontsDev, filesDev, jsDev, serverTaskDev, watchFilesDev } from './gulp/dev.js';
import { cleanDistDocs, htmlDocs, stylesDocs, imagesDocs, svgStackDocs, svgSymbolDocs, fontsDocs, filesDocs, jsDocs, serverTaskDocs } from './gulp/docs.js';

// Tasks for running a build in development mode
export const dev = gulp.series(
    cleanDistDev,
    gulp.parallel(htmlDev, stylesDev, imagesDev, svgStackDev, svgSymbolDev, fontsDev, filesDev, jsDev),
    gulp.parallel(serverTaskDev, watchFilesDev)
);

// Tasks for running a build in production mode (docs)
export const docs = gulp.series(
    cleanDistDocs,
    gulp.parallel(htmlDocs, stylesDocs, imagesDocs, svgStackDocs, svgSymbolDocs, fontsDocs, filesDocs, jsDocs),
    gulp.parallel(serverTaskDocs)
);

// Exporting tasks
export default dev;
