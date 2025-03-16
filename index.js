// Import required modules
const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Create an Express application
const app = express();
app.use(express.json()); // Middleware to parse JSON request bodies

// Load GitHub API token from environment variables
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const HEADERS = { Authorization: `token ${GITHUB_TOKEN}` }; // Authorization header for GitHub API

/**
 * MCP endpoint to handle incoming commands.
 * Accepts commands such as "list_repos" and "create_repo" along with arguments.
 */
app.post('/mcp/query', async (req, res) => {
    const { command, arguments: args } = req.body; // Extract command and arguments from the request body

    try {
        switch (command) {
            case 'list_repos': {
                // Handle the "list_repos" command
                const username = args.username; // GitHub username
                const repos = await listRepos(username); // Fetch repositories
                res.json(repos); // Send the list of repositories as the response
                break;
            }
            case 'create_repo': {
                // Handle the "create_repo" command
                const { repo_name, description, topics } = args; // Extract repository details
                const message = await createRepo(repo_name, description, topics); // Create repository
                res.json({ message }); // Send success message as the response
                break;
            }
            default:
                // Handle unknown commands
                res.status(400).json({ error: 'Unknown command' });
        }
    } catch (error) {
        // Handle unexpected errors
        res.status(500).json({ error: error.message });
    }
});

/**
 * Function to list repositories of a GitHub user.
 * @param {string} username - GitHub username
 * @returns {Promise<Array>} - A list of repositories with details
 */
const listRepos = async (username) => {
    const url = `https://api.github.com/users/${username}/repos`; // GitHub API URL for user repositories
    const response = await axios.get(url, { headers: HEADERS }); // Perform GET request
    return response.data.map(repo => ({
        name: repo.name,
        url: repo.html_url,
        description: repo.description,
        language: repo.language,
        stars: repo.stargazers_count,
        topics: repo.topics
    })); // Transform and return repository details
};

/**
 * Function to create a new GitHub repository with name, description, and topics.
 * @param {string} repoName - Name of the repository
 * @param {string} description - Description of the repository
 * @param {Array} topics - List of topics/tags for the repository
 * @returns {Promise<string>} - Success message
 */
const createRepo = async (repoName, description, topics) => {
    const url = 'https://api.github.com/user/repos'; // GitHub API URL for creating a repository
    const payload = {
        name: repoName,
        description: description, // Set repository description
        topics: topics,           // Add topics as tags
        auto_init: true           // Initialize repository with a README file
    };

    const response = await axios.post(url, payload, { headers: HEADERS }); // Perform POST request
    if (response.status === 201) {
        return `Repository '${repoName}' created successfully!`; // Success response
    } else {
        throw new Error(`Failed to create repository: ${response.data.message}`); // Handle failure
    }
};

// Start the server on the specified port
const PORT = 5000; // Define the server's port number
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
