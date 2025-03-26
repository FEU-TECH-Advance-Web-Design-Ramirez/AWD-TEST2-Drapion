document.addEventListener("DOMContentLoaded", function () {
    const navbar = document.querySelector(".navbar");
    const navLinks = document.querySelectorAll(".nav-link");
  
    window.addEventListener("scroll", function () {
      if (window.scrollY > 50) {
        navbar.classList.add("scrolled");
      } else {
        navbar.classList.remove("scrolled");
      }
    });
  });
  
  document.addEventListener("DOMContentLoaded", function () {
    function moveLoginButton() {
        const loginButtonContainer = document.getElementById("loginButtonContainer");
        const offcanvasContainer = document.getElementById("offcanvasLoginButtonContainer");

        if (window.innerWidth <= 991) {
            // Move login button to offcanvas
            if (!offcanvasContainer.contains(loginButtonContainer)) {
                offcanvasContainer.appendChild(loginButtonContainer);
            }
        } else {
            // Move login button back to original position
            const navbar = document.querySelector(".navbar .container-fluid");
            if (!navbar.contains(loginButtonContainer)) {
                navbar.insertBefore(loginButtonContainer, navbar.lastElementChild);
            }
        }
    }

    // Run on load
    moveLoginButton();

    // Run on window resize
    window.addEventListener("resize", moveLoginButton);
});
