import { expect, test, type Page } from "@playwright/test";

async function openPortfolio(page: Page) {
  await page.goto("./", { waitUntil: "domcontentloaded" });
  await expect(page.locator("main#main-content")).toBeVisible();
}

test("portfolio loads without runtime or same-origin resource failures", async ({ page }) => {
  const pageErrors: string[] = [];
  const consoleErrors: string[] = [];
  const failedRequests: string[] = [];

  page.on("pageerror", (error) => pageErrors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  page.on("requestfailed", (request) => {
    const failure = request.failure()?.errorText ?? "unknown failure";
    const isSameOrigin = request.url().startsWith("http://127.0.0.1:4173");
    if (isSameOrigin && !failure.includes("ERR_ABORTED")) {
      failedRequests.push(`${request.url()} — ${failure}`);
    }
  });

  await openPortfolio(page);
  await page.waitForTimeout(1_000);

  await expect(page.locator("h1")).toContainText("Building worlds");
  expect(pageErrors, `Page errors: ${pageErrors.join(" | ")}`).toEqual([]);
  expect(consoleErrors, `Console errors: ${consoleErrors.join(" | ")}`).toEqual([]);
  expect(failedRequests, `Failed resources: ${failedRequests.join(" | ")}`).toEqual([]);
});

test("navigation, Resume, LinkedIn and home anchors are valid", async ({ page }) => {
  await openPortfolio(page);

  const nav = page.locator("header.navbar nav");
  await expect(nav).toHaveCount(1);

  const resume = nav.locator('a[href*=".pdf"]');
  await expect(resume).toHaveCount(1);
  await expect(resume).toHaveAttribute("target", "_blank");
  const resumeHref = await resume.getAttribute("href");
  expect(resumeHref).toMatch(/\.pdf(?:$|[?#])/i);

  const linkedIn = nav.locator('a[href*="linkedin.com"]');
  await expect(linkedIn).toHaveCount(1);
  await expect(linkedIn).toHaveAttribute("target", "_blank");

  const internalTargets = await page.locator('a[href^="#"]').evaluateAll((links) =>
    Array.from(new Set(links.map((link) => link.getAttribute("href")).filter(Boolean))) as string[],
  );

  for (const href of internalTargets) {
    await expect(page.locator(href)).toHaveCount(1);
  }
});

test("project cards open dedicated project detail pages", async ({ page }) => {
  const projects = [
    ["ancient-temple", "Ancient Temple"],
    ["ancient-well", "Ancient Well"],
    ["alarm-clock", "Alarm Clock"],
    ["fight-sequence", "Fight Sequence"],
  ] as const;

  for (const [slug, title] of projects) {
    await openPortfolio(page);
    const projectLink = page.locator(`.carousel-thumb[href="?project=${slug}"]`);
    await expect(projectLink).toHaveCount(1);
    await projectLink.click();

    await expect(page).toHaveURL(new RegExp(`\\?project=${slug}$`));
    await expect(page.locator("main.project-page")).toBeVisible();
    await expect(page.locator(".project-page-heading h1")).toHaveText(title);
    await expect(page.getByRole("link", { name: /Back to selected work/i })).toHaveAttribute("href", "./#work");
  }
});

test("Ancient Well detail page keeps the media carousel", async ({ page }) => {
  await page.goto("./?project=ancient-well", { waitUntil: "domcontentloaded" });

  const carousel = page.locator(".project-page .detail-carousel");
  await expect(carousel).toBeVisible();
  await expect(carousel.locator(".detail-carousel-counter")).toContainText("01 / 05");

  const video = carousel.locator(".detail-carousel-stage video");
  await expect(video).toHaveCount(1);
  await video.scrollIntoViewIfNeeded();
  const playbackFlags = await video.evaluate((element: HTMLVideoElement) => ({ loop: element.loop, muted: element.muted }));
  expect(playbackFlags).toEqual({ loop: true, muted: true });

  await carousel.locator(".detail-carousel-arrows button").last().click();
  const image = carousel.locator(".detail-carousel-stage img");
  await expect(image).toHaveAttribute("alt", "Ancient Well render view 1");
  await expect(carousel.locator(".detail-carousel-counter")).toContainText("02 / 05");
});

test("Alarm Clock detail page uses render 3 as cover and the nine-item carousel", async ({ page }) => {
  await openPortfolio(page);

  const alarmCard = page.locator('.carousel-thumb[href="?project=alarm-clock"]');
  await expect(alarmCard.locator("img")).toHaveAttribute("src", /3-[^/]+\.jpg|3\.jpg/);

  await page.goto("./?project=alarm-clock", { waitUntil: "domcontentloaded" });
  const carousel = page.locator(".project-page .detail-carousel");
  await expect(carousel).toBeVisible();
  await expect(carousel.locator(".detail-carousel-counter")).toContainText("01 / 09");
  await expect(carousel.locator(".detail-carousel-dots button")).toHaveCount(9);

  await carousel.locator(".detail-carousel-arrows button").last().click();
  await expect(carousel.locator(".detail-carousel-counter")).toContainText("02 / 09");
  await expect(carousel.locator(".detail-carousel-stage video")).toHaveAttribute("aria-label", "Alarm Clock wireframe turntable");

  await carousel.locator(".detail-carousel-arrows button").last().click();
  await expect(carousel.locator(".detail-carousel-counter")).toContainText("03 / 09");
  await expect(carousel.locator(".detail-carousel-stage img")).toHaveAttribute("alt", "Alarm Clock final render 3");
});

test("home page no longer renders project detail sections inline", async ({ page }) => {
  await openPortfolio(page);

  await expect(page.locator("header.navbar")).toBeVisible();
  await expect(page.locator("main#main-content")).toBeVisible();
  await expect(page.locator("footer")).toBeVisible();
  await expect(page.locator("#about")).toHaveCount(1);
  await expect(page.locator("#work")).toHaveCount(1);
  await expect(page.locator("#experience")).toHaveCount(1);
  await expect(page.locator("#contact")).toHaveCount(1);
  await expect(page.locator(".project-page")).toHaveCount(0);
  await expect(page.locator('.carousel-thumb[href^="?project="]')).toHaveCount(4);
});
