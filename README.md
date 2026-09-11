# My World Journey

A virtual life-and-travel game: work through your real-life tasks (lectures, LeetCode, writing, projects) as "travel time" toward landmarks in the capital city you've virtually checked into. Finish a city's core experiences, unlock the next capital on the route.

> "I don't stop my life to travel the world; I travel the world while living my life."

No build step, no dependencies. Open `index.html` in a browser or serve the folder with GitHub Pages.

```
index.html          page shell
css/styles.css      styles
js/data/route.js    the ROUTE array — add cities here
js/app.js           game logic, views, save
```

## How the game works

- Every stop on the route is a capital city with a **City Experience Map**: an identity line, a routing reason for why it's next, a top/iconic hotel, 5 core experiences, and 6 optional side experiences.
- Each core experience has an **"Arrive"** button — you type in the real task that gets you there, and marking it done both completes the task and "visits" the place.
- A city is complete once all 5 core experiences are checked off.
- The **next city on the route stays locked** until the current one is complete.
- Progress is saved automatically per city and persists across sessions.

## Route so far

1. 🇳🇵 Kathmandu, Nepal
2. 🇧🇹 Thimphu, Bhutan
3. 🇧🇩 Dhaka, Bangladesh
4. 🇲🇲 Naypyidaw, Myanmar
5. 🇱🇰 Colombo (Sri Jayawardenepura Kotte), Sri Lanka
6. 🇲🇻 Malé, Maldives
7. 🇵🇰 Islamabad, Pakistan
8. 🇦🇫 Kabul, Afghanistan
9. 🇮🇷 Tehran, Iran
10. 🇹🇲 Ashgabat, Turkmenistan
11. 🇦🇿 Baku, Azerbaijan *(placeholder — not yet mapped)*

After all 193 capitals, the journey continues as a deeper virtual exploration of India.

## Adding the next city

When a city on the route doesn't have a `map` object yet, opening it in the app shows a **"Copy prompt"** button with a ready-made request. Paste that prompt to Claude, and it returns a full City Experience Map in the same format as the others.

To add it to the project:

1. Open `js/data/route.js` and find the `ROUTE` array.
2. Find the placeholder entry for that city (e.g. `{ id:"baku", city:"Baku", country:"Azerbaijan", flag:"🇦🇿" }`).
3. Replace it with the full object Claude returns (matching the structure of the existing built cities — `id`, `city`, `country`, `flag`, `map: { identity, why, hotel, core, optional, next }`).
4. Optionally add one more placeholder entry after it for the next city in the route.
5. Commit and push.

```bash
git add js/data/route.js
git commit -m "Add City Experience Map: <city name>"
git push
```

## Data format reference

```js
{
  id: "citykey",              // lowercase, no spaces
  city: "Display Name",
  country: "Country Name",
  flag: "🇽🇽",
  map: {
    identity: "One line capturing the city's character.",
    why: "One line on the routing logic for why it's next (geography/flight-cluster reasoning).",
    hotel: { name: "Hotel Name, City", note: "One line on why this hotel fits the city's identity." },
    core: [
      { id:"uniqueid", name:"Place Name", tag:"Category", desc:"2-line description.", explore:"A 15-30 min virtual exploration idea." },
      // exactly 5 of these
    ],
    optional: [
      { name:"Place Name", desc:"1-line description." },
      // 6 of these
    ],
    next: "Suggested next capital, with a one-line routing reason."
  }
}
```
