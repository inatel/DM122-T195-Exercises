'use strict'

async function fetchFromNetwork(endpoint) {
  const response = await fetch(endpoint)
  addToCache(endpoint, response.clone())
  return await response.json()
}

async function setCacheLifeSpan(cache, key) {
  const timer = 1000 * 10 // 10 seconds
  setTimeout(() => cache.delete(key), timer)
}

async function addToCache(key, response) {
  const cache = await caches.open('MY-CACHE-KEY')
  cache.put(key, response)
  setCacheLifeSpan(cache, key)
}

async function fetchFromCache(endpoint) {
  const response = await caches.match(endpoint)
  const data = response && await response?.json()
  return data
}

const button = document.querySelector('button')
button.addEventListener('click', async () => {
  const pre = document.querySelector('pre')
  const endpoint = 'https://jsonplaceholder.typicode.com/todos/'
  const data = await fetchFromCache(endpoint) || await fetchFromNetwork(endpoint)
  pre.textContent = JSON.stringify(data, null, 2)
})
