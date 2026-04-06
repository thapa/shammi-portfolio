# Admin Order Functionality — Design Spec

**Date:** 2026-04-06

## Context

The `display_order` column already exists on all content tables (`projects`, `services`, `skills`, `experience`, `process_steps`, `stats`) and `ContentContext` already fetches all tables ordered by `display_order`. However, the admin panels never expose or update this field, so the display order on the public portfolio cannot be controlled by the site owner. This spec adds ↑↓ reordering controls to both admin panels.

## Scope

- `src/admin/panels/ProjectsPanel.jsx`
- `src/admin/panels/TablePanel.jsx`

No schema changes, no frontend changes, no new dependencies.

## Data Fetch

**ProjectsPanel:** Change `.order('created_at', { ascending: false })` → `.order('display_order', { ascending: true })`.

**TablePanel:** Change `.order('id', { ascending: true })` → `.order('display_order', { ascending: true })`.

After fetching, normalize `display_order` values in local state to sequential integers (`1, 2, 3…`) based on the returned array order. This handles existing rows where `display_order` defaults to `0`. Normalization is in-memory only — no DB write unless the user clicks a button.

## UI

Add an **Order** column as the first column in each panel's table. It contains two small icon buttons per row:

- **↑** — disabled on the first row
- **↓** — disabled on the last row

Both buttons disable while a save is in-flight (prevents double-clicks). No loading spinner needed.

## Swap Logic

When ↑ or ↓ is clicked on row at index `i`:

1. Determine `j = i - 1` (for ↑) or `j = i + 1` (for ↓).
2. Swap `display_order` values of rows `i` and `j` in local state (optimistic update).
3. Fire two Supabase `.update({ display_order })` calls in parallel for rows `i` and `j` (by their `id`).
4. On error, revert local state and show a console error (no toast needed — keep it simple).

## Files Changed

| File | Change |
|---|---|
| `src/admin/panels/ProjectsPanel.jsx` | Change fetch order; add Order column with ↑↓ buttons and swap logic |
| `src/admin/panels/TablePanel.jsx` | Change fetch order; add Order column with ↑↓ buttons and swap logic |

## Verification

1. Run `npm run dev`.
2. Go to `/admin` → Projects panel: confirm rows appear ordered by `display_order`, use ↑↓ to reorder, refresh and verify order persists.
3. Go to `/admin` → Services (via TablePanel): same verification.
4. Check public portfolio `/` — services and projects render in the new order.
5. Confirm first-row ↑ and last-row ↓ buttons are visually disabled and non-interactive.
