export function debounce<Args extends any[] = any[]>(fn: (...args: Args) => any, timeout: number): (...args: Args) => void {
  let timer: NodeJS.Timeout;
  return (...args: Args) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn(...args), timeout);
  };
}

function attachListeners(frame: HTMLIFrameElement) {
  const doc = frame.contentDocument as HTMLDocument;
  const win = frame.contentWindow as WindowProxy;

  if (!doc || !win) return () => {}; // No doc available, probably restricted

  let oldHeight: number | null = null;

  function updateHeight() {
    const height = Math.ceil(doc.documentElement.getBoundingClientRect().height);
    if (height !== oldHeight) {
      frame.style.height = height + 'px';
      oldHeight = height;
    }
  }

  const observer = new MutationObserver(updateHeight);

  observer.observe(doc.body, {
    attributes: true,
    childList: true,
    subtree: true,
    characterData: true
  });

  updateHeight();

  win.addEventListener('resize', updateHeight);
}

export default function resizeIFrame(frame: HTMLIFrameElement) {
  function onLoad() {
    attachListeners(frame);
    frame.removeEventListener('load', onLoad);
  }
  frame.addEventListener('load', onLoad);
}
