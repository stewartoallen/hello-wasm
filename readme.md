# install emscripten sdk

`https://emscripten.org/docs/getting_started/downloads.html`

## install http-server (npm package)

`npm install -g http-server`

## compile hello.c to hello.wasm

* default emcc compiles leave in a ton of expected imports
  and require dependency wrappers (aka diapers)
* `-O3` strips anything not explicitly marked with `EMSCRIPTEN_KEEPALIVE`
* and also does not mangle your exported function name

`emcc hello.c -o hello.wasm -O3`

## optionally look at .wat

* `.wat` files are human readable assembly-ish version of `.wasm`

`wasm2wat hello.wasm`

## start http-server to access _hello.html_

* because most browers will not allow `fetch` to `file://` urls
* and `fetch` or `XMLHttpRequest` is required to load `.wasm` files

`http-server`

## open _hello.html_ in browser

`http://localhost:8081/hello.html`
