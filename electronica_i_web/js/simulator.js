/**
 * simulator.js - Engineering & Pedagogical Engine for Electronics I
 * Refined with professional engineering units (LaTeX).
 */

export const SimulatorEngine = {
    /**
     * Diodos: Rectificador de Puente
     */
    calculateBridgeRectifier(Vp, Vd = 0.7) {
        const Vp_out = Vp - (2 * Vd);
        const Vdc = (2 * Vp_out) / Math.PI;
        const PIV = Vp_out + Vd;
        
        return {
            Vp_out: Vp_out.toFixed(2),
            Vdc: Vdc.toFixed(2),
            PIV: PIV.toFixed(2),
            steps: [
                `V_{p(out)} = V_p - 2V_D = ${Vp}\\text{V} - 2(0.7\\text{V}) = ${Vp_out.toFixed(2)}\\text{V}`,
                `V_{dc} = \\frac{2V_{p(out)}}{\\pi} = \\frac{2(${Vp_out.toFixed(2)}\\text{V})}{\\pi} = ${Vdc.toFixed(2)}\\text{V}`,
                `PIV = V_{p(out)} + V_D = ${Vp_out.toFixed(2)}\\text{V} + 0.7\\text{V} = ${PIV.toFixed(2)}\\text{V}`
            ]
        };
    },

    /**
     * BJT Polarización por Divisor de Voltaje
     */
    calculateBJTVoltageDivider(Vcc, R1, R2, Rc, Re, Beta, Vbe = 0.7) {
        const Rth = (R1 * R2) / (R1 + R2);
        const Vth = Vcc * (R2 / (R1 + R2));
        const isApproxValid = (Beta * Re) >= (10 * R2);
        
        let Ib, Ic, Vce, Vb, Ve, steps = [];

        steps.push(`\\text{Paso 1: Verificación: } \\beta R_e \\ge 10R_2 \\rightarrow ${Beta}(${(Re/1000).toFixed(1)}\\text{k}\\Omega) \\ge 10(${(R2/1000).toFixed(1)}\\text{k}\\Omega)`);
        steps.push(isApproxValid ? `\\rightarrow ${(Beta*Re/1000).toFixed(1)}\\text{k}\\Omega \\ge ${(10*R2/1000).toFixed(1)}\\text{k}\\Omega \\text{ (Aproximado Válido)}` : `\\rightarrow ${(Beta*Re/1000).toFixed(1)}\\text{k}\\Omega < ${(10*R2/1000).toFixed(1)}\\text{k}\\Omega \\text{ (Usar Exacto)}`);

        if (isApproxValid) {
            Vb = Vcc * (R2 / (R1 + R2));
            Ve = Vb - Vbe;
            Ic = Ve / Re;
            Vce = Vcc - Ic * (Rc + Re);
            steps.push(`V_B \\approx V_{CC}\\frac{R_2}{R_1+R_2} = ${Vcc}\\text{V}\\frac{${(R2/1000).toFixed(1)}\\text{k}\\Omega}{${((R1+R2)/1000).toFixed(1)}\\text{k}\\Omega} = ${Vb.toFixed(2)}\\text{V}`);
        } else {
            Ib = (Vth - Vbe) / (Rth + (Beta + 1) * Re);
            Ic = Beta * Ib;
            Vce = Vcc - Ic * Rc - (Ic + Ib) * Re;
            Ve = (Ic + Ib) * Re;
            Vb = Ve + Vbe;
            steps.push(`R_{th} = R_1 \\parallel R_2 = ${(Rth/1000).toFixed(2)}\\text{k}\\Omega`);
            steps.push(`V_{th} = V_{CC}\\frac{R_2}{R_1+R_2} = ${Vth.toFixed(2)}\\text{V}`);
            steps.push(`I_B = \\frac{V_{th} - V_{BE}}{R_{th} + (\\beta+1)R_e} = \\frac{${Vth.toFixed(2)}\\text{V} - 0.7\\text{V}}{${(Rth/1000).toFixed(2)}\\text{k}\\Omega + ${Beta+1}(${(Re/1000).toFixed(1)}\\text{k}\\Omega) } = ${(Ib*1000000).toFixed(2)}\\mu\\text{A}`);
        }

        steps.push(`I_C = \\beta I_B = ${Beta}(${(Ib*1000000).toFixed(2)}\\mu\\text{A}) = ${(Ic*1000).toFixed(2)}\\text{mA}`);
        steps.push(`V_{CE} = V_{CC} - I_C(R_C + R_E) = ${Vcc}\\text{V} - ${(Ic*1000).toFixed(2)}\\text{mA}(${((Rc+Re)/1000).toFixed(1)}\\text{k}\\Omega) = ${Vce.toFixed(2)}\\text{V}`);

        let state = "Activa";
        if (Vb < Vbe) state = "Corte";
        if (Vce <= 0.2) state = "Saturación";

        return {
            Ic: (Ic * 1000).toFixed(2),
            Vce: Vce.toFixed(2),
            method: isApproxValid ? "Aproximado" : "Exacto",
            state: state,
            steps: steps
        };
    },

    /**
     * JFET Auto-Polarización
     */
    calculateJFETSelfBias(Idss, Vp, Rs) {
        const a = (Idss * Rs * Rs) / (Vp * Vp);
        const b = (2 * Idss * Rs / Vp) - 1;
        const c = Idss;

        const discriminant = Math.sqrt(b * b - 4 * a * c);
        const Id = (-b - discriminant) / (2 * a);
        const Vgs = -Id * Rs;

        return {
            Id: (Id * 1000).toFixed(2),
            Vgs: Vgs.toFixed(2),
            steps: [
                `I_D = I_{DSS}(1 - \\frac{V_{GS}}{V_P})^2 \\text{ donde } V_{GS} = -I_D R_S`,
                `I_D = ${Idss*1000}\\text{mA}(1 + \\frac{I_D ${Rs}\\Omega}{${Vp}\\text{V}})^2`,
                `\\text{Resolviendo la cuadrática: } I_D = ${(Id*1000).toFixed(2)}\\text{mA}`,
                `V_{GS} = -I_D R_S = -(${(Id*1000).toFixed(2)}\\text{mA})(${Rs}\\Omega) = ${Vgs.toFixed(2)}\\text{V}`
            ]
        };
    },

    /**
     * Motor de Simulación de Ondas (AC -> Rectificado -> Filtrado)
     */
    simulateWaveRectification(type, vp, f, capacitanciaUf) {
        const R = 1000; // Resistencia de carga fija
        const tMax = 0.1; // 100ms
        const numPuntos = 400; // Resolución optimizada
        const dt = tMax / numPuntos;
        const C = capacitanciaUf * 1e-6;
        const VD = 0.7;

        const results = {
            tiempos: [],
            datosEntrada: [],
            datosSalida: []
        };

        let voltajeCapacitor = 0;

        for (let i = 0; i <= numPuntos; i++) {
            const t = i * dt;
            results.tiempos.push((t * 1000).toFixed(1));

            // Onda de Entrada
            const vAc = vp * Math.sin(2 * Math.PI * f * t);
            results.datosEntrada.push(vAc);

            // Rectificación
            let vRect = 0;
            if (type === 'half') {
                vRect = vAc > VD ? vAc - VD : 0;
            } else {
                let vAbs = Math.abs(vAc);
                vRect = vAbs > (2 * VD) ? vAbs - (2 * VD) : 0;
            }

            // Filtrado
            if (C === 0) {
                results.datosSalida.push(vRect);
            } else {
                const decaimiento = voltajeCapacitor * Math.exp(-dt / (R * C));
                if (vRect >= decaimiento) {
                    voltajeCapacitor = vRect;
                } else {
                    voltajeCapacitor = decaimiento;
                }
                results.datosSalida.push(voltajeCapacitor);
            }
        }
        return results;
    }
};
