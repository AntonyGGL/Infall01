/**
 * INFALL Cart Module with UI Drawer
 * Persists plan & domain selections across pages using localStorage.
 */
(function () {
    const CART_KEY = "infallCart";
    const WHATSAPP_NUMBER = "51908536493";

    // CSS for Cart Drawer
    const style = document.createElement("style");
    style.innerHTML = `
        #infallCartOverlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(3, 7, 18, 0.6); backdrop-filter: blur(4px);
            z-index: 9999; opacity: 0; visibility: hidden; transition: all 0.3s ease;
        }
        #infallCartOverlay.active { opacity: 1; visibility: visible; }
        
        #infallCartDrawer {
            position: fixed; top: 0; right: -400px; width: 400px; max-width: 100%; height: 100%;
            background: #030712; border-left: 1px solid rgba(255,255,255,0.08);
            box-shadow: -10px 0 40px rgba(0,0,0,0.5); z-index: 10000;
            display: flex; flex-direction: column; transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        #infallCartDrawer.active { right: 0; }
        
        .icart-header {
            padding: 1.5rem; border-bottom: 1px solid rgba(255,255,255,0.08);
            display: flex; justify-content: space-between; align-items: center;
        }
        .icart-title { font-size: 1.25rem; font-weight: 700; color: #fff; display: flex; align-items: center; gap: 0.5rem; }
        .icart-close { background: transparent; border: none; color: #9CA3AF; font-size: 1.5rem; cursor: pointer; transition: color 0.2s; }
        .icart-close:hover { color: #fff; }
        
        .icart-body { flex: 1; padding: 1.5rem; overflow-y: auto; }
        
        .icart-empty { text-align: center; padding: 3rem 1rem; color: #9CA3AF; }
        .icart-empty i { font-size: 3rem; color: rgba(255,255,255,0.1); margin-bottom: 1rem; display: block; }
        
        .icart-item {
            background: #111827; border: 1px solid rgba(255,255,255,0.05);
            border-radius: 12px; padding: 1rem; margin-bottom: 1rem;
            position: relative;
        }
        .icart-item-header { display: flex; justify-content: space-between; margin-bottom: 0.5rem; }
        .icart-item-title { font-weight: 600; color: #e5e7eb; font-size: 0.95rem; display: flex; align-items: center; gap: 0.4rem; }
        .icart-item-price { font-weight: 700; color: #FBBF24; }
        .icart-item-desc { font-size: 0.85rem; color: #9CA3AF; margin-bottom: 0.8rem; }
        .icart-item-remove {
            background: rgba(239, 68, 68, 0.1); color: #EF4444; border: none;
            padding: 0.4rem 0.8rem; border-radius: 6px; font-size: 0.8rem;
            cursor: pointer; transition: all 0.2s; width: 100%;
        }
        .icart-item-remove:hover { background: rgba(239, 68, 68, 0.2); }
        
        .icart-footer { padding: 1.5rem; border-top: 1px solid rgba(255,255,255,0.08); background: #0b1120; }
        .icart-total-row { display: flex; justify-content: space-between; font-size: 1.2rem; font-weight: 700; color: #fff; margin-bottom: 1rem; }
        .icart-checkout {
            width: 100%; background: #25D366; color: #fff; border: none;
            padding: 1rem; border-radius: 10px; font-weight: 700; font-size: 1rem;
            display: flex; justify-content: center; align-items: center; gap: 0.5rem;
            cursor: pointer; transition: all 0.2s; box-shadow: 0 10px 20px -5px rgba(37, 211, 102, 0.4);
        }
        .icart-checkout:hover { transform: translateY(-2px); box-shadow: 0 15px 25px -5px rgba(37, 211, 102, 0.5); }
    `;
    document.head.appendChild(style);

    // HTML for Cart Drawer
    const drawerHTML = `
        <div id="infallCartOverlay"></div>
        <div id="infallCartDrawer">
            <div class="icart-header">
                <div class="icart-title"><i class="ri-shopping-cart-2-fill" style="color: #4F46E5;"></i> Tu Carrito</div>
                <button class="icart-close" id="icartClose">&times;</button>
            </div>
            <div class="icart-body" id="icartBody"></div>
            <div class="icart-footer">
                <div class="icart-total-row"><span>Total:</span> <span id="icartTotal">S/ 0</span></div>
                <button class="icart-checkout" id="icartCheckout"><i class="ri-whatsapp-line"></i> Finalizar Compra</button>
            </div>
        </div>
    `;
    const container = document.createElement("div");
    container.innerHTML = drawerHTML;
    document.body.appendChild(container);

    const overlay = document.getElementById("infallCartOverlay");
    const drawer = document.getElementById("infallCartDrawer");
    const body = document.getElementById("icartBody");
    const totalEl = document.getElementById("icartTotal");
    const btnClose = document.getElementById("icartClose");
    const btnCheckout = document.getElementById("icartCheckout");

    // ── Logic ────────────────────────────────────────────────────────────────
    function getCart() {
        try { return JSON.parse(localStorage.getItem(CART_KEY)) || { plan: null, domain: null }; }
        catch { return { plan: null, domain: null }; }
    }

    function saveCart(cart) {
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
        updateAllBadges();
        renderDrawer();
    }

    function getItemCount() {
        const c = getCart();
        return (c.plan ? 1 : 0) + (c.domain ? 1 : 0);
    }

    function getTotal() {
        const c = getCart();
        return (c.plan ? c.plan.price : 0) + (c.domain ? c.domain.price : 0);
    }

    function updateAllBadges() {
        const count = getItemCount();
        document.querySelectorAll(".cart-badge, #navCartBadge").forEach(badge => {
            if (count > 0) { badge.textContent = count; badge.classList.remove("hidden"); }
            else { badge.classList.add("hidden"); }
        });
    }

    function toggleDrawer(force) {
        const isActive = force !== undefined ? force : !drawer.classList.contains("active");
        if (isActive) {
            renderDrawer();
            overlay.classList.add("active");
            drawer.classList.add("active");
        } else {
            overlay.classList.remove("active");
            drawer.classList.remove("active");
        }
    }

    function renderDrawer() {
        const c = getCart();
        totalEl.textContent = `S/ ${getTotal()}`;
        
        if (!c.plan && !c.domain) {
            body.innerHTML = `
                <div class="icart-empty">
                    <i class="ri-shopping-cart-2-line"></i>
                    <p>Tu carrito está vacío.</p>
                    <p style="font-size: 0.85rem; margin-top: 0.5rem;">Agrega un plan web o un dominio para comenzar.</p>
                </div>
            `;
            btnCheckout.style.opacity = "0.5";
            btnCheckout.style.pointerEvents = "none";
            return;
        }

        btnCheckout.style.opacity = "1";
        btnCheckout.style.pointerEvents = "auto";
        let html = "";

        if (c.plan) {
            html += `
                <div class="icart-item">
                    <div class="icart-item-header">
                        <div class="icart-item-title"><i class="ri-layout-4-fill" style="color: #4F46E5;"></i> Plan Web</div>
                        <div class="icart-item-price">S/ ${c.plan.price}</div>
                    </div>
                    <div class="icart-item-desc">${c.plan.name}</div>
                    <button class="icart-item-remove" onclick="InfallCart.removePlan()"><i class="ri-delete-bin-line"></i> Eliminar</button>
                </div>
            `;
        }
        
        if (c.domain) {
            html += `
                <div class="icart-item">
                    <div class="icart-item-header">
                        <div class="icart-item-title"><i class="ri-earth-fill" style="color: #10B981;"></i> Dominio</div>
                        <div class="icart-item-price">S/ ${c.domain.price}</div>
                    </div>
                    <div class="icart-item-desc">${c.domain.name} (${c.domain.years} año${c.domain.years > 1 ? 's' : ''})</div>
                    <button class="icart-item-remove" onclick="InfallCart.removeDomain()"><i class="ri-delete-bin-line"></i> Eliminar</button>
                </div>
            `;
        }

        body.innerHTML = html;
    }

    window.InfallCart = {
        get: getCart, count: getItemCount, total: getTotal, WHATSAPP: WHATSAPP_NUMBER,

        setPlan(name, price, extra = null) { const c = getCart(); c.plan = { name, price: parseInt(price), extra }; saveCart(c); },
        setDomain(name, years, price) { const c = getCart(); c.domain = { name, years: parseInt(years), price: parseInt(price) }; saveCart(c); },
        removePlan() { const c = getCart(); c.plan = null; saveCart(c); },
        removeDomain() { const c = getCart(); c.domain = null; saveCart(c); },
        open() { toggleDrawer(true); },

        buildMessage() {
            const c = getCart();
            let msg = "Hola INFALL, me interesa lo siguiente:\n";
            if (c.plan) {
                msg += "\n*Plan Web:* " + c.plan.name + " - S/ " + c.plan.price;
                if (c.plan.extra) {
                    if (c.plan.extra.nombre) msg += "\n*Nombre:* " + c.plan.extra.nombre;
                    if (c.plan.extra.proyecto) msg += "\n*Proyecto:* " + c.plan.extra.proyecto;
                }
            }
            if (c.domain) msg += "\n*Dominio:* " + c.domain.name + " por " + c.domain.years + " año(s) - S/ " + c.domain.price;
            if (c.plan || c.domain) msg += "\n\n*Total estimado: S/ " + getTotal() + "*\n\nPor favor, quiero confirmar mi pedido.";
            return msg;
        },

        checkout() {
            window.open("https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(this.buildMessage()), "_blank");
            toggleDrawer(false);
        }
    };

    // Events
    btnClose.addEventListener("click", () => toggleDrawer(false));
    overlay.addEventListener("click", () => toggleDrawer(false));
    btnCheckout.addEventListener("click", () => window.InfallCart.checkout());

    // Bind all navbar cart buttons to open the drawer
    document.addEventListener("click", (e) => {
        const btn = e.target.closest("#navCartBtn, .cart-toggle");
        if (btn) {
            e.preventDefault();
            toggleDrawer(true);
        }
    });

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", updateAllBadges);
    } else { updateAllBadges(); }
})();
