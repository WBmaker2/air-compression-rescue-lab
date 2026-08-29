import { useEffect, useState } from "react";

/** 축소 모션 환경을 학생에게 알려 주는 정보 표시(밝은 교실용 라이트 모드 고정). */
export function AccessibilityToolbar() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return (
    <p className="accessibility-toolbar" role="note">
      {reducedMotion
        ? "움직임 줄임 모드예요. 필수 버튼은 굵은 테두리로 표시돼요."
        : "글자 확대는 브라우저 확대(200%까지)로 사용할 수 있어요."}
    </p>
  );
}
