let gulp = require("gulp");     //gulp仅提供简单的复制，监听，其他压缩，合并等许使用提供的插件
let concat = require("gulp-concat");    //引入gulp合并文件插件
let uglify = require("gulp-uglify")      //引入压缩文件插件
let rename = require("gulp-rename")       //引入重命名文件插件
let connect = require("gulp-connect")     //引入web服务插件
let minify = require("gulp-minify-css")    //引入css压缩插件
let babel = require("gulp-babel")
let sass = require("gulp-sass")

gulp.task("watchall",async ()=>{
	gulp.watch("*.html",async ()=>{
		gulp.src("*.html")
		.pipe(gulp.dest("D:\\phpStudy\\WWW\\pro_vhlondon"));
		
	})
	gulp.watch("js/*.js",async ()=>{
		gulp.src("js/*.js")
		.pipe(babel({
			presets:["es2015"]
		}))
		.pipe(gulp.dest("D:\\phpStudy\\WWW\\pro_vhlondon\\js"))
		.pipe(concat("vh.js"))
		.pipe(gulp.dest("D:\\phpStudy\\WWW\\pro_vhlondon\\js"))
		
		.pipe(uglify())
		.pipe(rename("vh_min.js"))
		.pipe(gulp.dest("D:\\phpStudy\\WWW\\pro_vhlondon\\js"));
	})
	gulp.watch("css/*.css",async ()=>{
		gulp.src("css/*.css")
		.pipe(gulp.dest("D:\\phpStudy\\WWW\\pro_vhlondon\\css"))
		.pipe(concat("vh.css"))
		.pipe(gulp.dest("D:\\phpStudy\\WWW\\pro_vhlondon\\css"))
		.pipe(minify())
		.pipe(rename("vh_min.css"))
		.pipe(gulp.dest("D:\\phpStudy\\WWW\\pro_vhlondon\\css"));
	})
	
	gulp.watch("img/*.*",async ()=>{
		gulp.src("img/*.*")
		.pipe(gulp.dest("D:\\phpStudy\\WWW\\pro_vhlondon\\img"));
	})
	gulp.watch("sass/**/*",async ()=>{
		gulp.src("sass/**/*")
		.pipe(sass())
		.pipe(gulp.dest("D:\\phpStudy\\WWW\\pro_vhlondon\\sass_css"));
		})
})