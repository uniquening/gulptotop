var gulp = require("gulp");
// html代码压缩插件如下
var htmlclean = require("gulp-htmlclean");
// 图片压缩代码
var imgMin = require("gulp-imagemin");
// js压缩
var uglify = require("gulp-uglify");
//去掉js中的调试语句
var strip = require("gulp-strip-debug");
//拼接多个js文件成1个js文件
var concat = require("gulp-concat");
//将less文件转换成css文件
var less = require("gulp-less");
//将
var postcss = require("gulp-postcss");
//给css3属性加前缀
var autoprefixer = require("autoprefixer");
//压缩css代码
var cssnano = require("cssnano");

var connect = require("gulp-connect");
// gulp.src(); //读文件
// gulp.dest(); //写文件
// gulp.task(); //任务 
// gulp.watch();//监听
var devMode = process.env.NODE_ENV == "development";
// 在git环境设置开发模式 ,输入下面命令，注意=两边不允许有空格
// export NODE_ENV=development
console.log(devMode);



var folder = {
	src: "src/", //开发目录文件夹
	dist: "dist/" //压缩打包后目录
}
gulp.task("html", function() {
	var page = gulp.src(folder.src + "html/*")
		.pipe(connect.reload());
	if (!devMode) {
		page.pipe(htmlclean());
	}
	page.pipe(gulp.dest(folder.dist + "html/"));
})
gulp.task("images", function() {
	gulp.src(folder.src + "images/*")
		.pipe(imgMin())
		.pipe(gulp.dest(folder.dist + "images/"))
})

gulp.task("js", function() {
	var page = gulp.src(folder.src + "js/*")
		.pipe(connect.reload());
	if (!devMode) {
		page.pipe(strip())
		page.pipe(uglify())
	}
	page.pipe(concat("main.js"))

	page.pipe(gulp.dest(folder.dist + "js/"))
})

gulp.task("php", function() {
	gulp.src(folder.src + "php/*")
		.pipe(gulp.dest(folder.dist + "php/"))
})

gulp.task("css", function() {
	var options = [autoprefixer(), cssnano()];
	var page = gulp.src(folder.src + "css/*")
		.pipe(connect.reload())
		.pipe(less());
	if (!devMode) {
		page.pipe(postcss([cssnano()]));
	}
	page.pipe(postcss([autoprefixer()]));
	page.pipe(gulp.dest(folder.dist + "css/"));
})
// gulp.task("index", function() {
// 	gulp.src(folder.src + "index.html")
// 		.pipe(gulp.dest(folder.dist + "index.html"))
// })

gulp.task("server", function() {
	connect.server({
		port: "8010",
		livereload: true
	});
})
gulp.task('watch', function() {
	gulp.watch(folder.src + "html/*", ["html"]);
	gulp.watch(folder.src + "css/*", ["css"]);
	gulp.watch(folder.src + "js/*", ["js"]);
	gulp.watch(folder.src + "images/*", ["images"]);
	gulp.watch(folder.src + "php/*", ["php"]);
	// gulp.watch(folder.src + "index.html", ["index"]);
})



gulp.task("default", ["html", "images", "js", "php", "css", "server", "watch"]);