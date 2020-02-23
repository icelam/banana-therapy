const textReveal = (selector, revealSpeed) => {
  const textElements = Array.from(document.querySelectorAll(selector));
  let textRevealInterval;
  let currentIndex = 0;

  const baseClass = 'text-reveal';
  const displayClass = `${baseClass}--current`;

  const reset = () => {
    window.clearInterval(textRevealInterval);
    currentIndex = 0;
    textElements.forEach(element => element.classList.remove(displayClass));
  };

  const init = () => {
    if (textElements.length === 0) {
      return false;
    }

    textElements.forEach(element => element.classList.add(baseClass));

    // show first sentence
    textElements[currentIndex].classList.add(displayClass);

    const reveal = (delay) => {
      textRevealInterval = window.setInterval(() => {
        currentIndex++;
        textElements[currentIndex].classList.add(displayClass);

        if (currentIndex !== 0) {
          textElements[currentIndex - 1].classList.remove(displayClass);
        }

        if (currentIndex === textElements.length - 1) {
          window.clearInterval(textRevealInterval);
        }
      }, delay);
    };

    reveal(revealSpeed);
    return true;
  };

  return {
    init,
    reset
  };
};

export default textReveal;
