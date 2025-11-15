import XCTest
import SwiftTreeSitter
import TreeSitterBigquery

final class TreeSitterBigqueryTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_bigquery())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading BigQuery grammar")
    }
}
