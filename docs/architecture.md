# Pentora Project Architecture

This document outlines the high-level and low-level design for the Pentora project by EncodersPro.

## Overall Architecture

The application follows a modern web architecture:

*   **Frontend:** A Next.js application using the App Router, React, and TypeScript. UI is built with shadcn/ui and Tailwind CSS.
*   **Backend:** Node.js-based API routes within the Next.js application.
*   **Future Integrations:**
    *   **Python Scanners:** The core scanning logic will be handled by separate Python-based microservices, communicating with the Next.js backend via a RESTful API.
    *   **AI KPI Module:** A DeepSeek AI-powered module is planned for analyzing and reporting on Key Performance Indicators (KPIs).

## Core Modules (Phase One)

The initial development phase will focus on the following core modules:

*   **Authentication:** User login, session management, and access control.
*   **Dashboard:** A high-level overview of the application's status, including attack surface summaries and recent activity.
*   **Assets:** Management of discovered and tracked assets (IPs, hostnames, etc.).
*   **Scans:** Configuration and initiation of security scans against assets.
*   **Findings:** Viewing and managing vulnerabilities and other findings from scans.
*   **Attack Surface:** Detailed visualization and management of the organization's digital footprint.
*   **Notifications:** Alerting users to important events and findings.

## Development Methodology

This project follows an **Agile** methodology with the following principles:

*   **Weekly Demos:** Regular demonstrations of progress to stakeholders.
*   **Extensible Structure:** The architecture is designed to be micro-frontend and microservice-friendly, allowing for future expansion and independent module deployment.
