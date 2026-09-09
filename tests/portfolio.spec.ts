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

test("navigation, Resume, LinkedIn and internal anchors are valid", async ({ page }) => {
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

test("project cards navigate to their matching detail sections", async ({ page }) => {
  await openPortfolio(page);

  const projects = ["ancient-temple", "ancient-well", "fight-sequence"];

  for (const id of projects) {
    const projectLink = page.locator(`.carousel-thumb[href="#${id}"]`);
    await expect(projectLink).toHaveCount(1);
    await projectLink.click();
    await expect(page).toHaveURL(new RegExp(`#${id}$`));
    await expect(page.locator(`#${id}`)).toBeInViewport({ ratio: 0.15 });
    await page.locator("#work").scrollIntoViewIfNeeded();
  }
});

test("Ancient Well detail carousel shows all renders and responds to controls", async ({ page }) => {
  await openPortfolio(page);
  await page.locator("#ancient-well").scrollIntoViewIfNeeded();

  const carousel = page.locator("#ancient-well .detail-carousel");
  await expect(carousel).toBeVisible();

  const image = carousel.locator(".detail-carousel-stage img");
  await expect(image).toHaveAttribute("alt", "Ancient Well view 1");
  await expect(carousel.locator(".detail-carousel-counter")).toContainText("01 / 04");

  await carousel.locator(".detail-carousel-arrows button").last().click();
  await expect(image).toHaveAttribute("alt", "Ancient Well view 2");
  await expect(carousel.locator(".detail-carousel-counter")).toContainText("02 / 04");

  await carousel.press("ArrowLeft");
  await expect(image).toHaveAttribute("alt", "Ancient Well view 1");
});

test("core portfolio semantics remain present", async ({ page }) => {
  await openPortfolio(page);

  await expect(page.locator("header.navbar")).toBeVisible();
  await expect(page.locator("main#main-content")).toBeVisible();
  await expect(page.locator("footer")).toBeVisible();
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator("#about")).toHaveCount(1);
  await expect(page.locator("#work")).toHaveCount(1);
  await expect(page.locator("#experience")).toHaveCount(1);
  await expect(page.locator("#contact")).toHaveCount(1);
});
