# Search setup after deployment

The production URL is https://farhanshakeel-ee.netlify.app/.

1. Deploy these files to the existing Netlify site.
2. Add the URL-prefix property `https://farhanshakeel-ee.netlify.app/` in https://search.google.com/search-console and verify ownership using Google's HTML file or meta tag. Use the exact token Google gives you.
3. Submit `sitemap.xml` in Search Console. Inspect the homepage and `about.html`, run the live test, and request indexing.
4. Validate the homepage with https://search.google.com/test/rich-results after deployment. Monitor indexing in Search Console.
5. Link to this profile from your existing LinkedIn, GitHub, and FabSCE website or official profile, where available. Keep your name and founder role consistent.

The sitemap lists the eight main content pages. Query-driven detail viewers are not included; no blanket noindex or canonical is applied to those viewers, so distinct items are not collapsed together.

When adding a main page, add its absolute URL to the sitemap and give it a unique title, description, and canonical URL. If the domain changes, update canonical links, social image/URL tags, homepage JSON-LD, robots.txt, and sitemap.xml together.

Google controls ranking, snippets, and entity panels. Structured data describes the visible profile; it does not guarantee first position or a knowledge panel. Crawling may take days to weeks, and an indexing request is not a guarantee of inclusion.

Reference: https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl
