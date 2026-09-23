document.getElementById("year").textContent = new Date().getFullYear();

const nav = document.querySelector(".nav");
window.addEventListener("scroll", () => {
  nav.classList.toggle("is-scrolled", window.scrollY > 10);
});

// Contact form: sends through Formspree once a form ID is set in index.html.
// Until then, it falls back to opening the visitor's email app with the message filled in.
const form = document.getElementById("contact-form");
const status = form.querySelector(".form__status");
const CONTACT_EMAIL = "ssharma411@gmail.com";

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = new FormData(form);
  if (data.get("_gotcha")) return;

  const setStatus = (msg, type) => {
    status.textContent = msg;
    status.className = "form__status" + (type ? " is-" + type : "");
  };

  if (form.action.includes("YOUR_FORM_ID")) {
    const subject = `New inquiry from ${data.get("name")}`;
    const body = [
      `Name: ${data.get("name")}`,
      `Email: ${data.get("email")}`,
      `Company: ${data.get("company") || "-"}`,
      "",
      data.get("message"),
    ].join("\n");
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    return;
  }

  const button = form.querySelector("button");
  button.disabled = true;
  setStatus("Sending…");
  try {
    const res = await fetch(form.action, {
      method: "POST",
      body: data,
      headers: { Accept: "application/json" },
    });
    if (!res.ok) throw new Error();
    form.reset();
    setStatus("Thanks! Your message is on its way. I'll be in touch soon.", "success");
  } catch {
    setStatus(`Something went wrong. Please email me directly at ${CONTACT_EMAIL}.`, "error");
  } finally {
    button.disabled = false;
  }
});
