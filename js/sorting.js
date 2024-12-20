// DOM Elements
const sortingArrayInput = document.getElementById("sortingArrayInput");
const generateRandomArray = document.getElementById("generateRandomArray");
const sortingAlgorithm = document.getElementById("sortingAlgorithm");
const startSorting = document.getElementById("startSorting");
const sortingArrayContainer = document.getElementById("sortingArrayContainer");
const sortingFeedback = document.getElementById("sortingFeedback");
const speedControl = document.getElementById("speedControl");

// Constants
let ANIMATION_DELAY = 500; // Default delay in milliseconds

// Helper: Initialize Array Visualization
function initializeSortingArray(array) {
    sortingArrayContainer.innerHTML = ""; // Clear existing elements
    array.forEach((value) => {
        const element = document.createElement("div");
        element.textContent = value;
        element.classList.add("array-element");
        element.style.height = `${value * 3}px`; // Dynamic height for visualization
        sortingArrayContainer.appendChild(element);
    });
}

// Helper: Highlight Elements
function highlightElements(index1, index2, className) {
    const elements = document.querySelectorAll(".array-element");
    if (index1 !== -1) elements[index1].classList.add(className);
    if (index2 !== -1) elements[index2].classList.add(className);
    setTimeout(() => {
        if (index1 !== -1) elements[index1].classList.remove(className);
        if (index2 !== -1) elements[index2].classList.remove(className);
    }, ANIMATION_DELAY);
}

// Helper: Swap Elements in DOM
function swapElements(index1, index2) {
    const elements = document.querySelectorAll(".array-element");
    const tempHeight = elements[index1].style.height;
    const tempText = elements[index1].textContent;

    elements[index1].style.height = elements[index2].style.height;
    elements[index1].textContent = elements[index2].textContent;

    elements[index2].style.height = tempHeight;
    elements[index2].textContent = tempText;
}

// Bubble Sort Visualization
async function bubbleSort(array) {
    sortingFeedback.textContent = "Performing Bubble Sort...";
    for (let i = 0; i < array.length - 1; i++) {
        for (let j = 0; j < array.length - i - 1; j++) {
            highlightElements(j, j + 1, "compared");
            if (array[j] > array[j + 1]) {
                [array[j], array[j + 1]] = [array[j + 1], array[j]];
                swapElements(j, j + 1);
                highlightElements(j, j + 1, "swapped");
                await new Promise((resolve) => setTimeout(resolve, ANIMATION_DELAY));
            }
        }
    }
    sortingFeedback.textContent = "Bubble Sort Complete!";
}

// Selection Sort Visualization
async function selectionSort(array) {
    sortingFeedback.textContent = "Performing Selection Sort...";
    for (let i = 0; i < array.length; i++) {
        let minIndex = i;
        for (let j = i + 1; j < array.length; j++) {
            highlightElements(minIndex, j, "compared");
            if (array[j] < array[minIndex]) {
                minIndex = j;
            }
        }
        if (minIndex !== i) {
            [array[i], array[minIndex]] = [array[minIndex], array[i]];
            swapElements(i, minIndex);
            highlightElements(i, minIndex, "swapped");
            await new Promise((resolve) => setTimeout(resolve, ANIMATION_DELAY));
        }
    }
    sortingFeedback.textContent = "Selection Sort Complete!";
}

// Insertion Sort Visualization
async function insertionSort(array) {
    sortingFeedback.textContent = "Performing Insertion Sort...";
    for (let i = 1; i < array.length; i++) {
        let key = array[i];
        let j = i - 1;
        while (j >= 0 && array[j] > key) {
            array[j + 1] = array[j];
            swapElements(j, j + 1);
            highlightElements(j, j + 1, "swapped");
            await new Promise((resolve) => setTimeout(resolve, ANIMATION_DELAY));
            j--;
        }
        array[j + 1] = key;
    }
    sortingFeedback.textContent = "Insertion Sort Complete!";
}

