/**
 * compile with: emcc hello.c -o hello.wasm -O3 -Wl,--import-memory -s INITIAL_MEMORY=8MB
 * convert to readable .wat with: wasm2wat hello.wasm
 */

#include <emscripten.h>
#include <string.h>

/* required annotation to keep compiler from optimizing
 * this function away. also prevents compiler from mangling
 * function name on export making it easy to access from javascript */
EMSCRIPTEN_KEEPALIVE
int adder(int a, int b) {
	return a + b;
}

int array[1000];

EMSCRIPTEN_KEEPALIVE
int array_get(int p) {
    return array[p];
}

EMSCRIPTEN_KEEPALIVE
int array_put(int p, int v) {
    return array[p] = v;
}

/* first param is pointer to shared memory position.
 * memory is created by .wasm then accessible from
 * javascript as an ArrayBuffer */
EMSCRIPTEN_KEEPALIVE
int reverse(unsigned char* p, int len) {
    for (int i = 0; i < len / 2; ++i) {
        unsigned char temp = p[i];
        p[i] = p[len - i - 1];
        p[len - i - 1] = temp;
    }
    return len;
}

struct simple {
    int abc;
    float def;
    char *name;
};

EMSCRIPTEN_KEEPALIVE
int structest(unsigned char *p) {
    struct simple rec = { 0x01020304, 123.456, "string" };
    memcpy(p, &rec, sizeof(rec));
    memcpy(p + sizeof(rec), rec.name, strlen(rec.name));
    return sizeof(rec) + strlen(rec.name);
}
