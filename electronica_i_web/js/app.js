/**
 * app.js - SPA Router & Controller
 */

import { SimulatorEngine } from './simulator.js';
import { UIComponents } from './components.js';

const App = {
    state: {
        activeTab: 'theory',
        simulator: {
            type: 'bridge',
            params: {
                vp: 12,
                f: 60,
                C: 100 // uF
            }
        },
        chartInstance: null
    },

    init() {
        this.render();
        this.bindEvents();
    },

    render() {
        const content = document.getElementById('main-content');
        if (!content) return;
        content.innerHTML = '';
        
        switch (this.state.activeTab) {
            case 'theory':
                content.innerHTML = this.renderTheory();
                break;
            case 'simulator':
                content.innerHTML = this.renderSimulator();
                this.initChart();
                break;
            case 'formulas':
                content.innerHTML = UIComponents.renderFormulaSheet();
                break;
            case 'tips':
                content.innerHTML = this.renderTips();
                break;
        }

        lucide.createIcons();
        if (window.MathJax) MathJax.typeset();
    },

    bindEvents() {
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tab = e.currentTarget.dataset.tab;
                this.state.activeTab = tab;
                document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
                e.currentTarget.classList.add('active');
                this.render();
            });
        });
    },

    renderSimulator() {
        const { params, type } = this.state.simulator;
        return `
            <div class="simulator-view">
                <header class="view-header">
                    <h2>Rectificador Avanzado con Filtro</h2>
                    <p>Simulación en tiempo real de rectificación y descarga de filtrado.</p>
                </header>

                <div class="sim-layout with-chart">
                    <aside class="controls-panel glass-panel">
                        <h3>Controles</h3>
                        <div class="control-group">
                            <label>Tipo de Rectificación</label>
                            <select id="rect-type-select">
                                <option value="half" ${type === 'half' ? 'selected' : ''}>Media Onda (1 Diodo)</option>
                                <option value="full" ${type === 'bridge' ? 'selected' : ''}>Onda Completa (Puente)</option>
                            </select>
                        </div>
                        <div class="control-group">
                            <label>Voltaje Pico: <span class="accent">${params.vp}V</span></label>
                            <input type="range" id="param-vp" min="1" max="50" value="${params.vp}">
                        </div>
                        <div class="control-group">
                            <label>Frecuencia: <span class="accent">${params.f}Hz</span></label>
                            <input type="range" id="param-f" min="10" max="100" value="${params.f}">
                        </div>
                        <div class="control-group">
                            <label>Filtro Capacitor: <span class="accent">${params.C}uF</span></label>
                            <input type="range" id="param-C" min="0" max="2200" step="10" value="${params.C}">
                        </div>
                    </aside>

                    <main class="visualization-panel">
                        <div class="glass-panel">
                            <h3>Gráfica de Ondas</h3>
                            ${UIComponents.renderChartContainer('waveChart')}
                        </div>
                    </main>
                </div>

                <div class="technical-details mt-8">
                    <div class="grid-2">
                        <div class="glass-panel">
                            <h3>Diagrama de Ingeniería</h3>
                            ${UIComponents.renderCircuitSVG(type === 'half' ? 'rectifier_half' : 'rectifier_full', params)}
                        </div>
                        <div id="procedure-container">
                            ${this.renderRectifierProcedure()}
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    initChart() {
        const canvas = document.getElementById('waveChart');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const simData = SimulatorEngine.simulateWaveRectification(
            this.state.simulator.type,
            this.state.simulator.params.vp,
            this.state.simulator.params.f,
            this.state.simulator.params.C
        );

        if (this.state.chartInstance) this.state.chartInstance.destroy();

        this.state.chartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: simData.tiempos,
                datasets: [
                    {
                        label: 'Entrada AC',
                        data: simData.datosEntrada,
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                        borderDash: [5, 5],
                        borderWidth: 1,
                        pointRadius: 0,
                        fill: false
                    },
                    {
                        label: 'Salida Rectificada/Filtrada',
                        data: simData.datosSalida,
                        borderColor: '#00d4ff',
                        borderWidth: 3,
                        pointRadius: 0,
                        backgroundColor: 'rgba(0, 212, 255, 0.1)',
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: false,
                scales: {
                    y: { min: -55, max: 55, grid: { color: 'rgba(255,255,255,0.1)' } },
                    x: { grid: { display: false } }
                },
                plugins: { legend: { labels: { color: 'white' } } }
            }
        });

        this.attachSimEvents();
    },

    attachSimEvents() {
        const update = () => {
            const typeSelect = document.getElementById('rect-type-select');
            const vpInput = document.getElementById('param-vp');
            const fInput = document.getElementById('param-f');
            const cInput = document.getElementById('param-C');
            
            if (!typeSelect || !vpInput || !fInput || !cInput) return;

            this.state.simulator.type = typeSelect.value;
            this.state.simulator.params.vp = parseInt(vpInput.value);
            this.state.simulator.params.f = parseInt(fInput.value);
            this.state.simulator.params.C = parseInt(cInput.value);
            
            this.render(); 
        };

        ['rect-type-select', 'param-vp', 'param-f', 'param-C'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.addEventListener('input', update);
        });
    },

    renderRectifierProcedure() {
        const { type, params } = this.state.simulator;
        const Vp_out = params.vp - (type === 'half' ? 0.7 : 1.4);
        const result = type === 'half' ? 
            { steps: [`V_{p(out)} = V_p - V_D = ${params.vp}\\text{V} - 0.7\\text{V} = ${Vp_out.toFixed(2)}\\text{V}`, `V_{dc} = \\frac{V_{p(out)}}{\\pi} = ${(Vp_out/Math.PI).toFixed(2)}\\text{V}`] } : 
            SimulatorEngine.calculateBridgeRectifier(params.vp);

        const freqRect = type === 'half' ? params.f : 2 * params.f;
        const R = 1000;
        const C_farads = params.C * 1e-6;
        let rippleSteps = [];
        if (params.C > 0) {
            const vrpp = Vp_out / (freqRect * R * C_farads);
            rippleSteps = [
                `V_{r(pp)} = \\frac{V_{p(out)}}{f_{rect} R C} = \\frac{${Vp_out.toFixed(2)}\\text{V}}{(${freqRect}\\text{Hz})(1\\text{k}\\Omega)(${params.C}\\mu\\text{F})} = ${vrpp.toFixed(2)}\\text{V}`
            ];
        }
        return UIComponents.renderProcedure([...result.steps, ...rippleSteps]);
    },

    renderTips() {
        return `
            <div class="theory-view">
                <header>
                    <h1>Tips y Procedimientos</h1>
                    <p>Guía rápida para resolución de circuitos en exámenes.</p>
                </header>
                <div class="grid-2 mt-6">
                    <div class="glass-panel">
                        <h3>1. Análisis DC</h3>
                        <p>Siempre verifica si el diodo está en polarización directa ($V > 0.7V$) antes de aplicar mallas.</p>
                    </div>
                    <div class="glass-panel">
                        <h3>2. Análisis de Filtro</h3>
                        <p>Si el rizado $V_{r(pp)}$ es mayor al 10% de $V_{dc}$, considera aumentar la capacitancia.</p>
                    </div>
                </div>
            </div>
        `;
    },

    renderTheory() {
        return `
            <div class="theory-view">
                <header>
                    <h1>Fundamentos de Rectificación</h1>
                    <p>La conversión de AC a DC es la base de las fuentes de alimentación lineal.</p>
                </header>
                <div class="glass-panel mt-6">
                    <h3>¿Cómo funciona el filtrado?</h3>
                    <p>Al añadir un capacitor en paralelo con la carga, este se carga al voltaje pico y se descarga lentamente durante los valles de la señal, reduciendo el rizado (voltaje alterno residual).</p>
                </div>
            </div>
        `;
    }
};

document.addEventListener('DOMContentLoaded', () => App.init());
