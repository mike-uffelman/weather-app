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

This is a weather app project built to practice and showcase skills learned. It uses many packages including OpenWeather API, Leaflet, and OpenStreetMap. Under the hood, it's a Model-View-Controller(MVC) architecture utilizing modules and parcel.js to implement the build. [Demo the app here](https://main--cranky-booth-057572.netlify.app/).

The user provides a location and the app retrieves and displays the current weather, current weather map, hourly forecast, weekly forecast, and current weather alerts.

The user is able search for locations via text input (e.g. "london, gb" or "reno, nv, us" - state only required for USA) or by selecting a location on the map in the search form.

The user can also bookmark a location for ease of lookup, which will be stored in the local storage of the browser.

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

Open the [live demo here](https://main--cranky-booth-057572.netlify.app/).

<p align="right">(<a href="#weather-app">back to top</a>)</p>

## Background and Discussion

This is a project I've been working on to refine my skills as a front end developer. Initially, the project scope was limited to forms and API calls using OpenWeatherMap. Over time the scope evolved and expanded to include a responsive dashboard layout, maps, search, bookmarks, and help functionality. Concepts incorporated included Model-View-Controller(MVC) architecture, mobile-first layout, SASS, reusable CSS components, state variable, ES6, modules, and error/action messaging to name a few.

Throughout the development of this project, there were many challenges that arose, from layout headaches to broken functionality.
There were many challenges throughout the development of this project. Some of which included??????????????????????????????

Upon load the user can select to allow or block their current location, by allowing their browser location the app will fetch your current weather and render the weather page. A blocked location will allow the user search for or load a previously saved location to be fetched and rendered.

### Challenges

navigation position
scope creep - as i learned new concepts and technologies it became very easy to include in the project and allow for the scope to grow as this was a practice project with unlimited scope and honestly a poor initial plan, the greatest lesson learned from this project was that planning is EVERYTHING.

## Architecture and Design

#### Architecture

- The application is built with a Model View Controller (MVC) architecture pattern to isolate and organize the flow control, logic, and view modules.
- Using a global state variable to control the application state. This variable stores the user's search query, geolocation (if enabled), current weather location results, and the bookmarked locations. Doing so keeps all the relevant data in one place that is easy to reference throughout the code.
- Publisher/Subscriber pattern
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
