import { spawn } from "node:child_process";
import { copyFile, mkdir, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import ffmpegPath from "ffmpeg-static";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const rawDir = path.join(root, "scripts", ".demo-raw");
const outMp4 = path.join(root, "public", "demo.mp4");
const outPoster = path.join(root, "public", "demo-poster.jpg");
const outVtt = path.join(root, "public", "demo.vtt");
const base = process.env.DEMO_URL || "http://localhost:3000";
const email = process.env.DEMO_EMAIL || "maria@yenko.co";

const cues = [];
const started = Date.now();

function now() {
  return (Date.now() - started) / 1000;
}

function pathname(page) {
  return new URL(page.url()).pathname;
}

function waitForAppPath(page, extra = []) {
  const allowed = new Set(["/app", "/billing", "/onboarding", ...extra]);
  return page.waitForURL(
    (url) => {
      const path = new URL(url).pathname;
      return allowed.has(path) || path.startsWith("/app/");
    },
    { timeout: 25_000 },
  );
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function formatStamp(seconds) {
  const ms = Math.max(0, Math.round(seconds * 1000));
  const h = Math.floor(ms / 3_600_000);
  const m = Math.floor((ms % 3_600_000) / 60_000);
  const s = Math.floor((ms % 60_000) / 1000);
  const frac = ms % 1000;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}.${String(frac).padStart(3, "0")}`;
}

async function run(bin, args) {
  await new Promise((resolve, reject) => {
    const child = spawn(bin, args, { stdio: "inherit" });
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${bin} exited ${code}`));
    });
  });
}

async function caption(page, text) {
  cues.push({ at: now(), text });
  await page.evaluate((label) => {
    let bar = document.getElementById("pb-demo-caption");
    if (!bar) {
      bar = document.createElement("div");
      bar.id = "pb-demo-caption";
      bar.style.cssText = [
        "position:fixed",
        "left:28px",
        "right:28px",
        "bottom:28px",
        "z-index:2147483647",
        "padding:14px 22px",
        "border-radius:999px",
        "background:#16081f",
        "color:#e8b44d",
        "font:500 16px/1.35 Geist,ui-sans-serif,system-ui,sans-serif",
        "letter-spacing:0.01em",
        "box-shadow:0 12px 40px rgba(0,0,0,.45)",
        "pointer-events:none",
      ].join(";");
      document.body.appendChild(bar);
    }
    bar.textContent = label;
  }, text);
}

async function hideChrome(page) {
  await page.addStyleTag({
    content: `
      nextjs-portal, [data-nextjs-toast], [data-next-badge-root] { display: none !important; }
      #pb-mouse {
        position: fixed;
        width: 18px;
        height: 18px;
        border-radius: 999px;
        border: 2px solid #e8b44d;
        background: rgba(232, 180, 77, 0.28);
        transform: translate(-50%, -50%);
        pointer-events: none;
        z-index: 2147483646;
      }
    `,
  });
  await page.evaluate(() => {
    if (document.getElementById("pb-mouse")) return;
    const dot = document.createElement("div");
    dot.id = "pb-mouse";
    document.documentElement.appendChild(dot);
    document.addEventListener(
      "mousemove",
      (event) => {
        dot.style.left = `${event.clientX}px`;
        dot.style.top = `${event.clientY}px`;
      },
      true,
    );
  });
}

async function moveTo(page, locator) {
  const box = await locator.boundingBox();
  if (!box) return;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, {
    steps: 14,
  });
  await sleep(220);
}

async function click(page, locator) {
  try {
    await moveTo(page, locator);
  } catch {
    // Still click even if the cursor chase times out.
  }
  await locator.click({ timeout: 10_000 });
}

function navLink(page, href) {
  return page.locator(`a[href="${href}"]`).first();
}

async function isMissingPage(page) {
  const text = await page.locator("body").innerText();
  return /this page could not be found/i.test(text);
}

