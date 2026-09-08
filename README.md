# AutoShine

AutoShine is a responsive automotive detailing studio website for presenting premium vehicle care services, limited-time offers, customer experiences, and booking information.

The project is built as a lightweight static website with semantic HTML, custom CSS, ES modules, and browser-delivered third-party libraries. It does not require a bundler, framework, package manager, or build step.

## Features

- Responsive automotive detailing website for desktop, tablet, and mobile.
- Multi-page navigation for the studio's main content areas.
- Dark and light theme toggle with local storage persistence.
- Lenis smooth scrolling integrated with GSAP ScrollTrigger.
- GSAP page-intro, hero, text, card, and section reveal animations.
- Reduced-motion support through `prefers-reduced-motion`.
- Responsive mobile navigation menu.
- Swiper carousels for offers and customer testimonials.
- Scroll-to-top control that follows the responsive header height.
- Hover interactions for service cards, navigation items, and animated text.
- Video tour with play and pause controls.
- Copy-to-clipboard controls for contact information.
- Ionicons for navigation, actions, services, and interface feedback.
- Reusable service, offer, portfolio, FAQ, blog, and contact layouts.

## Pages

| Page                | File                       | Purpose                                        |
| ------------------- | -------------------------- | ---------------------------------------------- |
| Home                | `index.html`               | Main landing page and complete studio overview |
| About               | `about.html`               | Studio story and company information           |
| Services            | `services.html`            | Services page entry point                      |
| Customer Experience | `customer-experience.html` | Customer-focused experience content            |
| Portfolio           | `portfolio.html`           | Completed detailing and restoration work       |
| Blog                | `blog.html`                | Detailing and vehicle-care articles            |
| Career              | `career.html`              | Career and team opportunities                  |
| Contact             | `contact.html`             | Contact and booking information                |
| Our Team            | `our-team.html`            | Team profiles                                  |
| Testimonials        | `testimonials.html`        | Customer feedback                              |
| FAQs                | `faqs.html`                | Frequently asked questions                     |

## Technology

### Local source

- HTML5
- CSS3
- Modern JavaScript ES modules
- Bootstrap overrides and responsive styles
- Local images and video assets in `public/`

### CDN dependencies

The pages load these libraries from public CDNs:

- [Bootstrap 5.3.8](https://getbootstrap.com/)
- [Ionicons 8.0.13](https://ionic.io/ionicons)
- [Lenis 1.3.26](https://lenis.darkroom.engineering/)
- [GSAP 3.15.0](https://gsap.com/)
- [GSAP ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/)
- [Swiper 11](https://swiperjs.com/)

An internet connection is required when running the site with the current CDN-based setup.

## Project Structure

```text
.
├── index.html
├── about.html
├── blog.html
├── career.html
├── contact.html
├── customer-experience.html
├── faqs.html
├── our-team.html
├── portfolio.html
├── services.html
├── testimonials.html
├── public/
│   ├── images/
│   └── videos/
└── src/
    ├── css/
    │   ├── bootstrap-override.css
    │   ├── main.css
    │   └── responsive.css
    └── js/
        ├── heroIntro.js
        ├── init.js
        ├── main.js
        ├── pageTransition.js
        ├── scrollAnimations.js
        └── toggleTheme.js
```

## Getting Started

### Prerequisites

Use one of the following:

- Python 3
- Node.js with any static file server
- VS Code Live Server or another static server

Opening the HTML file directly may work for basic markup, but a local server is recommended because the site uses ES modules and external assets.

### Run with Python

From the project root:

```bash
python -m http.server 4173
```

Open:

```text
http://localhost:4173/
```

Stop the server with `Ctrl+C`.

### Run with Node.js

If a static server is already available in your environment, serve the project root and open the URL it provides. For example, with `serve`:

```bash
npx serve .
```

## Development Notes

- Edit page content directly in the root HTML files.
- Place shared styling in `src/css/main.css` and responsive overrides in `src/css/responsive.css`.
- Keep Bootstrap-specific customizations in `src/css/bootstrap-override.css`.
- Add shared JavaScript initialization in `src/js/init.js`.
- Keep application startup and page-level wiring in `src/js/main.js`.
- Add ScrollTrigger reveal behavior in `src/js/scrollAnimations.js`.
- Add page-load animations in `src/js/heroIntro.js` or `src/js/pageTransition.js`.
- Use existing Ionicon and Bootstrap utility conventions before introducing new patterns.
- Preserve `prefers-reduced-motion` behavior when adding animations.
- Use relative paths for local assets so the site can be deployed as static files.

## Animation Guidelines

The site uses a small set of reusable animation patterns:

- `revealGroup()` for fade and slide reveals.
- `waveReveal()` for staggered card grids and lists.
- `waveTextReveal()` for letter-based text reveals.
- Lenis for smooth scrolling.
- GSAP ScrollTrigger for viewport-based animation timing.

When adding a new animated section:

1. Identify the section container and its repeated child elements.
2. Reuse an existing reveal helper where possible.
3. Add a narrow selector in `initScrollAnimations()`.
4. Respect reduced-motion users.
5. Test the section on both mobile and desktop widths.

## Accessibility

- Use meaningful `alt` text for images.
- Keep buttons and links descriptive.
- Preserve keyboard access when changing interactive controls.
- Keep `aria-label` and `aria-hidden` values synchronized with dynamic controls.
- Do not rely on color alone to communicate state.
- Respect `prefers-reduced-motion` for animation-heavy interactions.

## Validation

There is currently no automated test suite or build pipeline. Before opening a pull request, perform these checks:

```bash
node --check src/js/main.js
node --check src/js/init.js
node --check src/js/scrollAnimations.js
python -m http.server 4173
```

Then verify the main flows in a browser:

- Desktop and mobile navigation.
- Theme switching and persistence.
- Smooth scrolling and scroll-to-top behavior.
- Offers and testimonial Swipers.
- Service-card and text hover states.
- Video controls.
- Copy buttons.
- Keyboard focus and reduced-motion behavior.

## Deployment

AutoShine can be deployed to any static hosting provider, including:

- GitHub Pages
- Netlify
- Vercel static hosting
- Cloudflare Pages
- Amazon S3 with static website hosting
- Any web server that serves HTML, CSS, JavaScript, images, and video files

Publish the repository root as the site root. No compilation or server-side runtime is required.

## Content and Configuration

The following contact details are currently represented in the site content:

- Email: `contact@autoshine@gmail.com`
- Phone: `+971 50 555 0184`
- Location: Dubai, United Arab Emirates

Update these values in the relevant HTML files before production launch. Replace placeholder links such as `#` with real destinations, booking flows, social profiles, privacy policy pages, and terms pages.

## Browser Support

The site targets modern browsers with support for:

- ES modules
- CSS custom properties
- `IntersectionObserver` and modern browser APIs used by the animation libraries
- Responsive CSS media queries

Always test the deployed site in current versions of Chrome, Edge, Firefox, and Safari before release.

## License

No license has been specified for this project. Add a license file before distributing the source publicly.
