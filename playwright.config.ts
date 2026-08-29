import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  retries: 0,
  use: {
    baseURL: "http://127.0.0.1:4173/air-compression-rescue-lab/",
    ...devices["Desktop Chrome"],
  },
  webServer: {
    command: "npm run preview",
    url: "http://127.0.0.1:4173/air-compression-rescue-lab/",
    reuseExistingServer: true,
    timeout: 60_000,
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
