
import { AdTemplate } from '../types/template';

export const BEST_ADS_TEMPLATES: AdTemplate[] = [
    {
        id: 'ba-creatine-features',
        title: '1. Feature & Benefits (Icon Pro)',
        description: 'Estructura de autoridad con zoom tipo lupa y 4 iconos de beneficios técnicos.',
        thumbnailUrl: 'https://storage.googleapis.com/msgsndr/Zwjvo9JT2X190h2yTfhT/media/694edf3a73a5e0b9bb331afe.png',
        requiredImages: 1,
        aspectRatio: '1:1',
        fields: [
            { id: 'headline_part1', label: 'Titular Parte 1', type: 'text', placeholder: 'CREATINA HAY MUCHAS.' },
            { id: 'headline_highlight', label: 'Titular Destacado', type: 'text', placeholder: 'CALIDAD, SOLO UNA' },
            { id: 'callout', label: 'Texto Lupa (Zoom)', type: 'text', placeholder: 'Creapure® 24LB13' },
            { id: 'b1', label: 'Beneficio 1', type: 'text', placeholder: '100% Pura Creapure' },
            { id: 'b2', label: 'Beneficio 2', type: 'text', placeholder: 'Retrasa la fatiga' },
            { id: 'b3', label: 'Beneficio 3', type: 'text', placeholder: 'Aumenta masa muscular' },
            { id: 'b4', label: 'Beneficio 4', type: 'text', placeholder: 'Sin gluten ni azúcares' }
        ],
        basePrompt: `{
  "template_id": "iconic-authority-zoom",
  "visual_aesthetic": {
    "vibe": "Professional sports nutrition, high-authority commercial photography",
    "background": "Cinematic studio with soft neutral textures, professional rim lighting on the product",
    "lighting": "High-end studio setup, soft box illumination, clean depth of field"
  },
  "layout_structure": {
    "main_composition": "The core product is held by a professional hand in the center-lower third, presented directly to the camera.",
    "top_billboard": {
      "headline_part1": "{{headline_part1}}",
      "headline_highlight": "{{headline_highlight}}",
      "style": "Industrial bold typography, stacked, secondary line in accent color"
    },
    "detail_magnifier": {
      "element": "circular_zoom_bubble",
      "target": "quality_seal_or_label_on_product",
      "label": "{{callout}}",
      "style": "Floating glass lens with a fine connecting stroke to the product detail"
    },
    "benefits_grid": {
      "structure": "2x2 clean grid in the lower half",
      "items": [
        {"icon": "premium_purity", "text": "{{b1}}"},
        {"icon": "energy_bolt", "text": "{{b2}}"},
        {"icon": "muscle_icon", "text": "{{b3}}"},
        {"icon": "clean_label", "text": "{{b4}}"}
      ]
    },
    "offer_overlay": {
      "render": "bold_pricing_block",
      "text": "12 cuotas sin interés",
      "style": "Modern e-commerce typography, high visibility"
    }
  }
}`
    },
    {
        id: 'ba-drybreak-split',
        title: '2. Before & After (Split)',
        description: 'Contraste extremo entre el problema (B&W) y la solución (Color).',
        thumbnailUrl: 'https://storage.googleapis.com/msgsndr/Zwjvo9JT2X190h2yTfhT/media/694edf3a19b8c30779bb9082.png',
        requiredImages: 1,
        aspectRatio: '1:1',
        fields: [
            { id: 'left_label', label: 'Etiqueta Izquierda', type: 'text', placeholder: 'SIN PRODUCTO' },
            { id: 'right_label', label: 'Etiqueta Derecha', type: 'text', placeholder: 'CON PRODUCTO' },
            { id: 'prob_txt', label: 'Texto Problema (Izq)', type: 'textarea', placeholder: 'Sudor. Distracción. Puntos perdidos.' },
            { id: 'sol_txt', label: 'Texto Solución (Der)', type: 'textarea', placeholder: 'Manos secas. Máximo agarre. Rendimiento total.' }
        ],
        basePrompt: `{
  "template_id": "problem-solution-split",
  "visual_aesthetic": {
    "vibe": "Performance contrast, extreme emotional shift, competitive comparison",
    "background": "The scene is divided by a sharp vertical split exactly in the center"
  },
  "layout_structure": {
    "left_panel": {
      "focus": "The problem state",
      "visual_style": "Dramatic Grain Noir, low contrast black and white, moody shadows",
      "label": "{{left_label}}",
      "description": "{{prob_txt}}",
      "style": "Clean white typography on dark/BW background"
    },
    "right_panel": {
      "focus": "The solution state (The Product)",
      "visual_style": "High-fidelity vibrant color, professional studio lighting, warm skin tones",
      "label": "{{right_label}}",
      "description": "{{sol_txt}}",
      "style": "Bold high-contrast typography, high visibility"
    },
    "product_focus": "The product acts as the central anchor, perfectly centered over the split line."
  }
}`
    },
    {
        id: 'ba-zzen-dual',
        title: '3. Producto Sustituto (Dual Tone)',
        description: 'Comparativa minimalista contra el hábito tradicional. Ideal para suplementos.',
        thumbnailUrl: 'https://storage.googleapis.com/msgsndr/Zwjvo9JT2X190h2yTfhT/media/694edf3a835a58401fba10bc.png',
        requiredImages: 1,
        aspectRatio: '1:1',
        fields: [
            { id: 'left_name', label: 'Hábito Viejo', type: 'text', placeholder: 'CAFÉ' },
            { id: 'right_name', label: 'Tu Producto', type: 'text', placeholder: 'ZZEN Focus' },
            { id: 'left_cons', label: 'Contras (Sustituto)', type: 'textarea', placeholder: 'Nerviosismo y estrés\\nBajón de energía\\nSiempre cansado' },
            { id: 'right_pros', label: 'Pros (Tu Producto)', type: 'textarea', placeholder: 'Máximo foco y calma\\nEnergía sostenida\\nSin fatiga mental' }
        ],
        basePrompt: `{
  "template_id": "dual-tone-comparison",
  "visual_aesthetic": {
    "vibe": "Aesthetic minimalism, editorial supplement style, dual-tone sophistication",
    "background": "Bipartite composition: Deep Matte Black vs. Pristine Studio White"
  },
  "layout_structure": {
    "left_side_habits": {
      "background_color": "Deep Black",
      "product_name": "{{left_name}}",
      "cons_list": "{{left_cons}}",
      "typography": "Clean sans-serif white text, minimalist list design"
    },
    "right_side_product": {
      "background_color": "Studio White",
      "product_name": "{{right_name}}",
      "pros_list": "{{right_pros}}",
      "typography": "Clean sans-serif black text, bold product headline"
    },
    "visual_balance": "Two distinct columns with equal weighting, separating the 'old habit' from the 'new solution'."
  }
}`
    },
    {
        id: 'ba-table-science',
        title: '4. US vs THEM (Table)',
        description: 'Tabla de comparación técnica con enfoque científico y checkmarks.',
        thumbnailUrl: 'https://storage.googleapis.com/msgsndr/Zwjvo9JT2X190h2yTfhT/media/694edf3a42bb1c6b94348d55.png',
        requiredImages: 1,
        aspectRatio: '1:1',
        fields: [
            { id: 'brand_name', label: 'Tu Marca', type: 'text', placeholder: 'Ultisana' },
            { id: 'competitor_name', label: 'Competencia', type: 'text', placeholder: 'Other Brands' },
            { id: 'rows_data', label: 'Filas (Atributos)', type: 'textarea', placeholder: 'Protects brain health\\nSupports memory\\nIncreased energy\\nNo artificial fillers' }
        ],
        basePrompt: `{
  "template_id": "tech-comparison-table",
  "visual_aesthetic": {
    "vibe": "Scientific authority, clinical modern editorial, data-driven trust",
    "style": "Clean minimalist interface, thin dividers, professional data grid"
  },
  "layout_structure": {
    "main_table": {
      "headers": ["ATRIBUTO", "{{brand_name}}", "{{competitor_name}}"],
      "data_rows": "{{rows_data}}",
      "visual_style": "Checkmark table with green dots for your brand and neutral markers for others"
    },
    "typography": {
      "brand_column": "Bold accent typography",
      "competitor_column": "Muted secondary typography"
    },
    "environment": "High-end product placed beside the technical table on a clean lab-style surface"
  }
}`
    },
    {
        id: 'ba-sleep-progress',
        title: '5. Power Bars (Comparison)',
        description: 'Visualización de efectividad mediante barras de carga comparativas.',
        thumbnailUrl: 'https://storage.googleapis.com/msgsndr/Zwjvo9JT2X190h2yTfhT/media/694edf3ab62dd371a4dae70f.png',
        requiredImages: 1,
        aspectRatio: '1:1',
        fields: [
            { id: 'headline', label: 'Titular Superior', type: 'text', placeholder: 'EFECTO AL DESPERTAR' },
            { id: 'p1_name', label: 'Producto A', type: 'text', placeholder: 'Melatonina Convencional' },
            { id: 'p1_val', label: 'Valor A (%)', type: 'text', placeholder: '15%' },
            { id: 'p2_name', label: 'Tu Producto', type: 'text', placeholder: 'ZZEN Sleep' },
            { id: 'p2_val', label: 'Valor B (%)', type: 'text', placeholder: '100%' },
            { id: 'p2_desc', label: 'Texto Destacado B', type: 'text', placeholder: 'Descansas la noche entera' }
        ],
        basePrompt: `{
  "template_id": "data-loading-progress",
  "visual_aesthetic": {
    "vibe": "High-performance tech, analytical, visual proof of efficacy",
    "background": "Deep moody studio with electric blue/violet accents (tech glow)"
  },
  "layout_structure": {
    "upper_headline": "{{headline}}",
    "comparison_bars": [
      {
        "label": "{{p1_name}}",
        "value": "{{p1_val}}",
        "status": "Incomplete, grey/muted bar"
      },
      {
        "label": "{{p2_name}}",
        "value": "{{p2_val}}",
        "accent_text": "{{p2_desc}}",
        "status": "Full charge, glowing accent color (Electric Blue/Cyan)"
      }
    ],
    "typography": "High-tech digital display aesthetic, monospaced or modern sans-serif"
  }
}`
    },
    {
        id: 'ba-timeline-fit',
        title: '6. Proceso (Día 1 vs 90)',
        description: 'Línea de tiempo de resultados. Ideal para planes de nutrición o fitness.',
        thumbnailUrl: 'https://storage.googleapis.com/msgsndr/Zwjvo9JT2X190h2yTfhT/media/694edf3ab62dd3f7f7dae717.png',
        requiredImages: 1,
        aspectRatio: '1:1',
        fields: [
            { id: 'p_name', label: 'Nombre Producto', type: 'text', placeholder: 'FIT BLEND' },
            { id: 'd1_list', label: 'Día 1: Logros', type: 'textarea', placeholder: 'Menos hambre\\nMejor control de glucosa' },
            { id: 'd90_list', label: 'Día 90: Logros', type: 'textarea', placeholder: 'Ayuda a perder grasa\\nNo hay ansiedad por la comida\\nMenos diámetro de cintura' }
        ],
        basePrompt: `{
  "template_id": "vertical-evo-timeline",
  "visual_aesthetic": {
    "vibe": "Progressive transformation, results-oriented, motivational fitness/wellness",
    "background": "Clean minimalist gym or bright clinical studio environment"
  },
  "layout_structure": {
    "top_banner": {
      "headline": "TOMANDO {{p_name}}",
      "style": "Bold sporty typography, upper third of the frame"
    },
    "timeline_points": [
      {
        "time": "DÍA 1",
        "description": "{{d1_list}}",
        "visual_style": "Initial state, minimalist icon, clear list"
      },
      {
        "time": "DÍA 90",
        "description": "{{d90_list}}",
        "visual_style": "Transformation peak, glowing accent color, highlighted achievements"
      }
    ],
    "visual_flow": "A vertical connecting line showing chronology and continuous progress"
  }
}`
    },
    {
        id: 'ba-stats-glass',
        title: '7. Fact Metric (Stats)',
        description: 'Métrica gigante con porcentaje para generar autoridad inmediata.',
        thumbnailUrl: 'https://storage.googleapis.com/msgsndr/Zwjvo9JT2X190h2yTfhT/media/694edf3a835a586047ba10bd.png',
        requiredImages: 1,
        aspectRatio: '1:1',
        fields: [
            { id: 'stat_val', label: 'Porcentaje %', type: 'text', placeholder: '+95%' },
            { id: 'stat_sub', label: 'Subtexto Métrica', type: 'text', placeholder: 'de quienes lo prueban' },
            { id: 'stat_main', label: 'Texto de Impacto', type: 'text', placeholder: 'no vuelven al supermercado.' }
        ],
        basePrompt: `{
  "template_id": "giant-metric-overlay",
  "visual_aesthetic": {
    "vibe": "Cinematic authority, statistical dominance, high-end commercial feel",
    "background": "Cinematic product close-up, possibly inside a premium glass or marble container"
  },
  "layout_structure": {
    "metric_centerpiece": {
      "value": "{{stat_val}}",
      "subtext": "{{stat_sub}}",
      "main_headline": "{{stat_main}}",
      "style": "Giant high-visibility typography, glass-effect background on the text box"
    },
    "product_presentation": "The product is clearly visible behind the translucent metric box, maintaining focus on texture and quality."
  }
}`
    },
    {
        id: 'ba-hero-offer',
        title: '8. Oferta (Lifestyle)',
        description: 'Anuncio de oferta con tipografía de alto impacto sobre modelo.',
        thumbnailUrl: 'https://storage.googleapis.com/msgsndr/Zwjvo9JT2X190h2yTfhT/media/694edf3adda192d4067856e2.png',
        requiredImages: 1,
        aspectRatio: '3:4',
        fields: [
            { id: 'bg_txt', label: 'Texto de Fondo', type: 'text', placeholder: 'OFERTAS' },
            { id: 'promo_main', label: 'Promo Principal', type: 'text', placeholder: '50% DE DESCUENTO' },
            { id: 'promo_sub', label: 'Promo Bajada', type: 'text', placeholder: 'Últimos días de promoción' }
        ],
        basePrompt: `{
  "template_id": "typographic-lifestyle",
  "visual_aesthetic": {
    "vibe": "Active lifestyle, urban trendy, high-impact fashion editorial",
    "lighting": "Warm sunlight or high-energy gym lighting"
  },
  "layout_structure": {
    "background_text": {
      "text": "{{bg_txt}}",
      "style": "Repetitive or giant outline typography in the background layer"
    },
    "foreground_content": {
      "headline": "{{promo_main}}",
      "sub_headline": "{{promo_sub}}",
      "style": "Solid bold high-contrast text overlaying the model"
    },
    "model_interaction": "A professional agency model in an active lifestyle pose, interacting with or wearing the brand."
  }
}`
    },
    {
        id: 'ba-bundle-deal',
        title: '9. Oferta 2 (Bundle)',
        description: 'Diseño de Pack con ahorro total destacado en un listón.',
        thumbnailUrl: 'https://storage.googleapis.com/msgsndr/Zwjvo9JT2X190h2yTfhT/media/694edf3adda192e5ef7856de.png',
        requiredImages: 1,
        aspectRatio: '3:4',
        fields: [
            { id: 'title', label: 'Titular Oferta', type: 'text', placeholder: 'TE REGALAMOS MÁS DE 50€ EN PRODUCTOS' },
            { id: 'saving', label: 'Ahorro Listón', type: 'text', placeholder: '-€55,50' },
            { id: 'footer', label: 'Texto Inferior', type: 'text', placeholder: 'ENVÍO GRATIS INCLUIDO' }
        ],
        basePrompt: `{
  "template_id": "product-bundle-savings",
  "visual_aesthetic": {
    "vibe": "Generous bundle, outdoor breezy lifestyle, premium vacation feel",
    "background": "Clean outdoor terrace or bright minimalist kitchen"
  },
  "layout_structure": {
    "offer_headline": {
      "text": "{{title}}",
      "style": "Large celebratory typography at the top"
    },
    "savings_element": {
      "text": "{{saving}}",
      "component": "floating_ribbon_or_badge",
      "style": "High-contrast ribbon cutting across the product layout"
    },
    "brand_footer": "{{footer}}",
    "product_arrangement": "A multi-product bundle neatly arranged on a flat surface, showing variety and value."
  }
}`
    },
    {
        id: 'ba-receipt-flash',
        title: '10. Flash Sale (Ticket)',
        description: 'Estética de ticket térmico para ventas flash y urgencia.',
        thumbnailUrl: 'https://storage.googleapis.com/msgsndr/Zwjvo9JT2X190h2yTfhT/media/694edf3a6caf49835b623610.png',
        requiredImages: 1,
        aspectRatio: '1:1',
        fields: [
            { id: 'header', label: 'Encabezado Ticket', type: 'text', placeholder: 'FLASH SALE - 35% OFF' },
            { id: 'product', label: 'Producto/Pack', type: 'text', placeholder: 'Pack Paz & Calma' },
            { id: 'old_p', label: 'Precio Anterior', type: 'text', placeholder: '70€' },
            { id: 'new_p', label: 'Precio Nuevo', type: 'text', placeholder: '44€' }
        ],
        basePrompt: `{
  "template_id": "flash-sale-receipt",
  "visual_aesthetic": {
    "vibe": "Emergency discount, retail warehouse, urgent thermal output",
    "background": "Minimalist monochrome surface or slightly crumpled high-quality paper texture"
  },
  "layout_structure": {
    "receipt_header": {
      "text": "{{header}}",
      "style": "Monospaced thermal printer font, high contrast black on white"
    },
    "item_list": [
      {
        "name": "{{product}}",
        "original_price": "{{old_p}}",
        "promo_price": "{{new_p}}"
      }
    ],
    "urgency_footer": "TERMINA EN 24HS",
    "visual_elements": "Thin dotted dividers (-----), realistic paper shadows, monospaced typography throughout"
  }
}`
    },
    {
        id: 'ba-ig-question',
        title: '11. IG Box (Question & Answer)',
        description: 'Caja de preguntas de Instagram con respuesta debajo. Humaniza y vende.',
        thumbnailUrl: 'https://storage.googleapis.com/msgsndr/Zwjvo9JT2X190h2yTfhT/media/694edf3ab62dd309d6dae716.png',
        requiredImages: 1,
        aspectRatio: '9:16',
        fields: [
            { id: 'header', label: 'Cabecera Sticker', type: 'text', placeholder: '¡Pregunta lo que quieras!' },
            { id: 'question', label: 'Pregunta del Usuario', type: 'text', placeholder: '¿Qué recomiendan para combatir la hinchazón?' },
            { id: 'answer', label: 'Respuesta (Texto)', type: 'textarea', placeholder: 'Nuestro Microbiotic Creamer es el favorito para deshinchar el abdomen de forma natural.' }
        ],
        basePrompt: `{
  "template_id": "instagram-stories-ui",
  "visual_aesthetic": {
    "vibe": "Social native, authentic engagement, soft lifestyle aesthetic",
    "background": "Aesthetic soft-focus product lifestyle shot with natural shadows"
  },
  "layout_structure": {
    "sticker_component": {
      "type": "QuestionBox",
      "header_text": "{{header}}",
      "question_body": "{{question}}",
      "style": "Standard Instagram rounded-corner sticker, translucent white background"
    },
    "answer_response": {
      "text": "{{answer}}",
      "style": "Floating bubble overlay with standard IG story font (Aveny-T or similar)"
    },
    "ui_elements": "Includes standard story icons (Close, Reply) to simulate a real screenshot"
  }
}`
    },
    {
        id: 'ba-postit-box',
        title: '12. Post-it Unboxing',
        description: 'Mensaje manuscrito en un Post-it sobre la caja abierta del producto.',
        thumbnailUrl: 'https://storage.googleapis.com/msgsndr/Zwjvo9JT2X190h2yTfhT/media/694edf3a835a585126ba10bb.png',
        requiredImages: 1,
        aspectRatio: '1:1',
        fields: [
            { id: 'note', label: 'Nota del Post-it', type: 'text', placeholder: '¡MI SECRETO PARA LA HINCHAZÓN!' }
        ],
        basePrompt: `{
  "template_id": "unboxing-close-up-postit",
  "visual_aesthetic": {
    "vibe": "Personal touch, warm home setting, authentic discovery",
    "background": "The product box is open, showing the product inside in its packaging"
  },
  "layout_structure": {
    "key_element": {
      "item": "pink_postit_note",
      "text": "{{note}}",
      "style": "Realistic handwritten ink on a square pink adhesive note",
      "position": "Stuck to the edge of the opened box"
    },
    "lighting": "Warm, domestic natural light, soft shadows, realistic home environment"
  }
}`
    },
    {
        id: 'ba-notes-check',
        title: '13. Notas iPhone (Checklist)',
        description: 'Captura de pantalla de la app Notas. Transmite honestidad y cercanía.',
        thumbnailUrl: 'https://storage.googleapis.com/msgsndr/Zwjvo9JT2X190h2yTfhT/media/694edf3a19b8c32feebb9074.png',
        requiredImages: 1,
        aspectRatio: '1:1',
        fields: [
            { id: 'title', label: 'Título Nota', type: 'text', placeholder: 'Why some brands launch 10x more ads' },
            { id: 'list', label: 'Checklist (Notas)', type: 'textarea', placeholder: 'Discovered AI Studio\\nNo more designers needed\\nProduction in minutes' }
        ],
        basePrompt: `{
  "template_id": "iphone-notes-app-ui",
  "visual_aesthetic": {
    "vibe": "Raw honesty, simple thoughts, behind-the-scenes accessibility",
    "background": "High-fidelity mock of the Apple Notes app (iOS-style)"
  },
  "layout_structure": {
    "notes_content": {
      "timestamp": "Hoy, 12:45 PM",
      "title": "{{title}}",
      "checklist_items": "{{list}}",
      "style": "System-standard iOS typography, yellow checklist markers, clinical app background"
    },
    "visual_presentation": "The iPhone screen is the sole focus, presented as a clean screenshot overlay."
  }
}`
    },
    {
        id: 'ba-memes-story',
        title: '14. Memes (Viral Overlay)',
        description: 'Estética viral con banner superior y burbujas de diálogo dinámicas.',
        thumbnailUrl: 'https://storage.googleapis.com/msgsndr/Zwjvo9JT2X190h2yTfhT/media/694edf3a6caf4925ea623611.png',
        requiredImages: 1,
        aspectRatio: '9:16',
        fields: [
            { id: 'banner', label: 'Banner Superior', type: 'text', placeholder: 'YO CUANDO EMPECÉ A TOMAR ZZÉN' },
            { id: 'bubble1', label: 'Burbuja 1', type: 'text', placeholder: 'ADIÓS A LOS GASES' },
            { id: 'bubble2', label: 'Burbuja 2', type: 'text', placeholder: 'DIGESTIONES PERFECTAS' }
        ],
        basePrompt: `{
  "template_id": "viral-meme-overlay",
  "visual_aesthetic": {
    "vibe": "Viral humor, relatable social proof, fast-paced content",
    "aspect_ratio": "9:16 (Story format)"
  },
  "layout_structure": {
    "top_banner": {
      "text": "{{banner}}",
      "style": "Solid white banner with black bold Impact Font, classic meme style"
    },
    "chat_bubbles": [
      {
        "text": "{{bubble1}}",
        "style": "Floating dialogue bubble (iMessage or DM style)"
      },
      {
        "text": "{{bubble2}}",
        "style": "Secondary dialogue bubble"
      }
    ],
    "background_scene": "Dynamic, high-energy product interaction or relatable reaction shot"
  }
}`
    },
    {
        id: 'ba-google-shopping',
        title: '15. Google Shopping (Search UI)',
        description: 'Simula una búsqueda en Google donde tu producto es la solución número 1.',
        thumbnailUrl: 'https://storage.googleapis.com/msgsndr/Zwjvo9JT2X190h2yTfhT/media/694edf3ab62dd3f966dae711.png',
        requiredImages: 1,
        aspectRatio: '1:1',
        fields: [
            { id: 'search', label: 'Pregunta en Buscador', type: 'text', placeholder: 'How to fix digestion naturally' },
            { id: 'ad_headline', label: 'Titular Anuncio', type: 'text', placeholder: 'Best Microbiotic Solution' },
            { id: 'ad_domain', label: 'Dominio', type: 'text', placeholder: 'try.baiafood.com' }
        ],
        basePrompt: `{
  "template_id": "google-search-interface",
  "visual_aesthetic": {
    "vibe": "Digital authority, definitive search result, solution number one",
    "background": "Clean high-fidelity mock of a Google Search Results Page (SERP)"
  },
  "layout_structure": {
    "search_query": "{{search}}",
    "top_ad_result": {
      "headline": "{{ad_headline}}",
      "display_url": "{{ad_domain}}",
      "style": "Exact CSS-accurate Google Ads layout, blue bold headline, green/dark URL, grey description"
    },
    "visual_presentation": "The browser interface is the canvas, emphasizing the 'Top Result' status of the product."
  }
}`
    },
    {
        id: 'ba-collection-grid',
        title: '16. Collection (Grid)',
        description: 'Catálogo de variantes de color con etiquetas de "Los más vendidos".',
        thumbnailUrl: 'https://storage.googleapis.com/msgsndr/Zwjvo9JT2X190h2yTfhT/media/694edf3a19b8c37763bb9086.png',
        requiredImages: 1,
        aspectRatio: '3:4',
        fields: [
            { id: 'name', label: 'Nombre Producto', type: 'text', placeholder: 'TOALLA ZERO TWIST' },
            { id: 'badge', label: 'Etiqueta (Badge)', type: 'text', placeholder: 'LOS MÁS VENDIDOS' },
            { id: 'colors_list', label: 'Colores a Mostrar', type: 'text', placeholder: 'Navy, White, Red, Grey' }
        ],
        basePrompt: `{
  "template_id": "product-variations-grid",
  "visual_aesthetic": {
    "vibe": "Catalog abundance, color variety, organized premium retail",
    "background": "Minimalist studio grid with soft shadows for each variation"
  },
  "layout_structure": {
    "main_focus": "{{name}}",
    "trust_badge": {
      "text": "{{badge}}",
      "style": "High-contrast seal or ribbon over the 'best-selling' variation"
    },
    "grid_items": "{{colors_list}}",
    "arrangement": "A clean 2x2 or 2x3 grid showing the product in different color/size variants."
  }
}`
    },
    {
        id: 'ba-testimonial-editorial',
        title: '17. Testimonial (Editorial)',
        description: 'Reseña de 5 estrellas con estética de revista premium.',
        thumbnailUrl: 'https://storage.googleapis.com/msgsndr/Zwjvo9JT2X190h2yTfhT/media/694edf3a42bb1ccdd8348d56.png',
        requiredImages: 1,
        aspectRatio: '3:4',
        fields: [
            { id: 'quote', label: 'Testimonio', type: 'textarea', placeholder: 'Mi médico aprobó esta proteína por su calidad y pureza excepcional.' },
            { id: 'author', label: 'Nombre del Cliente', type: 'text', placeholder: 'Vicente M.' }
        ],
        basePrompt: `{
  "template_id": "editorial-review-stars",
  "visual_aesthetic": {
    "vibe": "High-end fitness magazine, prestigious editorial, trusted expert review",
    "background": "Full-bleed professional fitness photography with elegant lighting"
  },
  "layout_structure": {
    "rating_stars": "5 bright stars in a prominent position",
    "quote_block": {
      "text": "{{quote}}",
      "style": "Elegant serif or modern minimal bold typography, high-end magazine style"
    },
    "reviewer_credit": "{{author}}",
    "composition": "The product is placed with editorial grace, balanced with the text like a magazine spread."
  }
}`
    },
    {
        id: 'ba-pedestal-problem',
        title: '18. Problema vs Solución (Pedestal)',
        description: 'Enfoque en los dolores del cliente vs el alivio del producto.',
        thumbnailUrl: 'https://storage.googleapis.com/msgsndr/Zwjvo9JT2X190h2yTfhT/media/694edf3ab62dd32724dae710.png',
        requiredImages: 1,
        aspectRatio: '3:4',
        fields: [
            { id: 'problems', label: 'Lista de Problemas', type: 'textarea', placeholder: 'Digestiones pesadas\\nHinchazón constante\\nFalta de energía' },
            { id: 'solution_tag', label: 'Etiqueta Solución', type: 'text', placeholder: 'SOLUCIÓN REAL' }
        ],
        basePrompt: `{
  "template_id": "pain-points-vs-solution",
  "visual_aesthetic": {
    "vibe": "Clinical relief, elevated solution, architectural minimalism",
    "background": "The product is elevated on a premium minimalist pedestal (marble, wood, or stone)"
  },
  "layout_structure": {
    "pain_points_sidebar": {
      "items": "{{problems}}",
      "style": "Negative space list, slightly muted typography to contrast with the solution"
    },
    "solution_seal": {
      "text": "{{solution_tag}}",
      "style": "High-contrast badge or sticker near the product"
    },
    "lighting": "Dramatic gallery lighting focusing on the product 'hero' on its pedestal"
  }
}`
    },
    {
        id: 'ba-airdrop-story',
        title: '19. Airdrop (Story)',
        description: 'Notificación de Airdrop sobre imagen lifestyle. Alto nivel de atención.',
        thumbnailUrl: 'https://storage.googleapis.com/msgsndr/Zwjvo9JT2X190h2yTfhT/media/694edf3ae889d30633794055.png',
        requiredImages: 1,
        aspectRatio: '9:16',
        fields: [
            { id: 'sender', label: 'Remitente Airdrop', type: 'text', placeholder: 'Worker Agency' },
            { id: 'message', label: 'Mensaje Airdrop', type: 'text', placeholder: '¿Deseas recibir la oferta secreta de lanzamiento?' }
        ],
        basePrompt: `{
  "template_id": "ios-ui-airdrop",
  "visual_aesthetic": {
    "vibe": "iOS native, unexpected delivery, tech-savvy engagement",
    "background": "Aesthetic lifestyle shot with natural interaction"
  },
  "layout_structure": {
    "airdrop_notification": {
      "sender": "{{sender}}",
      "content": "{{message}}",
      "style": "Perfect iOS Airdrop notification UI, translucent blur, standard system font"
    },
    "visual_flow": "The notification appears center-screen, creating an 'interruptive' but realistic tech moment."
  }
}`
    }
];

