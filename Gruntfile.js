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
                    'index.html',
                    'js/*.js',
                    'css/*.css',
                    'steps/*.html',
                    'steps/list.json'
                ]
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
            steps: {
                src: './steps/**/*.*', dest: 'dist/'
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


    grunt.registerTask('server', ['connect:livereload', 'open', 'watch']);

    grunt.registerTask('build', ['copy:html', 'copy:steps', 'useminPrepare','concat',
		'uglify',
		'cssmin', 'usemin']);
};
