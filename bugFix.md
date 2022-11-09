## Fixing Performance Bug on Dashboard Render

- Render times before any fixes: ~1900ms

The issue is within the blocks widget, which pulls down 10,000 blocks each time there's a new block (or on initial page view).

- Render time with 100 blocks fetched: ~160ms

Potential fixes:

- Virtual tables (a separate library used in conjunction with mui table)

  - Test of this with 10,000 rows of light data renders in <20ms

- Reduce initial blocks fetched
- Skeleton components (which doesn't really solve the issue but provides a better UX)
