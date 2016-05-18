// Generated on 2016-03-29 using generator-impress 0.1.2
'use strict';

var LIVERELOAD_PORT = 35729;
var lrSnippet = require('connect-livereload')({ port: LIVERELOAD_PORT });
var mountFolder = function (connect, dir) {
    return connect.static(require('path').resolve(dir));
};

module.exports = function (grunt) {
    // load all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.initConfig({
        watch: {
            options: {
                nospawn: true,
                livereload: LIVERELOAD_PORT
            },
            livereload: {
                files: [
                    '_index.html',
                    'js/*.js',
                    'css/*.css',
                    'steps/**/*.html',
                    'steps/list.json'
                ],
                tasks: ['build'],
                options: {
                    debounceDelay: 250,
                }
            }
        },
        connect: {
            options: {
                port: 9000,
                // change this to '0.0.0.0' to access the server from outside
                hostname: 'localhost'
            },
            livereload: {
                options: {
                    middleware: function (connect) {
                        return [
                            lrSnippet,
                            mountFolder(connect, '.')
                        ];
                    }
                }
            }
        },
        open: {
            server: {
                path: 'http://localhost:<%= connect.options.port %>'
            }
        },
        copy: {
            html: {
                src: './index.html', dest: 'dist/index.html'
            },
            img: {
                src: './img/**/*.*', dest: 'dist/'
            }
        },
        useminPrepare: {
            html: './index.html',
            options: {
                dest: 'dist'
            }
        },

        usemin: {
            html: ['dist/{,*/}*.html'],
            css: ['dist/css/{,*/}*.css']
        },

    });

    grunt.registerTask('buildIndex', 'Build index.html task', function () {
        var Handlebars = require('handlebars');
        var templ = Handlebars.compile('<div id="{{id}}" class="{{class}}" {{#step data}}{{uri}}{{/step}}>{{{file}}}</div>');
        
        var indexTemplate = grunt.file.read('_index.html');
        
        Handlebars.registerHelper('step', function (data) {
            var ret = '';
            for (var key in data) {
                ret = ret + ' data-' + key + '="' + data[key] + '"';
            }
            return ret;
        });
        var root = "steps/";
        var full = "";
        var lists = grunt.file.readJSON(root + 'list.json');
        for (var i = 0; i < lists.length; i++) {
            var step = lists[i];
            var data = grunt.file.read(root + step.uri);
            full += templ({ file: data, data: step.data, class: step.class, id: step.id });
        }
        var html = grunt.template.process(indexTemplate, {data: {slides:full}});
        grunt.file.write('index.html', html);
    });


    grunt.registerTask('server', ['buildIndex','connect:livereload', 'open', 'watch']);

    grunt.registerTask('build', ['buildIndex','copy:html','copy:img', 'useminPrepare', 'concat','uglify','cssmin', 'usemin']);
};
