var $8973aab45c5aa6ba$exports = {};
// export {};
const $8973aab45c5aa6ba$var$encodeString = (string)=>{
    const buffer = new TextEncoder().encode(string);
    const pointer = $8973aab45c5aa6ba$var$alloc(buffer.length + 1); // ask Zig to allocate memory
    if (pointer == 0) throw allocationFailed;
    const slice = new Uint8Array($8973aab45c5aa6ba$var$memory.buffer, pointer, buffer.length + 1);
    slice.set(buffer);
    slice[buffer.length] = 0; // null byte to null-terminate the string
    return pointer;
};
const $8973aab45c5aa6ba$var$decodeString = (pointer, length)=>{
    const slice = new Uint8Array($8973aab45c5aa6ba$var$memory.buffer, pointer, length);
    return new TextDecoder().decode(slice);
};
const { instance: { exports: { memory: $8973aab45c5aa6ba$var$memory, evaluate: $8973aab45c5aa6ba$var$evaluate, alloc: $8973aab45c5aa6ba$var$alloc } } } = await WebAssembly.instantiateStreaming(fetch("./Calculator.wasm"), {
    env: {
        print: (pointer, length)=>{
            const string = $8973aab45c5aa6ba$var$decodeString(pointer, length);
            console.log(`${string}`);
        }
    }
});
console.log($8973aab45c5aa6ba$var$evaluate($8973aab45c5aa6ba$var$encodeString("10+10")));
var $8973aab45c5aa6ba$var$input = window.document.getElementById("input");
var $8973aab45c5aa6ba$var$button = window.document.getElementById("submit");
var $8973aab45c5aa6ba$var$form = window.document.getElementById("form");
$8973aab45c5aa6ba$var$form.addEventListener("submit", $8973aab45c5aa6ba$var$processSubmission);
function $8973aab45c5aa6ba$var$processSubmission(e) {
    e.preventDefault();
    $8973aab45c5aa6ba$var$input.value = $8973aab45c5aa6ba$var$evaluate($8973aab45c5aa6ba$var$encodeString($8973aab45c5aa6ba$var$input.value));
}


//# sourceMappingURL=index.806679d4.js.map
