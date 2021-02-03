const menu = () => {
  const toggle = document.querySelector(".toggle");
  const navigation = document.querySelector(".navigation");
  const underlay = document.querySelector(".underlay");

  const toggleNavigation = () => {
    toggle.classList.toggle("toggle--open");
    navigation.classList.toggle("navigation--open");
    underlay.classList.toggle("underlay--open");

    if (toggle.classList.contains("toggle--open")) {
      bodyScrollLock.disableBodyScroll(); // eslint-disable-line no-undef
    } else {
      bodyScrollLock.enableBodyScroll(); // eslint-disable-line no-undef
    }
  };

  toggle.addEventListener("click", toggleNavigation);

  underlay.addEventListener("click", toggleNavigation);
};

menu();
