import { 演出に写す入力欄の見た目 } from "./copied-input-value";
import {
  ENTER_APP_TIMING,
  type EnterAppMotion,
  type PanelRect,
  アプリのレールの位置を求める,
  入場の演出を選ぶ,
  同じ位置にある,
} from "./enter-app-plan";
import {
  DROPLET_HOST_ATTRIBUTE,
  LOGIN_SCENE_FREEZE_EVENT,
  LOGIN_SCENE_MELT_EVENT,
} from "./scene-freeze";

const DROPLET_SELECTOR = "canvas[data-login-droplet]";
const CONTENT_SELECTOR = "[data-login-content]";
const LENS_FILTER_ID = "enter-app-lens";
const WIPE_MASK =
  "linear-gradient(to right, #000 0, #000 33.333%, transparent 48.333%, transparent 100%)";
const WIPE_TRAVEL = 1.45;
const WIPE_PASSES_RAIL_AT = 0.7;
const SHEET_VARIABLES = ["--glass-radius", "--sheet-padding", "--field-fill"];
const SHEET_SELECTOR = "[data-login-sheet]";
const PHOTO_SELECTOR = "[data-login-photo]";
const OVERLAY_SELECTOR = "[data-enter-app]";
const APP_RAIL_SELECTOR = "[data-app-rail]";
const MOVE_EASING = "cubic-bezier(0.32, 0.72, 0, 1)";
const OVERLAY_Z_INDEX = "1000";

const px = (value: number): string => `${value}px`;

const rectKeyframe = (rect: PanelRect): Keyframe => ({
  left: px(rect.left),
  top: px(rect.top),
  width: px(rect.width),
  height: px(rect.height),
  borderRadius: px(rect.radius),
});

const 要素の位置を測る = (element: Element): PanelRect => {
  const rect = element.getBoundingClientRect();
  return {
    left: rect.left,
    top: rect.top,
    width: rect.width,
    height: rect.height,
    radius: Number.parseFloat(getComputedStyle(element).borderTopLeftRadius),
  };
};

const layer = (): HTMLDivElement => {
  const element = document.createElement("div");
  element.style.position = "absolute";
  element.style.inset = "0";
  element.style.borderRadius = "inherit";
  return element;
};

const 雫を静止画に写す = (): HTMLCanvasElement | null => {
  document.dispatchEvent(new Event(LOGIN_SCENE_FREEZE_EVENT));
  const droplet = document.querySelector<HTMLCanvasElement>(DROPLET_SELECTOR);
  if (!droplet || droplet.width === 0 || droplet.height === 0) {
    return null;
  }
  const still = document.createElement("canvas");
  still.width = droplet.width;
  still.height = droplet.height;
  still.style.cssText = "position:absolute;inset:0;width:100%;height:100%";
  still.getContext("2d")?.drawImage(droplet, 0, 0);
  return still;
};

const 写真の覆いを作る = (photo: HTMLElement): HTMLDivElement => {
  const source = getComputedStyle(photo);
  const root = layer();
  root.style.background = "#000";
  const picture = layer();
  picture.style.backgroundImage = source.backgroundImage;
  picture.style.backgroundPosition = source.backgroundPosition;
  picture.style.backgroundSize = "cover";
  picture.style.transform = source.transform;
  picture.style.filter = source.filter;
  root.appendChild(picture);
  return root;
};

const 溶ける雫を覆いへ移す = (cover: HTMLDivElement): boolean => {
  const host = layer();
  host.setAttribute(DROPLET_HOST_ATTRIBUTE, "");
  cover.appendChild(host);
  document.dispatchEvent(new Event(LOGIN_SCENE_MELT_EVENT));
  host.removeAttribute(DROPLET_HOST_ATTRIBUTE);
  if (host.firstChild) {
    return true;
  }
  host.remove();
  return false;
};

interface Lens {
  readonly filter: SVGFilterElement;
  readonly image: SVGFEImageElement;
}

