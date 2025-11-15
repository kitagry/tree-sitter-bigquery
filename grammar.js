/**
 * @file TreeSitter parser for BigQuery
 * @author Ryo Kitagawa <kitadrum50@gmail.com>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "bigquery",

  extras: $ => [
    /\s/, // whitespace
    /--.*/, // single-line comments
  ],

  rules: {
    // Stage 1: Basic SELECT statement
    source_file: $ => repeat($.select_statement),

    select_statement: $ => seq(
      optional($.with_clause),
      $.select_clause,
      optional($.from_clause),
      optional($.where_clause),
      optional($.group_by_clause),
      optional($.having_clause),
      optional($.order_by_clause),
      optional($.limit_clause)
    ),

    select_clause: $ => seq(
      kw('SELECT'),
      commaSep1($.select_item)
    ),

    select_item: $ => choice(
      $.alias,
      $.function_call,
      $.field_access,
      $.subquery,
      $.star,
      $.number_literal,
      $.identifier
    ),

    from_clause: $ => seq(
      kw('FROM'),
      $._table_expression
    ),

    _table_expression: $ => choice(
      $.join_expression,
      $.table_alias,
      $.subquery,
      $.identifier
    ),

    // Stage 2: WHERE clause and expressions
    where_clause: $ => seq(
      kw('WHERE'),
      $._expression
    ),

    _expression: $ => choice(
      $.binary_expression,
      $.unary_expression,
      $.parenthesized_expression,
      $.in_expression,
      $.exists_expression,
      $.function_call,
      $.field_access,
      $.subquery,
      $.identifier,
      $.number_literal,
      $.string_literal,
      $.boolean_literal
    ),

    // Binary expressions with precedence
    // OR has lowest precedence
    binary_expression: $ => choice(
      prec.left(1, seq(
        field('left', $._expression),
        kw('OR'),
        field('right', $._expression)
      )),
      // AND has higher precedence than OR
      prec.left(2, seq(
        field('left', $._expression),
        kw('AND'),
        field('right', $._expression)
      )),
      // Comparison operators have higher precedence than AND/OR
      prec.left(3, seq(
        field('left', $._expression),
        choice('=', '!=', '<', '>', '<=', '>='),
        field('right', $._expression)
      ))
    ),

    // Unary expression (NOT)
    unary_expression: $ => prec(4, seq(
      kw('NOT'),
      $._expression
    )),

    // Parenthesized expression has highest precedence
    parenthesized_expression: $ => seq(
      '(',
      $._expression,
      ')'
    ),

    // Stage 3: Aggregation, GROUP BY, HAVING, ORDER BY, LIMIT
    function_call: $ => seq(
      field('name', $.identifier),
      '(',
      field('arguments', optional(choice(
        $.star,
        commaSep1($._expression)
      ))),
      ')'
    ),

    alias: $ => seq(
      $._expression,
      kw('AS'),
      field('alias', $.identifier)
    ),

    group_by_clause: $ => seq(
      kw('GROUP'),
      kw('BY'),
      commaSep1($._expression)
    ),

    having_clause: $ => seq(
      kw('HAVING'),
      $._expression
    ),

    order_by_clause: $ => seq(
      kw('ORDER'),
      kw('BY'),
      commaSep1($.order_item)
    ),

    order_item: $ => seq(
      $._expression,
      optional(choice(kw('ASC'), kw('DESC')))
    ),

    limit_clause: $ => seq(
      kw('LIMIT'),
      $.number_literal
    ),

    // Stage 4: JOIN operations
    join_expression: $ => prec.left(seq(
      field('left', $._table_expression),
      choice(
        seq(kw('INNER'), kw('JOIN')),
        seq(kw('LEFT'), optional(kw('OUTER')), kw('JOIN')),
        seq(kw('RIGHT'), optional(kw('OUTER')), kw('JOIN')),
        seq(kw('FULL'), optional(kw('OUTER')), kw('JOIN')),
        seq(kw('CROSS'), kw('JOIN')),
        kw('JOIN')
      ),
      field('right', $._table_expression),
      optional($.on_clause)
    )),

    on_clause: $ => seq(
      kw('ON'),
      $._expression
    ),

    table_alias: $ => seq(
      field('table', choice($.identifier, $.subquery)),
      optional(kw('AS')),
      field('alias', $.identifier)
    ),

    field_access: $ => seq(
      field('object', $.identifier),
      '.',
      field('field', $.identifier)
    ),

    // Stage 5: Subqueries and CTEs
    subquery: $ => seq(
      '(',
      $.select_statement,
      ')'
    ),

    with_clause: $ => seq(
      kw('WITH'),
      commaSep1($.cte)
    ),

    cte: $ => seq(
      field('name', $.identifier),
      kw('AS'),
      '(',
      $.select_statement,
      ')'
    ),

    in_expression: $ => seq(
      $._expression,
      kw('IN'),
      choice(
        $.subquery,
        seq('(', commaSep1($._expression), ')')
      )
    ),

    exists_expression: $ => seq(
      kw('EXISTS'),
      $.subquery
    ),

    // Primitives
    star: $ => '*',

    number_literal: $ => /\d+/,

    string_literal: $ => choice(
      seq("'", /[^']*/, "'"),
      seq('"', /[^"]*/, '"')
    ),

    boolean_literal: $ => choice(
      kw('TRUE'),
      kw('FALSE')
    ),

    identifier: $ => /[a-zA-Z_][a-zA-Z0-9_]*/,
  }
});

// Helper function for case-insensitive keywords
function kw(keyword) {
  return new RegExp(keyword.split('').map(char =>
    `[${char.toLowerCase()}${char.toUpperCase()}]`
  ).join(''));
}

// Helper function for comma-separated lists (at least one item)
function commaSep1(rule) {
  return seq(rule, repeat(seq(',', rule)));
}
