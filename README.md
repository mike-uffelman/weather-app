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

## TL;DR 🤷‍♂️

This is a weather app built to practice and showcase skills. It uses the OpenWeatherMap API to fetch the weather, Leaflet for mapping and Openstreetmap for the map tiling. Under the hood, it's a Model-View-Controller(MVC) architecture utilizing modules and parcel.js for the build package. [Demo the app here](https://main--cranky-booth-057572.netlify.app/).

<br>

<!-- TABLE OF CONTENTS -->

## Table of Contents

<details>
  <summary>Weather App</summary>
  <ol>
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
  </ol>
</details>
<br>
<!-- ABOUT THE PROJECT -->

## About The Project

This is a weather app, the user provides a location and the app retrieves and displays the current weather, current weather map, hourly forecast, weekly forecast, and current weather alerts.

The user is able search for locations via text input (e.g. "london, gb" or "reno, nv, us" - state only required for USA) or by selecting a location on the map in the search form.

The user can also bookmark a location for ease of lookup, which will be stored in the local storage of your browser.

<br><br>

[![weather showcase][product-screenshot]]('./images/weather-showcase.png')

<br>

### Built With

- JavaScript
- [Open Weather Map](https://openweathermap.org/)
- [Leaflet](https://leafletjs.com/) - for the mapping
- [uuid](https://www.npmjs.com/package/uuid) - for unique location IDs
- [Parcel.js](https://parceljs.org/)

<p align="right">(<a href="#weather-app">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

Open the [live demo here](https://main--cranky-booth-057572.netlify.app/).

<p align="right">(<a href="#weather-app">back to top</a>)</p>

## Background and Discussion

This is a project I've been working on to refine my skills as a front end developer. Initially, the project scope was limited to forms and API calls using OpenWeatherMap. Over time the scope evolved and expaned to include a responsive dashboard layout, maps, search, bookmarks, and help functionality. Concepts incorporated included Model-View-Controller(MVC) architecture, state, SASS, Grid/Flexbox, reusable CSS components, ES6, modules, and more.

There were many challenges throughout the development of this project. Some of which included

Upon load the user can select to allow or block their current location, by allowing their browser location the app will fetch your current weather and render the weather page. A blocked location will allow the user search for or load a previously saved location to be fetched and rendered.

Challenges============================

## Architecture and Design

- Architecture

  - The application is built with a Model View Controller (MVC) architecture pattern to isolate and organize the flow control, logic, and view modules.
  - Using a global state variable to control the application state. This variable stores the user's search query, geolocation (if enabled), current weather location results, and the bookmarked locations. Doing so keeps all the relevant data in one place that is easy to reference throughout the code.
  - Publisher/Subscriber pattern
  - Form Validation

<br>

- Design ===========in progress

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

- To search, the user must select the search type radio button (i.e. location name or map location). Then provides the location name in the text input (e.g. "london, gb" or "reno, nv, us") or click and pin a location on the map.

  [![Password Generator ouput screenshot][form-screenshot]]('public/images/search-form.png')

### Bookmark a location

- To bookmark a location the user must click the location name or bookmark icon in the current weather box. Click a bookmarked location will remove the location from the bookmarks.

  [![Bookmark the location][bookmark-location]]('./images/bookmark-location.png')

### Load Bookmark

- To load a bookmark, the user must select the desired location (if previously bookmarked).

  [![Bookmarks screenshot][bookmarks-screenshot]]('public/images/bookmark-location.png')

### Navigation

- In the mobile view, the user may swipe left and right to navigate to the search and bookmarked locations views or select the menu toggle on the bottom and use the icons displayed.

  [![Mobile-navigation][mobile-nav]]('public/images/mobile-nav.png')

- In a larger screen view or desktop, the user can use the menu toggle which will display the navigation icons.

  [![Desktop-navigation][desktop-nav]]('public/images/desktop-nav.png')

<p align="right">(<a href="#weather-app">back to top</a>)</p>

## Going Forward

Additional features may include:

- light/dark mode toggle
- ability for the user to drag and/or hide certain weather elements such as the map, hourly, and weekly displays

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

[issues-shield]: https://img.shields.io/github/issues/mike-uffelman/password-generator.svg?labelcolor=green
[issues-url]: https://github.com/mike-uffelman/password-generator/issues
[license-shield]: https://img.shields.io/github/license/mike-uffelman/password-generator.svg
[license-url]: https://github.com/mike-uffelman/password-generator/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/LinkedIn-profile-blue
[linkedin-url]: https://www.linkedin.com/in/michael-uffelman-34289521/
[product-screenshot]: public/images/weather-showcase.png
[form-screenshot]: public/images/search-form.png
[icons-screenshot]: images/readMeImgs/icons.png
[github-url]: https://github.com/mike-uffelman
[github-shield]: https://img.shields.io/badge/GitHub-profle-orange
[project-shield]: https://img.shields.io/badge/GitHub-repo-gray?color=#6cc644
[project-repo]: https://github.com/mike-uffelman/password-generator
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
