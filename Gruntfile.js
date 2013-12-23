/**
 * MEAN Seed Gruntfile - Defines server and build tasks for the web application.
 */

module.exports = function (grunt) {

    'use strict';

    // load all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    // configurable paths
    var appPaths = {
        client: 'client', // The web root for the client application
        server: 'server', // Root directory for the server application
        dist: 'dist', // A directory for the compiled distribution version of the app
        docs: 'doc' // A directory for compiled app documentation
    };

    // Initial Grunt Configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        autoprefixer: {
            dev: {
                files: {
                    '<%= paths.client %>/css/style.css': '<%= paths.client %>/css/style.css'
                }
            }
        },
        clean: {
            dist: ['.tmp', '<%= paths.dist %>/*'],
            dev: ['.tmp', '<%= paths.client %>/css/style.css']
        },
        compress: {
            deploy: {
                options: {
                    archive: '<%= paths.dist %>/compressed/archive.tgz',
                    mode: 'tgz',
                },
                files: [
                    { src: ['<%= paths.dist %>/**', '!<%= paths.dist %>/compressed/**'], dest: '<%= paths.dist %>' }
                ]
            }
        },
        concat: {
            options: {
                // define a string to put between each file in the concatenated output
                separator: ';'
            }
        },
        concurrent: {
            target: {
                tasks: ['nodemon:dev', 'watch'],
                options: {
                    logConcurrentOutput: true
                }
            }
        },
        copy: {

        },
        cssmin: {
            report: 'gzip'
        },
        nodemon: {
            dev: {
                options: {
                    file: '<%= paths.server %>/server.js',
                    env: {
                        NODE_ENV: 'development'
                    },
                    watchedFolders: ['<%= paths.server %>/app', '<%= paths.server %>/config']
                }
            }
        },
        sass: {
            dev: {
                loadPath: '<%= paths.client',
                files: { '<%= paths.client %>/css/style.css': '<%= paths.client %>/css/style.scss' }
            }
        },
        uglify: {
            options: {
                // the banner is inserted at the top of the output
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
            }
        },
        watch: {
            devFiles: {
                files: [
                    '<%= paths.client %>/**',
                    '!<%= paths.client %>/css/*.scss'
                ],
                options: {
                    nospawn: false,
                    livereload: true,
                    verbose: true
                }
            },
            devCss: {
                files: [
                    '<%= paths.client %>/css/*.scss',
                    '<%= paths.client %>/css/*/*.scss'
                ],
                tasks: ['sass', 'autoprefixer'],
                options: {
                    nospawn: false,
                    livereload: false,
                    verbose: true
                }
            }
        },
        paths: appPaths,
    });

    /*
     *  Task Definitions
     */

    // Server Task
    grunt.registerTask('server', function (target) {

        grunt.task.run([ // Dev server
            'clean:dev',
            'sass:dev',
            'autoprefixer',
            'concurrent'
        ]);

    });

    // Build Task (Note: task order is important!)
    grunt.registerTask('build', function () {

        grunt.log.write('Mean Seed Build ' + new Date() + '\n');

        grunt.task.run([
            'clean:dist', // Empty the dist directory
            'concat', // Run the concatenate task
            'cssmin', // Run the css minify task
            'uglify', // Run the js minify task
            'copy:dist', // Copy all relevant files to the build directory
        ]);

    });

    // Default task is server
    grunt.registerTask('default', ['server']);
};
