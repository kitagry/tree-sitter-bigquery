/**
 * @file TreeSitter parser for BigQuery
 * @author Ryo Kitagawa <kitadrum50@gmail.com>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "bigquery",

  rules: {
    // TODO: add the actual grammar rules
    source_file: $ => "hello"
  }
});
