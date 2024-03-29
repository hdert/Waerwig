/// TODO:
/// - Change alerts to what they should be, like cards
/// - Fix text overflow messing with tooltips
/// - Make it look more like a fullscreen calculator/speedcrunch
"use strict";

import Tooltip from "bootstrap/js/dist/tooltip";

let history = [];
let editing_index = -1;
let previous_input;
// Global 'Constants' to manipulate the dom quicker
let input = document.getElementById("input");
let input_label = document.getElementById("inputLabel");
let form = document.getElementById("form");
let submit = document.getElementById("submit");
let upper_row = document.getElementById("upper-row");
let lower_row = document.getElementById("lower-row");
// SVGs
const edit_svg =
  '<svg xmlns="http://www.w3.org/2000/svg" aria-label="Submit edited equation" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16"><path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/><path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/></svg>';
const repeat_svg =
  '<svg xmlns="http://www.w3.org/2000/svg" aria-label="Repeat last equation" width="16" height="16" fill="currentColor" class="bi bi-arrow-repeat" viewBox="0 0 16 16"><path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41m-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9"/><path fill-rule="evenodd" d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5 5 0 0 0 8 3M3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9z"/></svg>';
const equal_svg = "=";
const cancel_svg =
  '<svg xmlns="http://www.w3.org/2000/svg" aria-label="Cancel editing equation" width="16" height="16" fill="currentColor" class="bi bi-x-circle" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/></svg>';

// WASM Imports

// WASM Debug Function

const print = (pointer, length) => {
  const string = decodeString(pointer, length);
  console.log(`${string}`);
};

// WASM Return Functions

const inputError = (pointer, length) => {
  const string = decodeString(pointer, length);
  lower_row.innerHTML =
    "<div class='alert alert-danger mb-0' data-bs-theme='dark' role='alert'>" +
    string +
    "</div>";
};

const handleAnswer = (pointer, length, result, addToHistory) => {
  // This string has trustable unsanitized user input
  const string = decodeString(pointer, length);
  if (editing_index >= 0 && addToHistory) {
    editModeHandleAnswer(string, result);
    return;
  }
  createAndPushCardElement(string, result, addToHistory, true);
  if (addToHistory) {
    appendToHistory(string, result);
    input.value = "";
    handleKeyUp();
  }
};

// Input Sanitization

// https://stackoverflow.com/a/17546215
let DOMtext = document.createTextNode("text");
let DOMnative = document.createElement("span");
DOMnative.appendChild(DOMtext);

const sanitizeForHtml = (input, length) => {
  DOMtext.nodeValue = decodeString(input, length);
  const text = encodeString(DOMnative.innerHTML);
  return text;
};

let memory, evaluate, evaluateUnchecked, alloc;

WebAssembly.instantiateStreaming(fetch("./Calculator.wasm"), {
  env: {
    print: print,
    inputError: inputError,
    handleAnswer: handleAnswer,
    sanitizeForHtml: sanitizeForHtml,
  },
}).then((obj) => {
  ({ memory, evaluate, evaluateUnchecked, alloc } = obj.instance.exports);
  main();
});

// Local Storage and History Functions

const updateLocalStorage = (start, end) => {
  const json = JSON.stringify(history, (k, v) => {
    return v === Number.POSITIVE_INFINITY
      ? "Infinity"
      : v === Number.NEGATIVE_INFINITY
      ? "-Infinity"
      : Number.isNaN(v)
      ? "NaN"
      : v;
  });
  localStorage.setItem("history", json);
};

const appendToHistory = (equation, result) => {
  history.push({ equation: equation, result: result });
  updateLocalStorage();
};

const loadHistory = () => {
  const parsed_history = JSON.parse(localStorage.getItem("history"));
  for (const calculation of parsed_history ? parsed_history : []) {
    history.push({
      equation: calculation.equation,
      result: calculation.result ? calculation.result : 0,
    });
    createAndPushCardElement(
      calculation.equation,
      calculation.result !== null ? calculation.result : 0,
      true,
      false
    );
  }
};

// WASM String Helper Functions

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

// Event Listener Functions

