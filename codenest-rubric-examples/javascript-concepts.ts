/*
 * CodeNest JavaScript Rubric Demonstrations
 *
 * Demonstrates:
 * 1. Promises
 * 2. Callbacks
 * 3. Promises vs callbacks
 * 4. async/await
 * 5. Closures
 * 6. Event loop
 * 7. Hoisting
 *
 * Educational examples; not part of the production request flow.
 */

// 1. PROMISE
function fetchReview(): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => resolve("Code review completed"), 500);
  });
}

fetchReview().then((result) => console.log(result));

// 2. CALLBACK
function fetchReviewWithCallback(
  callback: (result: string) => void,
): void {
  setTimeout(() => {
    callback("Code review completed");
  }, 500);
}

fetchReviewWithCallback((result) => console.log(result));

// 3. PROMISES VS CALLBACKS
function getReviewCallback(
  callback: (review: string) => void,
): void {
  setTimeout(() => callback("Review from callback"), 500);
}

getReviewCallback((review) => console.log(review));

function getReviewPromise(): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => resolve("Review from Promise"), 500);
  });
}

getReviewPromise().then((review) => console.log(review));

// Callback style passes a function to be executed later.
// Promise style returns an object representing the eventual result.

// 4. ASYNC/AWAIT
async function reviewCode(): Promise<string> {
  return await getReviewPromise();
}

reviewCode().then((result) => console.log(result));

// async functions return Promises; await consumes a Promise.

// 5. CLOSURE
function createReviewCounter() {
  let reviewCount = 0;

  return function incrementReviewCount() {
    reviewCount++;
    return reviewCount;
  };
}

const countReviews = createReviewCounter();

console.log(countReviews()); // 1
console.log(countReviews()); // 2
console.log(countReviews()); // 3

// The inner function retains access to reviewCount after the
// outer function has returned. That preserved scope is a closure.

// 6. EVENT LOOP
console.log("1: synchronous");

setTimeout(() => {
  console.log("3: timer callback");
}, 0);

Promise.resolve().then(() => {
  console.log("2: Promise microtask");
});

console.log("4: synchronous");

// Expected order:
// 1: synchronous
// 4: synchronous
// 2: Promise microtask
// 3: timer callback

// 7. HOISTING
let hoistedVariable: string | undefined = undefined;

console.log(hoistedVariable); // undefined

hoistedVariable = "CodeNest";

sayHello();

function sayHello() {
  console.log("Hello from CodeNest");
}
