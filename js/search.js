// DOM Elements
const arrayInput = document.getElementById("arrayInput");
const searchValue = document.getElementById("searchValue");
const linearSearchBtn = document.getElementById("linearSearchBtn");
const binarySearchBtn = document.getElementById("binarySearchBtn");
const arrayContainer = document.getElementById("arrayContainer");
const feedback = document.getElementById("feedback");

// Helper: Initialize Array Visualization
function initializeArray(array) {
    arrayContainer.innerHTML = ""; // Clear existing elements
    array.forEach((value, index) => {
        const element = document.createElement("div");
        element.textContent = value;
        element.classList.add("array-element");
        element.dataset.index = index; // Attach index for easy updates
        arrayContainer.appendChild(element);
    });
}

// Helper: Highlight Current and Found Elements
function updateArrayHighlight(currentIndex = -1, foundIndex = -1) {
    const elements = document.querySelectorAll(".array-element");
    elements.forEach((element, index) => {
        element.classList.remove("current", "found"); // Reset classes
        if (index === currentIndex) element.classList.add("current");
        if (index === foundIndex) element.classList.add("found");
    });
}

// Linear Search Visualization
function visualizeLinearSearch(array, target) {
    initializeArray(array);
    let i = 0;
    feedback.textContent = "Starting Linear Search...";
    const interval = setInterval(() => {
        if (i >= array.length) {
            clearInterval(interval);
            feedback.textContent = "Value not found!";
            return;
        }
        updateArrayHighlight(i); // Highlight current index
        if (array[i] === target) {
            updateArrayHighlight(i, i); // Highlight as found
            clearInterval(interval);
            feedback.textContent = `Value found at index ${i}!`;
        }
        i++;
    }, 500);
}

// Binary Search Visualization
function visualizeBinarySearch(array, target) {
    initializeArray(array);
    let left = 0, right = array.length - 1;
    feedback.textContent = "Starting Binary Search...";
    const interval = setInterval(() => {
        if (left > right) {
            clearInterval(interval);
            feedback.textContent = "Value not found!";
            return;
        }
        const mid = Math.floor((left + right) / 2);
        updateArrayHighlight(mid); // Highlight mid index
        if (array[mid] === target) {
            updateArrayHighlight(mid, mid); // Highlight as found
            clearInterval(interval);
            feedback.textContent = `Value found at index ${mid}!`;
        } else if (array[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }, 500);
}

// Button Event Listeners
linearSearchBtn.addEventListener("click", () => {
    const array = arrayInput.value.split(",").map(Number);
    const target = Number(searchValue.value);
    if (!array.length || isNaN(target)) {
        feedback.textContent = "Please enter valid input!";
        return;
    }
    visualizeLinearSearch(array, target);
});

binarySearchBtn.addEventListener("click", () => {
    const array = arrayInput.value.split(",").map(Number).sort((a, b) => a - b);
    const target = Number(searchValue.value);
    if (!array.length || isNaN(target)) {
        feedback.textContent = "Please enter valid input!";
        return;
    }
    visualizeBinarySearch(array, target);
});
