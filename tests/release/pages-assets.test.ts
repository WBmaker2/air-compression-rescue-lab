import { describe, expect, it } from "vitest";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const DIST = join(ROOT, "dist");
const distBuilt = existsSync(join(DIST, "index.html"));

// dist는 build 뒤에 생성되므로, 빌드 전 test:run에서는 건너뛰고 verify(build 이후)에서 검사한다.
describe.skipIf(!distBuilt)("Pages 배포 자산", () => {
  it("dist/index.html이 존재하고 base 하위 경로로 빌드된다", () => {
    const indexPath = join(DIST, "index.html");
    expect(existsSync(indexPath)).toBe(true);
    const html = readFileSync(indexPath, "utf8");
    expect(html).toContain("/air-compression-rescue-lab/");
    expect(html).toContain("공기 부피 압축 연구소");
  });

  it("index.html이 참조하는 모든 자산이 dist 안에 존재한다 (동일 출처)", () => {
    const html = readFileSync(join(DIST, "index.html"), "utf8");
    const refs = [...html.matchAll(/(?:src|href)="(\/air-compression-rescue-lab\/[^"]+)"/g)].map(
      (match) => match[1].replace("/air-compression-rescue-lab/", "")
    );
    expect(refs.length).toBeGreaterThan(0);
    for (const ref of refs) {
      expect(existsSync(join(DIST, ref)), `누락된 자산: ${ref}`).toBe(true);
    }
  });

  it("이미지 권리 장부의 자산이 로컬에 1:1로 존재한다", () => {
    const ledger = readFileSync(join(ROOT, "docs", "image-rights-ledger.md"), "utf8");
    const paths = [...ledger.matchAll(/(src\/assets\/generated\/[\w./-]+)/g)].map(
      (match) => match[1]
    );
    expect(paths.length).toBeGreaterThan(0);
    for (const path of paths) {
      expect(existsSync(join(ROOT, path)), `권리 장부 자산 누락: ${path}`).toBe(true);
    }
    const generatedDir = join(ROOT, "src", "assets", "generated");
    if (existsSync(generatedDir)) {
      const files = readdirSync(generatedDir);
      for (const file of files) {
        expect(ledger).toContain(file);
      }
    }
  });
});