interface Panel {
  readonly root: HTMLDivElement;
  readonly content: HTMLElement | null;
  readonly lens: Lens | null;
}

interface LensInput {
  readonly sheet: HTMLElement;
  readonly film: HTMLDivElement;
}

const 屈折を板へ写す = ({ sheet, film }: LensInput): Lens | null => {
  const source = sheet.querySelector<HTMLElement>(".liquid-glass");
  const copy = source?.querySelector("svg")?.cloneNode(true);
  if (!source || !(copy instanceof SVGSVGElement)) {
    return null;
  }
  const filter = copy.querySelector("filter");
  const image = copy.querySelector("feImage");
  if (!filter || !image) {
    return null;
  }
  filter.id = LENS_FILTER_ID;
  film.appendChild(copy);
  const bent = source.style.backdropFilter.replace(
    /url\([^)]*\)/,
    `url(#${LENS_FILTER_ID})`,
  );
  film.style.backdropFilter = bent;
  film.style.setProperty("-webkit-backdrop-filter", bent);
  return { filter, image };
};

const 屈折を板の大きさに合わせる = (panel: Panel): void => {
  if (!panel.lens) {
    return;
  }
  const rect = panel.root.getBoundingClientRect();
  const width = String(Math.round(rect.width));
  const height = String(Math.round(rect.height));
  panel.lens.filter.setAttribute("width", width);
  panel.lens.filter.setAttribute("height", height);
  panel.lens.image.setAttribute("width", width);
  panel.lens.image.setAttribute("height", height);
};

const 中身を板へ写す = (sheet: HTMLElement): HTMLElement | null => {
  const source = sheet.querySelector(CONTENT_SELECTOR);
  const copy = source?.cloneNode(true);
  if (!source || !(copy instanceof HTMLElement)) {
    return null;
  }
  const typed = source.querySelectorAll("input");
  copy.querySelectorAll("input").forEach((input, index) => {
    const original = typed[index];
    const look = 演出に写す入力欄の見た目({
      type: original?.type ?? input.type,
      autocomplete: original?.autocomplete ?? "",
      value: original?.value ?? "",
    });
    input.type = look.type;
    input.value = look.value;
  });
  const from = source.getBoundingClientRect();
  const frame = sheet.getBoundingClientRect();
  copy.inert = true;
  copy.style.position = "absolute";
  copy.style.left = px(from.left - frame.left);
  copy.style.top = px(from.top - frame.top);
  copy.style.width = px(from.width);
  return copy;
};

const ガラスの板を作る = (sheet: HTMLElement): Panel => {
  const look = getComputedStyle(sheet);
  const rect = {
    ...要素の位置を測る(sheet),
    radius: 要素の位置を測る(sheet.querySelector(".liquid-glass") ?? sheet)
      .radius,
  };
  const root = document.createElement("div");
  root.style.position = "fixed";
  root.style.overflow = "hidden";
  root.style.color = look.color;
  for (const name of SHEET_VARIABLES) {
    root.style.setProperty(name, look.getPropertyValue(name));
  }
  Object.assign(root.style, rectKeyframe(rect));
  const glass = layer();
  const film = layer();
  film.className = "liquid-glass liquid-glass-clear";
  const rim = document.createElement("span");
  rim.className = "liquid-glass-rim";
  film.appendChild(rim);
  const lens = 屈折を板へ写す({ sheet, film });
  const scrim = layer();
  const sourceScrim = sheet.querySelector("[data-login-scrim]");
  if (sourceScrim) {
    scrim.style.backgroundColor = getComputedStyle(sourceScrim).backgroundColor;
  }
  glass.appendChild(film);
  glass.appendChild(scrim);
  const content = 中身を板へ写す(sheet);
  root.appendChild(glass);
  if (content) {
    root.appendChild(content);
  }
  return { root, content, lens };
};

interface FadeInput {
  readonly element: Element;
  readonly from: number;
  readonly to: number;
  readonly duration: number;
  readonly delay?: number;
}

