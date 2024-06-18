/*
watch
    可以監聽多個檔案，當檔案有異動時，會延遲一段時間才驅動 Task。
    原則是，在延遲時間內，連續異動檔案，一個 watch 只會驅動一次 Task，但 watcher 的 change 事件會被觸發多次。
    
程式邏輯
    當觸發 watcher 的 change 事件時，記錄 path 到 Set 之中。
    被驅動的 Task 內，與 Set 中的 path 有關的 bundle 撈出來執行打包作業。
*/
const process = require("process");
const path = require("path");
const gulp = require("gulp");
const concat = require("gulp-concat");
const iife = require("gulp-iife");
const uglify = require("gulp-uglify");
const cleanCSS = require("gulp-clean-css");
const del = require("del");

// TODO: Change working directory to the project root
process.chdir("../src/jQueryChefExtend/jQueryChefExtend");

const bundleconfigPath = path.join(process.cwd(), "bundleconfig.json");

let bundleconfig = require(bundleconfigPath);

let changedFiles = new Set();

function bundleJS() {
    const jsBundles = bundleconfig.filter(b => /\.js$/.test(b.outputFileName) && (changedFiles.has("ALL") || b.inputFiles.some(f => changedFiles.has(f))));

    if (jsBundles.length === 0) return Promise.resolve();

    const tasks = jsBundles.map(bundle => {
        return Promise.resolve(
            gulp.src(bundle.inputFiles)
                .pipe(concat(bundle.outputFileName))
                .pipe(iife({
                    useStrict: false,
                    preprependSemicolon: false
                }))
                .pipe(uglify())
                .pipe(gulp.dest("."))
        );
    });

    return Promise.all(tasks).then(() => {
        changedFiles.clear();
    });
}

function bundleCSS() {
    const cssBundles = bundleconfig.filter(b => /\.css$/.test(b.outputFileName) && (changedFiles.has("ALL") || b.inputFiles.some(f => changedFiles.has(f))));

    if (cssBundles.length === 0) return Promise.resolve();

    const tasks = cssBundles.map(bundle => {
        return Promise.resolve(
            gulp.src(bundle.inputFiles)
                .pipe(concat(bundle.outputFileName))
                .pipe(cleanCSS())
                .pipe(gulp.dest("."))
        );
    });

    return Promise.all(tasks).then(() => {
        changedFiles.clear();
    });
}

function bundleAll(callback) {
    changedFiles.add("ALL");

    callback();
}

function watch(callback) {
    function watchInputFiles() {
        let _watcher = gulp.watch(bundleconfig.map(b => b.inputFiles).flat(), { events: ["change"] }, gulp.parallel(bundleJS, bundleCSS));
        
        _watcher.on("change", function (path, stat) {
            changedFiles.add(path.replace(/\\/g, "/"));
        });

        return _watcher;
    }

    let watcher = watchInputFiles();

    gulp.watch(bundleconfigPath, function (cb) {
        delete require.cache[require.resolve(bundleconfigPath)]

        bundleconfig = require(bundleconfigPath);

        watcher.close();
        watcher = watchInputFiles();

        changedFiles.clear();

        exports.default();

        cb();
    });

    callback();
}

function clean() {
    return del(["wwwroot/js/**/*.min.js", "wwwroot/css/**/*.min.css"]);
}

exports.default = gulp.series(clean, bundleAll, gulp.parallel(bundleJS, bundleCSS));
exports.watch = watch;
exports.clean = clean;
