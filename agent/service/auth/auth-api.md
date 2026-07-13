## auth api

# v1

- register api

```ts
// post
const path = "/auth/register";

const request = {
  username: "string",
  email: "string",
  password: "string",
};

const response = {
  code: 0,
  message: "success",
  data: {
    // user
    email: "yui@kon.jp",
    userName: "Hirasawa Yui",
  },
};
```

- login api

```ts
// post
const path = "/auth/login";

const request = {
  identifier: "string",
  password: "string",
};

const response = {
  code: 0,
  message: "success",
  data: {
    accessToken:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2YTU0NGRjZjRmNmZmODE5ZmY5OGE1Y2UiLCJ1c2VybmFtZSI6IkhpcmFzYXdhIFl1aSIsImlhdCI6MTc4MzkxMDAzMiwiZXhwIjoxNzgzOTEwOTMyLCJqdGkiOiJhMzMwYmJjOS00NDdhLTQzMzQtOThmNi03MzgyOWY3NzM1NjkifQ.-e8CDa1SWcdO__dR65sfwJcAfyFtyuXdQE4zkOqcayA",
    refreshToken:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2YTU0NGRjZjRmNmZmODE5ZmY5OGE1Y2UiLCJ1c2VybmFtZSI6IkhpcmFzYXdhIFl1aSIsImlhdCI6MTc4MzkxMDAzMiwiZXhwIjoxNzg0NTE0ODMyfQ.Byupd-8Na1rI4JA2QVLICsZl6sgI8y98JrXTdaXBQUc",
    user: {
      // user
      username: "Hirasawa Yui",
      email: "yui@kon.jp",
    },
  },
};
```

- refresh-token api

```ts
// post
const path = "/auth/refresh-token";

const request = {
  refreshToken: "occaecatadipisicingullamcoofficia",
};

const response = {
  code: 0,
  data: {
    accessToken:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2YTM5NDI4YTIzNzFmMGE5N2EzYjg0N2UiLCJ1c2VybmFtZSI6IldZSlIiLCJpYXQiOjE3ODIxNDQyMTMsImV4cCI6MTc4MjE0NTExM30.uLSVEuSkTw71nXYpnyP4GDfnq5PEe1WAoQR7UTSTQfA",
  },
};
```

- logout api

```ts
// post
const path = "/auth/logout";

// need authorization

const response = {
  code: 0,
  message: "Logged out successfully",
  data: null,
};
```
