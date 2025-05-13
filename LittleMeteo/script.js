// Definizione delle costanti per l'accesso all'API OpenWeatherMap
const API_KEY = '3b932798b70ef18d516be6323f856ed2'; // Chiave API personale
const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5'; // URL base dell'API

// Acquisizione degli elementi DOM per la manipolazione
const cityInput = document.getElementById('city-input'); // Campo di input per la città
const searchBtn = document.getElementById('search-btn'); // Pulsante di ricerca
const weatherContainer = document.getElementById('weather-container'); // Contenitore per i dati meteo
const errorMessage = document.getElementById('error-message'); // Elemento per messaggi di errore

// Funzione asincrona per ottenere i dati meteo dalla API
async function getWeatherData(city) {
  try {
    // Nasconde eventuali messaggi di errore precedenti
    errorMessage.style.display = 'none';
    
    // Effettua la chiamata API usando fetch con async/await
    // Parametri: città cercata, API key, unità metriche, lingua italiana
    const response = await fetch(`${WEATHER_API_URL}/weather?q=${city}&appid=${API_KEY}&units=metric&lang=it`);
    
    // Verifica se la risposta è valida, altrimenti lancia un errore
    if (!response.ok) {
      throw new Error('Città non trovata. Controlla il nome e riprova.');
    }
    
    // Converte la risposta in formato JSON
    const data = await response.json();
    // Chiama la funzione per visualizzare i dati
    displayWeatherData(data);
  } catch (error) {
    // Gestione degli errori: mostra il messaggio e nasconde il contenitore meteo
    errorMessage.textContent = error.message;
    errorMessage.style.display = 'block';
    weatherContainer.style.display = 'none';
  }
}

// Funzione per visualizzare i dati meteo nella UI
function displayWeatherData(data) {
  // Rende visibile il contenitore dei dati meteo
  weatherContainer.style.display = 'block';
  
  // Estrae e prepara i dati per la visualizzazione
  const weatherIcon = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`; // URL dell'icona meteo
  const temperature = Math.round(data.main.temp); // Temperatura arrotondata
  const feelsLike = Math.round(data.main.feels_like); // Temperatura percepita arrotondata
  const humidity = data.main.humidity; // Percentuale di umidità
  const windSpeed = Math.round(data.wind.speed * 3.6); // Conversione velocità vento da m/s a km/h
  
  // Aggiorna il contenuto HTML del contenitore con i dati meteo
  weatherContainer.innerHTML = `
    <div class="weather-info">
      <div class="city-name">${data.name}, ${data.sys.country}</div>
      <img src="${weatherIcon}" alt="${data.weather[0].description}" class="weather-icon">
      <div class="temperature">${temperature}°C</div>
      <div class="weather-description">${data.weather[0].description}</div>
      
      <div class="weather-details">
        <div class="detail">
          <i class="fas fa-thermometer-half"></i>
          <span>Percepita: ${feelsLike}°C</span>
        </div>
        <div class="detail">
          <i class="fas fa-tint"></i>
          <span>Umidità: ${humidity}%</span>
        </div>
        <div class="detail">
          <i class="fas fa-wind"></i>
          <span>Vento: ${windSpeed} km/h</span>
        </div>
      </div>
    </div>
  `;
}

// Event listener per il click sul pulsante di ricerca
searchBtn.addEventListener('click', () => {
  const city = cityInput.value.trim(); // Ottiene il valore inserito rimuovendo spazi
  if (city) { // Verifica che sia stato inserito un valore
    getWeatherData(city); // Chiama la funzione per ottenere i dati meteo
  } else { // Se il campo è vuoto
    errorMessage.textContent = 'Inserisci il nome di una città.'; // Imposta messaggio errore
    errorMessage.style.display = 'block'; // Mostra messaggio errore
    weatherContainer.style.display = 'none'; // Nasconde contenitore meteo
  }
});

// Event listener per la pressione del tasto Enter nel campo di input
cityInput.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') { // Verifica se il tasto premuto è Enter
    const city = cityInput.value.trim(); // Ottiene il valore inserito
    if (city) { // Verifica che sia stato inserito un valore
      getWeatherData(city); // Chiama la funzione per ottenere i dati meteo
    } else { // Se il campo è vuoto
      errorMessage.textContent = 'Inserisci il nome di una città.'; // Imposta messaggio errore
      errorMessage.style.display = 'block'; // Mostra messaggio errore
      weatherContainer.style.display = 'none'; // Nasconde contenitore meteo
    }
  }
});