package main

import (
	"flag"
	"fmt"
	"os"
	"strings"

	"blog/tools"
)

func main() {
	fmt.Fprintf(os.Stderr, "=== Search Engine Tool Started ===\n")

	// Parse command line arguments
	flag.Usage = func() {
		fmt.Fprintf(os.Stderr, "Usage: %s [query words...]\n\n", os.Args[0])
		fmt.Fprintf(os.Stderr, "Environment variables:\n")
		fmt.Fprintf(os.Stderr, "  BING_API_KEY    Required. Your Bing Web Search API key\n\n")
		fmt.Fprintf(os.Stderr, "Example:\n")
		fmt.Fprintf(os.Stderr, "  BING_API_KEY=your_api_key %s golang tutorial\n", os.Args[0])
		flag.PrintDefaults()
	}

	flag.Parse()
	query := strings.Join(flag.Args(), " ")

	fmt.Fprintf(os.Stderr, "Command line arguments processed\n")
	fmt.Fprintf(os.Stderr, "Search query: %q\n", query)

	// Validate input
	if query == "" {
		fmt.Fprintf(os.Stderr, "Error: No search query provided\n")
		flag.Usage()
		os.Exit(1)
	}

	if os.Getenv("BING_API_KEY") == "" {
		fmt.Fprintf(os.Stderr, "Error: BING_API_KEY environment variable is not set\n")
		flag.Usage()
		os.Exit(1)
	}

	fmt.Fprintf(os.Stderr, "Input validation successful\n")

	// Perform search
	fmt.Fprintf(os.Stderr, "Executing search...\n")
	results, err := tools.Search(query)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Search failed: %v\n", err)
		os.Exit(1)
	}

	// Display results
	fmt.Fprintf(os.Stderr, "Formatting results...\n")
	if len(results) == 0 {
		fmt.Println("No results found.")
		return
	}

	for i, result := range results {
		fmt.Printf("Result %d:\n", i+1)
		fmt.Printf("URL: %s\n", result.URL)
		fmt.Printf("Title: %s\n", result.Title)
		fmt.Printf("Snippet: %s\n\n", result.Snippet)
	}

	fmt.Fprintf(os.Stderr, "=== Search Engine Tool Completed ===\n")
}
