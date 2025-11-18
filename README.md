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

This project provides a comprehensive Tree-sitter grammar for Google BigQuery's SQL dialect. BigQuery has many unique features compared to standard SQL, and this parser supports:

- **Complete query structure**: SELECT, FROM, WHERE, GROUP BY, HAVING, QUALIFY, ORDER BY, LIMIT, OFFSET
- **Advanced SELECT features**: DISTINCT/ALL, set operations (UNION, INTERSECT, EXCEPT)
- **Nested and repeated fields**: STRUCT and ARRAY types with full bracket notation support
- **BigQuery-specific syntax**: Table qualifiers (`project.dataset.table`), table wildcards (`table_*`), backtick identifiers
- **Data transformation**: PIVOT/UNPIVOT for cross-tabulation and data reshaping
- **Comprehensive JOIN support**: INNER, LEFT, RIGHT, FULL, CROSS JOINs
- **Subqueries and CTEs**: Common Table Expressions with WITH clause
- **Window functions**: OVER, PARTITION BY, QUALIFY, frame specifications
- **DML statements**: INSERT, UPDATE, DELETE, and MERGE
- **Script features**: DECLARE, SET, CREATE FUNCTION (UDF)
- **Advanced features**: CASE expressions, CAST, INTERVAL literals, array element access

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

const sourceCode = `
  SELECT DISTINCT id, name
  FROM \`project.dataset.table\`
  WHERE id > 100
  OFFSET 10
`;
const tree = parser.parse(sourceCode);

console.log(tree.rootNode.toString());
```

## Features

This parser provides comprehensive support for BigQuery SQL, including:

### Query Basics
- **SELECT statements**: Column selection, DISTINCT/ALL modifiers, aliases
- **FROM clause**: Tables, subqueries, table wildcards (`dataset.table_*`)
- **WHERE clause**: Filtering with comparison and logical operators
- **GROUP BY / HAVING**: Aggregation and group filtering
- **QUALIFY**: Window function result filtering
- **ORDER BY**: Sorting with ASC/DESC
- **LIMIT / OFFSET**: Result pagination

### Joins and Set Operations
- **JOIN types**: INNER, LEFT, RIGHT, FULL, CROSS
- **Set operations**: UNION, INTERSECT, EXCEPT (with ALL/DISTINCT)
- **Subqueries**: In SELECT, FROM, WHERE clauses
- **CTEs**: WITH clause (Common Table Expressions)

### Data Types and Literals
- **Basic types**: INT64, STRING, FLOAT64, BOOL, TIMESTAMP, etc.
- **Complex types**: STRUCT, ARRAY
- **Literals**: Numbers, strings, booleans, arrays, intervals
- **INTERVAL expressions**: `INTERVAL 1 DAY`, `INTERVAL '1-2' YEAR TO MONTH`

### BigQuery-Specific Features
- **Nested fields**: Dot notation (`user.address.city`)
- **Array access**: Bracket notation (`array[0]`, `array[OFFSET(1)]`, `array[ORDINAL(1)]`)
- **Table qualifiers**: `project.dataset.table`
- **Table wildcards**: `dataset.table_*` for querying multiple tables
- **Backtick identifiers**: `` `project-id.dataset.table` ``
- **UNNEST**: Flatten arrays
- **PIVOT / UNPIVOT**: Data transformation and cross-tabulation

### Window Functions
- **OVER clause**: Window specifications
- **PARTITION BY**: Partition data for window operations
- **ORDER BY**: Ordering within windows
- **Frame clauses**: ROWS/RANGE BETWEEN
- **WINDOW clause**: Named window definitions
- **QUALIFY**: Filter on window function results

### DML Statements
- **INSERT**: Single/multiple rows, INSERT...SELECT
- **UPDATE**: With SET clause and WHERE conditions
- **DELETE**: With WHERE conditions
- **MERGE**: UPSERT operations with WHEN MATCHED/NOT MATCHED clauses

### DDL Statements
- **CREATE TABLE**: With column definitions or AS SELECT
- **CREATE VIEW**: Standard and materialized views
- **CREATE FUNCTION**: User-Defined Functions (UDF)
- **DROP statements**: TABLE, VIEW with IF EXISTS support
- **OR REPLACE**: For idempotent DDL operations

### Scripting and Functions
- **DECLARE**: Variable declaration with type and default values
- **SET**: Variable assignment
- **CREATE FUNCTION**: SQL-based UDFs with parameters and return types
- **TEMP functions**: Temporary function definitions

### Expressions and Operators
- **Arithmetic**: +, -, *, /, %
- **Comparison**: =, !=, <, >, <=, >=
- **Logical**: AND, OR, NOT
- **Special operators**: BETWEEN, LIKE, IN, EXISTS, IS NULL
- **CASE expressions**: Searched and simple forms
- **CAST**: Type conversion with CAST and SAFE_CAST
- **Functions**: Aggregate, window, and scalar functions

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
