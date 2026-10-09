/* Progressive enhancements; Django retains all forms, actions and validation. */
(() => {
  "use strict";
  const one = (selector, root = document) => root.querySelector(selector);
  const all = (selector, root = document) => [...root.querySelectorAll(selector)];
  const menuButton = one(".mg-menu-toggle");
  const sidebar = one("#mg-sidebar");
  const backdrop = one(".mg-menu-backdrop");
  const closeMenu = () => {
    document.body.classList.remove("mg-menu-open");
    menuButton?.setAttribute("aria-expanded", "false");
    if (backdrop) backdrop.hidden = true;
  };
  if (menuButton && sidebar && backdrop) {
    menuButton.addEventListener("click", () => {
      const open = !document.body.classList.contains("mg-menu-open");
      document.body.classList.toggle("mg-menu-open", open);
      menuButton.setAttribute("aria-expanded", String(open));
      backdrop.hidden = !open;
      if (open) one("a", sidebar)?.focus();
    });
    backdrop.addEventListener("click", () => { closeMenu(); menuButton.focus(); });
    one(".mg-menu-close")?.addEventListener("click", () => { closeMenu(); menuButton.focus(); });
    sidebar.addEventListener("keydown", (event) => {
      if (event.key !== "Tab" || !document.body.classList.contains("mg-menu-open")) return;
      const links = all("a,button", sidebar);
      const first = links[0], last = links.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    });
    const desktop = window.matchMedia("(min-width:821px)");
    desktop.addEventListener("change", () => { if (desktop.matches) closeMenu(); });
  }
  const dialog = one("#mg-command");
  const search = dialog && one("input", dialog);
  const openCommand = () => {
    if (!dialog || typeof dialog.showModal !== "function") return;
    closeMenu();
    if (!dialog.open) dialog.showModal();
    search.focus();
  };
  all(".mg-command-open").forEach(button => button.addEventListener("click", openCommand));
  one("[data-command-close]")?.addEventListener("click", () => dialog.close());
  const normalize = value => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
  search?.addEventListener("input", () => {
    const query = normalize(search.value);
    const links = all("[data-search-label]", dialog);
    links.forEach(link => { link.hidden = !normalize(link.dataset.searchLabel).includes(query); });
    one(".mg-command-empty", dialog).hidden = links.some(link => !link.hidden);
  });
  search?.addEventListener("keydown", event => {
    if (event.key === "Enter") {
      const link = all("[data-search-label]", dialog).find(item => !item.hidden);
      if (link) { event.preventDefault(); link.click(); }
    }
  });
  document.addEventListener("keydown", event => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k" && dialog) {
      event.preventDefault(); openCommand();
    }
    if (event.key === "Escape" && document.body.classList.contains("mg-menu-open")) {
      closeMenu(); menuButton?.focus();
    }
  });
  document.addEventListener("click", event => {
    all(".mg-account[open]").forEach(account => { if (!account.contains(event.target)) account.open = false; });
  });
  const filterToggle = one(".mg-filter-toggle");
  const filters = one("#changelist-filter");
  if (filterToggle && filters) {
    if (window.matchMedia("(max-width:1090px)").matches && filterToggle.dataset.filterActive !== "true") {
      filters.hidden = true;
      filterToggle.setAttribute("aria-expanded", "false");
    }
    filterToggle.addEventListener("click", () => {
      filters.hidden = !filters.hidden;
      filterToggle.setAttribute("aria-expanded", String(!filters.hidden));
      if (!filters.hidden && window.matchMedia("(max-width:1090px)").matches) {
        const reduced = window.matchMedia("(prefers-reduced-motion:reduce)").matches;
        filters.scrollIntoView({ block: "nearest", behavior: reduced ? "auto" : "smooth" });
      }
    });
  }
  const mediaButtons = all("[data-media-view]");
  const table = one("#result_list");
  if (mediaButtons.length && !table) one(".mg-view-switch").hidden = true;
  if (mediaButtons.length && table) {
    const setView = view => {
      table.classList.toggle("mg-media-grid", view === "grid");
      mediaButtons.forEach(button => button.setAttribute("aria-pressed", String(button.dataset.mediaView === view)));
      try { localStorage.setItem("morgillo.libraryView", view); } catch { /* Storage can be disabled. */ }
    };
    let initial = "grid";
    try { initial = localStorage.getItem("morgillo.libraryView") || initial; } catch { /* Use the default. */ }
    setView(initial);
    mediaButtons.forEach(button => button.addEventListener("click", () => setView(button.dataset.mediaView)));
  }
  const catalogButtons = all("[data-catalog-view]");
  if (catalogButtons.length && !table) one(".mg-catalog-view-switch").hidden = true;
  if (catalogButtons.length && table) {
    table.classList.add("mg-catalog-list");
    const compact = window.matchMedia("(max-width:1270px)");
    let preferredView;
    try { preferredView = localStorage.getItem("morgillo.catalogView"); } catch { /* Use the responsive default. */ }
    const setCatalogView = view => {
      table.classList.toggle("mg-catalog-cards", view === "cards");
      catalogButtons.forEach(button => button.setAttribute("aria-pressed", String(button.dataset.catalogView === view)));
    };
    const adaptCatalog = () => setCatalogView(compact.matches ? "cards" : preferredView || "list");
    adaptCatalog();
    compact.addEventListener("change", adaptCatalog);
    catalogButtons.forEach(button => button.addEventListener("click", () => {
      preferredView = button.dataset.catalogView;
      setCatalogView(preferredView);
      try { localStorage.setItem("morgillo.catalogView", preferredView); } catch { /* Storage can be disabled. */ }
    }));
    const headers = all("thead th", table).map(header => header.textContent.trim());
    const selectAll = one("#action-toggle", table);
    if (selectAll) {
      const label = document.createElement("label");
      label.className = "mg-select-all-label"; label.htmlFor = selectAll.id;
      label.textContent = "Seleccionar todos"; selectAll.after(label);
    }
    const editableRows = all("tbody tr", table).filter(row => one(".field-catalog_name", row));
    const editableInputs = [];
    editableRows.forEach(row => {
      const name = one(".mg-record-name", row)?.textContent.trim() || "registro";
      all(":scope > td, :scope > th", row).forEach((cell, index) => {
        const label = headers[index];
        cell.dataset.label = label || "";
        const input = one('input:not([type="hidden"])', cell);
        if (!input || cell.classList.contains("action-checkbox")) return;
        input.setAttribute("aria-label", `${label}: ${name}`);
        editableInputs.push(input);
        if (input.type === "checkbox") {
          const control = document.createElement("label"); control.className = "mg-catalog-check";
          const caption = document.createElement("span");
          caption.textContent = cell.matches(".field-published,.field-active") ? "Publicar en la web" : cell.classList.contains("field-featured") ? "Destacado" : label;
          input.before(control); control.append(input, caption);
        }
      });
    });
    const listForm = one("#changelist-form");
    const nativeSave = listForm && one('input[name="_save"]', listForm);
    if (nativeSave && editableInputs.length) {
      const saveBar = document.createElement("div"); saveBar.className = "mg-save-bar"; saveBar.hidden = true;
      const message = document.createElement("p"); message.setAttribute("role", "status");
      const save = document.createElement("button");
      save.type = "submit"; save.name = "_save"; save.value = "Guardar";
      save.className = "mg-button mg-button-primary"; save.textContent = "Guardar cambios";
      saveBar.append(message, save); listForm.append(saveBar);
      const changed = input => input.type === "checkbox" ? input.checked !== input.defaultChecked : input.value !== input.defaultValue;
      const updatePending = () => {
        const dirtyRows = editableRows.filter(row => all('input:not([type="hidden"])', row).some(input => editableInputs.includes(input) && changed(input)));
        editableRows.forEach(row => row.classList.toggle("mg-is-dirty", dirtyRows.includes(row)));
        saveBar.hidden = dirtyRows.length === 0;
        document.body.classList.toggle("mg-has-pending", dirtyRows.length > 0);
        message.textContent = `${dirtyRows.length} ${dirtyRows.length === 1 ? "registro con cambios sin guardar" : "registros con cambios sin guardar"}`;
      };
      editableInputs.forEach(input => input.addEventListener("change", updatePending));
      window.addEventListener("pageshow", updatePending);
    }
  }
  const prepareInlineRows = root => {
    all(".inline-group .tabular", root).forEach(inline => {
      inline.classList.add("mg-inline-cards");
      const headers = all("thead th", inline).map(header => header.textContent.trim());
      all("tr.form-row:not(.empty-form)", inline).forEach((row, rowIndex) => {
        const original = one("td.original p", row);
        if (original && !one("a", original)) {
          const group = inline.closest(".inline-group")?.id;
          const kind = group === "gallery-group" ? "Imagen" : group === "specifications-group" ? "Característica" : group === "documents-group" ? "Documento" : "Elemento";
          original.textContent = `${kind} ${rowIndex + 1}`;
        }
        all(":scope > td", row).forEach((cell, index) => {
          if (cell.classList.contains("original") || one(".mg-inline-label", cell)) return;
          const caption = headers[index] || (cell.classList.contains("delete") ? "Eliminar este elemento" : "");
          if (!caption) return;
          const label = document.createElement("label"); label.className = "mg-inline-label"; label.textContent = caption;
          const input = one('input:not([type="hidden"]),select,textarea', cell);
          if (input?.id) {
            label.htmlFor = input.id;
            input.setAttribute("aria-label", `${caption}, elemento ${rowIndex + 1}`);
          }
          cell.prepend(label);
        });
      });
    });
  };
  prepareInlineRows(document);
  document.addEventListener("formset:added", () => prepareInlineRows(document));
  const saveLabels = all('.submit-row input[name="_continue"],.submit-row input[name="_addanother"]').map(input => [input, input.value]);
  if (saveLabels.length) {
    const phone = window.matchMedia("(max-width:580px)");
    const adaptSaveLabels = () => saveLabels.forEach(([input, label]) => {
      input.value = phone.matches ? input.name === "_continue" ? "Guardar y seguir" : "Guardar y crear" : label;
    });
    adaptSaveLabels(); phone.addEventListener("change", adaptSaveLabels);
  }
  if (document.body.classList.contains("change-form") && !document.body.classList.contains("popup")) {
    const form = one("#content-main>form");
    if (form) {
      const deleteControl = one(".submit-row .deletelink", form);
      if (deleteControl) {
        const saveRow = deleteControl.closest(".submit-row");
        const deleteBox = deleteControl.closest("p") || document.createElement("p");
        if (!deleteBox.contains(deleteControl)) deleteBox.append(deleteControl);
        deleteBox.classList.add("mg-delete-record");
        saveRow.before(deleteBox);
      }
      const sections = all("fieldset.module, .inline-group", form).filter(section => {
        return !section.closest(".inline-related") && !(section.tagName === "FIELDSET" && section.closest(".inline-group"));
      });
      const nav = document.createElement("nav");
      nav.className = "mg-form-nav"; nav.setAttribute("aria-label", "Secciones del editor");
      sections.forEach((section, index) => {
        const heading = one("h2", section);
        if (!heading) return;
        if (!section.id) section.id = `cms-section-${index}`;
        const link = document.createElement("a");
        link.href = `#${section.id}`; link.textContent = heading.textContent.trim();
        link.addEventListener("click", () => { const details = one("details", section); if (details) details.open = true; });
        nav.append(link);
      });
      if (nav.childElementCount > 1) {
        sections[0].before(nav);
        if ("IntersectionObserver" in window) {
          const observer = new IntersectionObserver(entries => {
            const visible = entries.find(entry => entry.isIntersecting);
            if (!visible) return;
            all("a", nav).forEach(link => {
              const active = link.hash === `#${visible.target.id}`;
              link.classList.toggle("is-current", active);
              if (active) link.setAttribute("aria-current", "location"); else link.removeAttribute("aria-current");
            });
          }, { rootMargin: "-160px 0px -55% 0px", threshold: 0 });
          sections.forEach(section => observer.observe(section));
        }
      }
    }
  }
  const password = one("#login-form #id_password");
  if (password) {
    const button = document.createElement("button");
    button.type = "button"; button.className = "mg-password-toggle"; button.textContent = "Mostrar contraseña";
    button.setAttribute("aria-controls", password.id); button.setAttribute("aria-pressed", "false");
    button.addEventListener("click", () => {
      const reveal = password.type === "password"; password.type = reveal ? "text" : "password";
      button.textContent = reveal ? "Ocultar contraseña" : "Mostrar contraseña";
      button.setAttribute("aria-pressed", String(reveal));
    });
    password.after(button);
  }
  all('input[type="file"]').forEach(input => {
    input.accept = ".jpg,.jpeg,.png,.webp,.pdf";
    const preview = document.createElement("div"); preview.className = "mg-upload-preview";
    preview.setAttribute("aria-live", "polite"); input.after(preview);
    let objectUrl;
    input.addEventListener("change", () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      preview.replaceChildren(); const file = input.files[0]; if (!file) return;
      const text = document.createElement("p");
      text.textContent = `${file.name} · ${(file.size / 1024 / 1024).toFixed(2)} MB`;
      preview.append(text);
      if (file.size > 15 * 1024 * 1024) {
        text.textContent += " · Supera el límite de 15 MB. Elige un archivo más pequeño.";
        text.className = "mg-editor-warning";
      } else if (["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
        objectUrl = URL.createObjectURL(file);
        const image = document.createElement("img"); image.src = objectUrl; image.alt = "Vista previa del archivo seleccionado";
        preview.prepend(image);
      }
    });
    window.addEventListener("pagehide", () => { if (objectUrl) URL.revokeObjectURL(objectUrl); });
  });
})();
