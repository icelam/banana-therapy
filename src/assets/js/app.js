import { isUnsupportedBrowser } from '@js/utils';
import fallBananas from './fallBananas';
import textReveal from './textReveal';

if (isUnsupportedBrowser) {
  const unsupportedWarningElement = document.getElementById('unsupportedWarning');

  if (unsupportedWarningElement) {
    unsupportedWarningElement.style.display = 'flex';
  }
} else {
  const bananasEngine = fallBananas(50, 150);
  bananasEngine.init();

  const textRevealEngine = textReveal('.caption', 3000);
  textRevealEngine.init();

  const replay = () => {
    bananasEngine.resetAll();
    bananasEngine.init();

    textRevealEngine.reset();
    textRevealEngine.init();
  };

  /* Replay */
  const replayButton = document.querySelector('.replay-button');
  if (replayButton) {
    replayButton.addEventListener('click', replay);
  }

  /* Redraw on resize, debounce for 500ms */
  window.addEventListener('resize', () => {
    let resizeTimer;
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      replay();
    }, 500);
  });
}
