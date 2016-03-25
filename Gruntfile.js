module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-html2js');

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    dist: 'dist',
    meta: {
      modules: 'angular.module("angularBootstrapNumberpicker", ["<%= templateModule %>", "angularBootstrapNumberpickerSource"]);',
    },
    clean: {
      dist: {
        src: [], //src filled in by build task
      },
    },
    // Combine the template html.js file with the source .js file
    concat: {
      dist: {
        options: {
          banner: '<%= meta.modules %>\n\n'
        },
        src: [], //src filled in by build task
        dest: '<%= dist %>/<%= pkg.name %>-<%= pkg.version %>.js'
      },
    },
    // Convert the template html files to javascript so they can all be bundled together
    html2js: {
      dist: {
        options: {
          module: null, // no bundle module for all the html2js templates
          base: '.'
        },
        files: [{
          expand: true,
          src: ['src/*.html'],
          ext: '.html.js'
        }]
      }
    },
    jshint: {
      files: ['*.js', 'src/*.js' ,'!src/*.html.js'],
      options: {
        quotmark: 'single'
      }

    },
    // Minify
    uglify: {
      dist:{
        src:['<%= concat.dist.dest %>'],
        dest:'<%= dist %>/<%= pkg.name %>-<%= pkg.version %>.min.js'
      },
    },
  });

  grunt.registerTask('build', 'Create build files', function() {
    var srcFiles = grunt.file.expand('src/*.js');
    var tpljsFiles = grunt.file.expand('src/*.html.js');

    grunt.config('templateModule', grunt.file.expand('src/*.html'));

    //Set the concat-with-templates task to concat the given src & tpl modules
    grunt.config('concat.dist.src', grunt.config('concat.dist.src')
                 .concat(srcFiles).concat(tpljsFiles));
    grunt.task.run(['concat']);

    grunt.config('clean.dist.src', grunt.config('clean.dist.src')
                 .concat(tpljsFiles));
    grunt.task.run(['clean']);
  });

  grunt.registerTask('default', ['jshint', 'html2js', 'build', 'uglify']);
};
