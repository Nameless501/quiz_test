import { apiBaseUrl } from "../utils/constants";

// post data to mock API service (JSONPlaceholder)

export function postQuizData(data) {
  return fetch(`${apiBaseUrl}/posts`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  })
    .then(res => res.ok ? res.json() : Promise.reject(res.status))
}
