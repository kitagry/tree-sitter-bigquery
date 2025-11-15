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
    source_file: $ => repeat(choice(
      $.select_statement,
      $.create_table_statement,
      $.create_view_statement,
      $.drop_table_statement,
      $.drop_view_statement,
      $.insert_statement,
      $.update_statement,
      $.delete_statement
    )),

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
      $.case_expression,
      $.cast_expression,
      $.binary_expression,
      $.function_call,
      $.field_access,
      $.subquery,
      $.array_literal,
      $.struct_literal,
      $.star,
      $.number_literal,
      $.backtick_identifier,
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
      $.unnest_expression,
      $.qualified_table_name,
      $.backtick_identifier,
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
      $.between_expression,
      $.is_null_expression,
      $.case_expression,
      $.cast_expression,
      $.window_function,
      $.function_call,
      $.field_access,
      $.subquery,
      $.array_literal,
      $.struct_literal,
      $.backtick_identifier,
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
      // Comparison operators and LIKE have higher precedence than AND/OR
      prec.left(3, seq(
        field('left', $._expression),
        choice('=', '!=', '<', '>', '<=', '>=', kw('LIKE')),
        field('right', $._expression)
      )),
      // Addition and subtraction
      prec.left(5, seq(
        field('left', $._expression),
        choice('+', '-'),
        field('right', $._expression)
      )),
      // Multiplication, division, and modulo have highest precedence
      prec.left(6, seq(
        field('left', $._expression),
        choice('*', '/', '%'),
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
      field('table', choice(
        $.identifier,
        $.backtick_identifier,
        $.subquery,
        $.unnest_expression,
        $.qualified_table_name
      )),
      optional(kw('AS')),
      field('alias', $.identifier)
    ),

    field_access: $ => prec.left(seq(
      field('object', choice(
        $.identifier,
        $.backtick_identifier,
        $.field_access
      )),
      '.',
      field('field', choice(
        $.identifier,
        $.backtick_identifier
      ))
    )),

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

    // Stage 6: BigQuery-specific types and syntax
    array_literal: $ => seq(
      '[',
      optional(commaSep1($._expression)),
      ']'
    ),

    struct_literal: $ => seq(
      kw('STRUCT'),
      '(',
      optional(commaSep1($.struct_field)),
      ')'
    ),

    struct_field: $ => seq(
      $._expression,
      kw('AS'),
      field('alias', $.identifier)
    ),

    unnest_expression: $ => seq(
      kw('UNNEST'),
      '(',
      $._expression,
      ')'
    ),

    qualified_table_name: $ => choice(
      seq(
        choice($.identifier, $.backtick_identifier),
        '.',
        $.identifier,
        '.',
        $.identifier
      ),
      seq(
        choice($.identifier, $.backtick_identifier),
        '.',
        $.identifier
      )
    ),

    backtick_identifier: $ => /`[^`]+`/,

    // Stage 7: Window functions
    window_function: $ => seq(
      field('name', $.identifier),
      '(',
      optional(choice(
        field('arguments', $.star),
        field('arguments', commaSep1($._expression))
      )),
      ')',
      $.over_clause
    ),

    over_clause: $ => seq(
      kw('OVER'),
      '(',
      optional($.partition_by_clause),
      optional($.order_by_clause),
      optional($.frame_clause),
      ')'
    ),

    partition_by_clause: $ => seq(
      kw('PARTITION'),
      kw('BY'),
      commaSep1($._expression)
    ),

    frame_clause: $ => seq(
      choice(kw('ROWS'), kw('RANGE')),
      kw('BETWEEN'),
      field('start', $.frame_bound),
      kw('AND'),
      field('end', $.frame_bound)
    ),

    frame_bound: $ => choice(
      seq(kw('UNBOUNDED'), choice(kw('PRECEDING'), kw('FOLLOWING'))),
      seq($.number_literal, choice(kw('PRECEDING'), kw('FOLLOWING'))),
      seq(kw('CURRENT'), kw('ROW'))
    ),

    // Stage 8: DDL statements
    create_table_statement: $ => seq(
      kw('CREATE'),
      optional(seq(kw('OR'), kw('REPLACE'))),
      kw('TABLE'),
      field('name', choice(
        $.qualified_table_name,
        $.backtick_identifier,
        $.identifier
      )),
      choice(
        seq(
          '(',
          $.column_definitions,
          ')'
        ),
        seq(
          kw('AS'),
          $.select_statement
        )
      )
    ),

    create_view_statement: $ => seq(
      kw('CREATE'),
      optional(seq(kw('OR'), kw('REPLACE'))),
      kw('VIEW'),
      field('name', choice(
        $.qualified_table_name,
        $.backtick_identifier,
        $.identifier
      )),
      kw('AS'),
      $.select_statement
    ),

    drop_table_statement: $ => seq(
      kw('DROP'),
      kw('TABLE'),
      optional(seq(kw('IF'), kw('EXISTS'))),
      field('name', choice(
        $.qualified_table_name,
        $.backtick_identifier,
        $.identifier
      ))
    ),

    drop_view_statement: $ => seq(
      kw('DROP'),
      kw('VIEW'),
      optional(seq(kw('IF'), kw('EXISTS'))),
      field('name', choice(
        $.qualified_table_name,
        $.backtick_identifier,
        $.identifier
      ))
    ),

    column_definitions: $ => commaSep1($.column_definition),

    column_definition: $ => seq(
      field('name', $.identifier),
      field('type', $.type)
    ),

    type: $ => choice(
      // Simple types
      kw('INT64'),
      kw('FLOAT64'),
      kw('STRING'),
      kw('BOOL'),
      kw('BYTES'),
      kw('DATE'),
      kw('DATETIME'),
      kw('TIME'),
      kw('TIMESTAMP'),
      // Complex types (simplified for now)
      seq(kw('ARRAY'), '<', $.type, '>'),
      seq(kw('STRUCT'), '<', commaSep1($.struct_type_field), '>'),
      // Generic identifier for custom types
      $.identifier
    ),

    struct_type_field: $ => seq(
      optional(seq(field('name', $.identifier), optional(kw('AS')))),
      field('type', $.type)
    ),

    // Stage 9: DML statements
    insert_statement: $ => seq(
      kw('INSERT'),
      optional(kw('INTO')),
      field('table', choice(
        $.qualified_table_name,
        $.backtick_identifier,
        $.identifier
      )),
      optional($.column_list),
      choice(
        $.values_clause,
        $.select_statement
      )
    ),

    update_statement: $ => seq(
      kw('UPDATE'),
      field('table', choice(
        $.qualified_table_name,
        $.backtick_identifier,
        $.identifier
      )),
      $.set_clause,
      optional($.where_clause)
    ),

    delete_statement: $ => seq(
      kw('DELETE'),
      optional(kw('FROM')),
      field('table', choice(
        $.qualified_table_name,
        $.backtick_identifier,
        $.identifier
      )),
      optional($.where_clause)
    ),

    column_list: $ => seq(
      '(',
      commaSep1($.identifier),
      ')'
    ),

    values_clause: $ => seq(
      kw('VALUES'),
      commaSep1($.value_list)
    ),

    value_list: $ => seq(
      '(',
      commaSep1($._expression),
      ')'
    ),

    set_clause: $ => seq(
      kw('SET'),
      commaSep1($.assignment)
    ),

    assignment: $ => seq(
      field('column', $.identifier),
      '=',
      field('value', $._expression)
    ),

    // Stage 10: Advanced features
    case_expression: $ => seq(
      kw('CASE'),
      optional(field('value', $._expression)),
      repeat1($.when_clause),
      optional($.else_clause),
      kw('END')
    ),

    when_clause: $ => seq(
      kw('WHEN'),
      field('condition', $._expression),
      kw('THEN'),
      field('result', $._expression)
    ),

    else_clause: $ => seq(
      kw('ELSE'),
      $._expression
    ),

    cast_expression: $ => seq(
      choice(kw('CAST'), kw('SAFE_CAST')),
      '(',
      $._expression,
      kw('AS'),
      $.type,
      ')'
    ),

    between_expression: $ => seq(
      $._expression,
      kw('BETWEEN'),
      $._expression,
      kw('AND'),
      $._expression
    ),

    is_null_expression: $ => seq(
      $._expression,
      kw('IS'),
      optional(kw('NOT')),
      kw('NULL')
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
