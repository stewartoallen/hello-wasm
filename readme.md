* install emscripten sdk

`https://emscripten.org/docs/getting_started/downloads.html`

* install http-server (npm package)

`npm install -g http-server`

* compile hello.c to hello.wasm

`emcc hello.c -o hello.wasm -O3`

* optionally look at .wat

`wasm2wat hello.wasm`

* start http-server to play

`http-server`

* open browser to http://localhost:8081/hello.html
