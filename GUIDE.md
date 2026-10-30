# Your website — simple guide

## Part 1 — Put the site online (one time, ~15 minutes)

You'll use **GitHub Desktop**, a normal app with buttons, so no typing commands.

1. **Make a GitHub account** at <https://github.com/signup> if you don't have one.
2. **Install GitHub Desktop** from <https://desktop.github.com> and sign in with that account.
3. In GitHub Desktop: **File → Add local repository…** → choose this folder
   (`C:\Users\saart\Desktop\…\portfolio`).
   It will say "this directory does not appear to be a Git repository". Click **create a repository**, then **Create repository**.
4. Click **Publish repository** (top bar).
   - **Name:** see "Choosing the name" below.
   - **Untick "Keep this code private"**. Free GitHub Pages needs a public repository.
   - Click **Publish repository**. The first upload takes a few minutes because of the videos (~100 MB).
5. Open the repository on github.com (**Repository → View on GitHub**). Then:
   **Settings → Pages → Build and deployment → Source: GitHub Actions**.
6. Click the **Actions** tab. A job called "Deploy to GitHub Pages" runs for about 2 minutes. When it shows a green tick,
   your site is live. The address is shown under **Settings → Pages**.

**Choosing the name**

| Repository name | Website address |
|---|---|
| `portfolio` | `https://YOUR-USERNAME.github.io/portfolio/` |
| `YOUR-USERNAME.github.io` | `https://YOUR-USERNAME.github.io/` (cleanest) |

Both work, because the site adjusts itself automatically. You can connect your own domain later in **Settings → Pages → Custom domain**.

## Part 2 — Updating the site later

Every update follows the same three steps:

1. **Change something** (see below).
2. In GitHub Desktop, write a short note in **Summary** (for example "added new project"), then click **Commit to main**.
3. Click **Push origin**. About 2 minutes later the live site updates by itself.

To **preview before publishing**, open a terminal in this folder and run `npm run dev`. Then open <http://localhost:5173>.

### Changing text
All the words are in `src/data/`. Open the files in any text editor (Notepad works; VS Code is nicer):
- `projects.ts`: project names and briefs (`summary` = the bold line, `description` = the paragraphs)
- `profile.ts`: bio, experience, achievements, skills, contact links

Only change text **between the quotes**. Keep the quotes and commas as they are.

### Adding new renders or projects
Everything comes from your library folder `D:\Website\My projects`:

| To add… | Do this |
|---|---|
| A **practice render** | Drop the image into `Practice renders` (e.g. `Practice render 011.png`). |
| A **render to an existing ArchViz project** | Drop it into that project's folder. |
| A **new ArchViz project** | Make a new folder inside `Archviz`, put its renders in it, and add ` - hero` to the end of the cover image's file name. |
| A **new 3D film** | Drop the `.mp4` into `Unreal & Blender Projects`. |

Then open a terminal in the website folder and run:

```
npm run import
```

This resizes and compresses everything into web-ready files.

- **Renders and practice renders:** these appear on the site automatically, including in the Gallery.
- **New ArchViz project or new film:** it needs a short entry (title and brief) in `src/data/projects.ts`. Copy an existing block such as `arch('nfc', { … })` and change the words.
- **Practice render titles:** add a line to `practiceText` in the same file.

**Will new work break the layout?** No. Every section is built to take any number of items:
- Cards use fixed frames, so a new card lines up with the others.
- The Gallery wall rebalances its columns automatically.
- The viewer adapts to tall or wide images.

## Getting help
If something looks wrong, GitHub Desktop's **History** tab shows every change. You can right-click a change and choose
**Revert** to undo it. A simpler point-and-click editor (a small app) can be built later if you'd like.
