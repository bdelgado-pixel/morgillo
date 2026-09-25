"use client";
export default function ThemeToggle() {
  function toggle() {
    const root = document.documentElement;
    const dark = !root.classList.contains("dark");
    root.classList.toggle("dark", dark);
    root.style.colorScheme = dark ? "dark" : "light";
    try {
      localStorage.setItem("morgillo-theme", dark ? "dark" : "light");
    } catch {}
  }
  return (
    <button
      className="theme-toggle"
      onClick={toggle}
      type="button"
      aria-label="Cambiar entre tema claro y oscuro"
    >
      <span className="dark:hidden" aria-hidden="true">
        ☾
      </span>
      <span className="hidden dark:inline" aria-hidden="true">
        ☀
      </span>
    </button>
  );
}
