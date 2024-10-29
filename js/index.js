document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('github-form');
    const userList = document.getElementById('user-list');
    const reposList = document.getElementById('repos-list');
    const toggleButton = document.getElementById('toggle-button');
    let searchType = 'user'; // Toggle between 'user' and 'repo'
  
    toggleButton.addEventListener('click', () => {
      searchType = searchType === 'user' ? 'repo' : 'user';
      toggleButton.textContent = `Search by: ${searchType === 'user' ? 'User' : 'Repository'}`;
    });
  
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const searchQuery = document.getElementById('search').value.trim();
      if (searchQuery) {
        userList.innerHTML = '';
        reposList.innerHTML = '';
  
        if (searchType === 'user') {
          searchUsers(searchQuery);
        } else {
          searchRepos(searchQuery);
        }
      }
    });
  
    async function searchUsers(query) {
      try {
        const response = await fetch(`https://api.github.com/search/users?q=${query}`, {
          headers: { Accept: 'application/vnd.github.v3+json' }
        });
        const data = await response.json();
        displayUsers(data.items);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    }
  
    async function searchRepos(query) {
      try {
        const response = await fetch(`https://api.github.com/search/repositories?q=${query}`, {
          headers: { Accept: 'application/vnd.github.v3+json' }
        });
        const data = await response.json();
        displayRepos(data.items);
      } catch (error) {
        console.error('Error fetching repositories:', error);
      }
    }
  
    function displayUsers(users) {
      users.forEach(user => {
        const userItem = document.createElement('li');
        userItem.innerHTML = `
          <img src="${user.avatar_url}" alt="${user.login}'s avatar" width="50">
          <p><strong>${user.login}</strong></p>
          <a href="${user.html_url}" target="_blank">View Profile</a>
          <button onclick="fetchUserRepos('${user.login}')">View Repos</button>
        `;
        userList.appendChild(userItem);
      });
    }
  
    async function fetchUserRepos(username) {
      reposList.innerHTML = '';
      try {
        const response = await fetch(`https://api.github.com/users/${username}/repos`, {
          headers: { Accept: 'application/vnd.github.v3+json' }
        });
        const repos = await response.json();
        displayRepos(repos);
      } catch (error) {
        console.error('Error fetching repositories:', error);
      }
    }
  
    function displayRepos(repos) {
      repos.forEach(repo => {
        const repoItem = document.createElement('li');
        repoItem.innerHTML = `<a href="${repo.html_url}" target="_blank">${repo.name}</a>`;
        reposList.appendChild(repoItem);
      });
    }
  });
  