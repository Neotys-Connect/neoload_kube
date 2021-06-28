# Dependencies

Install mongodb driver:
```
npm install mongodb --save
```

# top.js - Biggest results

Returns biggest results based on disk usage.
Default settings return top 10.

## mongodb connection string

Replace `user`, `password`, `server` and `port` in the following line:
```
const uri = "mongodb://<user>:<password>@<server>:<port>";
```

## Run

```
node top.js
```

## Get more than 10 results

Change the value of 
```
const LIMIT = 10;
```

# short-results.js - Short results

Return results shorter than `MAX_DURATION_IN_MINUTES` with duration, date and test settings id.
By default returns 200 results.

## mongodb connection string

Replace `user`, `password`, `server` and `port` in the following line:
```
const uri = "mongodb://<user>:<password>@<server>:<port>";
```

## Run

```
node short-results.js
```

## Get more than 200 results

Change the value of 
```
const LIMIT = 200;
```

## Get longer results

Change the value of 
```
const MAX_DURATION_IN_MINUTES = 5;
```