/// TODO:
/// - Save and reload equations
/// - Make it look more like a fullscreen calculator/speedcrunch
/// - Make upstream support exponential notation

var previousAnswer = 0;
var finalCalculation = false;
var input = document.getElementById("input");
var form = document.getElementById("form");
var upperRow = document.getElementById("upper-row");
var lowerRow = document.getElementById("lower-row");

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
      lowerRow.innerHTML =
        "<div class='alert alert-danger mb-0' data-bs-theme='dark' role='alert'>" +
        string +
        "</div>";
      error = true;
    },
    handleAnswer: (pointer, length, result) => {
      const string = decodeString(pointer, length);
      const text =
        "<div class='alert alert-dark mb-0 text-end' data-bs-theme='dark' role='alert'>" +
        "<p class='fw-light mb-0'>" +
        string +
        "</p>" +
        "<p class='mb-0'>" +
        result +
        "</p>" +
        "</div>";
      if (finalCalculation) {
        previousAnswer = result;
        const updateHeight =
          Math.abs(
            upperRow.scrollHeight - upperRow.clientHeight - upperRow.scrollTop
          ) < 2;

        upperRow.insertAdjacentHTML("beforeend", text);
        input.value = "";
        if (updateHeight) upperRow.scrollTop = upperRow.scrollHeight;
      } else {
        lowerRow.innerHTML = text;
      }
    },
  },
});

form.addEventListener("submit", processSubmission);

function processSubmission(e) {
  e.preventDefault();
  finalCalculation = true;
  calculateResult(input.value);
}

function calculateResult(userInput) {
  return evaluate(encodeString(userInput), previousAnswer);
}

window.addEventListener("keyup", () => {
  finalCalculation = false;
  calculateResult(input.value);
});
