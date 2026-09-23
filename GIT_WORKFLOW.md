# Git Workflow

## Branch and remote rules

- Production work happens only on `main`
- Development work happens only on `dev-b2b`
- `main` pushes only to `origin`
- `dev-b2b` pushes only to `b2b`
- Do not push changes from one branch directly to the other remote
- `b2b` uses SSH: `git@github.com:dasomkkim/B2B_HR.git`
- `origin` uses SSH: `git@github.com:assestadev/piccle-website.git`
- Before release work, confirm remotes with `git remote -v`

If `origin` was switched back to HTTPS by mistake, restore it with:

```bash
git remote set-url origin git@github.com:assestadev/piccle-website.git
```

## Recommended release flow

1. Switch to `dev-b2b`
2. Do development work and commit there
3. Push to `b2b` and verify in development
4. Identify only the approved commit hashes
5. Switch to `main`
6. Cherry-pick only the approved commits
7. Push `main` to `origin`

## Common commands

```bash
git switch dev-b2b
git add .
git commit -m "feat: example change"
git push b2b dev-b2b:main
```

```bash
git log --oneline dev-b2b
git switch main
git cherry-pick <commit-hash>
git push origin main
```

## Service page visibility

- Development hosts should show `/service`
- The production host `piccle.assesta.com` should hide `/service` unless explicitly enabled
- Visibility is controlled in `lib/service-preview.ts`

## Landing popup safety

- The popup is mounted from `app/page.tsx`
- The popup implementation lives in `components/landing-popup.tsx`
- Keep the same render structure unless the request explicitly asks for a layout change
- If you remove only `components/landing-popup.tsx` and leave the import or render call behind, the app can fail to build

Safest temporary popup toggle:

- Keep the component file
- Make the smallest safe code change
- If the popup uses item-level control, switch `visible: true` and `visible: false`
- If the popup uses a global flag, switch `LANDING_POPUP_ENABLED = true` and `false`

Full removal is safe only if all three are done together:

- Remove the `LandingPopup` import from `app/page.tsx`
- Remove the `<LandingPopup />` render from `app/page.tsx`
- Then delete or stop using `components/landing-popup.tsx`

Popup image updates should normally change only:

- `imageUrl`
- `linkUrl`
- `alt`

After popup changes, verify related references with:

```bash
rg -n "LandingPopup|landing-popup|popup|팝업" app components
```

## Popup and release handling

Popup changes are frequent (at least monthly) and low-risk, so they use a
dedicated flow instead of the `dev-b2b` cherry-pick process. Do not create a
new long-lived branch per change and do not leave branches around after
merge — this caused branch sprawl (`popup-off-main`, `popup-push-august`,
`popup-release`, `release-disable-aug-popup` all existed for the same kind
of change and were deleted on 2026-09-23 after confirming they carried no
unique commits versus `origin/main`).

Standard popup flow:

1. Start from an up-to-date `main`, always:
   ```bash
   git fetch origin
   git switch -c popup/YYYY-MM origin/main
   ```
2. Make exactly one commit that only touches `lib/landing-popup-config.ts`
   (`enabled`, `imageUrl`, `linkUrl`, `alt`). Do not mix in unrelated
   changes or leftover working-tree state from other branches.
3. Push and open a PR into `main`:
   ```bash
   git push origin popup/YYYY-MM
   ```
4. Verify the change on the Vercel preview deployment attached to the PR
   before merging — do not merge on faith.
5. Squash-merge the PR once confirmed. Delete the branch immediately after
   merge (enable "auto-delete branch" on the GitHub repo if not already on).
6. Locally: `git switch main && git pull`.

- Do not delete the popup component (`components/landing-popup.tsx`) as
  part of a popup-only change.
- Full removal is safe only if all three are done together: remove the
  `LandingPopup` import from `app/page.tsx`, remove the `<LandingPopup />`
  render, then delete/stop using the component file.
- If the request is ambiguous, prefer this popup flow over touching
  `dev-b2b`/`main` directly — it is the safer default for small,
  frequent, production-only edits.

## Local safety guards

- `.git/hooks/pre-push` blocks `main -> b2b` and `dev-b2b -> origin`
- `.git/hooks/pre-commit` blocks direct commits on `main`
- Cherry-pick commits on `main` are allowed
