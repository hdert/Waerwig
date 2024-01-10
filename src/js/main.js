/// TODO:
/// - Save and reload equations
/// - Make it look more like a fullscreen calculator/speedcrunch
/// - Make upstream support exponential notation
/// - Allow copy of both equation and result
/// - Allow in place editing of equation and waterfall of results
/// - Allow copy edit of equation without waterfall of results

import Tooltip from "bootstrap/js/dist/tooltip";

var previousAnswer = 0;
var finalCalculation = false;
var input = document.getElementById("input");
var inputLabel = document.getElementById("inputLabel");
var form = document.getElementById("form");
var submit = document.getElementById("submit");
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
      var div = document.createElement("div");
      div.innerHTML =
        "<p class='mb-0'><a href='#' data-bs-toggle='tooltip' data-bs-title='Copy Equation' class='fw-light equation'>" +
        string +
        "</a></p>" +
        "<p class='mb-0'><a href='#' data-bs-toggle='tooltip' data-bs-title='Copy Result' class='result'>" +
        result +
        "</a></p>";
      div.classList.add("alert", "alert-dark", "mb-0", "text-end");
      div.setAttribute("role", "alert");
      const equations = div.getElementsByClassName("equation");
      const equation_a = equations[0];
      new Tooltip(equation_a);
      const results = div.getElementsByClassName("result");
      const result_a = results[0];
      new Tooltip(result_a);
      if (finalCalculation) {
        previousAnswer = result;
        const updateHeight =
          Math.abs(
            upperRow.scrollHeight - upperRow.clientHeight - upperRow.scrollTop
          ) < 2;

        upperRow.appendChild(div);
        input.value = "";
        if (updateHeight) upperRow.scrollTop = upperRow.scrollHeight;
      } else {
        lowerRow.replaceChildren(div);
      }
      const set_copied = (e) => {
        var element = e.target;
        navigator.clipboard.writeText(element.innerText).then(() => {
          const original_text = element.getAttribute("data-bs-title");
          const tooltip = Tooltip.getInstance(element);
          tooltip.setContent({ ".tooltip-inner": "Copied!" });
          element.addEventListener("hidden.bs.tooltip", () => {
            tooltip.setContent({ ".tooltip-inner": original_text });
          });
        });
      };
      equation_a.addEventListener("click", set_copied);
      result_a.addEventListener("click", set_copied);
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

input.disabled = false;
inputLabel.innerText = "Input";
input.focus();
submit.disabled = false;
