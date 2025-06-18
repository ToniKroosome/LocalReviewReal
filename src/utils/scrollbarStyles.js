// Custom scrollbar hide styles
const scrollbarHideStyles = `
  <style id="scrollbar-styles">
    .scrollbar-hide {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
    .scrollbar-hide::-webkit-scrollbar {
      display: none;
    }
  </style>
`;

export function initScrollbarStyles() {
  if (typeof document !== 'undefined' && !document.getElementById('scrollbar-styles')) {
    document.head.insertAdjacentHTML('beforeend', scrollbarHideStyles);
  }
}
