const gulp=require("gulp");                      //Normal gulp task
const connect = require('gulp-connect');         //For gulp server
const proxy = require('http-proxy-middleware');  //For Gulp Proxy setting
//var less = require("gulp-less");               //For gulp compresser 
const path = require("path");                    //Need to check 
//npm install gulp -uglify //For JS optimization
const uglify = require("gulp-uglify");
//npm install gulp-minify-css //For CSS optimization
const minifyCss = require('gulp-minify-css');
const concat = require('gulp-concat');
//optimize XML and JSON
 const prettyData = require('gulp-pretty-data');

 const international = require('gulp-international');

//Testing For Gulp
//For Proxy Setting
gulp.task('connect', function() {
  //For optimize folder
  connect.server({
    root: 'dist/webapp/',
    livereload: true,
    port:9000,
    middleware: function(connect, opt) {
      return [
          proxy('/proxy', {
              target: 'https://espmab4b0b917.hana.ondemand.com',
              secure:true,
              pathRewrite:{'/proxy':''},
              changeOrigin :true           
            })
            ,
          proxy('/proxy2',{
            target: 'https://sapui5.hana.ondemand.com/',
            secure:false,
            pathRewrite:{'/proxy2':'https://sapui5.hana.ondemand.com/'},
            changeOrigin :true           
          })
      ]
  }
  });


  //For Source 
  connect.server({
    root: 'src/webapp/',
    livereload: true,
    port:9090,
    middleware: function(connect, opt) {
      return [
          proxy('/proxy', {
              target: 'https://espmab4b0b917.hana.ondemand.com',
              secure:true,
              pathRewrite:{'/proxy':''},
              changeOrigin :true           
            })
            ,
          proxy('/proxy2',{
            target: 'https://sapui5.hana.ondemand.com/',
            secure:false,
            pathRewrite:{'/proxy2':'https://sapui5.hana.ondemand.com/'},
            changeOrigin :true           
          })
      ]
  }
  });


});
 
//To run application or HTML File
gulp.task('html', function () {
  //For destination
  gulp.dest('*.html')
    .pipe(connect.reload());
  
//For Source 
    gulp.src('*.html')
    .pipe(connect.reload()); 

  });
 

//Copy HTML files to des
gulp.task("copyHtml",function(){
  gulp.src("src/webapp/*.html")
    .pipe(gulp.dest("dist/webapp"));
});

//for optimize js file 
gulp.task("minify",function(){
  //All controller files
  gulp.src("src/webapp/controller/*js")
    .pipe(uglify())
    .pipe(gulp.dest("dist/webapp/controller"));
  //All model files
  gulp.src("src/webapp/model/*js")
    .pipe(uglify())
    .pipe(gulp.dest("dist/webapp/model"));

  //Component.js
  gulp.src("src/webapp/*.js")
    .pipe(uglify())
      .pipe(gulp.dest("dist/webapp"));

  //For SAPUI5 Library
  gulp.src("src/webapp/resources/*******.******")
//  .pipe(uglify())
    .pipe(gulp.dest("dist/webapp/resources"));
    

})
//End of JS optimization

//For optimize CSS file ideally  
/*gulp.task("sass",function(){
  gulp.src("src/webapp/css/*css")
    .pipe(sass().on("error",sass.logError))
      .pipe(gulp.dest("dist/webapp/css"));
});
*/
gulp.task('css', function(){
  gulp.src('src/webapp/css/*.css')
   .pipe(concat('style.css'))
  .pipe(minifyCss())
  .pipe(gulp.dest('dist/webapp/css'));
});

//End of CSS optimization

//Optimization of XML and JSON file
gulp.task('xmlminify', function() {
  gulp.src('src/webapp/view/*.xml')
    .pipe(prettyData({
      type: 'minify',
      preserveComments: true,
    }))
    .pipe(gulp.dest('dist/webapp/view'));

    //for manifest file
    gulp.src('src/webapp/*.json')
    .pipe(prettyData({
      type: 'minify',
      preserveComments: true,
    }))
    .pipe(gulp.dest('dist/webapp'));

});

gulp.task('xmlprettify', function() {

  gulp.src('src/webapp/view/*.xml')
    .pipe(prettyData({type: 'prettify'}))
    .pipe(gulp.dest('dist/webapp/view'));

  //For Manifest
  gulp.src('src/webapp/*.json')
    .pipe(prettyData({type: 'prettify'}))
    .pipe(gulp.dest('dist/webapp'));
    

  });

  gulp.task("i18nCopy",function(){
    gulp.src("src/webapp/i18n/*")
   //    .pipe(international())
      .pipe(gulp.dest("dist/webapp/i18n"));
  })

gulp.task("xmlCopy",["xmlminify","xmlprettify"]);
//End of JSON and XML Formate



//command to bulp dist folder
gulp.task("build",["copyHtml","minify","css","xmlCopy"]);

gulp.task('watch', function () {
  //For destination
   gulp.watch(['./dist/webapp*.html'], ['html']);
  //For Source
   gulp.watch(['./src/webapp*.html'], ['html']);
 
 });


 ///Checking for git 
const git=require("gulp-git");
gulp.task("add",function(){
    return gulp.src('https://github.com/munnaec/GitTest.git')
      .pipe(
        git.add()
      )
});

gulp.task('commit',function(){
  return gulp.src('https://github.com/munnaec/GitTest.git')
  .pipe(
    git.commit('send commit')
  )
})


/* var deploy = require('gulp-gh-pages');

 gulp.task('deploy', function () {
   console.log("Git Deployments");
   return gulp.src("./src/**/ /*****")
     .pipe(deploy({ 
       remoteUrl: "https://github.com/munnaec/GitTest.git",
       branch: "master",

     }))
 });
*/
 //concatinate All JS file
 //can not be used on SAPUI5 Application
 /*
  gulp.task("scripts",function(){
    gulp.src("src/webapp/controller/*.js")
      .pipe(concat("Main.controller.js"))
        .pipe(uglify())
          .pipe(gulp.dest("dist/webapp/controller"));
  });
*/
 
//To run application
gulp.task('default', ['connect', 'watch']);

