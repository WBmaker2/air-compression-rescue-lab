import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  retries: 0,
  use: {
    baseURL: "http://127.0.0.1:4217/air-compression-rescue-lab/",
    ...devices["Desktop Chrome"],
  },
  webServer: {
    command: "npm run preview -- --host 127.0.0.1 --port 4217",
    url: "http://127.0.0.1:4217/air-compression-rescue-lab/",
    reuseExistingServer: false,
    timeout: 60_000,
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
