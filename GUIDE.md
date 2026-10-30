# Your website — simple guide

## Part 1 — Put the site online (one time, about 20 minutes)

**Already done for you:** this folder is set up as a Git repository, a tracked project folder with a first saved
version ("Portfolio website"). You only need to sign in, upload it and switch the website on.

You'll use **GitHub Desktop** (already installed on this PC), so you won't type any commands.

### Step 1 — Create a GitHub account (skip if you have one)
1. Go to <https://github.com/signup>.
2. Enter your email, a password and a **username**. Your username becomes part of your website address, so pick
   something professional (for example `saarthak108`).
3. Verify your email by clicking the code or link GitHub sends you.

### Step 2 — Sign in to GitHub Desktop
1. Open **GitHub Desktop** from the Start menu.
2. If it shows a welcome screen, click **Sign in to GitHub.com**. Otherwise go to **File → Options → Accounts → Sign in**.
3. Your browser opens. Click **Authorize desktop**, then allow it to open GitHub Desktop again.
4. Back in GitHub Desktop, it should show your name under **File → Options → Accounts**.

### Step 3 — Add the website folder
1. In GitHub Desktop: **File → Add local repository…**
2. Click **Choose…** and go to your website folder:
   `D:\Website\KzY8UGvcv0fBjqIg9ts1tJosjIYhyEFrmC3tiIFeeg4\portfolio`
   (the folder that contains `package.json`, `src` and `public`). Click **Select Folder**.
3. Click **Add repository**.
4. The top-left should now say **Current repository: portfolio** and **Current branch: main**.

### Step 4 — Upload it (publish)
1. Click the blue **Publish repository** button (in the middle of the window, or at the top right).
2. Fill in the dialog:
   - **Name:** type **`YOUR-USERNAME.github.io`**, using your exact GitHub username. For example, if your username is
     `saarthak108`, type `saarthak108.github.io`. This gives you the address `https://saarthak108.github.io/`.
   - **Description:** optional.
   - **Keep this code private:** **untick it**. Free GitHub websites must be public.
3. Click **Publish repository** and wait for the progress bar. It may take 5–10 minutes because of the videos.

### Step 5 — Switch the website on
1. In GitHub Desktop: **Repository → View on GitHub**. Your browser opens the repository page.
2. Click the **Settings** tab (gear icon, in the row of tabs near the top). If your window is narrow, it may be under the **…** menu.
3. In the left sidebar, under "Code and automation", click **Pages**.
4. Under **Build and deployment → Source**, open the dropdown and choose **GitHub Actions**. There's no Save button;
   the choice applies immediately.

### Step 6 — Build the site
1. Click the **Actions** tab at the top of the repository page.
   - You may see one run with a **red ✗** from when you published. That's expected: the website wasn't switched on yet.
2. In the left list, click **Deploy to GitHub Pages**.
3. On the right, click **Run workflow ▾**, then the green **Run workflow** button.
4. Wait 2–4 minutes. The run turns from a yellow dot to a **green ✓**.

### Step 7 — Visit your website
Open `https://YOUR-USERNAME.github.io/`. You'll also find the link under **Settings → Pages** ("Your site is live at…").
If you see a 404 page at first, wait a minute and refresh.

### If something goes wrong
| What you see | What to do |
|---|---|
| Red ✗ in Actions *after* Step 5 | Click the red run and take a screenshot of the error, then send it to Claude. |
| "Publish repository" button missing | You're signed out. Repeat Step 2. |
| The name has a typo | On github.com: **Settings → General → Repository name** → fix it → **Rename**. |
| You chose a different name, like `portfolio` | That works too. The address becomes `https://YOUR-USERNAME.github.io/portfolio/`. |

You can connect your own domain (like `saarthak.com`) later under **Settings → Pages → Custom domain**.

## Part 2 — Updating the site later

Every update follows the same three steps:

1. **Change something** (see below).
2. Open GitHub Desktop. The left side lists every file you changed. In the **Summary** box at the bottom-left, write a short note (for example "added new project"), then click **Commit to main**.
3. Click **Push origin** at the top. About 2 minutes later the live site updates by itself (you can watch it in the **Actions** tab).

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
