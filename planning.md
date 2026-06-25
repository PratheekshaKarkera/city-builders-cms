# City Builders - Project Module Planning

## 1. Module Overview
This document outlines the architecture and schema specifically for the **Project Module** within the City Builders CMS. This module is the core component responsible for managing and distributing all real estate property data to the frontend website.

## 2. Database Schema (Project Collection)
The Project collection is designed to be comprehensive, ensuring all necessary data for the frontend "Explore More" details page is captured. 

**Core Information:**
* `name` & `slug`: Automatically generated unique identifiers.
* `type`: Property type (e.g., Residential, Commercial).
* `location`: Geographic location of the project.
* `status`: Categorized as Upcoming, Ongoing, Completed, or Ready to Move.
* **Drafts / Published State**: Enabled `versions: { drafts: true }` allowing content teams to save ongoing work as drafts without publishing it live.
* `description`: Full rich-text detailed content for the project details page.

**Media & Assets:**
* `image`: Primary cover image for listing cards.
* `gallery`: Array of multiple high-resolution images for the project carousel.
* `videoUrl`: Link to promotional project videos.
* `brochure`: Dedicated file upload (PDF) for the primary project brochure download button.
* `certificates`: Unified array for all other documents and approvals, featuring a title, an optional icon/logo, and the PDF document download.
* `mapLocationUrl`: Embed link for Google Maps integration.

**Project Features:**
* `amenities`: Dynamic array allowing either Lucide icon names (text) or custom SVG/image uploads, paired with the amenity name.
* `specifications`: Array for structural/material details with a `title` (e.g., Flooring) and an `excerpt` array for multiple bullet points.
* `floorPlans`: Array capturing the title, layout image, and optional description text of different unit configurations.
* `landmarks`: Array capturing nearby points of interest and their distances.

**Trust & Progress Indicators:**
* `constructionProgress`: Timeline tracker capturing dates, descriptions, and a single progress photo per update.
* `details`: Dynamic key-value pairs to handle flexible data points (e.g., Area, Price, RERA Number, BHK configurations) that vary by project type.

## 3. API Architecture
The module exposes dedicated REST endpoints tailored strictly for client-side consumption, completely separated from internal CMS CRUD operations:

* **GET `/api/projects/list`**
  * Fetches a lightweight array of all projects.
  * Used for rendering the main project listing page and filtering.
* **GET `/api/projects/get-by-slug/:slug`**
  * Fetches the complete, deep data structure for a single project using its unique slug.
  * Used for rendering the individual "Explore More" project details page.

## 4. Next Steps
1. **Content Seeding**: Enter initial real estate projects into the CMS to populate the database.
2. **Frontend Integration**: Connect the Astro frontend repository to fetch data dynamically from the newly established `/api/projects` endpoints, replacing any static mock data.
