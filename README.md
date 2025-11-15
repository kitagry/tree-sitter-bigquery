# tree-sitter-bigquery

A [Tree-sitter](https://tree-sitter.github.io/tree-sitter/) grammar for BigQuery SQL.

## What is Tree-sitter?

Tree-sitter is a parser generator tool and incremental parsing library. It builds concrete syntax trees for source files and efficiently updates them as the source file is edited. Tree-sitter parsers are used in text editors for:

- Syntax highlighting
- Code navigation
- Code folding
- Symbol search
- Linting and error detection

## About This Project

This project provides a Tree-sitter grammar for Google BigQuery's SQL dialect. BigQuery has many unique features compared to standard SQL, including:

- Nested and repeated fields (STRUCT and ARRAY types)
- Table name qualifiers (`project.dataset.table`)
- BigQuery-specific functions and syntax
- DDL statements specific to BigQuery

## Installation

### Node.js

```bash
npm install tree-sitter-bigquery
```

### Other Languages

This grammar provides bindings for multiple languages:

- **C**: Use the generated `parser.c` in `src/`
- **Go**: Import via Go modules
- **Python**: Install via pip (coming soon)
- **Rust**: Add to `Cargo.toml`
- **Swift**: Use Swift Package Manager

## Usage

### Node.js Example

```javascript
const Parser = require('tree-sitter');
const BigQuery = require('tree-sitter-bigquery');

const parser = new Parser();
parser.setLanguage(BigQuery);

const sourceCode = 'SELECT id, name FROM `project.dataset.table` WHERE id > 100';
const tree = parser.parse(sourceCode);

console.log(tree.rootNode.toString());
```

## Development Approach

This grammar is being developed incrementally in stages, from simple to complex:

### Stage 0: Preparation ✓
- Documentation and project setup

### Stage 1: Basic SELECT ✓
- `SELECT 1`
- `SELECT column FROM table`
- Basic identifiers and numeric literals

### Stage 2: WHERE Clause and Expressions ✓
- Comparison operators (=, !=, <, >, <=, >=)
- Logical operators (AND, OR, NOT)
- String and boolean literals

### Stage 3: Aggregation and GROUP BY ✓
- Aggregate functions (COUNT, SUM, AVG, MIN, MAX)
- GROUP BY and HAVING clauses
- ORDER BY and LIMIT

### Stage 4: JOIN Operations ✓
- INNER JOIN, LEFT JOIN, RIGHT JOIN, FULL JOIN, CROSS JOIN
- ON conditions
- Table and column aliases

### Stage 5: Subqueries and CTEs ✓
- Subqueries in SELECT, FROM, and WHERE
- WITH clause (Common Table Expressions)

### Stage 6: BigQuery-Specific Types ✓
- STRUCT and ARRAY types
- Nested field access (dot notation)
- UNNEST
- Qualified table names
- Backtick identifiers

### Stage 7: Window Functions
- OVER clause
- PARTITION BY and ORDER BY in windows
- Frame specifications

### Stage 8: DDL Statements
- CREATE TABLE / CREATE OR REPLACE TABLE
- CREATE VIEW
- ALTER TABLE
- DROP statements

### Stage 9: Other DML/DQL
- INSERT, UPDATE, DELETE, MERGE
- DECLARE and SET

### Stage 10: Advanced Features
- User-Defined Functions (UDFs)
- CASE expressions
- CAST and SAFE_CAST
- Date and time functions

## Testing

This project uses Test-Driven Development (TDD). Each feature is:

1. Documented with example SQL in `examples/`
2. Tested with failing tests in `test/corpus/`
3. Implemented in `grammar.js`
4. Verified with passing tests

### Running Tests

```bash
npm test
```

### Adding Test Cases

Test cases are located in `test/corpus/` following Tree-sitter's corpus format:

```
================================================================================
Test name
================================================================================

SELECT 1

--------------------------------------------------------------------------------

(source_file
  (select_statement
    (select_clause
      (number_literal))))
```

## Contributing

Contributions are welcome! When adding new grammar rules:

1. Add example SQL to `examples/`
2. Write failing tests in `test/corpus/`
3. Implement the grammar in `grammar.js`
4. Run `npx tree-sitter generate` to regenerate the parser
5. Verify tests pass with `npm test`
6. Submit a pull request

## License

MIT

## Author

Ryo Kitagawa (kitadrum50@gmail.com)

## References

- [Tree-sitter Documentation](https://tree-sitter.github.io/tree-sitter/)
- [BigQuery SQL Reference](https://cloud.google.com/bigquery/docs/reference/standard-sql/query-syntax)
- [Tree-sitter Grammar Development Guide](https://tree-sitter.github.io/tree-sitter/creating-parsers)
