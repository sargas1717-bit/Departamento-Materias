/**
 * Antigravity MNA Solver (Engineering Edition)
 * Features: Netlist extraction from Wires, DC & basic non-linear.
 */

class MNASolver {
    constructor() {
        this.nodesMap = new Map(); // Port to Node ID
        this.nodeCount = 0;
    }

    reset() {
        this.nodesMap.clear();
        this.nodeCount = 0;
    }

    /**
     * Extracts Netlist from components and wires.
     * Uses Union-Find to group connected ports.
     */
    extractNetlist(components, wires) {
        this.reset();
        
        // 1. Initialize Union-Find
        const parent = {};
        const getRoot = (id) => {
            if (!parent[id]) parent[id] = id;
            if (parent[id] === id) return id;
            return parent[id] = getRoot(parent[id]);
        };
        const union = (id1, id2) => {
            const r1 = getRoot(id1);
            const r2 = getRoot(id2);
            if (r1 !== r2) parent[r1] = r2;
        };

        // Unique ID for each port: compLabel_portId
        components.forEach(c => {
            c.getRotatedPorts().forEach(p => {
                const pid = `${c.label}_${p.id}`;
                parent[pid] = pid;
            });
        });

        // 2. Union by Wires
        wires.forEach(w => {
            const id1 = `${w.p1.owner.label}_${w.p1.id}`;
            const id2 = `${w.p2.owner.label}_${w.p2.id}`;
            union(id1, id2);
        });

        // 3. Identify GND (Node 0)
        let gndRoot = null;
        components.forEach(c => {
            if (c.type === 'GND') {
                gndRoot = getRoot(`${c.label}_p1`);
            }
        });

        // 4. Map Roots to Node IDs
        const rootToNode = new Map();
        if (gndRoot) rootToNode.set(gndRoot, 0);

        let nextNodeId = 1;
        Object.keys(parent).forEach(pid => {
            const root = getRoot(pid);
            if (!rootToNode.has(root)) {
                rootToNode.set(root, nextNodeId++);
            }
            this.nodesMap.set(pid, rootToNode.get(root));
        });

        this.nodeCount = nextNodeId;

        // 5. Assign Node IDs to components for solver
        components.forEach(c => {
            c.node1 = this.nodesMap.get(`${c.label}_p1`);
            c.node2 = this.nodesMap.get(`${c.label}_p2`);
        });
    }

    solveDC(components) {
        const n = this.nodeCount - 1; // GND is node 0
        const m = components.filter(c => c.type === 'V').length;
        const dim = n + m;

        if (dim <= 0) return [];

        let A = Array.from({ length: dim }, () => new Float64Array(dim).fill(0));
        let Z = new Float64Array(dim).fill(0);

        let vSourceIndex = 0;

        components.forEach(comp => {
            if (comp.type === 'GND') return;

            const i = comp.node1 - 1;
            const j = (comp.node2 !== undefined) ? comp.node2 - 1 : -1;
            let g = 0;

            switch (comp.type) {
                case 'R':
                    g = 1 / comp.value;
                    this.stampConductance(A, i, j, g);
                    break;
                case 'L':
                    this.stampConductance(A, i, j, 1e6); // DC short
                    break;
                case 'C':
                    this.stampConductance(A, i, j, 1e-12); // DC open
                    break;
                case 'V':
                    this.stampVoltageSource(A, Z, n, i, j, comp.value, vSourceIndex++);
                    break;
                case 'I':
                    if (i >= 0) Z[i] -= comp.value;
                    if (j >= 0) Z[j] += comp.value;
                    break;
                case 'D':
                    // Very crude diode: if forward, low R, else high R
                    // In real engineering, we'd iterate.
                    this.stampConductance(A, i, j, 1e-9);
                    break;
            }
        });

        return this.gaussianElimination(A, Z);
    }

    stampConductance(A, i, j, g) {
        if (i >= 0) A[i][i] += g;
        if (j >= 0) A[j][j] += g;
        if (i >= 0 && j >= 0) {
            A[i][j] -= g;
            A[j][i] -= g;
        }
    }

    stampVoltageSource(A, Z, n, i, j, value, vIdx) {
        const idx = n + vIdx;
        if (i >= 0) {
            A[i][idx] += 1;
            A[idx][i] += 1;
        }
        if (j >= 0) {
            A[j][idx] -= 1;
            A[idx][j] -= 1;
        }
        Z[idx] = value;
    }

    gaussianElimination(A, b) {
        const n = b.length;
        for (let i = 0; i < n; i++) {
            let max = Math.abs(A[i][i]);
            let maxRow = i;
            for (let k = i + 1; k < n; k++) {
                if (Math.abs(A[k][i]) > max) {
                    max = Math.abs(A[k][i]);
                    maxRow = k;
                }
            }
            [A[i], A[maxRow]] = [A[maxRow], A[i]];
            [b[i], b[maxRow]] = [b[maxRow], b[i]];

            if (Math.abs(A[i][i]) < 1e-18) continue; 

            for (let k = i + 1; k < n; k++) {
                const c = -A[k][i] / A[i][i];
                for (let j = i; j < n; j++) {
                    A[k][j] = (i === j) ? 0 : A[k][j] + c * A[i][j];
                }
                b[k] += c * b[i];
            }
        }

        const x = new Float64Array(n);
        for (let i = n - 1; i >= 0; i--) {
            if (Math.abs(A[i][i]) < 1e-18) {
                x[i] = 0;
            } else {
                x[i] = b[i] / A[i][i];
            }
            for (let k = i - 1; k >= 0; k--) {
                b[k] -= A[k][i] * x[i];
            }
        }
        return x;
    }
}

window.MNASolver = MNASolver;
