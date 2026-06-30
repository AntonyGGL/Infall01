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
            background: rgba(3, 7, 18, 0.55); backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px);
            z-index: 9999; opacity: 0; visibility: hidden; transition: opacity 220ms ease-out, visibility 220ms;
        }
        #infallCartOverlay.active { opacity: 1; visibility: visible; }

        #infallCartDrawer {
            --icart-r-xl: 28px; --icart-r-lg: 18px; --icart-r-md: 14px; --icart-r-sm: 10px;
            --icart-ease: cubic-bezier(0.16, 1, 0.3, 1);
            position: fixed; top: 14px; right: 14px; bottom: 14px; width: 410px; max-width: calc(100% - 28px);
            background: rgba(var(--rgb-deep, 15, 23, 42), 0.78);
            backdrop-filter: blur(22px) saturate(160%); -webkit-backdrop-filter: blur(22px) saturate(160%);
            border: 1px solid rgba(var(--rgb-contrast, 255,255,255), 0.12);
            border-radius: var(--icart-r-xl);
            box-shadow: 0 24px 70px -14px rgba(0,0,0,0.55), 0 0 0 1px rgba(var(--rgb-contrast, 255,255,255), 0.03),
                0 0 90px -30px rgba(var(--accent-orange-rgb, 255,140,0), 0.35), 0 0 70px -35px rgba(var(--accent-cyan-rgb, 0,229,255), 0.3);
            z-index: 10000; overflow: hidden;
            display: flex; flex-direction: column;
            transform: translateX(calc(100% + 40px));
            transition: transform 300ms var(--icart-ease);
            font-family: var(--font-main, 'DM Sans', sans-serif);
        }
        #infallCartDrawer.active { transform: translateX(0); }
        #infallCartDrawer::before {
            content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 2px;
            background: linear-gradient(90deg, var(--accent-orange, #FF8C00), var(--accent-cyan, #00E5FF));
        }

        .icart-header {
            padding: 1.4rem 1.4rem 1.1rem; border-bottom: 1px solid rgba(var(--rgb-contrast, 255,255,255), 0.08);
            display: flex; justify-content: space-between; align-items: center; flex-shrink: 0;
        }
        .icart-title {
            font-family: var(--font-display, 'Sora', sans-serif);
            font-size: 1.1rem; font-weight: 700; color: var(--text-white, #F1F5F9);
            display: flex; align-items: center; gap: 0.7rem;
        }
        .icart-title-icon {
            width: 34px; height: 34px; border-radius: var(--icart-r-sm, 10px);
            background: rgba(var(--accent-orange-rgb, 255,140,0), 0.14);
            color: var(--accent-orange, #FF8C00);
            display: flex; align-items: center; justify-content: center; font-size: 1.05rem;
        }
        .icart-close {
            width: 32px; height: 32px; border-radius: 50%;
            background: rgba(var(--rgb-contrast, 255,255,255), 0.05);
            border: none; color: var(--text-muted, #94A3B8); font-size: 1.25rem; cursor: pointer;
            display: flex; align-items: center; justify-content: center; line-height: 1;
            transition: background 160ms ease-out, color 160ms ease-out, transform 160ms var(--icart-ease, ease);
        }
        .icart-close:hover { color: var(--accent-orange, #FF8C00); background: rgba(var(--accent-orange-rgb, 255,140,0), 0.12); transform: rotate(90deg); }
        .icart-close:active { transform: rotate(90deg) scale(0.85); transition-duration: 90ms; }

        .icart-body { flex: 1; padding: 1.3rem 1.4rem; overflow-y: auto; scrollbar-width: thin; scrollbar-color: rgba(var(--accent-orange-rgb, 255,140,0), 0.4) transparent; }
        .icart-body::-webkit-scrollbar { width: 6px; }
        .icart-body::-webkit-scrollbar-track { background: transparent; }
        .icart-body::-webkit-scrollbar-thumb { background: rgba(var(--accent-orange-rgb, 255,140,0), 0.4); border-radius: 10px; }

        .icart-empty { text-align: center; padding: 3.5rem 1rem; color: var(--text-muted, #94A3B8); }
        .icart-empty i {
            font-size: 2.6rem; color: var(--accent-orange, #FF8C00); opacity: 0.35;
            margin-bottom: 1.1rem; display: block;
        }
        .icart-empty p:first-of-type { color: var(--text-white, #F1F5F9); font-weight: 600; font-size: 0.95rem; margin-bottom: 0.4rem; }

        @keyframes icartItemIn {
            from { opacity: 0; transform: translateY(10px) scale(0.98); }
            to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .icart-item {
            background: rgba(var(--rgb-contrast, 255,255,255), 0.04);
            border: 1px solid rgba(var(--rgb-contrast, 255,255,255), 0.08);
            border-left: 3px solid rgba(var(--accent-orange-rgb, 255,140,0), 0.5);
            border-radius: var(--icart-r-lg, 18px); padding: 1.1rem; margin-bottom: 0.9rem;
            position: relative; transition: border-color 200ms ease-out, background 200ms ease-out, transform 200ms var(--icart-ease, ease);
            animation: icartItemIn 280ms var(--icart-ease, ease) both;
        }
        .icart-item:hover { border-color: rgba(var(--accent-orange-rgb, 255,140,0), 0.32); background: rgba(var(--accent-orange-rgb, 255,140,0), 0.04); border-left-color: var(--accent-orange, #FF8C00); transform: translateY(-2px); }
        .icart-item--domain { border-left-color: rgba(var(--accent-cyan-rgb, 0,229,255), 0.5); }
        .icart-item--domain:hover { border-color: rgba(var(--accent-cyan-rgb, 0,229,255), 0.32); background: rgba(var(--accent-cyan-rgb, 0,229,255), 0.04); border-left-color: var(--accent-cyan, #00E5FF); }
        .icart-item-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; }
        .icart-item-title { font-weight: 700; color: var(--text-white, #F1F5F9); font-size: 0.92rem; display: flex; align-items: center; gap: 0.45rem; }
        .icart-item-price { font-weight: 700; color: var(--accent-orange, #FF8C00); font-family: var(--font-tech, 'Space Grotesk', sans-serif); }
        .icart-item--domain .icart-item-price { color: var(--accent-cyan, #00E5FF); }
        .icart-item-desc { font-size: 0.85rem; color: var(--text-muted, #94A3B8); margin-bottom: 0.9rem; line-height: 1.5; }
        .icart-item-remove {
            background: rgba(239, 68, 68, 0.08); color: #EF4444; border: 1px solid rgba(239, 68, 68, 0.18);
            padding: 0.45rem 0.8rem; border-radius: var(--icart-r-sm, 10px); font-size: 0.78rem; font-weight: 600;
            cursor: pointer; transition: background 160ms ease-out, border-color 160ms ease-out, transform 160ms var(--icart-ease, ease); width: 100%;
            display: flex; align-items: center; justify-content: center; gap: 0.35rem;
        }
        .icart-item-remove:hover { background: rgba(239, 68, 68, 0.16); border-color: rgba(239, 68, 68, 0.35); }
        .icart-item-remove:active { transform: scale(0.96); transition-duration: 90ms; }

        .icart-footer {
            padding: 1.3rem 1.4rem; position: relative;
            background: rgba(var(--rgb-contrast, 255,255,255), 0.02); flex-shrink: 0;
        }
        .icart-footer::before {
            content: ''; position: absolute; top: 0; left: 1.4rem; right: 1.4rem; height: 1px;
            background: linear-gradient(90deg, rgba(var(--accent-orange-rgb, 255,140,0), 0.5), rgba(var(--accent-cyan-rgb, 0,229,255), 0.5));
        }
        .icart-total-row {
            display: flex; justify-content: space-between; align-items: baseline;
            font-size: 0.95rem; font-weight: 600; color: var(--text-muted, #94A3B8); margin-bottom: 1.1rem;
        }
        .icart-total-row span:last-child {
            font-family: var(--font-tech, 'Space Grotesk', sans-serif);
            font-size: 1.6rem; font-weight: 700;
            background: linear-gradient(135deg, var(--text-white, #F1F5F9) 30%, var(--accent-orange, #FF8C00) 75%, #FBBF24 100%);
            -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .icart-checkout {
            width: 100%; background: #25D366; color: #fff; border: none;
            padding: 1rem; border-radius: var(--icart-r-md, 14px); font-weight: 700; font-size: 1rem;
            font-family: var(--font-main, 'DM Sans', sans-serif);
            display: flex; justify-content: center; align-items: center; gap: 0.6rem;
            cursor: pointer; transition: transform 180ms var(--icart-ease, ease), box-shadow 180ms ease-out, opacity 180ms ease-out;
            box-shadow: 0 12px 25px -8px rgba(37, 211, 102, 0.45);
        }
        .icart-checkout:hover { transform: translateY(-2px); box-shadow: 0 18px 32px -8px rgba(37, 211, 102, 0.55); }
        .icart-checkout:active { transform: translateY(0) scale(0.97); transition-duration: 90ms; }

        @media (prefers-reduced-motion: reduce) {
            #infallCartDrawer, #infallCartOverlay, .icart-item, .icart-close, .icart-checkout, .icart-item-remove {
                transition: none !important; animation: none !important;
            }
        }
    `;
    document.head.appendChild(style);

    // HTML for Cart Drawer
    const drawerHTML = `
        <div id="infallCartOverlay"></div>
        <div id="infallCartDrawer">
            <div class="icart-header">
                <div class="icart-title"><span class="icart-title-icon"><i class="ri-shopping-cart-2-fill"></i></span> Tu Carrito</div>
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
        let itemIndex = 0;

        if (c.plan) {
            html += `
                <div class="icart-item" style="animation-delay: ${itemIndex++ * 60}ms">
                    <div class="icart-item-header">
                        <div class="icart-item-title"><i class="ri-layout-4-fill" style="color: var(--accent-orange, #FF8C00);"></i> Plan Web</div>
                        <div class="icart-item-price">S/ ${c.plan.price}</div>
                    </div>
                    <div class="icart-item-desc">${c.plan.name}</div>
                    <button class="icart-item-remove" onclick="InfallCart.removePlan()"><i class="ri-delete-bin-line"></i> Eliminar</button>
                </div>
            `;
        }

        if (c.domain) {
            html += `
                <div class="icart-item icart-item--domain" style="animation-delay: ${itemIndex++ * 60}ms">
                    <div class="icart-item-header">
                        <div class="icart-item-title"><i class="ri-earth-fill" style="color: var(--accent-cyan, #00E5FF);"></i> Dominio</div>
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
