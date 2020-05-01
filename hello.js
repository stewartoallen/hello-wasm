let start = Date.now();
let context;

// check to see if we're in a worker or browser top then provide
// the log() function needed for init() to report test results
if (self.window) {

    context = 'page';

    // if we're in the browser top, spawn a worker to show the same
    // WebAssembly code works in a worker context, too
    new Worker("hello.js");

    function $(id) {
        return document.getElementById(id);
    }

    function log() {
        let msg = [...arguments].map(v => v.toString()).join(' ') + '\n';
        $('log').innerText += msg;
    }

} else {

    context = 'worker';

    // this is inside the worker context because window isn't present
    // open javascript console to see this output
    function log() {
        console.log(...arguments);
    }

    init();

}

// runs after the DOM loads in the browser top context or
// immediately inside the worker when it loads
function init() {
    log(`${context} loaded after ${Date.now() - start}ms`);

    const kb = 1024;
    const mb = kb * kb;
    const page_size = 65536;
    const memory = new WebAssembly.Memory({
        initial: (8 * mb) / page_size,
        maximum: (8 * mb) / page_size
    });
    const heap = new Uint8Array(memory.buffer);
    let importObject = {
        env: { memory: memory }
    };

    // seed first 100 bytes of heap which we will see part of
    // in the reverse() test below
    for (let i=0; i<100; i++) heap[i] = 100 - i;

    fetch('hello.wasm')
        // fetch raw .wasm bytes and convert to arraybuffer
        .then(response => response.arrayBuffer())
        // compile and instantiate a module from arraybuffer
        .then(bytes => WebAssembly.instantiate(bytes, importObject))
        // bind memory and function pointers from exports and test
        .then(results => {
            let {module, instance} = results;
            let {exports} = instance;
            // if `-Wl,--import-memory` is omitted from .wasm compile
            // then we can access the memory as an export from the module
            // let heap = new Uint8Array(exports.memory.buffer);

            let values = [2,4,6,8,1,3,5,7];

            // test array_get and array_put
            log('array_get / array_put test');
            values.forEach((value,index) => exports.array_put(index,value));
            for (let i=0; i<10; i++) log(i, exports.array_get(i));

            // test heap access with reverse()
            log('heap test');
            values.forEach((value,index) => heap[index] = value);
            exports.reverse(0,10);
            for (let i=0; i<10; i++) log(i, heap[i]);

        });
}