async function visit(page, href, line) {
  await caption(page, line);
  const link = navLink(page, href);
  try {
    if (await link.isVisible({ timeout: 2500 })) {
      await click(page, link);
      await page.waitForURL((url) => new URL(url).pathname === href, {
        timeout: 10_000,
      });
    } else {
      throw new Error("nav hidden");
    }
  } catch {
    await page.goto(`${base}${href}`, { waitUntil: "domcontentloaded" });
  }
  if (await isMissingPage(page)) {
    await sleep(800);
    await page.goto(`${base}${href}`, { waitUntil: "networkidle" });
  }
  if (await isMissingPage(page)) {
    throw new Error(`Demo hit a 404 at ${href}`);
  }
  await hideChrome(page);
}

async function smoothScroll(page, y) {
  await page.evaluate(async (target) => {
    const start = window.scrollY;
    const distance = target - start;
    const duration = 1100;
    const origin = performance.now();
    await new Promise((resolve) => {
      const tick = (stamp) => {
        const t = Math.min(1, (stamp - origin) / duration);
        const eased = 1 - (1 - t) ** 3;
        window.scrollTo(0, start + distance * eased);
        if (t < 1) requestAnimationFrame(tick);
        else resolve();
      };
      requestAnimationFrame(tick);
    });
  }, y);
}

async function writeVtt(duration) {
  const lines = ["WEBVTT", ""];
  for (let i = 0; i < cues.length; i += 1) {
    const start = cues[i].at;
    const end = i + 1 < cues.length ? cues[i + 1].at : duration;
    if (end <= start) continue;
    lines.push(`${formatStamp(start)} --> ${formatStamp(end)}`);
    lines.push(cues[i].text);
    lines.push("");
  }
  await writeFile(outVtt, lines.join("\n"));
}

