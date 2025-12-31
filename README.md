# ptrace.net

[![Deploy Jekyll to GitHub Pages](https://github.com/d3b4g/blogs/actions/workflows/deploy.yml/badge.svg)](https://github.com/d3b4g/blogs/actions/workflows/deploy.yml)

Personal blog covering infosec, reverse engineering, and random technical ramblings.

🌐 **Live Site:** [https://ptrace.net](https://ptrace.net)

## Tech Stack

- **Static Site Generator:** [Jekyll](https://jekyllrb.com/)
- **Hosting:** [GitHub Pages](https://pages.github.com/)
- **CI/CD:** GitHub Actions

## Local Development

### Prerequisites

- Ruby 3.x
- Bundler

### Setup

```bash
# Clone the repository
git clone https://github.com/d3b4g/blogs.git
cd blogs

# Install dependencies
bundle install

# Start the development server
bundle exec jekyll serve
```

The site will be available at `http://localhost:4000`

## Deployment

The site is automatically deployed to GitHub Pages via GitHub Actions when changes are pushed to the `gh-pages` branch.

### Manual Deployment

To trigger a manual deployment, go to **Actions** → **Deploy Jekyll to GitHub Pages** → **Run workflow**

## Project Structure

```
├── _config.yml          # Jekyll configuration
├── _includes/           # Reusable HTML components
├── _layouts/            # Page templates
├── _posts/              # Blog posts (Markdown)
├── _sass/               # SCSS stylesheets
├── css/                 # Compiled CSS
├── js/                  # JavaScript files
├── img/                 # Images and assets
└── .github/workflows/   # CI/CD workflows
```

## License

This project is licensed under the MIT License - see the [LICENSE.txt](LICENSE.txt) file for details.

---

Made with ☕ by [@d3b4g](https://github.com/d3b4g)
