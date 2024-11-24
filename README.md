# Backend Tech Challenge

As per point - Explain any compromise you may have made
Compromises made:
Not getting a mongo instance and do the trip saving deleting there.
Not separating the routes and moving them in a trip folder.
Didn't make documentation with postman.
Didn't add a Dockerfile to have it in a container.
Also if i had time to go above and beyond, i would have made a user auth endpoint to then have users, and do the trip saving, displaying and deletion by user.
This is all the time i had for this, i hope it's sufficient.
Thank you!!

## Trip planner

This api defines a `Trip` in this way:

```
{
    "origin": "SYD",
    "destination": "GRU",
    "cost": 625,
    "duration": 5,
    "type": "flight",
    "id": "a749c866-7928-4d08-9d5c-a6821a583d1a",
    "display_name": "from SYD to GRU by flight"
}
```

The supported places by the API are:

```
[
    "ATL", "PEK", "LAX", "DXB", "HND", "ORD", "LHR", "PVG", "CDG", "DFW",
    "AMS", "FRA", "IST", "CAN", "JFK", "SIN", "DEN", "ICN", "BKK", "SFO",
    "LAS", "CLT", "MIA", "KUL", "SEA", "MUC", "EWR", "MAD", "HKG", "MCO",
    "PHX", "IAH", "SYD", "MEL", "GRU", "YYZ", "LGW", "BCN", "MAN", "BOM",
    "DEL", "ZRH", "SVO", "DME", "JNB", "ARN", "OSL", "CPH", "HEL", "VIE"
]
```

The api has 4 endpoints:
GET /queryTrips

Accepted params:

- `origin`: IATA 3 letter code of the origin
- `destination`: IATA 3 letter code of the destination
- `sort_by`: Sorting strategy, either `fastest` or `cheapest`

POST /trip
Accepts a Trip object as defined above.
Saves the trip in memory.

GET /trip
Returns the trips saved in memory

DELETE /trip/:id
Accepts param id type string
{
id: "test1234"
}
Deletes the trip if it's saved in memory
