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
    source_file: $ => repeat(seq(
      choice(
        $.set_operation,
        $.select_statement,
        $.create_table_statement,
        $.create_view_statement,
        $.create_function_statement,
        $.drop_table_statement,
        $.drop_view_statement,
        $.insert_statement,
        $.update_statement,
        $.delete_statement,
        $.merge_statement,
        $.declare_statement,
        $.set_statement,
        $.begin_end_block
      ),
      optional(';')
    )),

    select_statement: $ => seq(
      optional($.with_clause),
      $.select_clause,
      optional($.from_clause),
      optional($.where_clause),
      optional($.group_by_clause),
      optional($.having_clause),
      optional($.qualify_clause),
      optional($.window_clause),
      optional($.order_by_clause),
      optional($.limit_clause),
      optional($.offset_clause)
    ),

    select_clause: $ => seq(
      kw('SELECT'),
      optional(choice(kw('DISTINCT'), kw('ALL'))),
      prec.right(
        seq(
          $.select_item,
          repeat(seq(',', $.select_item)),
          optional(',') // Allow trailing comma
        )
      )
    ),

    select_item: $ => prec.right(0, choice(
      $.alias,
      $.case_expression,
      $.cast_expression,
      $.binary_expression,
      $.function_call,
      $.array_access,
      $.field_access,
      $.subquery,
      $.array_literal,
      $.struct_literal,
      $.interval_literal,
      $.parameter_marker,
      $.system_variable,
      $.star,
      $.number_literal,
      $.string_literal,
      $.backtick_identifier,
      $.identifier
    )),

    from_clause: $ => seq(
      kw('FROM'),
      $._table_expression
    ),

    _table_expression: $ => choice(
      $.join_expression,
      $.table_alias,
      $.subquery,
      $.unnest_expression,
      $.pivot_expression,
      $.unpivot_expression,
      $.qualified_table_name,
      $.backtick_identifier,
      $.identifier
    ),

    // Stage 2: WHERE clause and expressions
    where_clause: $ => seq(
      kw('WHERE'),
      $._expression
    ),

    _expression: $ => optionalParenthesis(choice(
      $.binary_expression,
      $.unary_expression,
      $.in_expression,
      $.exists_expression,
      $.between_expression,
      $.is_null_expression,
      $.case_expression,
      $.cast_expression,
      $.window_function,
      $.function_call,
      $.array_access,
      $.field_access,
      $.subquery,
      $.array_literal,
      $.struct_literal,
      $.interval_literal,
      $.parameter_marker,
      $.system_variable,
      $.backtick_identifier,
      $.identifier,
      $.number_literal,
      $.string_literal,
      $.boolean_literal
    )),

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
    function_call: $ => prec(7, seq(
      field('name', $.identifier),
      '(',
      field('arguments', optional(choice(
        $.star,
        commaSep1($._expression)
      ))),
      ')'
    )),

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

    qualify_clause: $ => seq(
      kw('QUALIFY'),
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

    offset_clause: $ => seq(
      kw('OFFSET'),
      $.number_literal
    ),

    // Set operations (UNION, INTERSECT, EXCEPT)
    set_operation: $ => prec.left(seq(
      optionalParenthesis(choice($.select_statement, $.set_operation)),
      repeat1(
        seq(
          choice(
            seq(kw('UNION'), choice(kw('ALL'), kw('DISTINCT'))),
            seq(kw('UNION'), kw('ALL')),
            kw('UNION'),
            seq(kw('INTERSECT'), kw('DISTINCT')),
            kw('INTERSECT'),
            seq(kw('EXCEPT'), kw('DISTINCT')),
            kw('EXCEPT')
          ),
          optionalParenthesis(choice($.select_statement, $.set_operation)),
        )
      )
    )),

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
        $.field_access,
        $.array_access
      )),
      '.',
      field('field', choice(
        $.identifier,
        $.backtick_identifier
      ))
    )),

    // Array element access with brackets
    array_access: $ => prec.left(8, seq(
      field('array', choice(
        $.identifier,
        $.backtick_identifier,
        $.field_access,
        $.array_access
      )),
      '[',
      field('index', choice(
        $._expression,
        $.offset_subscript,
        $.ordinal_subscript
      )),
      ']'
    )),

    offset_subscript: $ => seq(
      kw('OFFSET'),
      '(',
      $._expression,
      ')'
    ),

    ordinal_subscript: $ => seq(
      kw('ORDINAL'),
      '(',
      $._expression,
      ')'
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

    // PIVOT expression
    pivot_expression: $ => seq(
      field('input', choice(
        $.subquery,
        $.qualified_table_name,
        $.backtick_identifier,
        $.identifier
      )),
      $.pivot_clause
    ),

    pivot_clause: $ => seq(
      kw('PIVOT'),
      '(',
      field('aggregates', choice(
        // Single aggregate: SUM(sales)
        $.function_call,
        // Multiple aggregates with aliases: SUM(sales) AS total, COUNT(*) AS cnt
        commaSep1($.pivot_aggregate)
      )),
      kw('FOR'),
      field('pivot_column', $.identifier),
      kw('IN'),
      '(',
      commaSep1(choice(
        $.pivot_value,
        $._expression
      )),
      ')',
      ')'
    ),

    pivot_aggregate: $ => seq(
      $.function_call,
      kw('AS'),
      field('alias', $.identifier)
    ),

    pivot_value: $ => seq(
      $._expression,
      kw('AS'),
      field('alias', $.identifier)
    ),

    // UNPIVOT expression (placeholder for now)
    unpivot_expression: $ => seq(
      field('input', choice(
        $.subquery,
        $.qualified_table_name,
        $.backtick_identifier,
        $.identifier
      )),
      kw('UNPIVOT'),
      '(',
      $.identifier,
      kw('FOR'),
      $.identifier,
      kw('IN'),
      '(',
      commaSep1($.identifier),
      ')',
      ')'
    ),

    qualified_table_name: $ => choice(
      // project.dataset.table or project.dataset.table_*
      seq(
        choice($.identifier, $.backtick_identifier),
        '.',
        $.identifier,
        '.',
        choice(
          $.identifier,
          $.table_name_with_wildcard
        )
      ),
      // dataset.table or dataset.table_*
      seq(
        choice($.identifier, $.backtick_identifier),
        '.',
        choice(
          $.identifier,
          $.table_name_with_wildcard
        )
      )
    ),

    // Table name with wildcard suffix
    table_name_with_wildcard: $ => seq(
      $.identifier,
      token.immediate('*')
    ),

    backtick_identifier: $ => /`[^`]+`/,

    // Stage 7: Window functions
    window_function: $ => prec(8, seq(
      field('name', $.identifier),
      '(',
      optional(choice(
        field('arguments', $.star),
        field('arguments', commaSep1($._expression))
      )),
      ')',
      $.over_clause
    )),

    over_clause: $ => seq(
      kw('OVER'),
      choice(
        // Named window reference
        field('window_name', $.identifier),
        // Inline window specification
        seq(
          '(',
          optional($.partition_by_clause),
          optional($.order_by_clause),
          optional($.frame_clause),
          ')'
        )
      )
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

    // WINDOW clause for named window definitions
    window_clause: $ => seq(
      kw('WINDOW'),
      commaSep1($.window_definition)
    ),

    window_definition: $ => seq(
      field('name', $.identifier),
      kw('AS'),
      seq(
        '(',
        optional($.partition_by_clause),
        optional($.order_by_clause),
        optional($.frame_clause),
        ')'
      )
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

    create_function_statement: $ => seq(
      kw('CREATE'),
      optional(choice(
        seq(kw('OR'), kw('REPLACE')),
        kw('TEMP'),
        kw('TEMPORARY')
      )),
      kw('FUNCTION'),
      field('name', choice(
        $.qualified_table_name,
        $.backtick_identifier,
        $.identifier
      )),
      field('parameters', $.parameter_list),
      kw('RETURNS'),
      field('return_type', $.type),
      kw('AS'),
      '(',
      field('body', $._expression),
      ')'
    ),

    parameter_list: $ => seq(
      '(',
      optional(commaSep1($.parameter)),
      ')'
    ),

    parameter: $ => seq(
      field('name', $.identifier),
      field('type', $.type)
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

    // MERGE statement
    merge_statement: $ => seq(
      kw('MERGE'),
      optional(kw('INTO')),
      field('target', choice($.qualified_table_name, $.backtick_identifier, $.identifier)),
      optional(field('target_alias', $.identifier)),
      kw('USING'),
      field('source', choice($.qualified_table_name, $.backtick_identifier, $.identifier, $.subquery)),
      optional(field('source_alias', $.identifier)),
      kw('ON'),
      field('condition', $._expression),
      repeat1(choice(
        $.when_matched_clause,
        $.when_not_matched_clause,
        $.when_not_matched_by_source_clause
      ))
    ),

    when_matched_clause: $ => seq(
      kw('WHEN'),
      kw('MATCHED'),
      optional(seq(kw('AND'), $._expression)),
      kw('THEN'),
      choice(
        seq(kw('UPDATE'), $.set_clause),
        $.delete_action
      )
    ),

    when_not_matched_clause: $ => seq(
      kw('WHEN'),
      kw('NOT'),
      kw('MATCHED'),
      optional(seq(kw('AND'), $._expression)),
      kw('THEN'),
      kw('INSERT'),
      '(',
      commaSep1($.identifier),
      ')',
      kw('VALUES'),
      '(',
      commaSep1($._expression),
      ')'
    ),

    when_not_matched_by_source_clause: $ => seq(
      kw('WHEN'),
      kw('NOT'),
      kw('MATCHED'),
      kw('BY'),
      kw('SOURCE'),
      optional(seq(kw('AND'), $._expression)),
      kw('THEN'),
      choice(
        seq(kw('UPDATE'), $.set_clause),
        $.delete_action
      )
    ),

    delete_action: $ => kw('DELETE'),

    // DECLARE statement
    declare_statement: $ => seq(
      kw('DECLARE'),
      field('variable', $.identifier),
      field('type', $.type),
      optional(seq(
        kw('DEFAULT'),
        field('default_value', $._expression)
      ))
    ),

    // SET statement
    set_statement: $ => seq(
      kw('SET'),
      field('variable', $.identifier),
      '=',
      field('value', $._expression)
    ),

    // Control flow: BEGIN...END block
    begin_end_block: $ => seq(
      kw('BEGIN'),
      repeat($._block_statement),
      kw('END')
    ),

    // Helper rule for statements inside BEGIN...END or IF blocks
    _block_statement: $ => seq(
      choice(
        $.select_statement,
        $.insert_statement,
        $.update_statement,
        $.delete_statement,
        $.merge_statement,
        $.declare_statement,
        $.set_statement,
        $.if_statement,
        $.while_statement,
        $.loop_statement,
        $.repeat_statement,
        $.break_statement,
        $.continue_statement,
        $.leave_statement,
        $.begin_end_block
      ),
      optional(';')
    ),

    // Control flow: IF statement
    if_statement: $ => seq(
      kw('IF'),
      field('condition', $._expression),
      kw('THEN'),
      repeat($._block_statement),
      repeat($.elseif_clause),
      optional($.else_clause),
      kw('END'),
      kw('IF')
    ),

    elseif_clause: $ => seq(
      kw('ELSEIF'),
      field('condition', $._expression),
      kw('THEN'),
      repeat($._block_statement)
    ),

    else_clause: $ => seq(
      kw('ELSE'),
      repeat($._block_statement)
    ),

    // Loop constructs
    while_statement: $ => seq(
      kw('WHILE'),
      field('condition', $._expression),
      kw('DO'),
      repeat($._block_statement),
      kw('END'),
      kw('WHILE')
    ),

    loop_statement: $ => seq(
      kw('LOOP'),
      repeat($._block_statement),
      kw('END'),
      kw('LOOP')
    ),

    repeat_statement: $ => seq(
      kw('REPEAT'),
      repeat($._block_statement),
      kw('UNTIL'),
      field('condition', $._expression),
      kw('END'),
      kw('REPEAT')
    ),

    // Loop control statements
    break_statement: $ => kw('BREAK'),

    continue_statement: $ => kw('CONTINUE'),

    leave_statement: $ => seq(
      kw('LEAVE'),
      optional($.identifier)
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
      field('column', choice($.field_access, $.identifier)),
      '=',
      field('value', $._expression)
    ),

    // Stage 10: Advanced features
    case_expression: $ => seq(
      kw('CASE'),
      optional(field('value', $._expression)),
      repeat1($.when_clause),
      optional($.case_else_clause),
      kw('END')
    ),

    when_clause: $ => seq(
      kw('WHEN'),
      field('condition', $._expression),
      kw('THEN'),
      field('result', $._expression)
    ),

    case_else_clause: $ => seq(
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

    // INTERVAL literals
    interval_literal: $ => seq(
      kw('INTERVAL'),
      choice($.number_literal, $.string_literal),
      field('from', $.date_part),
      optional(seq(
        kw('TO'),
        field('to', $.date_part)
      ))
    ),

    date_part: $ => choice(
      kw('YEAR'),
      kw('MONTH'),
      kw('DAY'),
      kw('HOUR'),
      kw('MINUTE'),
      kw('SECOND'),
      kw('MILLISECOND'),
      kw('MICROSECOND')
    ),

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

    // Parameter marker (@param_name)
    parameter_marker: $ => /@[a-zA-Z_][a-zA-Z0-9_]*/,

    // System variable (@@variable_name)
    system_variable: $ => /@@[a-zA-Z_][a-zA-Z0-9_]*/,
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

function optionalParenthesis(node) {
  return prec.right(
    choice(
      node,
      wrappedInParenthesis(node),
    ),
  )
}

function wrappedInParenthesis(node) {
  if (node) {
    return seq("(", node, ")");
  }
  return seq("(", ")");
}