const fade = ({
  element,
  from,
  to,
  duration,
  delay = 0,
}: FadeInput): Promise<unknown> =>
  element.animate([{ opacity: from }, { opacity: to }], {
    duration,
    delay,
    easing: "ease",
    fill: "both",
  }).finished;

const wait = (duration: number): Promise<void> =>
  new Promise((resolve) => {
    window.setTimeout(resolve, duration);
  });

const アプリの画面に替わるのを待つ = (): Promise<boolean> =>
  new Promise((resolve) => {
    const startedAt = performance.now();
    const check = (): void => {
      if (!document.querySelector(PHOTO_SELECTOR)) {
        requestAnimationFrame(() => requestAnimationFrame(() => resolve(true)));
        return;
      }
      if (performance.now() - startedAt > ENTER_APP_TIMING.waitLimit) {
        resolve(false);
        return;
      }
      requestAnimationFrame(check);
    };
    requestAnimationFrame(check);
  });

interface MoveInput {
  readonly panel: Panel;
  readonly from: PanelRect;
  readonly to: PanelRect;
  readonly duration: number;
}

const 板を動かす = ({
  panel,
  from,
  to,
  duration,
}: MoveInput): Promise<unknown> =>
  panel.root.animate([rectKeyframe(from), rectKeyframe(to)], {
    duration,
    easing: MOVE_EASING,
    fill: "forwards",
  }).finished;

interface WipeInput {
  readonly cover: HTMLDivElement;
  readonly duration: number;
}

const 写真を拭き取る = ({ cover, duration }: WipeInput): Promise<unknown> => {
  const end = `${-WIPE_TRAVEL * window.innerWidth}px 0px`;
  for (const prefix of ["", "-webkit-"]) {
    cover.style.setProperty(`${prefix}mask-image`, WIPE_MASK);
    cover.style.setProperty(`${prefix}mask-size`, "300% 100%");
    cover.style.setProperty(`${prefix}mask-repeat`, "no-repeat");
  }
  return cover.animate(
    [
      { maskPosition: "0px 0px", webkitMaskPosition: "0px 0px" },
      { maskPosition: end, webkitMaskPosition: end },
    ],
    { duration, easing: "ease-in-out", fill: "forwards" },
  ).finished;
};

interface RunInput {
  readonly motion: EnterAppMotion;
  readonly overlay: HTMLDivElement;
  readonly cover: HTMLDivElement;
  readonly still: HTMLCanvasElement | null;
  readonly panel: Panel | null;
  readonly rail: PanelRect | null;
  readonly sheet: HTMLElement | null;
}

const 実際のレールへ合わせる = async ({
  panel,
  rail,
}: {
  readonly panel: Panel;
  readonly rail: PanelRect;
}): Promise<void> => {
  const element = document.querySelector(APP_RAIL_SELECTOR);
  if (!element) {
    return;
  }
  const measured = 要素の位置を測る(element);
  if (measured.width === 0 || 同じ位置にある({ current: rail, measured })) {
    return;
  }
  await 板を動かす({
    panel,
    from: 要素の位置を測る(panel.root),
    to: measured,
    duration: ENTER_APP_TIMING.panelAdjust,
  });
};

