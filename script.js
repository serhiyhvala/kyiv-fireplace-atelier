// Mobile menu
const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.getElementById("site-nav");
if (menuToggle && siteNav) {
  const setMenu = (open) => {
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    siteNav.dataset.open = String(open);
  };
  menuToggle.addEventListener("click", () => setMenu(menuToggle.getAttribute("aria-expanded") !== "true"));
  siteNav.addEventListener("click", (event) => { if (event.target.closest("a")) setMenu(false); });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
      setMenu(false);
      menuToggle.focus();
    }
  });
  window.matchMedia("(min-width: 56rem)").addEventListener("change", () => setMenu(false));
}

// Scroll reveal
const revealed = document.querySelectorAll("[data-reveal]");
if (revealed.length > 0) {
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    }), { rootMargin: "0px 0px -10% 0px" });
    revealed.forEach((element) => observer.observe(element));
  } else {
    revealed.forEach((element) => element.classList.add("is-visible"));
  }
}

// Visit request form
document.querySelectorAll("[data-form]").forEach((form) => {
  const status = form.querySelector('[role="status"]');
  const messages = {
    name: "Enter your name.",
    phone: "Enter a phone number like +380 44 555 01 23."
  };
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    let firstInvalid = null;
    form.querySelectorAll("input[required], textarea[required], select[required]").forEach((field) => {
      field.value = field.value.trim();
      const error = document.getElementById(`${field.id}-error`);
      const valid = field.checkValidity();
      field.setAttribute("aria-invalid", String(!valid));
      if (error) {
        error.hidden = valid;
        error.textContent = valid ? "" : (messages[field.name] ?? "Fill in this field.");
        if (!valid) field.setAttribute("aria-describedby", error.id);
        else field.removeAttribute("aria-describedby");
      }
      if (!valid && !firstInvalid) firstInvalid = field;
    });
    if (firstInvalid) {
      firstInvalid.focus();
      return;
    }
    const name = form.elements.namedItem("name")?.value.split(" ")[0];
    if (status) {
      status.textContent = name
        ? `Thanks, ${name}. I will call you within one working day to agree a time.`
        : "Thanks. I will call you within one working day to agree a time.";
      status.animate([{ opacity: 0, translate: "0 8px" }, { opacity: 1, translate: "0 0" }], { duration: 300, easing: "cubic-bezier(0.23, 1, 0.32, 1)" });
    }
    form.reset();
  });
});