const copyText = (e) => {
  let element = e.target;
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

const addTooltipsToDiv = (d) => {
  let anchors = d.getElementsByTagName("a");
  let anchor_equation = anchors[0];
  let anchor_result = anchors[1];
  new Tooltip(anchor_equation);
  new Tooltip(anchor_result);
  anchor_equation.addEventListener("click", copyText);
  anchor_result.addEventListener("click", copyText);
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
  let div = document.createElement("div");
  div.classList.add(
    "alert",
    "alert-dark",
    "mb-0",
    "text-end",
    "d-flex",
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
  if (addToHistory) {
    const index = upper_row.childElementCount;
    // Adjust div for use as history card
    let final_div = addToCurrent ? div.cloneNode(true) : div;
    addTooltipsToDiv(final_div);
    final_div.classList.add("justify-content-between");
    final_div.insertAdjacentHTML("afterbegin", buttons);
    // Add event listeners to buttons
    let control_buttons = final_div.getElementsByTagName("button");
    let button_edit = control_buttons[0];
    button_edit.addEventListener("click", () => {
      editing_index = index;
      previous_input = input.value;
      input.value = history[index].equation;
      final_div.classList.add("alert-warning");
      final_div.classList.remove("alert-dark");
      submit.innerHTML = edit_svg;
      calculateResult(input.value, false);
      input.focus();
    });
    let button_copy = control_buttons[1];
    button_copy.addEventListener("click", () => {
      input.value += history[index].equation;
      submit.innerHTML = equal_svg;
      calculateResult(input.value, false);
      input.focus();
    });
    // Deal with updating scroll height
    const update_height =
      Math.abs(
        upper_row.scrollHeight - upper_row.clientHeight - upper_row.scrollTop
      ) < 2;
    upper_row.appendChild(final_div);
    if (update_height) upper_row.scrollTop = upper_row.scrollHeight;
  }
  if (addToCurrent) {
    div.classList.add("justify-content-end");
    addTooltipsToDiv(div);
    lower_row.replaceChildren(div);
  }
};

function processSubmission(e) {
  e.preventDefault();
  if (editing_index >= 0) {
    editModeProcessSubmission();
    return;
  }
  if (input.value.trim() == "" && history.length > 0) {
    calculateResult(history[history.length - 1].equation, true);
  } else {
    calculateResult(input.value, true);
  }
  input.focus();
}

const getPrevious = () => {
  if (editing_index > 0) {
    return history[editing_index - 1];
  } else if (editing_index != 0 && history.length > 0) {
    return history[history.length - 1];
  }
  return null;
};

const getPreviousAnswer = () => {
  const previous = getPrevious();
  return previous !== null ? previous.result : 0;
};

function calculateResult(userInput, addToHistory) {
  evaluate(encodeString(userInput), getPreviousAnswer(), addToHistory);
}

const handleKeyUp = () => {
  if (input.value.trim() == "") {
    const previous = getPrevious();
    if (previous !== null && editing_index < 0) {
      calculateResult(previous.equation, false);
      submit.innerHTML = repeat_svg;
    } else if (editing_index >= 0) {
      calculateResult(history[editing_index].equation, false);
      submit.innerHTML = cancel_svg;
    }
    return;
  }
  if (editing_index >= 0) {
    submit.innerHTML = edit_svg;
  } else {
    submit.innerHTML = equal_svg;
  }
  calculateResult(input.value, false);
};

function main() {
  loadHistory();

  form.addEventListener("submit", processSubmission);
  submit.addEventListener("click", processSubmission);

  window.addEventListener("keyup", handleKeyUp);

  input.disabled = false;
  input_label.innerText = "Input";
  submit.disabled = false;
  input.focus();
  handleKeyUp();
}

// Edit Mode Functions

const updateResults = (start, newEquation, newResult) => {
  history[start].equation = newEquation;
  history[start].result = newResult;

  let previousAnswer = newResult;
  let i = start + 1;
  while (i < history.length) {
    const result_before_edit = history[i].result;
    const new_result = evaluateUnchecked(
      encodeString(history[i].equation),
      previousAnswer
    );
    if (result_before_edit == new_result) break;
    history[i].result = new_result;
    previousAnswer = new_result;
    i++;
  }
  updateCards(start, i - 1);
};

const updateCards = (start, end) => {
  const cards = upper_row.children;
  cards[start].lastChild.firstChild.firstChild.innerText =
    history[start].equation;
  let i = start;
  while (i <= end) {
    cards[i].lastChild.lastChild.firstChild.innerText = history[i].result;
    i++;
  }
};

const editModeHandleAnswer = (string, result) => {
  updateResults(editing_index, string, result);
  updateLocalStorage();
  const div = upper_row.children[editing_index];
  div.classList.add("alert-dark");
  div.classList.remove("alert-warning");
  editing_index = -1;
  input.value = previous_input;
  previous_input = undefined;
  handleKeyUp();
};

const editModeProcessSubmission = () => {
  if (input.value.trim() == "") {
    calculateResult(history[editing_index].equation, true);
  } else {
    calculateResult(input.value, true);
  }
  input.focus();
};
