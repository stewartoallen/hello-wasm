/**
 * compile with: emcc hello.c -o hello.wasm -O3
 * decompile to .wat with: wasm2wat hello.wasm
 */

#include <emscripten.h>

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

EMSCRIPTEN_KEEPALIVE
int reverse(unsigned char* p, int len) {
    for (int i = 0; i < len / 2; ++i) {
        unsigned char temp = p[i];
        p[i] = p[len - i - 1];
        p[len - i - 1] = temp;
    }
    return len;
}
