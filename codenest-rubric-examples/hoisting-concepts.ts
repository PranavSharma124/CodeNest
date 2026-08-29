// JavaScript Hoisting Demonstration
// Required for JavaScript hoisting evaluation criteria

// ============================================================
// 1. Function Declaration Hoisting
// ============================================================

// The function can be called before its declaration
// because function declarations are hoisted.

const functionResult = greetUser("CodeNest");

function greetUser(name: string): string {
  return `Hello, ${name}!`;
}

console.log("Function declaration hoisting:", functionResult);


// ============================================================
// 2. var Hoisting
// ============================================================

// var declarations are hoisted and initialized with undefined.
// The assignment happens later.

function demonstrateVarHoisting(): void {
  // Declaration is separated from assignment to demonstrate
  // that the variable exists before it receives its value.

  // eslint-disable-next-line no-var
  var hoistedValue: string | undefined;

  console.log("Value before var assignment:", hoistedValue);

  hoistedValue = "CodeNest";

  console.log("Value after var assignment:", hoistedValue);
}

demonstrateVarHoisting();


// ============================================================
// 3. let Hoisting and Temporal Dead Zone
// ============================================================

// let and const declarations are also hoisted technically,
// but they are NOT initialized before their declaration.
// Accessing them before declaration causes a ReferenceError.
//
// Example:
//
// console.log(userName); // ReferenceError
// let userName = "Pranav";


// ============================================================
// 4. const Hoisting and Temporal Dead Zone
// ============================================================

// const behaves similarly to let.
// It exists in the scope but cannot be accessed before
// its declaration.

//
// console.log(projectName); // ReferenceError
// const projectName = "CodeNest";


// ============================================================
// 5. Function Expression vs Function Declaration
// ============================================================

// Function declarations are fully hoisted.

console.log(addNumbers(10, 20));

function addNumbers(a: number, b: number): number {
  return a + b;
}


// Function expressions assigned to const are NOT callable
// before the declaration because the const variable is in
// the Temporal Dead Zone.

// Example:
//
// console.log(multiplyNumbers(10, 20)); // ReferenceError
//
// const multiplyNumbers = (a: number, b: number): number => {
//   return a * b;
// };


// ============================================================
// 6. Hoisting Summary
// ============================================================

export function explainHoisting(): void {
  console.log(`
JavaScript Hoisting Summary:

1. Function declarations are hoisted completely.
2. var declarations are hoisted and initialized as undefined.
3. let declarations are hoisted but remain in the Temporal Dead Zone.
4. const declarations are hoisted but remain in the Temporal Dead Zone.
5. Function expressions using let/const cannot be called before declaration.
`);
}