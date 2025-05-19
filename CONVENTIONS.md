# Coding Conventions

## Introduction

This document outlines the coding conventions for our project. While we aim to maintain flexibility, these guidelines promote code readability, maintainability, and consistency across the project.

## General Principles

1. **Simplicity**: Keep it simple. Reduce complexity wherever possible.
2. **Boy Scout Rule**: Always leave the code cleaner than you found it.
3. **Root Cause Analysis**: Always seek to understand and address the root cause of a problem.

## Code Understandability

1. **Consistency**: Maintain consistent coding patterns throughout the project.
2. **Descriptive Variables**: Use clear, self-explanatory variable names.
3. **Boundary Conditions**: Encapsulate and clearly define boundary conditions.
4. **Value Objects**: Prefer dedicated value objects over primitive types when appropriate.
5. **Independence**: Avoid logical dependencies between methods within the same class.
6. **Positive Conditionals**: Favor positive conditionals over negative ones for clarity.

## Naming Conventions

1. **Clarity**: Choose descriptive and unambiguous names.
2. **Distinction**: Ensure names are meaningfully distinct.
3. **Pronunciation**: Use easily pronounceable names.
4. **Searchability**: Opt for names that are easy to search for.
5. **Constants**: Replace magic numbers with named constants.
6. **No Encodings**: Avoid prefixes or type information in names.

## Function Guidelines

1. **Size**: Keep functions small and focused.
2. **Single Responsibility**: Each function should do one thing well.
3. **Naming**: Use descriptive names that explain the function's purpose.
4. **Arguments**: Minimize the number of arguments.
5. **Side Effects**: Avoid side effects in functions.
6. **Flag Arguments**: Instead of using flag arguments, split into separate methods.

## Code Smells to Avoid

1. **Rigidity**: Code that's difficult to change.
2. **Fragility**: Software that breaks in multiple places due to a single change.
3. **Immobility**: Code that's hard to reuse in other projects.
4. **Needless Complexity**: Overengineering simple solutions.
5. **Needless Repetition**: Duplicated code or logic.
6. **Opacity**: Code that's hard to understand or reason about.

Remember, these conventions are guidelines to improve our codebase. They should be applied judiciously, always keeping in mind the context and specific needs of each part of the project.
