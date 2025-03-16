# MCP Server with GitHub Integration

This project implements a **Model Context Protocol (MCP)** server, enabling an AI assistant (like Claude) to interact with GitHub via natural language commands. The server uses Node.js, Express, and the GitHub API to perform tasks like listing repositories and creating repositories.

---

## Features
- **MCP Implementation**: A server to handle MCP commands such as `list_repos` and `create_repo`.
- **GitHub API Integration**: Interact with GitHub to list repositories, create repositories, and more.
- **AI Assistant Compatibility**: Designed to integrate with an AI assistant like Claude for natural language interaction.

---

## Prerequisites
Before running this project, ensure you have:
1. **Node.js**: Install Node.js from [here](https://nodejs.org/).
2. **GitHub Personal Access Token**:
   - Follow [GitHub's guide](https://docs.github.com/en/rest/authentication/authenticating-to-the-rest-api) to create a token.
   - Enable required scopes: `repo` for full repository access or `public_repo` for public repositories.

---

## Installation
1. Clone this repository:
   ```bash
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```bash
   cd mcp-github-server
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

---

## Configuration
Create a `.env` file in the project root and add your GitHub token:
   ```
   GITHUB_TOKEN=your_github_token
   ```

---

## Endpoints
The server provides the following endpoints:

### 1. `/mcp/query`
- **Method**: POST
- **Description**: Handles MCP commands and interacts with GitHub.
- **Request Body** (example for `create_repo`):
  ```json
  {
      "command": "create_repo",
      "arguments": {
          "repo_name": "awesome-project",
          "description": "A repository to showcase the awesomeness of Node.js projects.",
          "topics": ["nodejs", "open-source", "example"]
      }
  }
  ```
- **Response** (success):
  ```json
  {
      "message": "Repository 'awesome-project' created successfully!"
  }
  ```

---

## How to Test with Postman
1. Open **Postman** and set up a new `POST` request.
2. Use the endpoint URL:
   ```
   http://localhost:5000/mcp/query
   ```
3. Add the following headers:
   - `Content-Type`: `application/json`
   - `Authorization`: `Bearer your_github_token`
4. In the "Body" tab, input the JSON payload for the desired command (e.g., `create_repo`):
   ```json
   {
       "command": "create_repo",
       "arguments": {
           "repo_name": "awesome-project",
           "description": "A repository to showcase the awesomeness of Node.js projects.",
           "topics": ["nodejs", "open-source", "example"]
       }
   }
   ```
5. Send the request and inspect the response.

---

## How AI (like Claude) Interacts
1. **Natural Language Input**: The user gives a command, such as:
   > "Can you create a GitHub repository named 'awesome-project'?"
2. **MCP Command**: The AI converts the input into a structured JSON command, like:
   ```json
   {
       "command": "create_repo",
       "arguments": {
           "repo_name": "awesome-project",
           "description": "This is an awesome repository created via the MCP server.",
           "topics": ["nodejs", "tutorial", "example"]
       }
   }
   ```
3. **Server Response**: The AI sends the MCP command to the server, which interacts with GitHub and returns a response.
4. **AI Output**: The AI interprets the server's response and replies to the user with the result.

---

## Example MCP Commands
### List Repositories:
```json
{
    "command": "list_repos",
    "arguments": {
        "username": "octocat"
    }
}
```

### Create Repository:
```json
{
    "command": "create_repo",
    "arguments": {
        "repo_name": "awesome-project",
        "description": "An awesome project repository",
        "topics": ["nodejs", "example", "open-source"]
    }
}
```

---

## Running the Server
Start the server using:
```bash
node index.js
```
The server runs on `http://localhost:5000` by default.

---