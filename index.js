// index.js
const weatherApi = "https://api.weather.gov/alerts/active?area="

// Your code here!

const form = document.getElementById("weather-form");
const stateInput = document.getElementById("state-input");
const alertsElement = document.getElementById("alerts-display");
const errorElement = document.getElementById("error-message");
const spinnerElement = document.getElementById("loading-spinner");

const submitButton = form.querySelector('button[type="submit"]');

function showLoadingSpinner() {
    spinnerElement.classList.remove("hidden");
    spinnerElement.style.display = "block";
    submitButton.disabled = true;
}

function hideLoadingSpinner() {
    spinnerElement.classList.add("hidden");
    spinnerElement.style.display = "none";
    submitButton.disabled = false;
}

function displayError(message) {
    errorElement.textContent = message;
    errorElement.classList.remove("hidden");
    errorElement.classList.add("error");
    errorElement.hidden = false;
}

function clearError() {
    errorElement.textContent = "";
    errorElement.classList.remove("error");
    errorElement.classList.add("hidden");
    errorElement.hidden = true;
}

async function fetchWeatherAlerts(stateAbbr) {
    const state = stateAbbr.trim().toUpperCase();

    if (!/^[A-Z]{2}$/.test(state)) {
        throw new Error("Please enter a valid two-letter state abbreviation.");
    }

    const response = await fetch(
        `https://api.weather.gov/alerts/active?area=${state}`
    );

    if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
    }

    return await response.json();
}

function displayAlerts(data) {
    alertsElement.replaceChildren();

    const alerts = Array.isArray(data.features) ? data.features : [];

    const summary = document.createElement("h2");
    summary.textContent = `${data.title || "Weather Alerts"}: ${alerts.length}`;
    alertsElement.appendChild(summary);

    if (alerts.length === 0) {
        const message = document.createElement("p");
        message.textContent = "There are currently no active weather alerts.";
        alertsElement.appendChild(message);
        return;
    }

    const list = document.createElement("ul");

    alerts.forEach((alert) => {
        const item = document.createElement("li");
        item.textContent =
            alert.properties?.headline || "Headline unavailable";
        list.appendChild(item);
    });

    alertsElement.appendChild(list);
}

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const state = stateInput.value.trim().toUpperCase();

    // Clear old results and errors.
    alertsElement.replaceChildren();
    clearError();

    // Clear the input after submission.
    stateInput.value = "";

    try {
        showLoadingSpinner();

        const data = await fetchWeatherAlerts(state);
        displayAlerts(data);

        clearError();
    } catch (error) {
        displayError(error.message || "An unexpected error occurred.");
    } finally {
        hideLoadingSpinner();
    }
});
