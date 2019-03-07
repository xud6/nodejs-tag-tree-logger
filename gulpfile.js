const gulp = require("gulp");
const merge = require('merge2');
const ts = require("gulp-typescript");
const tsProject = ts.createProject("tsconfig.json", { declaration: true });
const del = require('del');
const mocha = require('gulp-mocha');

gulp.task("test", function () {
    return gulp.src("test/**/*.ts")
        .pipe(mocha({ require: ['ts-node/register'] }))
})

gulp.task("cleanDist", function () {
    return del('dist/**/*')
})

function tsbuildFunc() {
    let tsResult = gulp.src("src/**/*.ts")
        .pipe(tsProject())
    return merge([
        tsResult.js
            .pipe(gulp.dest('dist')),
        tsResult.dts
            .pipe(gulp.dest('dist/definitions'))
    ])
}

gulp.task("tsbuild", gulp.series("cleanDist", tsbuildFunc));

gulp.task("build", gulp.series("tsbuild"));

gulp.task("prePublish", gulp.series("test", "build"));
