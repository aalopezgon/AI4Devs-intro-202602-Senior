// js/script.js
(() => {
  const input = document.getElementById("txtInput");
  const btnReverse = document.getElementById("btnReverse");
  const output = document.getElementById("output");
  const btnCopy = document.getElementById("btnCopy");
  const copyStatus = document.getElementById("copyStatus");

  // Mejor que split("") para muchos casos con Unicode
  const reverseString = (str) => Array.from(str).reverse().join("");

  const setStatus = (message, type = "") => {
    copyStatus.textContent = message;
    copyStatus.className = `status ${type}`.trim();

    if (message) {
      clearTimeout(setStatus._t);
      setStatus._t = setTimeout(() => {
        copyStatus.textContent = "";
        copyStatus.className = "status";
      }, 1500);
    }
  };

  const render = () => {
    const reversed = reverseString(input.value);
    output.textContent = reversed;

    // habilita/deshabilita copiar según haya algo
    btnCopy.disabled = reversed.length === 0;
  };

  const copyToClipboardModern = async (text) => {
    // Requiere contexto seguro (https) o localhost
    await navigator.clipboard.writeText(text);
  };

  const copyToClipboardFallback = (text) => {
    // Fallback para entornos sin navigator.clipboard
    const temp = document.createElement("textarea");
    temp.value = text;
    temp.setAttribute("readonly", "");
    temp.style.position = "fixed";
    temp.style.opacity = "0";
    document.body.appendChild(temp);
    temp.select();
    temp.setSelectionRange(0, temp.value.length);
    const ok = document.execCommand("copy");
    document.body.removeChild(temp);
    if (!ok) throw new Error("Copy command failed");
  };

  const handleCopy = async () => {
    const text = output.textContent || "";
    if (!text) return;

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await copyToClipboardModern(text);
      } else {
        copyToClipboardFallback(text);
      }
      setStatus("✅ Copied to clipboard!", "success");
    } catch (err) {
      setStatus("⚠️ Could not copy. Please copy manually.", "error");
    }
  };

  // Eventos
  btnReverse.addEventListener("click", render);

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") render();
  });

  input.addEventListener("input", render);

  btnCopy.addEventListener("click", handleCopy);

  // Render inicial
  render();
})();