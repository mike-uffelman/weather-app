# weather-app

[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]

<!-- PROJECT LOGO -->
<br />
<div align="center">

<h3 align="center">weather-app</h3>
<br>
  <p align="center">
    A responsive weather dashboard and mobile app.
    <br />
    <a href="https://main--cranky-booth-057572.netlify.app/">View Demo</a>
    ·
    <a href="https://github.com/mike-uffelman/weather-app/issues">Report Bug</a>
    ·
    <a href="https://github.com/mike-uffelman/weather-app/issues">Request Feature</a>
  </p>
</div>
<br>

<!-- TABLE OF CONTENTS -->

## Table of Contents

<details>
  <summary>Weather App</summary>
  <ul>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li><a href="#getting-started">Getting Started</a></li>
    <li><a href="#background-and-discussion">Background & Discussion</a></li>
    <li><a href="#architecture-and-design">Architecture & Design</a></li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#going-forward">Going Forward</a></li>
    <li><a href="#considerations">Considerations</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ul>
</details>
<br>
<!-- ABOUT THE PROJECT -->

## About The Project

This is a weather app project built primarily using vanilla JavaScript, it also utilizes many packages and resources for specialized features including OpenWeather API for weather data, Leaflet for maps, and OpenStreetMap for map tiling.

Under the hood, it's a Model-View-Controller(MVC) architecture utilizing modules and parcel.js to implement the build. [Demo the app here](https://main--cranky-booth-057572.netlify.app/).

The app styling was built using Sass as a preprocessor to CSS to take advantage of the mixins, nesting, and other features.

### Basic Usage

- The user provides a location and the app retrieves and displays the current weather, a current weather map, hourly forecasts, weekly forecasts, and current weather alerts.

- The user is able search for locations via text input of city, state(only for USA), country code (e.g. "london, gb" or "reno, nv, us") or by selecting a location on the map in the search form.

- The user can also bookmark a location for ease of lookup, which will be stored in the local storage of the browser.

- The user may resize the viewport and view the app in a mobile or desktop/dashboard layout.

<br><br>

[![weather showcase][product-screenshot]]('./images/weather-showcase.png')

<br>

## Built With

