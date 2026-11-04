# Engineering College — Brochure Website

Static, multi-page, responsive website for a fictional institution, **Engineering College**. Built with HTML5, CSS3, Bootstrap 5 and vanilla JavaScript (ES6+). No server-side code and no JS frameworks.

## Project overview and page map

| Page | File | Purpose |
|---|---|---|
| Home | `index.html` | Hero with tagline and call-to-action, key stats, highlights, news teasers |
| About & Programs | `about.html` | Institution intro, values, six programs as cards |
| Admissions | `admissions.html` | Overview, application steps, tuition/fees table, FAQ |
| Student Life & News | `student-life.html` | Campus snapshots, clubs, events, announcements |
| Contact | `contact.html` | Contact channels and Contact Us form |
| Registration | `registration.html` | Advanced prospective-student registration form |

Shared assets: `css/style.css` (design tokens, components) and `js/main.js` (all scripts).

## Features implemented

- Fixed top navigation on every page, collapsible on small screens, with `aria-current` active state
- Mobile-first layout using the Bootstrap grid, utilities, cards, table, navbar and alerts
- Consistent brand system: navy/amber palette, type scale and spacing scale via CSS variables
- Accessibility: skip link, semantic landmarks, heading hierarchy, labelled controls, visible focus, ARIA live regions, text alternatives for meaningful graphics
- **Registration form**: inline validation with error and success states, password match, policy checkbox required, submit blocked until valid, on-page confirmation
- **Contact form**: required fields, inline validation, honeypot plus simple arithmetic human check, success and failure messages
- **Extra JS interaction 1**: filter buttons for programs (About) and for clubs/events/announcements (Student Life), with screen-reader status updates
- **Extra JS interaction 2**: FAQ on the Admissions page, one answer open at a time (built on native `details`, works without JS)
- Back-to-top button that appears on scroll
- Progressive enhancement: filter controls only appear when JavaScript runs; all content is visible without it

## Known limitations

- Forms are client-side only; there is no backend, so submissions are not stored or sent. Passwords are never stored or transmitted.
- Fees, contact details and statistics are fictional demonstration data.
- Bootstrap and Bootstrap Icons load from a CDN and need an internet connection.
- The human check on the Contact form is a basic deterrent, not a full spam solution.

## Attribution / credits

- [Bootstrap 5.3](https://getbootstrap.com/) — MIT License
- [Bootstrap Icons 1.11](https://icons.getbootstrap.com/) — MIT License
- Hero illustration and gallery tiles are original (inline SVG and CSS gradients)
- All copy is original, written for this project. AI assistance was used during development as permitted by the assignment.

## Live site

- Repository: `https://github.com/<your-username>/midterm-engineering-college-<yourID>`
- Live URL: `https://baratbekova.github.io/midterm-engineering-college-baratbekova/`
- Use the top navigation bar to move between pages; start at **Home**.
