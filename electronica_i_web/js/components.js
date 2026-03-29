/**
 * components.js - Professional Engineering UI Component Generator
 */

export const UIComponents = {
    renderCheckpoint(title, text, type = "info") {
        return `
            <div class="checkpoint-card ${type}">
                <div class="checkpoint-header">
                    <i data-lucide="shield-check"></i>
                    <h4>${title}</h4>
                </div>
                <p>${text}</p>
            </div>
        `;
    },

    renderProcedure(steps) {
        return `
            <div class="procedure-modal">
                <h3>Procedimiento de Cálculo</h3>
                <div class="steps-container">
                    ${steps.map((step, index) => `
                        <div class="step-item">
                            <span class="step-num">${index + 1}</span>
                            <div class="step-content">$$ ${step} $$</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    renderFormulaSheet() {
        const sections = [
            {
                title: "Diodos y Rectificación",
                formulas: [
                    { label: "Vdc (Media Onda)", math: "V_{dc} = \\frac{V_p}{\\pi}" },
                    { label: "Vdc (Puente)", math: "V_{dc} = \\frac{2V_{p(out)}}{\\pi}" },
                    { label: "PIV (Puente)", math: "PIV = V_{p(out)} + V_D" }
                ]
            },
            {
                title: "BJT - Transistor Bipolar",
                formulas: [
                    { label: "Corriente de Colector", math: "I_C = \\beta I_B" },
                    { label: "Voltaje de Thevenin", math: "V_{th} = V_{CC}\\frac{R_2}{R_1+R_2}" },
                    { label: "Resistencia Dinámica re", math: "r_e = \\frac{26mV}{I_E}" }
                ]
            },
            {
                title: "JFET - Transistor de Efecto de Campo",
                formulas: [
                    { label: "Ecuación de Shockley", math: "I_D = I_{DSS}\\left(1 - \\frac{V_{GS}}{V_P}\\right)^2" },
                    { label: "Transconductancia gm", math: "g_m = g_{m0}\\left(1 - \\frac{V_{GS}}{V_P}\\right)" }
                ]
            },
            {
                title: "Modelos Equivalentes (AC)",
                formulas: [
                    { 
                        label: "Modelo r_e (BJT)", 
                        math: "r_e = \\frac{26mV}{I_{E}}",
                        svg: `
                            <svg viewBox="0 0 200 100" class="mini-svg">
                                <path d="M20 50 H50 M80 50 H110 M140 20 V80 M140 50 H170" class="wire" stroke="white" fill="none"/>
                                <circle cx="65" cy="50" r="15" class="component" stroke="white" fill="none"/>
                                <text x="60" y="55" fill="white" font-size="8">βre</text>
                                <text x="145" y="45" fill="white" font-size="8">βIb</text>
                            </svg>
                        `
                    }
                ]
            }
        ];

        return `
            <div class="formula-sheet">
                ${sections.map(sec => `
                    <div class="formula-section glass-panel">
                        <h4>${sec.title}</h4>
                        <div class="formulas-grid">
                            ${sec.formulas.map(f => `
                                <div class="formula-item">
                                    <span class="f-label">${f.label}</span>
                                    <div class="f-math">$$ ${f.math} $$</div>
                                    ${f.svg ? `<div class="f-svg">${f.svg}</div>` : ''}
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    },

    /**
     * Canvas para Chart.js
     */
    renderChartContainer(id) {
        return `<div class="chart-wrapper"><canvas id="${id}"></canvas></div>`;
    },

    /**
     * Professional Circuit Schematics (Boylestad Style)
     */
    renderCircuitSVG(type, params = {}) {
        let svg = '';
        const capacitorOpacity = params.C > 0 ? 1 : 0.15;
        
        if (type === 'rectifier_half') {
            svg = `
                <svg width="350" height="150" viewBox="0 0 350 150" class="circuit-svg" stroke="#1f2937" stroke-width="2.5" fill="none">
                    <circle cx="50" cy="75" r="20" class="component-fill" />
                    <path d="M 40 75 Q 45 65 50 75 T 60 75" class="wire" />
                    <line x1="50" y1="55" x2="50" y2="20" class="wire" />
                    <line x1="50" y1="20" x2="120" y2="20" class="wire" />
                    <polygon points="120,10 120,30 140,20" class="component" fill="#00d4ff" />
                    <line x1="140" y1="10" x2="140" y2="30" class="component" />
                    <line x1="140" y1="20" x2="280" y2="20" class="wire" />
                    <line x1="280" y1="20" x2="280" y2="50" class="wire" />
                    <polyline points="280,50 270,55 290,65 270,75 290,85 270,95 280,100" class="component" />
                    <line x1="280" y1="100" x2="280" y2="130" class="wire" />
                    <line x1="280" y1="130" x2="50" y2="130" class="wire" />
                    <line x1="50" y1="130" x2="50" y2="95" class="wire" />
                    <g style="opacity: ${capacitorOpacity}">
                        <line x1="200" y1="20" x2="200" y2="65" class="wire" />
                        <line x1="185" y1="65" x2="215" y2="65" stroke-width="3" stroke="#7d2ae8" />
                        <line x1="185" y1="85" x2="215" y2="85" stroke-width="3" stroke="#7d2ae8" />
                        <line x1="200" y1="85" x2="200" y2="130" class="wire" />
                    </g>
                    <text x="35" y="40" class="node-label">AC</text>
                    <text x="125" y="45" class="node-label">D1</text>
                    <text x="295" y="80" class="node-label">RL</text>
                </svg>
            `;
        } else if (type === 'rectifier_full') {
            svg = `
                <svg width="350" height="150" viewBox="0 0 350 150" class="circuit-svg" stroke="#1f2937" stroke-width="2" fill="none">
                    <circle cx="40" cy="75" r="20" class="component-fill" />
                    <path d="M 30 75 Q 35 65 40 75 T 50 75" class="wire" />
                    <line x1="40" y1="55" x2="40" y2="40" class="wire" />
                    <line x1="40" y1="40" x2="80" y2="40" class="wire" />
                    <line x1="40" y1="95" x2="40" y2="110" class="wire" />
                    <line x1="40" y1="110" x2="80" y2="110" class="wire" />
                    <polygon points="110,40 140,75 110,110 80,75" class="wire" stroke="#00d4ff" />
                    <line x1="110" y1="40" x2="110" y2="20" class="wire" />
                    <line x1="110" y1="20" x2="280" y2="20" class="wire" />
                    <line x1="110" y1="110" x2="110" y2="130" class="wire" />
                    <line x1="110" y1="130" x2="280" y2="130" class="wire" />
                    <rect x="270" y="50" width="20" height="50" class="component" />
                    <g style="opacity: ${capacitorOpacity}">
                        <line x1="200" y1="20" x2="200" y2="65" class="wire" />
                        <line x1="185" y1="65" x2="215" y2="65" stroke-width="3" stroke="#7d2ae8" />
                        <line x1="185" y1="85" x2="215" y2="85" stroke-width="3" stroke="#7d2ae8" />
                        <line x1="200" y1="85" x2="200" y2="130" class="wire" />
                    </g>
                    <text x="295" y="80" class="node-label">RL</text>
                </svg>
            `;
        } else if (type === 'bridge_rectifier') {
             // Keep existing professional bridge if needed, but for the new view we use the above.
             return `<!-- Legacy Bridge -->`;
        } else if (type === 'bjt_divider') {
             // Keep existing BJT
             return `<!-- BJT -->`;
        }
        
        return `<div class="circuit-viz-container">${svg}</div>`;
    }
};
