module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-menu');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-downloadfile');
    grunt.loadNpmTasks('grunt-zip');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-replace-attribute');
    grunt.loadNpmTasks('grunt-comment-toggler');
    grunt.loadNpmTasks('grunt-bump');

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        bump: {
            options: {
                files: ['package.json'],
                updateConfigs: [],
                commit: false,
                createTag: false,
                push: false,
                globalReplace: false,
                prereleaseName: false,
                metadata: '',
                regExp: false
            }
        },
        nameProjectFiles: (function() {
            return "movilnet"
        }()),
        nameProject: (function() {
            return "MOVILNET"
        }()),
        dateCompiled: (function() {
            var date = new Date(),
                day = date.getDate(),
                month = date.getMonth() + 1,
                year = date.getFullYear(),
                hour = date.getHours(),
                mins = date.getMinutes(),
                secs = date.getSeconds();

            if (month < 10) {
                month = '0' + month;
            }
            if (day < 10) {
                day = '0' + day;
            }
            if (hour < 10) {
                hour = '0' + hour;
            }
            if (mins < 10) {
                mins = '0' + mins;
            }
            if (secs < 10) {
                secs = '0' + secs;
            }
            return `${year}${month}${day}${hour}${mins}${secs}`;
        }()),
        nameFile: (function() {
            return "compress_v<%= pkg.version %>.js"
        }()),
        nameFileCss: (function() {
            return "compress_v<%= pkg.version %>.css"
        }()),
        uglify: {
            bundle_and_minify: {
                options: {
                    // mangle: true,
                    compress:true,
                    // beautify:true,
                },
                files: {
                    "dist/<%= nameFile %>": [
                        "movilnet-utils/messages.es.js",
                        "movilnet-utils/i18n.js",
                        "movilnet-utils/utils.js",
                        "movilnet-utils/loading.js",
                        "movilnet-utils/custom-table.js",
                        "movilnet-utils/msg.js",
                        "movilnet-app.callservices.js",
                        "movilnet-sidebar.js",
                        "movilnet-controllers/active.js",
                        "movilnet-controllers/apps.js",
                        "movilnet-controllers/expired-password.js",
                        "movilnet-controllers/login.js",
                        "movilnet-controllers/recovery-password.js",
                        "movilnet-controllers/register.js",
                        "movilnet-controllers/request-recovery-password.js",
                        "movilnet-controllers/resend-activation.js",
                        "movilnet-controllers/register-with-email.js",
                        "movilnet-controllers/register-eap.js",
                        "movilnet-app.component.js",
                        "movilnet-app.routes.js",
                        "movilnet-app.module.js",
                        "movilnet-app.main.js",
                    ],
                }
            }
        },
        cssmin : {
            target : {
                src : [
                    "styles1.css",
                ],
                dest : "dist/<%= nameFileCss %>"
            },
        },
        copy: {
            moveFiles: {
                files : [
                    {
                        expand: true,
                        src: ['index_v1.js','assets/**','views/**'],
                        dest: 'dist/',
                    },
                ]
            }
        },
        replace_attribute: {
            remplaza_js: {
              options: {
                upsert: true,
                replace: {
                  '#principal_js': { src: '<%= nameFile %>' },
                  '#principal_css': { href: '<%= nameFileCss %>' }
                }
              },
              files: {
                  'dist/index.html': 'index.html'
              }
            }
        },
        compress: {
            main: {
                options: {
                    archive: 'zip/<%= nameProject %>_<%= dateCompiled %>.zip',
                    mode: 'zip'
                },
                files: [   
                    {src: ['dist/**']},
                ]
            }
        },
        downloadfile: {
            options: {
              dest: './',
              overwriteEverytime: false
            },
            files: {
              'base.zip': 'https://staticd.paguetodo.com/images/bandera.zip'
            }
        },
        unzip: {
            './downloaded/': './base.zip'
        },
        toggleComments: {
            customOptions: {
                options: {
                    padding: 4,
                    removeCommands: true
                },
                files: {"dist/index.html": "dist/index.html"}
            }
        }
    })
    grunt.registerTask("subir", ["bump"]);
    grunt.registerTask("production", ["bump", "uglify:bundle_and_minify", "cssmin:target", "copy:moveFiles", "replace_attribute:remplaza_js", "toggleComments","compress:main"]);
}    