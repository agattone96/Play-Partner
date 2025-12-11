# API Reference

Base URL: `/api`
Authentication: Cookie-based (Session ID). validated via `connect.sid`.

## Authentication

| Method | Endpoint               | Description            | Body / Query                                 |
| :----- | :--------------------- | :--------------------- | :------------------------------------------- |
| `POST` | `/login`               | Log in with password   | `{ "username": "email", "password": "..." }` |
| `POST` | `/logout`              | Destroy session        | -                                            |
| `GET`  | `/auth/user`           | Get current user       | -                                            |
| `POST` | `/magic-link`          | Request magic link     | `{ "email": "..." }`                         |
| `GET`  | `/magic-link/callback` | Magic link entry point | `?token=...`                                 |
| `POST` | `/reset-password`      | Update password        | `{ "password": "new_password" }`             |

## Dashboard

| Method | Endpoint     | Description                                                                         |
| :----- | :----------- | :---------------------------------------------------------------------------------- |
| `GET`  | `/dashboard` | Returns aggregated metrics (Active partners, rating distribution, recent activity). |

## Partners

Core entity management.

| Method   | Endpoint        | Description        | Payload                     |
| :------- | :-------------- | :----------------- | :-------------------------- |
| `GET`    | `/partners`     | List all partners  | -                           |
| `POST`   | `/partners`     | Create new partner | `{ fullName, status, ... }` |
| `GET`    | `/partners/:id` | Get single partner | -                           |
| `PATCH`  | `/partners/:id` | Update partner     | Partial partner object      |
| `DELETE` | `/partners/:id` | Delete partner     | -                           |

## Partner Details

Sub-resources linked to a specific partner.

### Intimacy

| Method | Endpoint                 | Description             |
| :----- | :----------------------- | :---------------------- |
| `GET`  | `/partners/:id/intimacy` | Get intimacy details    |
| `PUT`  | `/partners/:id/intimacy` | Upsert intimacy details |

### Logistics

| Method | Endpoint                  | Description              |
| :----- | :------------------------ | :----------------------- |
| `GET`  | `/partners/:id/logistics` | Get logistics details    |
| `PUT`  | `/partners/:id/logistics` | Upsert logistics details |

### Media

| Method   | Endpoint              | Description                                  |
| :------- | :-------------------- | :------------------------------------------- |
| `GET`    | `/partners/:id/media` | List media items                             |
| `POST`   | `/partners/:id/media` | Add media item                               |
| `DELETE` | `/media/:id`          | **Note**: Delete by Media ID, not Partner ID |

### Assessments

| Method | Endpoint                    | Description                  |
| :----- | :-------------------------- | :--------------------------- |
| `GET`  | `/partners/:id/assessments` | Get ratings for this partner |

## Global Resources

| Method   | Endpoint              | Description                        |
| :------- | :-------------------- | :--------------------------------- |
| `GET`    | `/assessments`        | List all assessments (system wide) |
| `GET`    | `/assessments/export` | Download CSV of all assessments    |
| `POST`   | `/assessments`        | Add new assessment                 |
| `GET`    | `/tags`               | List all tags                      |
| `POST`   | `/tags`               | Create new tag                     |
| `DELETE` | `/tags/:id`           | Delete tag                         |

## Error Responses

All endpoints return standard HTTP status codes:

- `200/201`: Success
- `400`: Validation Error (Zod)
- `401`: Unauthorized (Not logged in)
- `404`: Not Found
- `500`: Internal Server Error
