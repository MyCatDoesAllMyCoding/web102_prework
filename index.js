/*****************************************************************************
 * Challenge 2: Review the provided code. The provided code includes:
 * -> Statements that import data from games.js
 * -> A function that deletes all child elements from a parent element in the DOM
 */

// import the JSON data about the crowd funded games from the games.js file
import GAMES_DATA from "./games.js";

// create a list of objects to store the data about the games using JSON.parse
const GAMES_JSON = JSON.parse(GAMES_DATA);

// remove all child elements from a parent element in the DOM
function deleteChildElements(parent) {
  while (parent.firstChild) {
    // while loop
    parent.removeChild(parent.firstChild);
  }
}

/*****************************************************************************
 * Challenge 3: Add data about each game as a card to the games-container
 * Skills used: DOM manipulation, for loops, template literals, functions
 */

// grab the element with the id games-container
const gamesContainer = document.getElementById("games-container");

// create a function that adds all data from the games array to the page
function addGamesToPage(games) {
  // loop over each item in the data
  for (let i = 0; i < games.length; i++) {
    // create a new div element, which will become the game card
    let divElem = document.createElement("div");

    // add the class game-card to the list
    divElem.classList.add("game-card");

    // set the inner HTML using a template literal to display some info
    // about each game
    divElem.innerHTML = `
        <img src=${games[i].img} class="game-img" alt="Game's image." />
        <h2>${games[i].name}</h2>
        <p>${games[i].description}</p>
        <p>Backers: ${games[i].backers}</p>
        <p>Pledged: $${games[i].pledged.toLocaleString("en-US")}</p>
        <p>Goal: $${games[i].goal.toLocaleString("en-US")}</p>
        `;
    // TIP: if your images are not displaying, make sure there is space
    // between the end of the src attribute and the end of the tag ("/>")
    // append the game to the games-container
    gamesContainer.appendChild(divElem);
  }
}

// call the function we just defined using the correct variable
// later, we'll call this function using a different list of games

addGamesToPage(GAMES_JSON);

/*************************************************************************************
 * Challenge 4: Create the summary statistics at the top of the page displaying the
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: arrow functions, reduce, template literals
 */

// grab the contributions card element
const contributionsCard = document.getElementById("num-contributions");

// use reduce() on the GAMES_JSON array to count the number of total contributions made to the games by summing the backers
const totalContributions = GAMES_JSON.reduce((acc, game) => {
  return acc + game.backers;
}, 0);

// set the inner HTML using a template literal and toLocaleString to get a number with commas
contributionsCard.innerHTML = `${totalContributions.toLocaleString("en-US")}`;

// grab the amount raised card, then use reduce() to find the total amount raised
const raisedCard = document.getElementById("total-raised");

const totalRaised = GAMES_JSON.reduce((acc, game) => {
  return acc + game.pledged;
}, 0);

// set inner HTML using template literal
raisedCard.innerHTML = `$${totalRaised.toLocaleString("en-US")}`;

// grab the total number of games and display in gamesCard, set its inner HTML
const gamesCard = document.getElementById("num-games");

const totalGames = GAMES_JSON.reduce((acc) => {
  return acc + 1;
}, 0);

gamesCard.innerHTML = `${totalGames.toLocaleString("en-US")}`;

/*************************************************************************************
 * Challenge 5: Add functions to filter the funded and unfunded games
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: functions, filter
 */

// show only games that do not yet have enough funding
function filterUnfundedOnly() {
  deleteChildElements(gamesContainer);

  // use filter() to get a list of games that have not yet met their goal
  let unfundedGames = GAMES_JSON.filter((game) => {
    return game.pledged < game.goal;
  });

  // use the function we previously created to add the unfunded games to the DOM
  addGamesToPage(unfundedGames);
}

// show only games that are fully funded
function filterFundedOnly() {
  deleteChildElements(gamesContainer);

  // use filter() to get a list of games that have met or exceeded their goal
  let fundedGames = GAMES_JSON.filter((game) => {
    return game.pledged >= game.goal;
  });

  // use the function we previously created to add funded games to the DOM
  addGamesToPage(fundedGames);
}

