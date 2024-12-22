package tools

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"os"
)

// SearchResult represents a processed search result
type SearchResult struct {
	URL     string
	Title   string
	Snippet string
}

// Search performs a web search using Bing Web Search API
func Search(query string) ([]SearchResult, error) {
	fmt.Fprintf(os.Stderr, "=== Search Process Started ===\n")
	fmt.Fprintf(os.Stderr, "Input query: %q\n", query)

	// Check API key
	apiKey := os.Getenv("BING_API_KEY")
	if apiKey == "" {
		fmt.Fprintf(os.Stderr, "Error: BING_API_KEY environment variable is not set\n")
		return nil, fmt.Errorf("BING_API_KEY environment variable is not set")
	}
	fmt.Fprintf(os.Stderr, "API key validation: successful\n")

	// Prepare request URL
	fmt.Fprintf(os.Stderr, "Preparing API request...\n")
	baseURL := "https://api.bing.microsoft.com/v7.0/search"
	params := url.Values{}
	params.Add("q", query)
	params.Add("count", "10")
	params.Add("responseFilter", "Webpages")
	params.Add("textFormat", "Raw")

	requestURL := baseURL + "?" + params.Encode()
	fmt.Fprintf(os.Stderr, "Request URL: %s\n", requestURL)

	// Create HTTP request
	req, err := http.NewRequest("GET", requestURL, nil)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error creating request: %v\n", err)
		return nil, fmt.Errorf("failed to create request: %v", err)
	}
	fmt.Fprintf(os.Stderr, "HTTP request created successfully\n")

	req.Header.Add("Ocp-Apim-Subscription-Key", apiKey)
	fmt.Fprintf(os.Stderr, "Added authentication header\n")

	// Execute request
	fmt.Fprintf(os.Stderr, "Executing API request...\n")
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error executing request: %v\n", err)
		return nil, fmt.Errorf("failed to perform search: %v", err)
	}
	defer resp.Body.Close()

	fmt.Fprintf(os.Stderr, "Response status: %s\n", resp.Status)
	if resp.StatusCode != http.StatusOK {
		fmt.Fprintf(os.Stderr, "Error: Non-200 status code received\n")
		return nil, fmt.Errorf("search request failed with status code: %d", resp.StatusCode)
	}

	// Read response body
	fmt.Fprintf(os.Stderr, "Reading response body...\n")
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error reading response body: %v\n", err)
		return nil, fmt.Errorf("failed to read response: %v", err)
	}
	fmt.Fprintf(os.Stderr, "Response body length: %d bytes\n", len(body))

	// Parse JSON response
	fmt.Fprintf(os.Stderr, "Parsing JSON response...\n")
	var response struct {
		WebPages struct {
			Value []struct {
				URL              string `json:"url"`
				Name             string `json:"name"`
				Snippet          string `json:"snippet"`
				Language         string `json:"language"`
				IsFamilyFriendly bool   `json:"isFamilyFriendly"`
			} `json:"value"`
		} `json:"webPages"`
	}

	err = json.Unmarshal(body, &response)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error parsing JSON: %v\n", err)
		// Log a sample of the response for debugging
		if len(body) > 200 {
			fmt.Fprintf(os.Stderr, "First 200 bytes of response: %s\n", body[:200])
		} else {
			fmt.Fprintf(os.Stderr, "Full response: %s\n", body)
		}
		return nil, fmt.Errorf("failed to parse response: %v", err)
	}

	// Process results
	fmt.Fprintf(os.Stderr, "Processing search results...\n")
	results := make([]SearchResult, 0)
	totalResults := len(response.WebPages.Value)
	familyFriendlyCount := 0

	for i, page := range response.WebPages.Value {
		fmt.Fprintf(os.Stderr, "Processing result %d/%d...\n", i+1, totalResults)
		if page.IsFamilyFriendly {
			familyFriendlyCount++
			results = append(results, SearchResult{
				URL:     page.URL,
				Title:   page.Name,
				Snippet: page.Snippet,
			})
		}
	}

	fmt.Fprintf(os.Stderr, "Results statistics:\n")
	fmt.Fprintf(os.Stderr, "- Total results: %d\n", totalResults)
	fmt.Fprintf(os.Stderr, "- Family friendly results: %d\n", familyFriendlyCount)
	fmt.Fprintf(os.Stderr, "=== Search Process Completed ===\n\n")

	return results, nil
}
