const _clickEventType = () => (matchMedia('(hover: none)').matches ? 'touchstart' : 'click');

function _clickAway(event: Event, target: Element, callback: Function): void {
  if (!target.contains(event.target as Node)) callback(event);
}

const EL_CALLBACK_STORE = '__click_away_callback__';

const vClickAway = {
  mounted(el: any, binding: { value: Function }) {
    el[EL_CALLBACK_STORE] = (e: Event) => _clickAway(e, el, binding.value);
    document.addEventListener(_clickEventType(), el[EL_CALLBACK_STORE]);
  },

  beforeUnmount(el: any) {
    document.removeEventListener(_clickEventType(), el[EL_CALLBACK_STORE]);
  }
};

export default vClickAway;
