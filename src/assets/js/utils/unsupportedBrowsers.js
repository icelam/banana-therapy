const isIE = () => {
  const ua = window.navigator.userAgent;
  const msie = ua.indexOf('MSIE '); // IE 10 or older
  const trident = ua.indexOf('Trident/'); // IE 11

  return (msie > 0 || trident > 0);
};

const isUnsupportedBrowser = isIE();

export default isUnsupportedBrowser;
