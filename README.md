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

This is a weather app project to showcase my skills. It uses the OpenWeatherMap API to fetch the weather, Leaflet mapping and Openstreetmap tiling. Under the hood, it's a Model-View-Controller(MVC) architecture using object-oriented programming(OOP) paradigm to manage and organize the logic and views.

Upon load the user can select to allow or block their current location, by allowing their browser location the app will fetch your current weather and render the weather page. A blocked location will allow the user search for or load a previously saved location to be fetched and rendered.
[Demo the app here](https://main--cranky-booth-057572.netlify.app/).

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

<br><br>

[![weather showcase][product-screenshot]]('./images/weather-showcase.png')

<br>

### Built With

- JavaScript
- [Open Weather Map](https://openweathermap.org/)
- [Leaflet](https://leafletjs.com/)
- [uuid](https://www.npmjs.com/package/uuid)
- [Parcel.js](https://parceljs.org/)

<p align="right">(<a href="#weather-app">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

Open the [live demo here](https://main--cranky-booth-057572.netlify.app/).

<p align="right">(<a href="#weather-app">back to top</a>)</p>

## Background and Discussion

This is a practice project I've been working on to refine my skills as a front end developer. Initially, the project scope was limited to forms and API calls using OpenWeatherMap. Over time the scope evolved and expaned to include a responsive dashboard layout, maps, search, bookmarks, and help functionality. Concepts incorporated included Model-View-Controller(MVC) architecture, Object-Oriented Programming(OOP), state, SASS, Grid/Flexbox, component styling, ES6, modules, and more.

DELETE THIS-=-----------------------------
The initial planned project scope was limited to creating a simple password generator that allowed the user to select a password length, special characters, and numbers. After leaving it as is for several months I returned to the project to re-evaluate and decided to update several aspects and add new features. The revisions included an updated password generating alorithm and additional features that improve the quality of life for the user, such as copy to clipboard and check password vulnerability lookup.

In the design and revist to the project, JavaScript frameworks have been intentionally omitted, this was to practice the fundamentals as well as leave many development problems left unsolved for me to figure out.

There were many new and welcomed challenges which arose while developing this project, some of which included readable streams (having only worked with well defined JSON prior), regular expression pattern matching for input validation and data sanitization, architecture redesign, and extensive HTML templating.

## Architecture and Design

- Architecture
  - The application is built with a Model View Controller (MVC) architecture pattern and utilizes an object-oriented programming (OOP) approach to organize and manage the application's logic and views.
    <br><br>
- Password Algorithm & Validation
  - The algorithm to create the a password takes a random number from crypto.getRandomValues() (Web Crypto API) to select the character type (az, AZ, 09, SC) at each index up to the user defined password length, at each index another random value is generated to assign as the character value of the index from the ASCII decimal value corresponding to the range of the character type.
    - According to [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random#sect1):
      > Note: Math.random() does not provide cryptographically secure random numbers. Do not use them for anything related to security. Use the Web Crypto API instead, and more precisely the window.crypto.getRandomValues() method.
    - For this reason, it seemed like a good opportunity to use the Web Crypto API instead of the Math.random() method.
  - From the ASCII decimal values the indexes are converted to the readable Latin characters.
  - After the password is generated, the password is tested against a regular expression pattern matching to ensure the generated password contains at lease one of each character type the user has chosen, if not it will try again.
  - If the password passes the character type validation, the password is shuffled once more. While not necessarily required, it was a nice feature to add as it utilizes a Fisher-Yates shuffle.
  - Checking the generated password's vulnerability against the Pwned Passwords API requires the password to be hashed, the first five characters (prefix) of the hash is sent in the fetch request and all passwords with matching prefix characters are returned as hashes (less the prefix). The generated password hash suffix (last 35 characters) are compared against the returned list from the API.
    <br><br>
- Form & Data Validation

  - The form validation (client side) includes the following:
    - User must select at least one (1) character type.
    - The password length must be greater than or equal to the number of character types selected, e.g. if a-z, A-Z, and special characters are checked, the password length must be greater than or equal to three (3).
    - Using regular expressions pattern matching, the user input may only contain special characters, and of which the HTML vulnerable characters (&lt; &gt; &amp; &quot; &apos; &bsol;) are converted to HTML entity codes to sanitize the inputs.
    - If the 'Only' user defined special characters field is selected, the input must have special characters, a logic function and HTML form input 'required' is enabled.
    - If the 'Only' user defined special characters field is not selected, the input field is disabled.
    - As the user input of special characters is limited to only special characters and encodes the vulnerable special characters, Cross Site Scripting attacks methods are reduced.

<p align="right">(<a href="#weather-app">back to top</a>)</p>

<!-- USAGE EXAMPLES -->

## Usage

This is the basic usage of the application:

1.  On load, the user will be prompted to allow or block their location.

    - If allowed, application will automatically retrieve and display the weather.
    - If blocked, the application will allow the user to search for a location or open a previously saved location from their favorites.
      <br>
      [![Password Generator form screenshot][form-screenshot]](file path)

2.  To search, the user must select the search type radio button (i.e. location name or map location). Then provides the location name in the text input (e.g. "london, gb" or "reno, nv, us") or click and pin a location on the map.
    [![Password Generator ouput screenshot][item-screenshot]]('./images/readMeImgs/pwItem.png')
3.  To load a bookmark, the user must select the desired location (if previously bookmarked).

    <br>

4.  Other actions includes a help/instructions button ![info-icon] and the ability to clear the current list of generated passwords with 'Clear'.

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
[form-screenshot]: images/readMeImgs/form-inputs.png
[item-screenshot]: images/readMeImgs/password-output.png
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
