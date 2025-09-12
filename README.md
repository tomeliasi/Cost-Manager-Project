# Cost Manager API

**Final Project – Asynchronous Server-Side Development Course**

## Description

A REST API for managing **users** and their **costs**, with on-demand **monthly reports** grouped by category and day.  
The service is built with a clean, layered architecture (`buildApp` bootstrap + modular routes/models), **UTC-accurate** month boundaries, lightweight **JSON error handling**, and **structured request auditing** stored in MongoDB. Past months are **cached** to avoid recomputation, and totals are computed reliably using MongoDB aggregation (including `$toDouble` for mixed numeric/string sums).

## Highlights

- Minimal, fast **Express** server with clear separation of concerns (routes, middleware, services, models, utils).
- Deterministic monthly reporting (per-category buckets sorted by day).
- Structured HTTP logging + **Mongo-backed** access logs for auditability.

## Technologies Used

- **Node.js**
- **Express**
- **MongoDB** + **Mongoose**