// Quick Sort Visualization
async function quickSort(array, left = 0, right = array.length - 1) {
    if (left >= right) return;

    const partitionIndex = await partition(array, left, right);
    await quickSort(array, left, partitionIndex - 1);
    await quickSort(array, partitionIndex + 1, right);
    if (left === 0 && right === array.length - 1)
        sortingFeedback.textContent = "Quick Sort Complete!";
}

async function partition(array, left, right) {
    const pivot = array[right];
    let i = left - 1;

    for (let j = left; j < right; j++) {
        highlightElements(j, right, "compared");
        if (array[j] < pivot) {
            i++;
            [array[i], array[j]] = [array[j], array[i]];
            swapElements(i, j);
            highlightElements(i, j, "swapped");
            await new Promise((resolve) => setTimeout(resolve, ANIMATION_DELAY));
        }
    }
    [array[i + 1], array[right]] = [array[right], array[i + 1]];
    swapElements(i + 1, right);
    return i + 1;
}

// Merge Sort Visualization
async function mergeSort(array, start = 0, end = array.length) {
    if (end - start <= 1) return;

    const mid = Math.floor((start + end) / 2);
    await mergeSort(array, start, mid);
    await mergeSort(array, mid, end);

    await merge(array, start, mid, end);
    if (start === 0 && end === array.length)
        sortingFeedback.textContent = "Merge Sort Complete!";
}

async function merge(array, start, mid, end) {
    const left = array.slice(start, mid);
    const right = array.slice(mid, end);
    let k = start, i = 0, j = 0;

    while (i < left.length && j < right.length) {
        highlightElements(k, k + 1, "compared");
        if (left[i] <= right[j]) {
            array[k] = left[i++];
        } else {
            array[k] = right[j++];
        }
        initializeSortingArray(array);
        highlightElements(k, -1, "swapped");
        await new Promise((resolve) => setTimeout(resolve, ANIMATION_DELAY));
        k++;
    }

    while (i < left.length) {
        array[k++] = left[i++];
        initializeSortingArray(array);
        await new Promise((resolve) => setTimeout(resolve, ANIMATION_DELAY));
    }

    while (j < right.length) {
        array[k++] = right[j++];
        initializeSortingArray(array);
        await new Promise((resolve) => setTimeout(resolve, ANIMATION_DELAY));
    }
}

// Utility: Adjust Animation Speed
speedControl.addEventListener("input", (event) => {
    ANIMATION_DELAY = 1000 - event.target.value; // Adjust delay based on slider value
});

// Utility: Generate Random Array
function generateRandomArrayValues() {
    const randomArray = Array.from({ length: 10 }, () => Math.floor(Math.random() * 50) + 1);
    sortingArrayInput.value = randomArray.join(",");
}

// Utility: Validate Input Array
function parseInputArray(input) {
    const array = input.split(",").map((num) => parseInt(num.trim(), 10));
    if (array.some(isNaN)) {
        sortingFeedback.textContent = "Error: Invalid input. Please enter valid numbers.";
        return null;
    }
    return array;
}

// Event Listeners
generateRandomArray.addEventListener("click", () => {
    generateRandomArrayValues();
    sortingFeedback.textContent = "Random array generated. Choose an algorithm to sort.";
});

startSorting.addEventListener("click", () => {
    const array = parseInputArray(sortingArrayInput.value);
    if (!array) return;

    initializeSortingArray(array); // Visualize the initial array
    const algorithm = sortingAlgorithm.value;

    switch (algorithm) {
        case "bubbleSort":
            bubbleSort(array);
            break;
        case "selectionSort":
            selectionSort(array);
            break;
        case "insertionSort":
            insertionSort(array);
            break;
        case "quickSort":
            quickSort(array);
            break;
        case "mergeSort":
            mergeSort(array);
            break;
        default:
            sortingFeedback.textContent = "Error: No valid sorting algorithm selected.";
    }
});
