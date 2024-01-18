const apiUrl = 'https://api.github.com/users/';

async function fetchRepositoriesAndUser(username, page = 1, perPage = 10) {
  const reposResponse = await fetch(`${apiUrl}${username}/repos?page=${page}&per_page=${perPage}`);
  const userResponse = await fetch(`${apiUrl}${username}`);
  
  const [repositories, userDetails] = await Promise.all([reposResponse.json(), userResponse.json()]);
  
  return { repositories, userDetails };
}

// Update the displayProfile function to handle the new structure
function displayProfile(userDetails) {
  const profileImageContainer = document.getElementById('profile-image');
  const profileBioContainer = document.getElementById('profile-bio');
  const githubLinkContainer = document.getElementById('githubLink'); // New container

  profileImageContainer.innerHTML = '';
  profileBioContainer.innerHTML = '';
  githubLinkContainer.innerHTML = ''; // Clear existing content

  // Check if the user details include an avatar_url
  if (userDetails.avatar_url) {
    const profileImage = document.createElement('img');
    const imageURL = userDetails.avatar_url.replace('http://', 'https://');

    profileImage.src = imageURL;
    profileImage.alt = 'Profile Image';
    profileImage.className = 'img-fluid';

    console.log('Avatar URL:', imageURL);

    profileImage.addEventListener('error', () => {
      console.error('Error loading profile image:', imageURL);
    });

    profileImageContainer.appendChild(profileImage);
  }

  // Bio details
  const bioHeading = document.createElement('h2');
  bioHeading.textContent = userDetails.name || 'User';

  const bioText = document.createElement('p');
  bioText.textContent = userDetails.bio || 'Bio goes here';

  const locationText = document.createElement('p');
  locationText.textContent = `Location: ${userDetails.location || 'N/A'}`;

  const twitterLink = document.createElement('p');
  if (userDetails.twitter_username) {
    const twitterAnchor = document.createElement('a');
    twitterAnchor.href = `https://twitter.com/${userDetails.twitter_username}`;
    twitterAnchor.textContent = `Twitter: @${userDetails.twitter_username}`;
    twitterLink.appendChild(twitterAnchor);
  } else {
    twitterLink.textContent = 'Twitter: N/A';
  }

  profileBioContainer.appendChild(bioHeading);
  profileBioContainer.appendChild(bioText);
  profileBioContainer.appendChild(locationText);
  profileBioContainer.appendChild(twitterLink);

  // GitHub link
  const githubLink = document.createElement('a');
  githubLink.href = userDetails.html_url;
  githubLink.target = '_blank';

  const linkLogo = document.createElement('img');
 
  githubLink.appendChild(linkLogo);
  githubLink.appendChild(document.createTextNode(githubLink));

  githubLinkContainer.appendChild(githubLink);
}

  
  function displayRepositories(repositories) {
    const repoContainer = document.getElementById('repoList');
    repoContainer.innerHTML = '';
  
    repositories.forEach(repo => {
      const card = document.createElement('div');
      card.className = 'card mb-3';
  
      const cardBody = document.createElement('div');
      cardBody.className = 'card-body';
  
      const title = document.createElement('h5');
      title.className = 'card-title';
      title.textContent = repo.name;
  
      const description = document.createElement('p');
      description.className = 'card-description';
      description.textContent = repo.description || 'No description available';
  
      const topicsContainer = document.createElement('div');
      topicsContainer.className = 'topics-container';
  
      if (repo.topics && repo.topics.length > 0) {
        repo.topics.forEach(topic => {
          const topicButton = document.createElement('button');
          topicButton.className = 'btn btn-primary btn-sm mr-2 ml-2 mt-2';
          topicButton.textContent = topic;
  
          topicsContainer.appendChild(topicButton);
        });
      } else {
        const noTopics = document.createElement('span');
        noTopics.textContent = 'No topics';
        topicsContainer.appendChild(noTopics);
      }
  
      cardBody.appendChild(title);
      cardBody.appendChild(description);
      cardBody.appendChild(topicsContainer);
  
      card.appendChild(cardBody);
      repoContainer.appendChild(card);
    });
  }
  

function displayPagination(totalPages, currentPage) {
  const pagination = document.querySelector('.pagination');
  pagination.innerHTML = '';

  for (let i = 1; i <= totalPages; i++) {
    const pageItem = document.createElement('li');
    pageItem.className = `page-item ${i === currentPage ? 'active' : ''}`;

    const pageLink = document.createElement('a');
    pageLink.className = 'page-link';
    pageLink.href = '#';
    pageLink.textContent = i;

    pageLink.addEventListener('click', () => loadRepositories(i));

    pageItem.appendChild(pageLink);
    pagination.appendChild(pageItem);
  }
}

function loadRepositoriesByUsername() {
  const usernameInput = document.getElementById('searchInput');
  const username = usernameInput.value.trim();

  if (!username) {
    console.error('Please enter a GitHub username');
    return;
  }

  loadRepositories(1, username);
}

function showLoader(loaderId) {
    const loader = document.getElementById(loaderId);
    loader.style.display = 'block';
  }
  
  function hideLoader(loaderId) {
    const loader = document.getElementById(loaderId);
    loader.style.display = 'none';
  }

function loadRepositories(page, username) {
  const perPage = 10;

  fetchRepositoriesAndUser(username, page, perPage)
    .then(data => {
      displayRepositories(data.repositories);
      displayProfile(data.userDetails);

      const totalPages = Math.ceil(data.userDetails.public_repos / perPage);
      displayPagination(totalPages, page);
    })
    .catch(error => console.error('Error fetching repositories and user details:', error));
}

document.addEventListener('DOMContentLoaded', () => {
  loadRepositories(1, 'TencentARC');
});

document.addEventListener('DOMContentLoaded', () => {
  const searchButton = document.querySelector('.search-button');
  searchButton.addEventListener('click', loadRepositoriesByUsername);
});
