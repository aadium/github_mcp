const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(express.json());

// GitHub API token
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const HEADERS = { Authorization: `token ${GITHUB_TOKEN}` };

// MCP endpoint
app.post('/mcp/query', async (req, res) => {
    const { command, arguments: args } = req.body;

    try {
        if (command === 'list_repos') {
            const username = args.username;
            const repos = await listRepos(username);
            res.json(repos);
        } else if (command === 'create_repo') {
            const repoName = args.repo_name;
            const message = await createRepo(repoName);
            res.json({ message });
        } else {
            res.status(400).json({ error: 'Unknown command' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Function to list repositories of a GitHub user
const listRepos = async (username) => {
    const url = `https://api.github.com/users/${username}/repos`;
    const response = await axios.get(url, { headers: HEADERS });
    return response.data.map(repo => ({ name: repo.name, url: repo.html_url, description: repo.description, language: repo.language, stars: repo.stargazers_count, topics: repo.topics }));
};

// Function to create a new repository with name, description, and topics
const createRepo = async (repoName, description, topics) => {
    const url = 'https://api.github.com/user/repos';
    const payload = {
        name: repoName,
        description: description,  // Adding a description to the repository
        topics: topics,            // Adding topics (GitHub's API allows topics in an array format)
        auto_init: true            // Automatically initializes the repository with a README
    };

    const response = await axios.post(url, payload, { headers: HEADERS });
    if (response.status === 201) {
        return `Repository '${repoName}' created successfully!`;
    } else {
        throw new Error(`Failed to create repository: ${response.data.message}`);
    }
};

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