// show all games
function showAllGames() {
  deleteChildElements(gamesContainer);

  // add all games from the JSON data to the DOM
  addGamesToPage(GAMES_JSON);
}

// select each button in the "Our Games" section
const unfundedBtn = document.getElementById("unfunded-btn");
const fundedBtn = document.getElementById("funded-btn");
const allBtn = document.getElementById("all-btn");

// add event listeners with the correct functions to each button
document
  .getElementById("funded-btn")
  .addEventListener("click", filterFundedOnly);
document
  .getElementById("unfunded-btn")
  .addEventListener("click", filterUnfundedOnly);
document.getElementById("all-btn").addEventListener("click", showAllGames);

/*************************************************************************************
 * Challenge 6: Add more information at the top of the page about the company.
 * Skills used: template literals, ternary operator
 */

// grab the description container
const descriptionContainer = document.getElementById("description-container");

// use filter or reduce to count the number of unfunded games
const totalUnfunded = GAMES_JSON.reduce((acc, game) => {
  if (game.pledged < game.goal) {
    acc++;
  }
  return acc;
}, 0);

// create a string that explains the number of unfunded games using the ternary operator
let numUnfundedStr = `A total of $${totalRaised} has been raised for ${totalGames} games.
Currently, ${totalUnfunded} ${
  totalUnfunded == 1 ? "game remains" : "games remain"
} unfunded. We need your help to fund these amazing games!`;

// create a new DOM element containing the template string and append it to the description container
let unFundedStr = document.createElement("p");

unFundedStr.innerHTML = `${numUnfundedStr}`;

descriptionContainer.appendChild(unFundedStr);

/************************************************************************************
 * Challenge 7: Select & display the top 2 games
 * Skills used: spread operator, destructuring, template literals, sort
 */

const firstGameContainer = document.getElementById("first-game");
const secondGameContainer = document.getElementById("second-game");

const sortedGames = GAMES_JSON.sort((item1, item2) => {
  return item2.pledged - item1.pledged;
});

// use destructuring and the spread operator to grab the first and second games
let [first, second, ...rest] = sortedGames;

// create a new element to hold the name of the top pledge game, then append it to the correct element
let firstGame = document.createElement("p");
firstGame.innerHTML = `${first.name}`;

firstGameContainer.appendChild(firstGame);

// do the same for the runner up item
let secondGame = document.createElement("p");
secondGame.innerHTML = `${second.name}`;

secondGameContainer.appendChild(secondGame);

/************************************************************************************
 * Extra: Search Functionality
 * If you type a game's title in the search bar and use the search button,
 * the page will display a duplicate of the game-card you wanted to see- but at the top.
 */

const input = document.getElementById("searchInput");
const resultsContainer = document.getElementById("results");

// create a function that adds search results to the results container
function addSearchResultsToPage(searchResults) {
  // loop over each item in the search results
  for (let i = 0; i < searchResults.length; i++) {
    // create a new div element, which will become the search result card
    let divElem = document.createElement("div");

    // add the class game-card to the list
    divElem.classList.add("game-card");

    // set the inner HTML using a template literal to display some info
    // about each search result
    divElem.innerHTML = `
          <img src=${
            searchResults[i].img
          } class="game-img" alt="Game's image." />
          <h2>${searchResults[i].name}</h2>
          <p>${searchResults[i].description}</p>
          <p>Backers: ${searchResults[i].backers}</p>
          <p>Pledged: $${searchResults[i].pledged.toLocaleString("en-US")}</p>
          <p>Goal: $${searchResults[i].goal.toLocaleString("en-US")}</p>
          `;

    // append the search result to the results container
    resultsContainer.appendChild(divElem);
  }
}

// modify the displayResults function to handle both all games and search results
function displayResults(input) {
  // clear previous results
  deleteChildElements(resultsContainer);

  // only show results when the search input matches a game's name
  if (input.trim() !== "") {
    // filter games based on the search input
    const filteredGames = GAMES_JSON.filter((game) =>
      game.name.toLowerCase().includes(input.toLowerCase())
    );

    // display the search results
    addSearchResultsToPage(filteredGames);
  }
}

// add event listener for the search button
document.getElementById("searchButton").addEventListener("click", () => {
  const input = document.getElementById("searchInput").value;
  displayResults(input);
});