async function main() {
  await mkdir(rawDir, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
    colorScheme: "dark",
    locale: "en-US",
    recordVideo: {
      dir: rawDir,
      size: { width: 1440, height: 900 },
    },
  });
  const page = await context.newPage();

  await page.goto(base, { waitUntil: "networkidle" });
  await hideChrome(page);
  await caption(page, "The weekly scorecard for founders");
  await sleep(3200);

  await caption(page, "Same page every Monday");
  const ritual = page.locator("#ritual");
  await ritual.scrollIntoViewIfNeeded();
  await smoothScroll(page, await ritual.evaluate((el) => el.offsetTop - 24));
  await sleep(2800);

  await caption(page, "$12 a month, or $99 for the founding year");
  const pricing = page.locator("#pricing");
  await pricing.scrollIntoViewIfNeeded();
  await sleep(2400);

  await caption(page, "Sign in with the email you already use");
  await click(page, page.getByRole("link", { name: "Get the Founder plan" }));
  await page.waitForURL((url) => new URL(url).pathname === "/login", {
    timeout: 20_000,
  });
  await hideChrome(page);

  await caption(page, "Use your work email");
  const field = page.locator("#email");
  await click(page, field);
  await field.fill("");
  await field.pressSequentially(email, { delay: 55 });
  await sleep(400);
  await click(page, page.getByRole("button", { name: "Continue" }));
  await waitForAppPath(page);
  await hideChrome(page);

  if (pathname(page) === "/billing") {
    const openDash = page.getByRole("link", { name: /Open dashboard|Finish setup/ });
    const unlock = page.getByRole("button", { name: "Get the Founder plan" }).first();
    if (await openDash.count()) {
      await caption(page, "One plan. Then the Monday page.");
      await sleep(1600);
      await click(page, openDash);
      await waitForAppPath(page);
    } else if (await unlock.count()) {
      await caption(page, "Unlock the Founder plan");
      await sleep(1200);
      await click(page, unlock);
      await waitForAppPath(page);
    }
    await hideChrome(page);
  }

  if (pathname(page) === "/onboarding") {
    await caption(page, "Name the company. Write this week’s numbers.");
    await sleep(800);
    const name = page.locator("#name");
    if (await name.count()) {
      await click(page, name);
      await name.fill("");
      await name.pressSequentially("Yenko Labs", { delay: 40 });
    }
    const mrr = page.locator("#mrr");
    if (await mrr.count()) {
      await mrr.fill("2400");
      await page.locator("#payingUsers").fill("3");
      await page.locator("#runwayMonths").fill("8");
      await page.locator("#weeklyGoal").fill("Write the week on one page");
    }
    await sleep(400);
    await click(page, page.getByRole("button", { name: "Open my scorecard" }));
    await waitForAppPath(page);
    await hideChrome(page);
  }

  if (pathname(page) !== "/app" && !pathname(page).startsWith("/app/")) {
    await page.goto(`${base}/app`, { waitUntil: "networkidle" });
    await hideChrome(page);
  }

  await page.waitForLoadState("networkidle");
  await hideChrome(page);
  await navLink(page, "/app/customers").waitFor({ timeout: 15_000 });
  await caption(page, "MRR, paying users, runway — on one screen");
  await sleep(2200);
  await page.mouse.wheel(0, 420);
  await sleep(1800);
  await page.mouse.wheel(0, 420);
  await sleep(1400);

  await visit(page, "/app/customers", "Who actually paid");
  await sleep(2800);

  await visit(page, "/app/review", "Three priorities. Nothing else gets a line.");
  await sleep(2800);

  await visit(
    page,
    "/app/integrations",
    "Analytics, Stripe, and social — connected",
  );
  await sleep(1800);
  await page.mouse.wheel(0, 360);
  await sleep(1600);

  await caption(page, "pulseboard.lol  ·  $12 / month");
  await page.evaluate(() => {
    const card = document.createElement("div");
    card.style.cssText =
      "position:fixed;inset:0;z-index:2147483645;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#16081f;color:white;text-align:center;padding:48px;";
    card.innerHTML = `
      <img src="/logo.png" width="72" height="72" alt="" style="border-radius:16px" />
      <p style="margin:28px 0 0;font:italic 42px/1 Instrument Serif,Georgia,serif;color:#e8b44d">pulseboard</p>
      <p style="margin:18px 0 0;font:800 56px/0.95 Geist,ui-sans-serif,system-ui;letter-spacing:-0.04em">Write the week.</p>
      <p style="margin:16px 0 0;font:500 18px/1.4 Geist,ui-sans-serif,system-ui;color:rgba(255,255,255,.62)">One Monday page. $12 a month.</p>
      <p style="margin:28px 0 0;font:500 16px/1 Geist,ui-sans-serif,system-ui;color:#e8b44d">pulseboard.lol</p>
    `;
    document.body.appendChild(card);
  });
  await sleep(3600);

  const duration = now();
  const video = page.video();
  await context.close();
  await browser.close();

  if (!video) throw new Error("Playwright did not record a video");
  const rawPath = await video.path();
  const files = await readdir(rawDir);
  const source =
    rawPath && files.includes(path.basename(rawPath))
      ? rawPath
      : path.join(rawDir, files.find((name) => name.endsWith(".webm")) ?? "");
  if (!source) throw new Error("No raw WebM in scripts/.demo-raw");

  if (!ffmpegPath) throw new Error("ffmpeg-static is missing");
  await run(ffmpegPath, [
    "-y",
    "-i",
    source,
    "-vf",
    "scale=1280:-2,fps=30",
    "-c:v",
    "libx264",
    "-pix_fmt",
    "yuv420p",
    "-crf",
    "18",
    "-an",
    "-movflags",
    "+faststart",
    outMp4,
  ]);
  await run(ffmpegPath, [
    "-y",
    "-i",
    outMp4,
    "-ss",
    "00:00:06.500",
    "-frames:v",
    "1",
    "-update",
    "1",
    outPoster,
  ]);
  await writeVtt(duration);
  await copyFile(source, path.join(rawDir, "latest.webm"));
  console.log(`Wrote ${path.relative(root, outMp4)} (${duration.toFixed(1)}s)`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
