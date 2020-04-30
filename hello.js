let start = Date.now();

function $(id) {
    return document.getElementById(id);
}

function log() {
    let msg = [...arguments].map(v => v.toString()).join(' ') + '\n';
    $('log').innerText += msg;
}

function init() {
    log(`page loaded after ${Date.now() - start}ms`);

    // TODO: haven't figured out now to create imports with standalone
    // `.wasm` libraries which is required in order to create memory in
    // javascript which is then shared with the loaded .wasm module.s

    // const memory = new WebAssembly.Memory({
    //     initial: 4096,
    //     maximum: 8192
    // });
    // const heap = new Uint8Array(memory.buffer);
    // const glob = new WebAssembly.Global({value:'i32', mutable:true}, 0);
    let importObject = {
        // env: { memory: memory },
        // js: { global: glob }
    };

    fetch('hello.wasm')
        // fetch raw .wasm bytes and convert to arraybuffer
        .then(response => response.arrayBuffer())
        // compile and instantiate a module from arraybuffer
        .then(bytes => WebAssembly.instantiate(bytes, importObject))
        // bind memory and function pointers from exports and test
        .then(results => {
            let {module, instance} = results;
            let {exports} = instance;
            let heap = new Uint8Array(exports.memory.buffer);

            console.log({module, instance, exports, heap});

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
