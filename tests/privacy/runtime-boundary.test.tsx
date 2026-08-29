import { describe, expect, it, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../../src/app/App";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

/** 런타임 경계: 어떤 상호작용도 외부 요청이나 저장소 접근을 유발하지 않는다. */
describe("개인정보·네트워크 런타임 경계", () => {
  it("전체 미션 흐름 동안 fetch, XHR, WebSocket, EventSource, sendBeagon 호출이 0건이다", async () => {
    const fetchSpy = vi.spyOn(window, "fetch").mockRejectedValue(new Error("blocked"));
    const xhrSpy = vi.spyOn(XMLHttpRequest.prototype, "open");
    const wsSpy = vi.fn();
    const esSpy = vi.fn();
    const beaconSpy = vi.fn();
    Object.defineProperty(window, "WebSocket", { value: wsSpy, configurable: true });
    Object.defineProperty(window, "EventSource", { value: esSpy, configurable: true });
    Object.defineProperty(navigator, "sendBeacon", { value: beaconSpy, configurable: true });

    const user = userEvent.setup();
    render(<App />);
    const answers = [
      /같은 공기가 더 작은 공간에 모인다/,
      /같은 공기가 더 작은 공간에 모인다/,
      /빠져나감/,
      /공간이 커지고 간격이 넓어진다/,
      /정보가 부족해 판단을 보류한다/,
    ];
    for (const [index, answer] of answers.entries()) {
      if (index === 0) {
        await user.click(screen.getByRole("button", { name: /가상 실험 시작하기/ }));
      }
      await user.click(screen.getByRole("button", { name: /예측하기/ }));
      await user.click(screen.getByRole("radio", { name: answer }));
      await user.click(screen.getByRole("button", { name: /실행 준비/ }));
      const runButton = screen.queryByRole("button", { name: /가상 실험 실행/ });
      await user.click(runButton ?? screen.getByRole("button", { name: /관찰 결과 확인/ }));
      const checkboxes = screen.queryAllByRole("checkbox");
      if (checkboxes.length > 0) {
        await user.click(checkboxes[0]);
      } else {
        // 누출 미션은 근거가 제공되지 않으므로 진단만 진행
      }
      const diagnoseButton = screen.getByRole("button", { name: /진단하기/ });
      if (!(diagnoseButton as HTMLButtonElement).disabled) {
        await user.click(diagnoseButton);
        await user.click(screen.getByRole("radio", { name: answer }));
        await user.click(screen.getByRole("button", { name: /기록으로/ }));
        const review = screen.queryByRole("button", { name: /실험 기록 보기/ });
        if (review) await user.click(review);
        await user.click(screen.getByRole("button", { name: /다음 미션으로/ }));
      } else {
        break; // 마지막 검증은 E2E에서 담당
      }
    }

    expect(fetchSpy).not.toHaveBeenCalled();
    expect(xhrSpy).not.toHaveBeenCalled();
    expect(wsSpy).not.toHaveBeenCalled();
    expect(esSpy).not.toHaveBeenCalled();
    expect(beaconSpy).not.toHaveBeenCalled();
  });

  it("localStorage, sessionStorage, IndexedDB, cookie에 아무것도 쓰지 않는다", async () => {
    const localStorageSpy = vi.spyOn(Storage.prototype, "setItem");
    const sessionStorageSpy = vi.spyOn(Storage.prototype, "setItem");
    const indexedOpen = vi.fn();
    Object.defineProperty(window, "indexedDB", { value: { open: indexedOpen }, configurable: true });
    const cookieSetter = vi.fn();
    Object.defineProperty(document, "cookie", {
      get: () => "",
      set: cookieSetter,
      configurable: true,
    });

    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole("button", { name: /가상 실험 시작하기/ }));
    await user.click(screen.getByRole("button", { name: /예측하기/ }));
    await user.click(screen.getByRole("radio", { name: /같은 공기가 더 작은 공간에 모인다/ }));
    await user.click(screen.getByRole("button", { name: /실행 준비/ }));
    await user.click(screen.getByRole("button", { name: /가상 실험 실행/ }));

    expect(localStorageSpy).not.toHaveBeenCalled();
    expect(sessionStorageSpy).not.toHaveBeenCalled();
    expect(indexedOpen).not.toHaveBeenCalled();
    expect(cookieSetter).not.toHaveBeenCalled();
    expect(window.localStorage.length).toBe(0);
    expect(window.sessionStorage.length).toBe(0);
  });
});
