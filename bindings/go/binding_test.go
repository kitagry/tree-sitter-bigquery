package tree_sitter_bigquery_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_bigquery "github.com/kitagry/tree-sitter-bigquery/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_bigquery.Language())
	if language == nil {
		t.Errorf("Error loading BigQuery grammar")
	}
}
