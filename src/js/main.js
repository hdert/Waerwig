// export {};

import Modal from "bootstrap/js/dist/modal";

const encodeString = (string) => {
  const buffer = new TextEncoder().encode(string);
  const pointer = alloc(buffer.length + 1); // ask Zig to allocate memory
  if (pointer == 0) {
    throw allocationFailed;
  }
  const slice = new Uint8Array(
    memory.buffer, // memory exported from Zig
    pointer,
    buffer.length + 1
  );
  slice.set(buffer);
  slice[buffer.length] = 0; // null byte to null-terminate the string
  return pointer;
};

const decodeString = (pointer, length) => {
  const slice = new Uint8Array(
    memory.buffer, //
    pointer,
    length
  );
  return new TextDecoder().decode(slice);
};

var error = false;

const {
  instance: {
    exports: { memory, evaluate, alloc },
  },
} = await WebAssembly.instantiateStreaming(fetch("./Calculator.wasm"), {
  env: {
    print: (pointer, length) => {
      const string = decodeString(pointer, length);
      console.log(`${string}`);
    },
    inputError: (pointer, length) => {
      const string = decodeString(pointer, length);
      document.getElementById("modalBody").innerHTML =
        "<div class='alert alert-danger bg-alert mb-0' data-bs-theme='dark' role='alert'>" +
        string +
        "</div>";
      new Modal(document.getElementById("modal")).show();
      error = true;
    },
  },
});

console.log(evaluate(encodeString("10+10")));

var input = window.document.getElementById("input");
var button = window.document.getElementById("submit");
var form = window.document.getElementById("form");

form.addEventListener("submit", processSubmission);

function processSubmission(e) {
  e.preventDefault();
  const value = evaluate(encodeString(input.value));
  if (!error) {
    input.value = value;
  }
  error = false;
}
