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

- If the request is only to raise or lower the popup:
  - do not delete the popup component
  - toggle it with the smallest safe code change
  - keep popup data in place for later reuse

- If the request is to update popup content:
  - keep the current structure
  - update `imageUrl`, then review `linkUrl` and `alt`
  - change copy only when new wording was explicitly provided

- If the request is for development only:
  - work on `dev-b2b`
  - create a popup-only commit
  - push to `b2b` with `git push b2b dev-b2b:main`
  - do not push anything to `origin`

- If the request is for production only:
  - work on `main`
  - create a popup-only commit
  - do not include unrelated `dev-b2b` commits or working tree changes
  - push only that popup-related commit to `origin/main`

- If the request is to release development work to production:
  - switch to `main`
  - do not merge all development history blindly
  - cherry-pick only the approved commits from `dev-b2b`
  - push to `origin`

- If the request is ambiguous, prefer the safer development flow first

## Local safety guards

- `.git/hooks/pre-push` blocks `main -> b2b` and `dev-b2b -> origin`
- `.git/hooks/pre-commit` blocks direct commits on `main`
- Cherry-pick commits on `main` are allowed
