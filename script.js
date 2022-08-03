const CLIENT_ID = 'f96386491d6645c8836c02605303c3ef';
const CLIENT_SECRET = 'adfc72c162e84b989235cf4d9a3cd3c3';
let token;

//HELPERS

const getElementOrClosest = (sectionClass, target) => 
 target.classList.contains(sectionClass) ? target: target.closest(sectionClass);

 const clearSelectedItem  = (containerSelector) => {
  const element = document.querySelector(`${containerSelector} .item-selected`);

  if(element) {
    element.classList.remove('item-selected');
  }
 };

 const clearPlaylists = () => {
  const element = document.querySelector(`.playlist-cards`);
  element.innerHTML = '';
 }

 const clearTracks = () => {
  const element = document.querySelector(`.tracks-cards`);
  element.innerHTML = '';
 }

//HANDLERS

const handleGenreCardClick = async ({ target }) => {
  const genreSection = getElementOrClosest('.genre', target);
  const id = genreSection.id;
  clearSelectedItem('.genre-cards');
  genreSection.classList.add('item-selected');

  const playlists = await getPlaylists(token, id);
  clearPlaylists();
  renderPlaylists(playlists);
};

const handlePlaylistCardClick = async ({ target }) => {
  const PlaylistSection = getElementOrClosest('.playlist', target);
  const id = PlaylistSection.id;
  clearSelectedItem('.playlist-cards');
  PlaylistSection.classList.add('item-selected');

  const tracks = await getTracks(token, id);
  clearTracks();
  renderTracks(tracks);
};

const handleTrackCardClick = async ({ target }) => {
  const trackSection = getElementOrClosest('.track', target);
  const id = trackSection.id;
  clearSelectedItem('.tracks-cards');
  trackSection.classList.add('item-selected');

  const player = document.querySelector('#player');
  if (player) {
    player.querySelector('source').src = trackSection.value;
    player.load();
  } else {
    createPlayer(trackSection.value)
  }
  document.querySelector('#playing-music-name').innerHTML = target.innerText;
};

// RESQUESTS

const getToken = async () => {
  const requestInfo = {
    method: 'POST',
    headers: {
      Authorization: 'Basic ' + btoa(CLIENT_ID + ':' + CLIENT_SECRET),
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'grant_type=client_credentials',
  };

  const response = await fetch(`https://accounts.spotify.com/api/token`, requestInfo);
  const data = await response.json();
  return data.access_token;
};

const getGenres = async (token) => {
  const requestInfo = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    }
  };

  const url = 'https://api.spotify.com/v1/browse/categories?locale=pt-br';
  const response = await fetch(url, requestInfo)
  const data = await response.json();
  return data.categories.items;
}

const getPlaylists = async (token, genreId) => {
  const requestInfo = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    }
  };

  const url = `https://api.spotify.com/v1/browse/categories/${genreId}/playlists`;
  const response = await fetch(url, requestInfo)
  const data = await response.json();
  return data.playlists.items;
};

const getTracks = async (token, playlistId) => {
  const requestInfo = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    }
  };

  const url = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;
  const response = await fetch(url, requestInfo)
  const data = await response.json();
  return data.items;
}

// RENDERS

const renderGenrs = (genres) => {
  const genresCards = document.querySelector('.genre-cards');
  genres.forEach((genre) => {
    const section = document.createElement('section');
    section.className = 'genre'
    section.id = genre.id;

    const paragraph = document.createElement('p');
    paragraph.className = 'genre-title';
    paragraph.innerHTML = genre.name;

    const img = document.createElement('img');
    img.className = 'genre-image';
    img.src = genre.icons[0].url;

    section.appendChild(img);
    section.appendChild(paragraph);
    section.addEventListener('click', handleGenreCardClick);

    genresCards.appendChild(section);
  })
};

const renderPlaylists = (playlists) => {
  const playlistsCards = document.querySelector('.playlist-cards');
  playlists.forEach((playlist) => {
    const section = document.createElement('section');
    section.className = 'playlist text-card'
    section.id = playlist.id;

    const paragraph = document.createElement('p');
    paragraph.className = 'playlist-title';
    paragraph.innerHTML = playlist.name;

    section.appendChild(paragraph);
    section.addEventListener('click', handlePlaylistCardClick);

    playlistsCards.appendChild(section);
  })
};

const renderTracks = (tracks) => {
  const tracksCards = document.querySelector('.tracks-cards');
  tracks.forEach((track) => {
    const section = document.createElement('section');
    section.className = 'track text-card'
    section.id = track.id;

    const paragraph = document.createElement('p');
    paragraph.className = 'track-title';
    paragraph.innerHTML = track.track.name;
    section.value = track.track.preview_url;

    section.appendChild(paragraph);
    section.addEventListener('click', handleTrackCardClick);

    tracksCards.appendChild(section);
  })
};

const createPlayer = (src) => {
  const audio = document.createElement('audio');
  audio.controls = true;
  audio.autoplay = true;
  audio.id = 'player';

  const source = document.createElement('source');
  source.src = src;
  audio.appendChild(source);

  document.querySelector('.player-container').appendChild(audio);
  return audio;
};

window.onload = async () => {
  try {
 token = await getToken();
 const genres = await getGenres(token);
 renderGenrs(genres);
  } catch (error) {
    console.log(error);
  }
}