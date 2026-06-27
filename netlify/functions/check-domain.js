exports.handler = async function (event, context) {
    // 1. Validar Método HTTP (Solo permitir GET)
    if (event.httpMethod !== "GET") {
        return { statusCode: 405, body: JSON.stringify({ error: "Method Not Allowed" }) };
    }

    // 2. Política CORS Estricta (Reemplaza con tu dominio real en producción)
    const allowedOrigins = ['http://127.0.0.1:5501', 'http://localhost:5501', 'http://localhost:8888', 'https://infall.com', 'https://www.infall.com'];
    const origin = event.headers.origin || event.headers.Origin || "";
    
    let corsHeader = "";
    if (allowedOrigins.includes(origin)) {
        corsHeader = origin;
    } else if (process.env.NODE_ENV !== 'production') {
        // Fallback local solo si no estamos en producción forzada
        corsHeader = "*";
    }

    const headers = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": corsHeader || allowedOrigins[0],
        "X-Content-Type-Options": "nosniff", // Evita MIME sniffing
        "Strict-Transport-Security": "max-age=31536000; includeSubDomains" // Obliga HTTPS
    };

    // Si el origen no está permitido en producción, bloqueamos
    if (!corsHeader && process.env.NODE_ENV === 'production') {
        return { statusCode: 403, headers, body: JSON.stringify({ error: "Forbidden" }) };
    }

    const domain = event.queryStringParameters?.domain;

    // 3. Validación y Sanitización Estricta del Input
    if (!domain || typeof domain !== 'string') {
        return { statusCode: 400, headers, body: JSON.stringify({ error: "Parámetro 'domain' requerido" }) };
    }

    const cleanDomain = domain.trim().toLowerCase();
    
    // Regex para validar formato exacto de dominio (Evita inyección y payloads maliciosos)
    // - Máximo 253 caracteres, solo letras, números, guiones y puntos
    const domainRegex = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/;
    if (!domainRegex.test(cleanDomain) || cleanDomain.length > 253) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: "Formato de dominio inválido" }) };
    }

    // 4. Configuración Segura de API (Nunca exponer estas keys)
    const apiKey = process.env.NAMESILO_API_KEY;
    const isSandbox = process.env.NAMESILO_SANDBOX === "true"; // Debe ser explícito para evitar fugas

    if (!apiKey) {
        console.error("[SECURITY] API Key no configurada.");
        // Mensaje genérico para el cliente, no exponer el motivo real
        return { statusCode: 500, headers, body: JSON.stringify({ error: "Error interno del servidor" }) };
    }

    const baseUrl = isSandbox 
        ? "https://sandbox.namesilo.com/api/checkRegisterAvailability" 
        : "https://www.namesilo.com/api/checkRegisterAvailability";

    const url = new URL(baseUrl);
    url.searchParams.append("version", "1");
    url.searchParams.append("type", "xml");
    url.searchParams.append("key", apiKey);
    url.searchParams.append("domains", cleanDomain);

    try {
        const response = await fetch(url.toString());
        const xmlText = await response.text();

        // 5. Manejo Seguro de Errores (Sanitización de respuesta)
        const codeMatch = xmlText.match(/<code>(\d+)<\/code>/);
        const detailMatch = xmlText.match(/<detail>([^<]+)<\/detail>/);

        if (codeMatch && codeMatch[1] !== "300") {
            // Log interno para depuración (no se filtra al cliente)
            console.error(`[Namesilo API Error] Code: ${codeMatch[1]}, Detail: ${detailMatch ? detailMatch[1] : 'Unknown'}`);
            // Mensaje genérico al cliente para evitar fugas de información de backend
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ error: "No se pudo consultar el dominio en este momento" })
            };
        }

        const availableBlockMatch = xmlText.match(/<available>([\s\S]*?)<\/available>/);
        const unavailableBlockMatch = xmlText.match(/<unavailable>([\s\S]*?)<\/unavailable>/);

        let isAvailable = false;
        let price = null;

        if (availableBlockMatch && availableBlockMatch[1].includes(cleanDomain)) {
            isAvailable = true;
            const priceMatch = availableBlockMatch[1].match(/price="([^"]+)"/);
            if (priceMatch) {
                // Parseo seguro
                price = parseFloat(priceMatch[1]);
                if (isNaN(price)) price = null;
            }
        } else if (unavailableBlockMatch && unavailableBlockMatch[1].includes(cleanDomain)) {
            isAvailable = false;
        } else {
            console.error("[Parsing Error] Fallo al parsear la respuesta de Namesilo o dominio no encontrado en XML.");
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ error: "Error procesando la disponibilidad" })
            };
        }

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                domain: cleanDomain,
                available: isAvailable,
                price: price
            })
        };
    } catch (error) {
        // Enmascarar error de conexión
        console.error("[Network Error] Fallo al contactar la API de Namesilo:", error.message);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: "Servicio temporalmente no disponible" })
        };
    }
};