| Technology Stack                               | Description                               |
| ---------------------------------------------- | ----------------------------------------- |
| JavaScript                                     |                                           |
| [OpenWeather API](https://openweathermap.org/) | Weather and geocoding                     |
| [Leaflet](https://leafletjs.com/)              | open-source JavaScript maps               |
| [uuid](https://www.npmjs.com/package/uuid)     | **U**niversally **U**nique **ID**entifier |
| [Parcel.js](https://parceljs.org/)             | build tool                                |
| [Sass](https://sass-lang.com/)                 | stylesheet and style compiler             |

<p align="right">(<a href="#weather-app">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

Open the [live demo here](https://main--cranky-booth-057572.netlify.app/), or clone the repository, (node and npm are required).

Install npm packages

```
npm install
```

Start Server

```
npm start
```

Navigate to localhost

```
localhost:8080
```

<p align="right">(<a href="#weather-app">back to top</a>)</p>

## Background and Discussion

This is a project I've been working on to refine my skills as a front end developer. Initially, the project scope was limited to forms and API calls using OpenWeatherMap. Over time the scope evolved and expanded to include a responsive dashboard layout, maps, search, bookmarks, and help functionality. Concepts incorporated included Model-View-Controller(MVC) architecture, mobile-first layout, SASS, reusable CSS components, state variable, ES6, modules, and error/action messaging to name a few.

Upon load the user can select to allow or block their current location, by allowing their browser location the app will fetch your current weather and render the weather page. A blocked location will allow the user search for or load a previously saved location to be fetched and rendered.

### Challenges

Throughout the development of this project, there were many challenges that arose, from layout headaches to broken functionality.

- <details>
  <summary>Navigation & Menu Positioning</summary>
    <ul>The application is built with a Model View Controller (MVC) architecture pattern to isolate and organize the flow control, logic, and view modules.</ul>
  </details>
- <details>
    <summary>Refactoring and Creating CSS components</summary>
      <ul>Refactoring common styles into components, modularizing scss, using class prefixing. This proved to be a pretty difficult challenge, recognizing repeated CSS, and determining the property names and structures to ensure the ability reuse classes took some time to figure out. There is still some refactoring that could be achieved, but the main components have been refactored.</ul>
  </details>

- <details>
    <summary>Scope Creep</summary>
      <ul>A very important lesson learned while building this project was that planning is the most important step, and should be done early in the build (ideally before you begin). Since this is a practice project, it was very easy to expand the scope of the project on the fly as I learned new concepts and technologies. This resulted in excessive scope creep on the original intention of the project, and likely resulted in a messier final (for now) application. In summary, I learned that a truely well developed application is planned and limited in scope to ensure features are executed correctly.</ul>
  </details>

- <details>
    <summary>More...</summary>
    <p></p>
  </details>

## Architecture and Design

#### Architecture

- The application is built with a Model View Controller (MVC) architecture pattern to isolate and organize the flow control, logic, and view modules.
- Using a global state variable to control the application state. This variable stores the user's search query, geolocation (if enabled), current weather location results, and the bookmarked locations. Doing so keeps all the relevant data in one place that is easy to reference throughout the code.
  - Note: After learning React, upon a revisit to this application, I realized that much of the design and execution of the application could have been done more efficiently in React as many similar concepts are used, i.e. components and state.
- Publisher/Subscriber Patterns -
- Form Validation

<br>

#### Design

The layout of this app has been designed mobile first such that it works well on a mobile sized viewport and when the viewport size is detected larger (i.e. tablet or desktop) the layout will switch to a grid-like dashboard.

- mobile with swipe navigation
- desktop and larger screens dashboard layout

  <br><br>

<p align="right">(<a href="#weather-app">back to top</a>)</p>

<!-- USAGE EXAMPLES -->

## Usage

This is the basic usage of the application:

### App Start

- On load, the user will be prompted to allow or block their location.

  - If allowed, the application will automatically retrieve and display the weather.
  - If blocked, the application will allow the user to search for a location or open a previously saved location from their favorites.
    <br>

### Search

- To search, the user must select the search type radio button (i.e. location name or map location). Then provides the location name in the text input (e.g. "london, gb" or "reno, nv, us") or click and pin a location on the map (as seen in the screenshot).

  [![Password Generator ouput screenshot][form-screenshot]]('public/images/search-form.png')

### Bookmark a location

- To bookmark a location the user must click the location name or bookmark icon in the current weather box.

  [![Bookmark the location][bookmark-location]]('./images/bookmark-location.png')

### Remove a bookmarked location

- Clicking an already bookmarked location's header (title or bookmark icon) will remove the location from the bookmarks.
- The use may also remove a bookmark by clicking the red icon to the right of a location in the bookmarked locations view.

### Load Bookmark

- To load a bookmark, the user must select the desired location (if previously bookmarked).

  [![Bookmarks screenshot][bookmarks-screenshot]]('public/images/bookmark-location.png')

### Navigation

- In the mobile view, the user may swipe left and right to navigate to the search and bookmarked locations views or select the menu toggle on the bottom and use the icons displayed.

  [![Mobile-navigation][mobile-nav]]('public/images/mobile-nav.png')

- On a larger viewport or desktop, the user can use the menu toggle which will display the navigation icons.

  [![Desktop-navigation][desktop-nav]]('public/images/desktop-nav.png')

<p align="right">(<a href="#weather-app">back to top</a>)</p>

## Going Forward

Additional features may include:

- light/dark mode toggle
- ability for the user to drag and/or hide certain weather elements such as the map, hourly, and weekly displays
- ability for the user to create a custom name for a location, e.g. 'Home', 'Work', etc.
- ability for the user to pin favorite locations to the top of saved locations component

Known items to refactor:

- the styling source code can be refactored and cleaned up
- the sort saved location logic is a bit clunky and difficult to

<p align="right">(<a href="#weather-app">back to top</a>)</p>

<!-- LICENSE -->

## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#weather-app">back to top</a>)</p>

<!-- CONTACT -->

## Contact

[![LinkedIn][linkedin-shield]][linkedin-url]
[![GitHub][github-shield]][github-url]
[![Project][project-shield]][project-repo]

<p align="right">(<a href="#weather-app">back to top</a>)</p>

[issues-shield]: https://img.shields.io/github/issues/mike-uffelman/weather-app.svg?labelcolor=green
[issues-url]: https://github.com/mike-uffelman/weather-app/issues
[license-shield]: https://img.shields.io/github/license/mike-uffelman/weather-app.svg
[license-url]: https://github.com/mike-uffelman/weather-app/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/LinkedIn-profile-blue
[linkedin-url]: https://www.linkedin.com/in/michael-uffelman-34289521/
[product-screenshot]: public/images/weather-showcase.png
[form-screenshot]: public/images/search-form.png
[icons-screenshot]: images/readMeImgs/icons.png
[github-url]: https://github.com/mike-uffelman
[github-shield]: https://img.shields.io/badge/GitHub-profle-orange
[project-shield]: https://img.shields.io/badge/GitHub-repo-gray?color=#6cc644
[project-repo]: https://github.com/mike-uffelman/weather-app
[shield-search]: images/check_password.svg
[copy-icon]: images/copy2.svg
[info-icon]: images/info.svg
[checked-passwords]: ./images/readMeImgs/password-validation.png
[usage-demo]: ./images/readMeImgs/pw_generator_demo.gif
[bookmarks]: ./images/bookmarks_black_24dp.svg
[bookmark-location]: public/images/bookmark-location.png
[bookmarks-screenshot]: public/images/bookmarks-screenshot.png
[mobile-nav]: public/images/mobile-nav.png
[desktop-nav]: public/images/desktop-nav.png
