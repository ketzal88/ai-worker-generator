# Worker Agency Brain: Technical Knowledge Base

This document serves as the "Master Mind" for the AI Worker Generator architecture. It outlines the logic, AI protocols, and rendering standards used across all modules.

## 1. Core Architecture: The Three Verticals

The system is divided into three specialized production modules:

### A. Best Ads (High-Performance Ad Generator)
- **Logic**: Uses a "Blueprint-First" approach.
- **AI Persona**: Senior Ad Designer & Meta Andromeda Specialist.
- **Protocol**: 
    - **Master Guiding**: Every request includes the template's thumbnail as a visual guide.
    - **Blueprint Standard**: High-detail JSON defining `visual_aesthetic` (lighting, vibra) and `layout_structure` (positioning, components).
    - **Component Dictionary**: Strict rules for rendering `magnifying_glass` and `features_grid`.

### B. Image Variations (Link-to-Image)
- **Logic**: Combines product URLs with reference images.
- **Protocol**: Extracts product context (environment, tone) from the URL and applies it to the image generation to create consistent product shots in new settings.

### C. Video Variations (Cinematic Spots)
- **Logic**: Generative video engine.
- **Engine**: Google Veo 3.1.
- **Protocol**: Transforms product concepts into 8-25 second cinematic spots with professional camera movements (360 spins, close-ups).

## 2. The High-Detail Blueprint Standard

All templates must follow the `basePrompt` JSON structure to ensure AI adherence:

```json
{
  "template_id": "unique-id",
  "visual_aesthetic": {
    "vibe": "Mood/Tone description",
    "background": "Specific scenery requirements",
    "lighting": "Studio/Natural/Rim lighting details"
  },
  "layout_structure": {
    "main_composition": "Primary element positioning",
    "key_components": {
      "magnifier": "Detail about zoom bubble",
      "grid": "Grid structure and icon style"
    },
    "typography": "Style and weight requirements"
  }
}
```

## 3. Spanish-First Protocol
Regardless of the source material or product URL language, the **Worker Agency AI** is strictly instructed to output all consumer-facing text in **Spanish (Español)**.

## 4. Cost Estimation & Pricing Strategy (100% Margin)

To ensure project sustainability, we apply a **100% markup** on all internal API costs.

| Service | Int. Cost (Est.) | **User Price** | Protocol |
| :--- | :--- | :--- | :--- |
| **Best Ads Gen** | $0.25 | **$0.50** | Gemini 1.5 Pro Rendering |
| **Image Variations** | $0.25 | **$0.50** | Contextual Diffusion Ops |
| **Video Variations** | $1.00 | **$2.00** | Veo 3.1 Cinematic Gen |
| **Product Analysis** | $0.005 | **$0.01** | Google Search + LLM |

## 5. Expansion Strategy
To add a new template:
1. Identify a "Winning Structure" from creative research.
2. Use the **Template Builder** to generate a High-Detail JSON Blueprint from a reference image.
3. Integrate the JSON into `unifiedTemplates.ts`.
4. The system will automatically calculate the deduction based on the module used.

---
*Worker Creative Lab © 2026*
