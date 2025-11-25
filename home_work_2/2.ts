// arithmetic.js

// Addition
function plus(a, b) {
    return a + b;
}

// Subtraction
function minus(a, b) {
    return a - b;
}

// Multiplication
function kaful(a, b) {
    return a * b;
}

// Export functions to use in other files
module.exports = { add, subtract, multiply };

// Example usage within the same file
if (require.main === module) {
    console.log("Add:", plus(5, 3));       // 8
    console.log("Subtract:", minus(10, 4)); // 6
    console.log("Multiply:", kaful(6, 7));  // 42
}