export const SAMPLE_TEMPLATES: AdTemplate[] = [
    {
        id: 'lifestyle-blend',
        title: 'Lifestyle Blend',
        description: 'Fusión avanzada de persona y producto. Combina dos imágenes para crear una escena de interacción natural y profesional.',
        thumbnailUrl: 'https://cdn.prod.website-files.com/682908ddac8c8f2756b83e2a/68b2f4b07528aa40530a134e_Gemini_Generated_Image_1d37kr1d37kr1d37.avif',
        requiredImages: 2,
        aspectRatio: '3:4',
        basePrompt: `{"mode":"image_to_image_blending","instructions":{"roles":"Image 1 is the PERSON. Image 2 is the PRODUCT.","task":"Create a photorealistic image where the person from Image 1 is naturally interacting with the object from Image 2.","interaction":"{{interaction_description}}","environment":"{{environment}}"},"style":{"overall_vibe":"photorealistic commercial photography"}}`,
        fields: [
            { id: 'interaction_description', label: '¿Cómo interactúan?', type: 'textarea', placeholder: 'e.g. La persona sostiene el producto con ambas manos y sonríe a cámara.' },
            { id: 'environment', label: 'Contexto / Fondo', type: 'text', placeholder: 'e.g. Un living moderno iluminado por luz natural.' }
        ]
    },
    {
        id: 'outdoor-sticker',
        title: 'Outdoor Sticker',
        description: 'Estética cálida y natural con contornos tipo sticker y notas manuscritas. Ideal para momentos casuales.',
        thumbnailUrl: 'https://images.spr.so/cdn-cgi/imagedelivery/j42No7y-dcokJuNgXeA0ig/7ec8fd74-5ff1-4974-8da4-aa420cc54cc6/truck_in_sand/w=640,quality=90,fit=scale-down',
        requiredImages: 1,
        aspectRatio: '3:4',
        basePrompt: `{"user_prompt":{"scene_description":"{{scene_description}}","overlay_text":"{{overlay_text}}"},"settings":{"aspect_ratio":"3:4"},"style":{"overall_vibe":"warm outdoor aesthetic with sticker-style outline"}}`,
        fields: [
            { id: 'scene_description', label: 'Descripción de la Escena', type: 'textarea', placeholder: 'e.g. A toy truck in the sand.' },
            { id: 'overlay_text', label: 'Texto Manuscrito', type: 'text', placeholder: 'e.g. It\\\'s playtime today.' }
        ]
    },
    {
        id: 'editorial-skincare',
        title: 'Editorial Skincare',
        description: 'Anuncio minimalista y premium con diseño editorial. Iluminación suave y tipografía elegante.',
        thumbnailUrl: 'https://images.spr.so/cdn-cgi/imagedelivery/j42No7y-dcokJuNgXeA0ig/05f80496-1d3f-4415-835f-119a82ec59b4/glowing_skin/w=640,quality=90,fit=scale-down',
        requiredImages: 1,
        aspectRatio: '3:4',
        basePrompt: `{"user_prompt":{"scene_description":"{{scene_description}}","headline_text":"{{headline_text}}","supporting_text":"{{supporting_text}}"},"settings":{"aspect_ratio":"3:4"},"style":{"overall_vibe":"modern premium skincare editorial layout"}}`,
        fields: [
            { id: 'scene_description', label: 'Descripción de la Escena', type: 'textarea', placeholder: 'e.g. A close-up portrait of a person with dewy skin.' },
            { id: 'headline_text', label: 'Titular', type: 'text', placeholder: 'e.g. Glowing skin starts here.' },
            { id: 'supporting_text', label: 'Texto de Apoyo', type: 'text', placeholder: 'e.g. Discover the routine.' }
        ]
    },
    {
        id: 'urban-poster',
        title: 'Urban Poster',
        description: 'Estilo audaz y vibrante con tipografía estilo caricatura. Perfecto para comida rápida.',
        thumbnailUrl: 'https://images.spr.so/cdn-cgi/imagedelivery/j42No7y-dcokJuNgXeA0ig/7232c429-3719-421f-bbd9-9b16279f841c/fire_chicken/w=640,quality=90,fit=scale-down',
        requiredImages: 1,
        aspectRatio: '3:4',
        basePrompt: `{"user_prompt":{"main_subject":"{{main_subject}}","primary_text":"{{primary_text}}","tagline_text":"{{tagline_text}}"},"style":{"overall_vibe":"bold high-energy urban fast-food poster"}}`,
        fields: [
            { id: 'main_subject', label: 'Sujeto Principal', type: 'textarea', placeholder: 'e.g. A fully loaded spicy fried chicken sandwich.' },
            { id: 'primary_text', label: 'Texto Primario', type: 'text', placeholder: 'e.g. Fire Chicken' },
            { id: 'tagline_text', label: 'Tagline', type: 'text', placeholder: 'e.g. Crunch. Heat. Repeat.' }
        ]
    },
    {
        id: 'creativity-stationery',
        title: 'Modern Editorial (Bold)',
        description: 'Layout limpio y moderno con tipografía audaz y jerarquía estructurada. Fondo oscuro para contraste.',
        thumbnailUrl: 'https://images.spr.so/cdn-cgi/imagedelivery/j42No7y-dcokJuNgXeA0ig/817862e2-ddeb-4924-9247-ca86e05c9daa/creativity/w=640,quality=90,fit=scale-down',
        requiredImages: 1,
        aspectRatio: '3:4',
        fields: [
            { id: 'headline', label: 'Titular Principal', type: 'text', placeholder: 'e.g. CREATIVITY STARTS HERE.' },
            { id: 'subheadline', label: 'Subtítulo / Bajada', type: 'text', placeholder: 'e.g. unlock your potential with our tools.' }
        ],
        basePrompt: `{"layout":"BoldModernEditorial","elements":{"headline":{"text":"{{headline}}","style":"all_caps_bold"},"subheadline":{"text":"{{subheadline}}","style":"descender_light"}},"style":"Clean studio composition, dark moody background, premium stationery aesthetic"}`
    },
    {
        id: 'motorsport-news',
        title: 'Motorsport News',
        description: 'Tarjeta de noticias deportivas dinámica con tipografía impactante. Ideal para acción.',
        thumbnailUrl: 'https://images.spr.so/cdn-cgi/imagedelivery/j42No7y-dcokJuNgXeA0ig/534a9649-d5d8-4f7d-b40a-c6303379da33/motorsport_news/w=640,quality=90,fit=scale-down',
        requiredImages: 1,
        aspectRatio: '3:4',
        basePrompt: `{"user_prompt":{"image_subject":"{{image_subject}}","category_label":"{{category_label}}","headline_text":"{{headline_text}}"},"style":{"overall_vibe":"dynamic sports news card bold condensed typography"}}`,
        fields: [
            { id: 'image_subject', label: 'Sujeto de la Imagen', type: 'textarea', placeholder: 'e.g. A powerful blue rally car.' },
            { id: 'category_label', label: 'Etiqueta', type: 'text', placeholder: 'e.g. MOTORSPORT' },
            { id: 'headline_text', label: 'Titular', type: 'text', placeholder: 'e.g. RALLY CHAMPIONSHIP KICKS OFF' }
        ]
    },
    {
        id: 'y2k-digital',
        title: 'Y2K Digital',
        description: 'Nostalgia de los 2000, estética de interfaz social, colores pastel y elementos flotantes.',
        thumbnailUrl: 'https://images.spr.so/cdn-cgi/imagedelivery/j42No7y-dcokJuNgXeA0ig/c7c584d0-babb-4bc7-9a00-fc3a49e6a668/Gemini_Generated_Image_jy2mu2jy2mu2jy2m/w=640,quality=90,fit=scale-down',
        requiredImages: 1,
        aspectRatio: '3:4',
        basePrompt: `{"user_prompt":{"scene_description":"{{scene_description}}","overlay_text":"{{overlay_text}}"},"style":{"overall_vibe":"Y2K digital collage playful social media interface"}}`,
        fields: [
            { id: 'scene_description', label: 'Descripción de la Escena', type: 'textarea', placeholder: 'e.g. A young woman sitting on the floor.' },
            { id: 'overlay_text', label: 'Texto Overlay', type: 'textarea', placeholder: 'e.g. Headline: TODAYS SHOOT.' }
        ]
    },
    {
        id: 'tech-specs',
        title: 'Tech Specs (Grid Layout)',
        description: 'Diseño limpio y moderno para gadgets o productos de alto valor. Muestra el producto a la derecha con una grilla técnica a la izquierda.',
        thumbnailUrl: 'https://images.spr.so/cdn-cgi/imagedelivery/j42No7y-dcokJuNgXeA0ig/27da9f10-8343-4b3b-af4f-88ceeeb5c481/Gemini_Generated_Image_8elg8b8elg8b8elg/w=640,quality=90,fit=scale-down',
        requiredImages: 1,
        aspectRatio: '3:4',
        fields: [
            { id: 'brand_logo', label: 'Marca / Logo', type: 'text', placeholder: 'e.g. NEOGADGET' },
            { id: 'headline', label: 'Modelo / Producto', type: 'text', placeholder: 'e.g. SERIES 7 PRO' },
            { id: 'f1', label: 'Feature 1', type: 'text', placeholder: 'AMOLED DISPLAY' },
            { id: 'f2', label: 'Feature 2', type: 'text', placeholder: 'WATERPROOF' },
            { id: 'f3', label: 'Feature 3', type: 'text', placeholder: '15 DAYS STANDBY' },
            { id: 'f4', label: 'Feature 4', type: 'text', placeholder: 'GPS INTEGRATED' },
            { id: 'f5', label: 'Feature 5', type: 'text', placeholder: '60+ SPORTS MODES' },
            { id: 'f6', label: 'Feature 6', type: 'text', placeholder: 'HEART RATE MONITOR' }
        ],
        basePrompt: `{"layout":"StructuredTechGrid","elements":{"header":{"logo":"{{brand_logo}}","badge":"NEW ARRIVAL"},"main_content":{"headline":"{{headline}}","product_position":"right_half"},"features_grid":{"position":"left_bottom","items":["{{f1}}","{{f2}}","{{f3}}","{{f4}}","{{f5}}","{{f6}}"]},"style":"Clean modern tech aesthetics, soft shadows, warm neutral background"}}`
    },
    {
        id: 'wellness-zine',
        title: 'Wellness Zine',
        description: 'Collage estilo Zine digital, texturizado y casual. Perfecto para bienestar y lifestyle.',
        thumbnailUrl: 'https://images.spr.so/cdn-cgi/imagedelivery/j42No7y-dcokJuNgXeA0ig/42b4ea77-cf4e-4287-bc6c-8fe80b9a0088/Gemini_Generated_Image_7emi4h7emi4h7emi/w=640,quality=90,fit=scale-down',
        requiredImages: 1,
        aspectRatio: '3:4',
        basePrompt: `{"user_prompt":{"scene_description":"{{scene_description}}","overlay_text":"{{overlay_text}}"},"style":{"overall_vibe":"Zine-style digital scrapbook handwritten ink doodles"}}`,
        fields: [
            { id: 'scene_description', label: 'Descripción de Objetos', type: 'textarea', placeholder: 'e.g. A flat-lay collage of wellness items.' },
            { id: 'overlay_text', label: 'Texto Central', type: 'textarea', placeholder: 'e.g. Headline: THE SELF CARE GUIDE.' }
        ]
    },
    {
        id: 'sleek-product',
        title: 'Sleek Product',
        description: 'Publicidad de producto monocromática y elegante. Estilo de estudio moderno.',
        thumbnailUrl: 'https://images.spr.so/cdn-cgi/imagedelivery/j42No7y-dcokJuNgXeA0ig/5f0746c4-af7a-4789-ad12-c42cd5965dbc/Gemini_Generated_Image_t2zqpft2zqpft2zq/w=640,quality=90,fit=scale-down',
        requiredImages: 1,
        aspectRatio: '3:4',
        basePrompt: `{"user_prompt":{"scene_description":"{{scene_description}}","overlay_text":"{{overlay_text}}"},"style":{"overall_vibe":"Sleek monochromatic product advertisement studio aesthetic"}}`,
        fields: [
            { id: 'scene_description', label: 'Descripción del Producto', type: 'textarea', placeholder: 'e.g. A front-facing pair of green sunglasses.' },
            { id: 'overlay_text', label: 'Texto del Anuncio', type: 'textarea', placeholder: 'e.g. Headline: CLASSY GLASSES.' }
        ]
    },
    {
        id: 'finance-3d',
        title: 'Finance 3D',
        description: 'Publicidad financiera corporativa premium. Arte digital 3D moderno con tonos dorados y negros.',
        thumbnailUrl: 'https://images.spr.so/cdn-cgi/imagedelivery/j42No7y-dcokJuNgXeA0ig/7e612372-3789-430e-890a-7cad542fb022/Gemini_Generated_Image_ceogn9ceogn9ceog/w=640,quality=90,fit=scale-down',
        requiredImages: 1,
        aspectRatio: '3:4',
        basePrompt: `{"user_prompt":{"scene_description":"{{scene_description}}","overlay_text":"{{overlay_text}}"},"style":{"overall_vibe":"Premium corporate finance 3D art black and gold"}}`,
        fields: [
            { id: 'scene_description', label: 'Descripción 3D', type: 'textarea', placeholder: 'e.g. A 3D dartboard hitting bullseye.' },
            { id: 'overlay_text', label: 'Texto', type: 'textarea', placeholder: 'e.g. Headline: ACHIEVE YOUR GOALS.' }
        ]
    },
    {
        id: 'minimalist-wellness',
        title: 'Minimalist Wellness',
        description: 'Estética de bienestar minimalista. Gráfico educativo limpio y orgánico para redes sociales.',
        thumbnailUrl: 'https://images.spr.so/cdn-cgi/imagedelivery/j42No7y-dcokJuNgXeA0ig/83c3a3c7-ca00-4940-a5f8-2dc49d8223ee/Gemini_Generated_Image_1gtb5a1gtb5a1gtb/w=1920,quality=90,fit=scale-down',
        requiredImages: 1,
        aspectRatio: '3:4',
        basePrompt: `{"user_prompt":{"scene_description":"{{scene_description}}","overlay_text":"{{overlay_text}}"},"style":{"overall_vibe":"Minimalist wellness flat lay organic social media graphic"}}`,
        fields: [
            { id: 'scene_description', label: 'Descripción de la Escena', type: 'textarea', placeholder: 'e.g. Top-down view of a ceramic cup of matcha.' },
            { id: 'overlay_text', label: 'Texto y Etiquetas', type: 'textarea', placeholder: 'e.g. Headline: matcha benefits?' }
        ]
    },
    {
        id: 'interior-card',
        title: 'Interior Card',
        description: 'Diseño e-commerce limpio y moderno. Tarjeta redondeada flotando sobre fondo blanco con UI de búsqueda.',
        thumbnailUrl: 'https://images.spr.so/cdn-cgi/imagedelivery/j42No7y-dcokJuNgXeA0ig/8b6d7100-17da-4c85-843f-e2e1ebd296b3/Gemini_Generated_Image_hduogxhduogxhduo/w=1920,quality=90,fit=scale-down',
        requiredImages: 1,
        aspectRatio: '3:4',
        basePrompt: `{"user_prompt":{"scene_description":"{{scene_description}}","overlay_text":"{{overlay_text}}"},"style":{"overall_vibe":"Modern e-commerce interior card design minimalist search UI"}}`,
        fields: [
            { id: 'scene_description', label: 'Descripción del Interior', type: 'textarea', placeholder: 'e.g. A modern dining room setup.' },
            { id: 'overlay_text', label: 'Texto UI', type: 'textarea', placeholder: 'e.g. Search: Dining Set Deals.' }
        ]
    },
    {
        id: 'camping-handwritten',
        title: 'Camping Handwritten',
        description: 'Estilo diario acogedor en papel cuadriculado. Garabatos y notas manuscritas alrededor de un recorte.',
        thumbnailUrl: 'https://images.spr.so/cdn-cgi/imagedelivery/j42No7y-dcokJuNgXeA0ig/aeecd4d4-192c-49b7-8508-b5547d9070ad/camping/w=640,quality=90,fit=scale-down',
        requiredImages: 1,
        aspectRatio: '3:4',
        basePrompt: `{"user_prompt":{"center_image_description":"{{center_image_description}}","title_text":"{{title_text}}"},"style":{"overall_vibe":"cozy diary aesthetic grid paper red markers"}}`,
        fields: [
            { id: 'center_image_description', label: 'Imagen Central', type: 'textarea', placeholder: 'e.g. A traveler with a backpack.' },
            { id: 'title_text', label: 'Título Principal', type: 'text', placeholder: 'e.g. Camping Essentials' }
        ]
    },
    {
        id: 'app-ui-mockup',
        title: 'App UI Mockup',
        description: 'Mockup moderno y limpio de interfaz móvil. Estética digital minimalista.',
        thumbnailUrl: 'https://images.spr.so/cdn-cgi/imagedelivery/j42No7y-dcokJuNgXeA0ig/b4c9b434-24b0-41ea-bfe8-c2c233410382/Gemini_Generated_Image_x5q0bax5q0bax5q0/w=1920,quality=90,fit=scale-down',
        requiredImages: 1,
        aspectRatio: '3:4',
        basePrompt: `{"user_prompt":{"scene_description":"{{scene_description}}","overlay_text":"{{overlay_text}}"},"style":{"overall_vibe":"modern mobile app UI mockup digital aesthetic"}}`,
        fields: [
            { id: 'scene_description', label: 'Descripción de la Imagen', type: 'textarea', placeholder: 'e.g. A woman in a black dress.' },
            { id: 'overlay_text', label: 'Texto UI', type: 'text', placeholder: 'e.g. 1 Photo Selected' }
        ]
    },
    {
        id: 'receipt-fashion',
        title: 'Receipt Fashion',
        description: 'Estética grunge de recibo térmico de alta moda. Minimalista, crudo e industrial.',
        thumbnailUrl: 'https://images.spr.so/cdn-cgi/imagedelivery/j42No7y-dcokJuNgXeA0ig/7799c4d9-95ce-4e35-9274-fb1544ad7818/Gemini_Generated_Image_thbmtathbmtathbm/w=1920,quality=90,fit=scale-down',
        requiredImages: 1,
        aspectRatio: '3:4',
        basePrompt: `{"user_prompt":{"scene_description":"{{scene_description}}","overlay_text":"{{overlay_text}}"},"style":{"overall_vibe":"High-fashion thermal receipt aesthetic industrial look"}}`,
        fields: [
            { id: 'scene_description', label: 'Descripción de la Imagen', type: 'textarea', placeholder: 'e.g. Grainy black and white portrait.' },
            { id: 'overlay_text', label: 'Texto del Recibo', type: 'textarea', placeholder: 'e.g. Header: moi. PRICE LIST # 205.' }
        ]
    },
    {
        id: 'clean-beauty',
        title: 'Clean Beauty',
        description: 'Fotografía de producto radiante y educativa. Fresca, comercial y aireada.',
        thumbnailUrl: 'https://images.spr.so/cdn-cgi/imagedelivery/j42No7y-dcokJuNgXeA0ig/5d4df105-4ec1-448d-8e04-f972609a874f/Gemini_Generated_Image_7k6z7i7k6z7i7k6z/w=1920,quality=90,fit=scale-down',
        requiredImages: 1,
        aspectRatio: '3:4',
        basePrompt: `{"user_prompt":{"scene_description":"{{scene_description}}","overlay_text":"{{overlay_text}}"},"style":{"overall_vibe":"Radiant clean beauty photography elegant serif"}}`,
        fields: [
            { id: 'scene_description', label: 'Descripción del Producto', type: 'textarea', placeholder: 'e.g. A dropper bottle with golden oil.' },
            { id: 'overlay_text', label: 'Texto y Beneficios', type: 'textarea', placeholder: 'e.g. Headline: Vitamin C Brightening Oil.' }
        ]
    },
    {
        id: 'finance-gold',
        title: 'Finance Gold Info',
        description: 'Infografía financiera lujosa. Arte 3D comercial premium con estética de riqueza cálida.',
        thumbnailUrl: 'https://images.spr.so/cdn-cgi/imagedelivery/j42No7y-dcokJuNgXeA0ig/4ea6f119-c77d-41cb-b0ed-937eebc5b62d/Gemini_Generated_Image_herxppherxppherx/w=1920,quality=90,fit=scale-down',
        requiredImages: 1,
        aspectRatio: '3:4',
        basePrompt: `{"user_prompt":{"scene_description":"{{scene_description}}","overlay_text":"{{overlay_text}}"},"style":{"overall_vibe":"Luxurious financial infographic gold 3D premium wealth"}}`,
        fields: [
            { id: 'scene_description', label: 'Descripción de Elementos', type: 'textarea', placeholder: 'e.g. Stack of gold bars on a podium.' },
            { id: 'overlay_text', label: 'Texto Informativo', type: 'textarea', placeholder: 'e.g. Headline: Investing in Gold.' }
        ]
    },
    {
        id: 'retro-grunge',
        title: 'Retro Grunge',
        description: 'Collage punk grunge retro. Estética de papel rasgado y técnica mixta audaz y rebelde.',
        thumbnailUrl: 'https://images.spr.so/cdn-cgi/imagedelivery/j42No7y-dcokJuNgXeA0ig/39483247-a7b1-4508-a2c9-800a84edd053/Gemini_Generated_Image_djvtbrdjvtbrdjvt/w=1920,quality=90,fit=scale-down',
        requiredImages: 1,
        aspectRatio: '3:4',
        basePrompt: `{"user_prompt":{"scene_description":"{{scene_description}}","overlay_text":"{{overlay_text}}"},"style":{"overall_vibe":"Retro punk grunge collage ripped paper aesthetic"}}`,
        fields: [
            { id: 'scene_description', label: 'Descripción de la Escena', type: 'textarea', placeholder: 'e.g. A hand holding a red retro phone.' },
            { id: 'overlay_text', label: 'Texto', type: 'textarea', placeholder: 'e.g. Headline: New Job Openings.' }
        ]
    },
    {
        id: 'sepia-garage',
        title: 'Vintage Sepia',
        description: 'Nostalgia en tono sepia. Estética documental histórica, rústica e industrial.',
        thumbnailUrl: 'https://images.spr.so/cdn-cgi/imagedelivery/j42No7y-dcokJuNgXeA0ig/d9bfda4c-b202-427c-af08-d3320fcf7d37/Gemini_Generated_Image_9im0yy9im0yy9im0/w=1920,quality=90,fit=scale-down',
        requiredImages: 1,
        aspectRatio: '3:4',
        basePrompt: `{"user_prompt":{"scene_description":"{{scene_description}}","overlay_text":"{{overlay_text}}"},"style":{"overall_vibe":"Sepia-toned historical garage photography vintage industrial"}}`,
        fields: [
            { id: 'scene_description', label: 'Descripción Vintage', type: 'textarea', placeholder: 'e.g. A classic antique car in a garage.' },
            { id: 'overlay_text', label: 'Texto', type: 'textarea', placeholder: 'e.g. Headline: VINTAGE COLLECTION.' }
        ]
    },
    {
        id: 'interior-catalog',
        title: 'Interior Catalog',
        description: 'Minimalismo escandinavo. Imagen arquitectónica limpia con pie de página editorial.',
        thumbnailUrl: 'https://images.spr.so/cdn-cgi/imagedelivery/j42No7y-dcokJuNgXeA0ig/466f3fce-c402-469e-a41b-610026288936/Gemini_Generated_Image_o3a8jho3a8jho3a8/w=1920,quality=90,fit=scale-down',
        requiredImages: 1,
        aspectRatio: '3:4',
        basePrompt: `{"user_prompt":{"scene_description":"{{scene_description}}","overlay_text":"{{overlay_text}}"},"style":{"overall_vibe":"High-end interior design catalog Scandinavian minimalism"}}`,
        fields: [
            { id: 'scene_description', label: 'Descripción de la Escena', type: 'textarea', placeholder: 'e.g. Minimalist kitchen counter.' },
            { id: 'overlay_text', label: 'Texto Overlay y Footer', type: 'textarea', placeholder: 'e.g. Overlay: Simplicity Meets Elegance.' }
        ]
    }
];

export const UNIFIED_TEMPLATES: AdTemplate[] = [
    ...BEST_ADS_TEMPLATES.map(t => ({ ...t, category: 'Performance Meta' })),
    ...SAMPLE_TEMPLATES.map(t => ({ ...t, category: 'Creative Studio' }))
];

export const CATEGORIES = ['All', 'Performance Meta', 'Creative Studio'];
