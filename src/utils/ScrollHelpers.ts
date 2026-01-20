export class ScrollHelper {
  static getScrollbarWidth() {
    const outer = document.createElement('div');
    outer.style.cssText = `
      position: absolute;
      overflow: scroll;
      z-index: -999;
      top: -100vh;
      left: -100vw;
    `;
    outer.classList.add('_scroll-element');

    document.body.appendChild(outer);

    const inner = document.createElement('div');
    outer.appendChild(inner);

    const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;

    outer.parentNode?.removeChild(outer);

    return scrollbarWidth;
  }

  static setCustomBodyScrollbar() {
    const scrollbarHoverArea = 20;

    const body = document?.body;
    if (body) {
      body.classList.add('_scroll-element');
      body.classList.add('_scroll-element--y');

      body.addEventListener('mousemove', onMousemove);
    }

    function onMousemove(event: MouseEvent) {
      const scrollbarYVisible = document.body.offsetHeight < document.body.scrollHeight;
      if (scrollbarYVisible) {
        const cursorNearScrollbar = document.body.offsetWidth - event.clientX < scrollbarHoverArea;
        if (cursorNearScrollbar) document.body.classList.add('_scroll-el-hover');
        else document.body.classList.remove('_scroll-el-hover');
      }
    }
  }
}
