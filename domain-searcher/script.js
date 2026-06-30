document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("domainSearchForm");
    const input = document.getElementById("domainInput");
    const extSelect = document.getElementById("domainExt");
    const searchBtn = document.getElementById("searchBtn");
    const btnText = searchBtn.querySelector(".btn-text");
    const spinner = document.getElementById("searchSpinner");
    const errorMsg = document.getElementById("errorMsg");

    const resultCard = document.getElementById("resultCard");
    const resultIcon = document.getElementById("resultIcon");
    const resultDomain = document.getElementById("resultDomain");
    const resultStatus = document.getElementById("resultStatus");
    const priceBox = document.getElementById("priceBox");
    const priceAmount = priceBox.querySelector(".amount");
    const whatsappBtn = document.getElementById("whatsappBtn");

    const yearSelector = document.getElementById("yearSelector");
    const yearPills = document.querySelectorAll(".year-pill");

    const cartModal = document.getElementById("cartModal");
    const closeModalBtn = document.getElementById("closeModalBtn");
    const cartDomainName = document.getElementById("cartDomainName");
    const cartYearPill = document.getElementById("cartYearPill");
    const cartDomainPrice = document.getElementById("cartDomainPrice");
    const cartTotalPrice = document.getElementById("cartTotalPrice");
    const planRadios = document.querySelectorAll("input[name=\"webPlan\"]");
    const finalWhatsappBtn = document.getElementById("finalWhatsappBtn");
    const navCartBtn = document.getElementById("navCartBtn");
    const navCartBadge = document.getElementById("navCartBadge");

    // ── State ─────────────────────────────────────────────────────────────────
    let currentDomain = "";
    let basePrice = 59;
    let selectedYears = 1;
    let selectedDiscount = 0;
    let selectedPlanPrice = 0;
    let selectedPlanName = "Ninguno (Solo Dominio)";

    // ── Load plan from InfallCart (persisted from index.html) ─────────────────
    const savedCart = window.InfallCart ? window.InfallCart.get() : null;
    if (savedCart && savedCart.plan) {
        selectedPlanPrice = savedCart.plan.price;
        selectedPlanName = savedCart.plan.name;

        // Show a welcome banner noting the pre-selected plan
        const banner = document.createElement("div");
        banner.id = "planBanner";
        banner.style.cssText = "background:rgba(255,140,0,0.10);border:1px solid rgba(255,140,0,0.32);border-radius:14px;padding:0.85rem 1.25rem;margin-bottom:1.5rem;color:#F1F5F9;font-size:0.95rem;display:flex;align-items:center;gap:0.6rem;";
        banner.innerHTML = "<i class=\"ri-shopping-cart-2-fill\" style=\"color:#FF8C00;font-size:1.2rem;\"></i> Plan <strong style=\"color:#fff;\">" + savedCart.plan.name + " (S/ " + savedCart.plan.price + ")</strong>&nbsp;agregado. Ahora busca tu dominio ideal.";
        const container = document.querySelector(".search-container") || document.querySelector(".container");
        if (container) container.insertBefore(banner, container.firstChild);

        // Pre-select matching radio
        const matchingRadio = Array.from(planRadios).find(r => parseInt(r.value) === selectedPlanPrice);
        if (matchingRadio) {
            matchingRadio.checked = true;
        }
    }

    // ── Form Submission ───────────────────────────────────────────────────────
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        let domain = input.value.trim().toLowerCase();
        const extension = extSelect.value;
        if (!domain) return;
        if (!domain.includes(".")) domain += extension;

        const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;
        if (!domainRegex.test(domain)) { showError("Por favor ingresa un dominio válido (ej: minegocio.com)"); return; }

        setLoading(true); hideResult(); hideError();

        try {
            const response = await fetch("/.netlify/functions/check-domain?domain=" + encodeURIComponent(domain));

            // Si el servidor no devuelve JSON (p. ej. una página 404 de Live Server),
            // mostramos un mensaje claro en lugar del error técnico de parseo.
            let data;
            try {
                data = await response.json();
            } catch (parseError) {
                throw new Error("El servicio de búsqueda no está disponible en este momento. Vuelve a intentarlo en unos minutos.");
            }

            if (!response.ok) throw new Error(data.error || "No pudimos verificar ese dominio. Inténtalo de nuevo.");

            const exchangeRate = 3.85;
            let priceUSD = data.price || 15.32;
            basePrice = Math.ceil(priceUSD * exchangeRate);
            currentDomain = data.domain;
            showResult(data);
        } catch (error) {
            console.error("Error:", error);
            showError(error.message || "Ocurrió un error. Intenta de nuevo.");
        } finally {
            setLoading(false);
        }
    });

    // ── Price calculation ─────────────────────────────────────────────────────
    function updatePrices() {
        const domainTotal = Math.round((basePrice * selectedYears) * (1 - selectedDiscount));
        const grandTotal = domainTotal + selectedPlanPrice;

        priceAmount.textContent = domainTotal;
        cartDomainPrice.textContent = domainTotal;
        cartTotalPrice.textContent = grandTotal;

        // Update InfallCart domain entry
        if (window.InfallCart && currentDomain) {
            window.InfallCart.setDomain(currentDomain, selectedYears, domainTotal);
        }

        // Build final WhatsApp message using InfallCart
        if (window.InfallCart && finalWhatsappBtn) {
            const msg = window.InfallCart.buildMessage();
            finalWhatsappBtn.href = "https://wa.me/" + window.InfallCart.WHATSAPP + "?text=" + encodeURIComponent(msg);
        }
    }

    // ── Year selection ────────────────────────────────────────────────────────
    yearPills.forEach(pill => {
        pill.addEventListener("click", () => {
            yearPills.forEach(p => p.classList.remove("active"));
            pill.classList.add("active");
            selectedYears = parseInt(pill.dataset.years);
            selectedDiscount = parseFloat(pill.dataset.discount);
            cartYearPill.textContent = selectedYears + " año" + (selectedYears > 1 ? "s" : "");
            updatePrices();
        });
    });

    // ── Plan radio selection ──────────────────────────────────────────────────
    planRadios.forEach(radio => {
        radio.addEventListener("change", (e) => {
            selectedPlanPrice = parseInt(e.target.value);
            selectedPlanName = e.target.dataset.name;
            if (window.InfallCart) window.InfallCart.setPlan(selectedPlanName, selectedPlanPrice);
            updatePrices();
        });
    });

    // ── Show/hide result card ─────────────────────────────────────────────────
    function showResult(data) {
        resultDomain.textContent = data.domain;
        resultCard.classList.remove("hidden", "available", "unavailable");

        if (data.available) {
            resultCard.classList.add("available");
            resultIcon.className = "ri-check-line";
            resultStatus.textContent = "¡Felicidades, está disponible!";
            priceBox.style.display = "block";
            whatsappBtn.style.display = "flex";
            yearSelector.classList.remove("hidden");

            if (navCartBadge) { navCartBadge.textContent = (window.InfallCart ? window.InfallCart.count() : 1); navCartBadge.classList.remove("hidden"); }
            yearPills[0].click();
        } else {
            resultCard.classList.add("unavailable");
            resultIcon.className = "ri-close-line";
            resultStatus.textContent = "El dominio ya está registrado";
            priceBox.style.display = "none";
            whatsappBtn.style.display = "none";
            yearSelector.classList.add("hidden");
            if (window.InfallCart) window.InfallCart.removeDomain();
        }
    }

    // ── Cart modal open/close (domain prompt modal) ─────────────────────────────────────────────────
    whatsappBtn.addEventListener("click", (e) => {
        e.preventDefault();
        cartDomainName.textContent = currentDomain;
        // Show pre-selected plan name if available
        const saved = window.InfallCart ? window.InfallCart.get() : null;
        const planSelectionStep = document.getElementById("planSelectionStep");
        const cartPlanSummary = document.getElementById("cartPlanSummary");
        const cartPlanSummaryName = document.getElementById("cartPlanSummaryName");
        const cartPlanSummaryPrice = document.getElementById("cartPlanSummaryPrice");

        if (saved && saved.plan) {
            const matchingRadio = Array.from(planRadios).find(r => parseInt(r.value) === saved.plan.price);
            if (matchingRadio) { matchingRadio.checked = true; selectedPlanPrice = saved.plan.price; selectedPlanName = saved.plan.name; updatePrices(); }
            
            // Si ya viene con un plan elegido desde la página de inicio, ocultamos el selector de planes.
            if (planSelectionStep) planSelectionStep.style.display = 'none';
            // Y mostramos el resumen del plan en el carrito
            if (cartPlanSummary) {
                cartPlanSummary.classList.remove("hidden");
                cartPlanSummaryName.textContent = saved.plan.name;
                cartPlanSummaryPrice.textContent = saved.plan.price;
            }
        } else {
            if (planSelectionStep) planSelectionStep.style.display = 'block';
            if (cartPlanSummary) cartPlanSummary.classList.add("hidden");
        }
        
        cartModal.classList.remove("hidden");
    });

    closeModalBtn.addEventListener("click", () => cartModal.classList.add("hidden"));
    cartModal.addEventListener("click", (e) => { if (e.target === cartModal) cartModal.classList.add("hidden"); });

    // ── Helpers ───────────────────────────────────────────────────────────────
    function hideResult() { resultCard.classList.add("hidden"); yearSelector.classList.add("hidden"); }
    function showError(message) { errorMsg.textContent = message; errorMsg.classList.remove("hidden"); }
    function hideError() { errorMsg.classList.add("hidden"); errorMsg.textContent = ""; }
    function setLoading(isLoading) {
        if (isLoading) { btnText.classList.add("hidden"); spinner.classList.remove("hidden"); searchBtn.disabled = true; input.disabled = true; }
        else { btnText.classList.remove("hidden"); spinner.classList.add("hidden"); searchBtn.disabled = false; input.disabled = false; input.focus(); }
    }
});