const 演出を流す = async ({
  motion,
  overlay,
  cover,
  still,
  panel,
  rail,
  sheet,
}: RunInput): Promise<void> => {
  const timing = ENTER_APP_TIMING;
  const isMorph = motion === "morph" && panel !== null && rail !== null;
  const dropletGone =
    still && motion !== "fade"
      ? fade({
          element: still,
          from: 1,
          to: 0,
          duration: timing.dropletOut,
        })
      : Promise.resolve();
  if (panel?.content) {
    panel.content.animate(
      [
        { opacity: 1, filter: "blur(0px)", translate: "0px 0px" },
        { opacity: 0, filter: "blur(12px)", translate: "-28px 0px" },
      ],
      { duration: timing.contentOut, easing: "ease-in", fill: "forwards" },
    );
  }
  const landed =
    isMorph && panel && rail
      ? wait(timing.panelDelay).then(() =>
          板を動かす({
            panel,
            from: 要素の位置を測る(panel.root),
            to: rail,
            duration: timing.panelMove,
          }),
        )
      : panel
        ? fade({
            element: panel.root,
            from: 1,
            to: 0,
            duration: timing.dissolveOut,
          })
        : Promise.resolve();
  if (isMorph && panel?.lens) {
    let moving = true;
    const follow = (): void => {
      屈折を板の大きさに合わせる(panel);
      if (moving) {
        requestAnimationFrame(follow);
      }
    };
    follow();
    landed.finally(() => {
      moving = false;
    });
  }

  const [replaced] = await Promise.all([
    アプリの画面に替わるのを待つ(),
    dropletGone,
    wait(motion === "fade" ? timing.fadeHold : timing.revealAfter),
  ]);
  if (!replaced) {
    delete sheet?.dataset.leaving;
    await fade({ element: overlay, from: 1, to: 0, duration: timing.fadeOut });
    return;
  }
  if (motion === "fade") {
    await fade({ element: overlay, from: 1, to: 0, duration: timing.fadeOut });
    return;
  }
  if (!(isMorph && panel && rail)) {
    await Promise.all([
      landed,
      fade({ element: cover, from: 1, to: 0, duration: timing.coverOut }),
    ]);
    return;
  }
  const revealed = 写真を拭き取る({ cover, duration: timing.wipe });
  await Promise.all([landed, wait(timing.wipe * WIPE_PASSES_RAIL_AT)]);
  await 実際のレールへ合わせる({ panel, rail });
  await Promise.all([
    revealed,
    fade({ element: panel.root, from: 1, to: 0, duration: timing.panelOut }),
  ]);
};

export const アプリへ入る演出を始める = (): void => {
  try {
    演出を組み立てて流す();
  } catch (error: unknown) {
    console.warn("アプリへ入る演出を始められませんでした", error);
    document.querySelector(OVERLAY_SELECTOR)?.remove();
    const sheet = document.querySelector<HTMLElement>(SHEET_SELECTOR);
    delete sheet?.dataset.leaving;
  }
};

const 演出を組み立てて流す = (): void => {
  const photo = document.querySelector<HTMLElement>(PHOTO_SELECTOR);
  if (!photo || document.querySelector(OVERLAY_SELECTOR)) {
    return;
  }
  const sheet = document.querySelector<HTMLElement>(SHEET_SELECTOR);
  const rail = アプリのレールの位置を求める({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const motion = 入場の演出を選ぶ({
    reducedMotion:
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      document.documentElement.classList.contains("reduce-motion"),
    hasSheet: sheet !== null,
    rail,
  });
  const overlay = document.createElement("div");
  overlay.dataset.enterApp = motion;
  overlay.setAttribute("aria-hidden", "true");
  overlay.style.position = "fixed";
  overlay.style.inset = "0";
  overlay.style.zIndex = OVERLAY_Z_INDEX;
  overlay.style.pointerEvents = "none";
  const cover = 写真の覆いを作る(photo);
  const panel = sheet && motion !== "fade" ? ガラスの板を作る(sheet) : null;
  overlay.appendChild(cover);
  if (panel) {
    overlay.appendChild(panel.root);
  }
  document.body.appendChild(overlay);
  const melting = motion !== "fade" && 溶ける雫を覆いへ移す(cover);
  const still = melting ? null : 雫を静止画に写す();
  if (still) {
    cover.appendChild(still);
  }
  if (sheet && panel) {
    sheet.dataset.leaving = "true";
  }
  演出を流す({ motion, overlay, cover, still, panel, rail, sheet })
    .catch((error: unknown) => {
      console.warn("アプリへ入る演出を最後まで流せませんでした", error);
      delete sheet?.dataset.leaving;
    })
    .finally(() => overlay.remove());
};
