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

    // const memory = new WebAssembly.Memory({
    //     initial: 256,
    //     maximum: 256
    // });
    // const heap = new Uint8Array(memory.buffer);
    // const glob = new WebAssembly.Global({value:'i32', mutable:true}, 0);
    let importObject = {
        // env: { memory: memory },
        // js: { global: glob }
    };

    fetch('hello.wasm')
        .then(response => response.arrayBuffer())
        // if we want to cache and instantiate a lot of modules
        // .then(bytes => {
        //     // but only want to compile it once
        //     WebAssembly.compile(bytes).then(mod => {
        //         console.log('imports', WebAssembly.Module.imports(mod));
        //         console.log('exports', WebAssembly.Module.exports(mod));
        //         WebAssembly.instantiate(mod, importObject).then(instance => {
        //             console.log({instance});
        //         });
        //     });
        //     return bytes;
        // })
        // compile and instantiate a module from raw wasm bytes
        .then(bytes => WebAssembly.instantiate(bytes, importObject))
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
