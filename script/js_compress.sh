#! /bin/zsh

JS_PATH=./static/js/
JS_PATH_SRC=${JS_PATH}src/
JS_PATH_DIST=${JS_PATH}dist.js

find ${JS_PATH_SRC} -type f -name '*.js' | sort | xargs cat > ${JS_PATH_DIST}