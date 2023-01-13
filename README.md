# Crockpot - Version 1

![heroimage](https://res.cloudinary.com/dqdjr1d4f/image/upload/v1673455688/Crockpot/Screenshot_2023-01-11_at_16.47.40_y9reuu.png)

Crockpot is a web application for maintaining newly discovered recipes and generating convenient shopping lists. For general users, this version of the site can be a place to discover new recipes and manage a weekly shop - while administrators can add more recipes in.

The site was created using NodeJs/Express on the backend with MongoDb as the database, while the frontend was written in React with React Query handling all server state and requests. 

This particular iteration of the application is very much a prototype, with fairly limited CRUD functions available to general users. However, now that the groundwork has been laid, the app has a lot of potential to scale up with plenty of new features on the way in version 2.

You can find the link the repository [here](https://github.com/franciskershaw/crockpot-node), and the live website can be viewed [here](https://www.crockpot.app/) 

## Table of Contents

* [Core Features](#core-features)
* [Future Features](#future-features)
* [Technologies Used](#technologies-used)
* [Known Bugs](#known-bugs)

## Core Features

* Account registration and authentication to use personalised features.
* Browse already added recipes, complete with corresponding ingredients and instructions.
* Add recipes into favourites section, or into menu with a choice of serves amount.
* Automatically generated shopping list based off of recipes and their serves data that have been included in a user's menu section.
* Ability to add extra items to the shopping list that weren't already included from the recipes in the menu.

## Future Features

Version 2 is going to improve and enhance the site in many ways, some of which have been sumarised here:

* We'll be adding a landing page, so as to improve the user experience on arriving at the site and hopefully improve SEO.
* Full crud functionality for admin users, not only for recipes for for ingredients and categories too. This will take shape as a proper admin area on the site.
* Ability for normal users to add in their own recipes that will appear in their own area of the site. These recipes can then be approved by administrators and be added to the browse page for other users to see.
* An improved shopping list that allows you to increase or decrease quantities from within the list itself.
* Improved UI direct from the browse page, including ability to change your serves amount for a recipe on the recipe card instead of in the recipe page.
* Eventually mutliple ways of authentication, instead of just using a username and password.

## Technologies Used

* React as the frontend framework
* React Query to maintain server side data on the client.
* SCSS and Tailwind for styling
* Express / Node.JS to handle the backend logic
* MongoDb / Mongoose to handle and store data.
* Digital Ocean for cloud hosting.
* Nginx as a reverse proxy.
* Cloudflare for added site security.
* Cloudinary for image hosting.

## Known Bugs
* We are aware that having two ingredients with the same _id but different units result in only one of these ingredients making it to the shopping list when adding multiple recipes to the menu.
* The button that clears the search bar is not working.
* On mobile the search functionality doesn't work at all.
* Site occasionally crashes when attempting to retrieve user while already logged in.


