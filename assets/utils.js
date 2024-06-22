// Function to format file names
function formatFileName(fileName) {
    // Remove the .md or .MD extension
    const baseName = fileName.replace(/\.md$/i, '');

    // Replace underscores and dashes with spaces
    const withSpaces = baseName.replace(/[_-]/g, ' ');

    // List of filler words to exclude from capitalization
    const fillerWords = ['in', 'of', 'the', 'and', 'a', 'to', 'for'];

    // Convert to camel case, excluding filler words
    const words = withSpaces.split(' ');
    const formattedWords = words.map((word, index) => {
        if (index === 0 || !fillerWords.includes(word.toLowerCase())) {
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        }
        return word.toLowerCase();
    });

    return formattedWords.join(' ');
}

// Function to convert a string to camelCase
function toCamelCase(str) {
    return str.replace(/(?:^\w|[A-Z]|\b\w|\s+|[-_])/g, function(match, index) {
        if (+match === 0 || match === '-' || match === '_') {
            return '';
        }
        return index === 0 ? match.toLowerCase() : match.toUpperCase();
    });
}

// Function to load and parse a JSON file
async function loadJson(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
}

// Function to load and parse a Markdown file
async function loadMarkdown(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.text();
}
