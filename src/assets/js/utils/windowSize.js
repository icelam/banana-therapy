const getWindowSize = () => {
  const body = document.getElementsByTagName('body')[0];

  return {
    width: window.innerWidth || document.documentElement.clientWidth || body.clientWidth,
    height: window.innerHeight || document.documentElement.clientHeight || body.clientHeight
  };
};

export default getWindowSize;
