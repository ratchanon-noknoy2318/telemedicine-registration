# 🏥 Healthcare Registration System

A production-oriented healthcare registration system designed for hospital workflows, enabling patient registration, automated notifications via LINE Messaging API, and structured data storage through Google Sheets powered by Google Apps Script.

> Built to solve issues faced by nursing staff at the time.

---

## Overview

This system streamlines patient registration and notification processes in healthcare environments by connecting:

- A modern web interface built with Next.js
- Automated backend processing via Google Apps Script
- Structured data storage using Google Sheets
- Real-time notifications through LINE Messaging API

It replaces manual registration workflows with a lightweight, cloud-based automation pipeline.

---

## Key Features

- Patient registration form with real-time submission
- Automated data synchronization to Google Sheets
- Instant notifications via LINE Messaging API
- Serverless backend logic using Google Apps Script
- Lightweight deployment with no dedicated backend server required
- Environment-based configuration for secure API handling

---

## Tech Stack

**Frontend**
- Next.js
- Tailwind CSS

**Backend / Integration Layer**
- Google Apps Script (GAS)

**Data Layer**
- Google Sheets

**Messaging / Notification**
- LINE Messaging API

---

## System Architecture

flowchart TD
    A[User] --> B[Next.js Frontend]

    B --> C[API Layer - Google Apps Script]

    C --> D[Validation & Processing]
    D --> E[Google Sheets Storage]

    D --> F[LINE Messaging API]

    F --> G[Hospital Staff Notification]
