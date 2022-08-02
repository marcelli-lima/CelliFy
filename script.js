const CLIENT_ID = 'f96386491d6645c8836c02605303c3ef';
const CLIENT_SECRET = 'adfc72c162e84b989235cf4d9a3cd3c3';
let token;

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

window.onload = async () => {
 token = await getToken();
 const genres = await getGenres(token);
 console.log(genres);
}