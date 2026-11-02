# Asset sources: How to do any website (video 6)

Real interface material comes from **official public documentation and repositories**. It was downloaded on 2026-10-25 into `raw/`, and the originals are unmodified. Each piece is shown as a taped print with a credit tag «لقطة رسمية · <source>».

- No private accounts or screens were captured.
- Nothing was bought.
- No watermarks were removed.

| Use in video | File (raw/) | Source URL | Treatment |
|---|---|---|---|
| «افتح VS Code» | `vscode_product-screenshot.png` (1575×1071) | https://code.visualstudio.com/assets/images/product-screenshot.png | Full window, slow push-in (×1.10) |
| «وافتح التيرمنال» | `vscode_integrated-terminal.png` (1096×586) | https://code.visualstudio.com/assets/docs/terminal/basics/integrated-terminal.png (docs page: /docs/terminal/basics) | Full image, a yellow bracket on the TERMINAL tab, label «Terminal ← View» |
| Claude Code running in the project folder; Claude Code working on the prompt | `claudecode_demo.gif` (1552×992, 10 fps) | https://github.com/anthropics/claude-code/raw/main/demo.gif (official README demo) | Window crop 1460×900 @ (44, 50). 0.25 s still (welcome header); 8–18 s working segment, real time, frames repeated ×3 to 30 fps |
| «ارفع الكود على GitHub» | `github_repo-create-nav.png` (732×516) | https://docs.github.com/assets/cb-29762/images/help/repository/repo-create-global-nav-update.png (GitHub Docs, "Creating a new repository") | Full image; the orange highlight is GitHub's own |
| «اربط بـ Vercel» | `vercel_repo-list-dark.png` (1766×1404) | https://7nyt0uhk7sse4zvn.public.blob.vercel-storage.com/docs-assets/static/docs/concepts/deployments/git/index/repo-list-dark.png (Vercel Docs, /docs/git) | Top crop ("Import Git Repository") |

Downloaded but not used: `vscode_…` other docs images and `github_create-repository-name.png` (it shows a different repository name, "hello").

## Explanatory graphics (our Paper Workshop style, labelled)

- **ChatGPT windows:** our own paper window titled "ChatGPT", with the plan and prompt text written for the example. Badge «توضيح». No OpenAI logo or UI copy is used.
- **Terminal cards:**
  - Real commands: `npm install -g @anthropic-ai/claude-code`, `claude`, `/login`, `cd sukkar-coffee`, `git add . && git commit -m "init"`, `git push -u origin main`.
  - The install line shows the npm package name `@anthropic-ai/claude-code`.
- **The example project «سُكّر» / `sukkar-coffee`:**
  - It is one invented café site, carried from planning to the final reveal.
  - It is drawn in the brand style and labelled «مثال توضيحي».
  - The URL `sukkar-coffee.vercel.app` is illustrative. **No account was created and nothing was deployed or published.**
- **The Vercel repository row, Deploy button, build bar «Building…/Ready» and «تم النشر» stamp:** animated explanation, badged «لقطة توثيق + رسم توضيحي». They are not a recording of a real deployment.
