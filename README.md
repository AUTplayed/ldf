# LDF - Little Dynamic Framework for making Single-Page Applications

Tired of giant frameworks like Angular? 

Trying to avoid complicated stuff like MVC, Typescript or JSX and just want to create a website in good old plain JS HTML CSS?

Want to make a small website feel 100x better because it's a Single-Page Application?

Then this is the framework for you!

## Features

Navigating your website with `a` tags like this

```html
<a href="login">Login</a>
```

will, instead of fully refreshing the page, dynamically load the requested content (in this case`login.html`), and switch out the old content with the new one.

Additionally, LDF will wait for external resources (like stylesheets or images) to load before displaying the page. Demonstration with a throttled connection and cpu:

![demo](https://i.imgur.com/G9FTMYu.gif)

The script will also change the browser's navigation bar via the History-API, so that the page can be refreshed and browser-features like back and forward will work.

If you want to navigate your page via Javascript, all you have to do is call the `nav` function of the global `ldf` object like this, with the parameter being the page you want to navigate to:

```javascript
ldf.nav("login");
```

You can include css and js in your html files just like normal, they will also be dynamically loaded.

For a small demonstration, check out the `test` directory.

**Notes:**

If you dynamically add `a` tags via Javascript (not by changing the page with `ldf` but with for example `document.createElement`), you'll have to invoke `ldf.updatePageLinks()` in order for `a` tags to not reload the page.

## Getting started

Just include the script in your index page like this:

```
<script src="ldf.js"></script>
```

You also have to add a div element with the id "ldf" in your `index.html` where you want your content to be like this:

```
<div id="ldf"></div>
```

LDF currently expects a folder structure like this:

```
index.html                                    required
pages/                                        required
├── index/                                    required
│   ├── index.html                            required
│   ├── index.css
│   └── index.js
└── examplepage/
    ├── examplepage.html
    └── styles.css
```

Each folder in the `pages` directory represents a page (duh) and will be loaded if a user navigates to the route named after the folder. So, for example if a user clicks on an `a` tag with `href="examplepage"`, LDF will attempt to load `pages/examplepage/examplepage.html`.
The page `index` is required, and is the default content you'll see without any navigation.

## Configuration

LDF currently allows for some configuration.

```javascript
// The content displayed when LDF receive a 404 from the server while requesting a page
// Set this to undefined if you want LDF to display the error page it receive from your server
ldf.notfound = "<div>Page not Found</div>";
// The directory your pages are stored on the server, default is /pages
ldf.pagedir = "/pages";
// The css selector string LDF will wait on before displaying the page.
// By default it waits for all stylesheets and all elements with a src attribute (like images), but not scripts.
ldf.waitselector = "link[rel='stylesheet'],:not(script)[src]"
```

## Drawbacks

In order for the refresh function to work, you will have to include a special case in your web server.

You have to look at the request if it's not `/` but a request to a page, and send back your `index.html`. But you can't just always send back `index.html` when the requested file isn't found, unless you want your site to break if a user visits a missing page, since LDF relies on getting an error from a request to a missing page.

A small implementation of this I used in the test/example project (with nodejs and express) looks like this:

```javascript
// Static resources
app.use(express.static(pj(__dirname)));
// Special case, always sends back index.html if the request is only 1 level. This works because requests to resources are 3 levels deep (pages/resource/resource.html)
app.get("/:page", (req, res) => {
	res.sendFile(pj(__dirname, "index.html"));
});
```

## Final Notes

This project was just thrown together in a few hours based on a way messier implementation, which I used in my diploma thesis. If you find a bug or want to add an improvement, please open an issue/pull request.
