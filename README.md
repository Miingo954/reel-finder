# Reel Finder

A small, no-build movie and series finder powered by the OMDb API.

## Open it

Open this folder in VS Code, then either:

- install the **Live Server** extension and choose **Go Live**, or
- open `index.html` directly in a browser.

The supplied OMDb key is already in `app.js`, so searches work without further setup. The app searches by title, filters by type, and opens a detail view for each result.

## Files

- `index.html` — structure and content
- `styles.css` — responsive visual design
- `app.js` — OMDb requests and interactions

For a deployed production site, move the API key into a server-side proxy so it is not exposed in browser source.
