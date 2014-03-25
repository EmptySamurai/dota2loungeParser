# dota2loungeParser

Just a small Node.js parser for finished games for dota2lounge.com

## Installation
1. Download repository from github
2. Run `npm install`
3. Run `node server.js`

## Result
Result is a *list.json* file. *list.json* is an array of objects that have fields:
* **matchID** - unique ID of the match
* **winner** - object that contains *name* and *percent* of the winner
* **looser** - object that contains *name* and *percent* of the looser
