/// TODO:
/// - Save and reload equations
///   - Decide on a data structure to store equations and results
///   - Modularize code that creates history blocks
/// - Change alerts to what they should be, like cards
/// - Allow in place editing of equation and waterfall of results
/// - Fix text overflow messing with tooltips
/// - Make it look more like a fullscreen calculator/speedcrunch
"use strict";

import Tooltip from "bootstrap/js/dist/tooltip";

var previousAnswer = 0;
var previousEquation = null;
var finalCalculation = false;
var input = document.getElementById("input");
var inputLabel = document.getElementById("inputLabel");
var form = document.getElementById("form");
var submit = document.getElementById("submit");
var upperRow = document.getElementById("upper-row");
var lowerRow = document.getElementById("lower-row");

const copy_text = (e) => {
  var element = e.target;
  navigator.clipboard.writeText(element.innerText).then(() => {
    const original_text = element.getAttribute("data-bs-title");
    const tooltip = Tooltip.getInstance(element);
    tooltip.setContent({ ".tooltip-inner": "Copied!" });
    element.addEventListener("hidden.bs.tooltip", () => {
      tooltip.setContent({ ".tooltip-inner": original_text });
    });
    input.focus();
  });
};

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

const print = (pointer, length) => {
  const string = decodeString(pointer, length);
  console.log(`${string}`);
};

const inputError = (pointer, length) => {
  // This string has untrustable unsanitized user input mixed in with html
  const string = decodeString(pointer, length);
  lowerRow.innerHTML =
    "<div class='alert alert-danger mb-0' data-bs-theme='dark' role='alert'>" +
    string +
    "</div>";
};

const addTooltipsToDiv = (d) => {
  var anchors = d.getElementsByTagName("a");
  var anchor_equation = anchors[0];
  var anchor_result = anchors[1];
  new Tooltip(anchor_equation);
  new Tooltip(anchor_result);
  anchor_equation.addEventListener("click", copy_text);
  anchor_result.addEventListener("click", copy_text);
};

const createAndPushCardElement = (
  equation,
  result,
  addToHistory,
  addToCurrent
) => {
  // If none of these are true, what is the point of printing to the screen?
  if (!(addToHistory || addToCurrent)) {
    return;
  }
  var div = document.createElement("div");
  div.classList.add(
    "alert",
    "alert-dark",
    "mb-0",
    "text-end",
    "d-flex",
    "justify-content-end",
    "p-sm-0",
    "min-width-0"
  );
  div.setAttribute("role", "alert");
  const buttons =
    "<div class='d-flex flex-sm-column justify-content-sm-around ms-sm-2 py-sm-2 flex-row align-items-center'>" +
    "<button type='button' class='btn btn-outline-primary p-6 p-sm-1 lh-1 order-sm-0 order-1 me-1 me-sm-0' title='Edit' aria-label='Edit'>" +
    '<svg focusable="false" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16"><path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/><path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/></svg>' +
    "</button>" +
    "<button type='button' class='btn btn-outline-primary p-6 p-sm-1 lh-1 order-sm-1 order-0 me-1 me-sm-0' title='Copy to Input' aria-label='Copy to Equation'>" +
    '<svg focusable="false" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-90deg-down" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M4.854 14.854a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L4 13.293V3.5A2.5 2.5 0 0 1 6.5 1h8a.5.5 0 0 1 0 1h-8A1.5 1.5 0 0 0 5 3.5v9.793l3.146-3.147a.5.5 0 0 1 .708.708z"/></svg>' +
    "</button>" +
    "</div>";
  div.innerHTML =
    "<div class='p-sm-3 min-width-0'>" +
    "<p class='mb-0 overflow-x-auto'>" +
    "<a href='#' data-bs-toggle='tooltip' data-bs-title='Copy Equation' class='fw-light text-decoration-none text-light equation'>" +
    equation +
    "</a>" +
    "</p>" +
    "<p class='mb-0'>" +
    "<a href='#' data-bs-toggle='tooltip' data-bs-title='Copy Result' class='text-decoration-none text-light result'>" +
    result +
    "</a>" +
    "</p>" +
    "</div>";
  addTooltipsToDiv(div);
  if (addToHistory) {
    // Adjust div for use as history card
    var final_div = div.cloneNode(true);
    addTooltipsToDiv(final_div);
    final_div.classList.remove("justify-content-end");
    final_div.classList.add("justify-content-between");
    final_div.insertAdjacentHTML("afterbegin", buttons);
    // Add event listeners to buttons
    var control_buttons = final_div.getElementsByTagName("button");
    var button_edit = control_buttons[0];
    var button_copy = control_buttons[1];
    button_copy.addEventListener("click", () => {
      input.value += equation;
      finalCalculation = false;
      calculateResult(input.value);
      input.focus();
    });
    // Deal with updating scroll height
    const updateHeight =
      Math.abs(
        upperRow.scrollHeight - upperRow.clientHeight - upperRow.scrollTop
      ) < 2;
    upperRow.appendChild(final_div);
    input.value = "";
    if (updateHeight) upperRow.scrollTop = upperRow.scrollHeight;
  }
  if (addToCurrent) lowerRow.replaceChildren(div);
};

const handleAnswer = (pointer, length, result) => {
  // This string has trustable unsanitized user input
  const string = decodeString(pointer, length);
  createAndPushCardElement(string, result, finalCalculation, true);
  if (finalCalculation) {
    previousEquation = string;
    previousAnswer = result;
    finalCalculation = false;
  }
};

const {
  instance: {
    exports: { memory, evaluate, alloc },
  },
} = await WebAssembly.instantiateStreaming(fetch("./Calculator.wasm"), {
  env: {
    print: print,
    inputError: inputError,
    handleAnswer: handleAnswer,
  },
});

function processSubmission(e) {
  e.preventDefault();
  finalCalculation = true;
  if (input.value.trim() == "" && previousEquation !== null) {
    calculateResult(previousEquation);
  } else {
    calculateResult(input.value);
  }
  finalCalculation = false;
  input.focus();
}

function calculateResult(userInput) {
  return evaluate(encodeString(userInput), previousAnswer);
}

function main() {
  form.addEventListener("submit", processSubmission);

  window.addEventListener("keyup", () => {
    if (input.value.trim() == "") return;
    finalCalculation = false;
    calculateResult(input.value);
  });

  input.disabled = false;
  inputLabel.innerText = "Input";
  submit.disabled = false;
  input.focus();
}

main();
