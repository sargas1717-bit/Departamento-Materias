/**
 * Antigravity Circuit Editor (Ultra-Robust Edition)
 */

const GRID_SIZE = 20;

class Component {
    constructor(type, x, y, value, label) {
        this.type = type; 
        this.x = Math.round(x / GRID_SIZE) * GRID_SIZE;
        this.y = Math.round(y / GRID_SIZE) * GRID_SIZE;
        this.value = value;
        this.label = label;
        this.selected = false;
        this.rotation = 0; 
        this.ports = this.calculatePorts();
    }

    calculatePorts() {
        if (this.type === 'GND') return [{ x: 0, y: 0, id: 'p1' }];
        return [{ x: -30, y: 0, id: 'p1' }, { x: 30, y: 0, id: 'p2' }];
    }

    getRotatedPorts() {
        const rad = (this.rotation * Math.PI) / 180;
        return this.ports.map(p => ({
            x: this.x + (p.x * Math.cos(rad) - p.y * Math.sin(rad)),
            y: this.y + (p.x * Math.sin(rad) + p.y * Math.cos(rad)),
            id: p.id, owner: this
        }));
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate((this.rotation * Math.PI) / 180);

        ctx.strokeStyle = this.selected ? '#00f2fe' : '#e2e8f0';
        ctx.lineWidth = 2;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.beginPath();

        switch (this.type) {
            case 'R': this.drawResistor(ctx); break;
            case 'V': this.drawVoltageSource(ctx); break;
            case 'I': this.drawCurrentSource(ctx); break;
            case 'L': this.drawInductor(ctx); break;
            case 'C': this.drawCapacitor(ctx); break;
            case 'GND': this.drawGround(ctx); break;
            case 'D': this.drawDiode(ctx); break;
        }
        ctx.stroke();

        // Draw Ports (Larger and glowing)
        ctx.fillStyle = '#38bdf8';
        this.ports.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
            ctx.fill();
            if (this.selected) {
                ctx.strokeStyle = 'rgba(56, 189, 248, 0.5)';
                ctx.lineWidth = 2;
                ctx.stroke();
            }
        });

        ctx.restore();

        // Label
        ctx.fillStyle = this.selected ? '#00f2fe' : '#94a3b8';
        ctx.font = 'bold 12px Inter';
        ctx.textAlign = 'center';
        ctx.fillText(`${this.label} (${this.value})`, this.x, this.y - 35);
    }

    // Graphic helpers (Resistor, etc.)
    drawResistor(ctx) {
        ctx.moveTo(-30, 0); ctx.lineTo(-15, 0);
        for(let i=0; i<6; i++) ctx.lineTo(-12.5 + i*5, (i%2==0)?-8:8);
        ctx.lineTo(15, 0); ctx.lineTo(30, 0);
    }
    drawVoltageSource(ctx) {
        ctx.arc(0, 0, 15, 0, Math.PI*2);
        ctx.moveTo(-30, 0); ctx.lineTo(-15, 0); ctx.moveTo(15, 0); ctx.lineTo(30, 0);
        ctx.moveTo(-8, 0); ctx.lineTo(-2, 0); ctx.moveTo(-5, -3); ctx.lineTo(-5, 3);
        ctx.moveTo(2, 0); ctx.lineTo(8, 0);
    }
    drawCurrentSource(ctx) {
        ctx.arc(0, 0, 15, 0, Math.PI*2);
        ctx.moveTo(-30, 0); ctx.lineTo(-15, 0); ctx.moveTo(15, 0); ctx.lineTo(30, 0);
        ctx.moveTo(-5, 0); ctx.lineTo(5, 0); ctx.lineTo(2, -3); ctx.moveTo(5, 0); ctx.lineTo(2, 3);
    }
    drawCapacitor(ctx) {
        ctx.moveTo(-30, 0); ctx.lineTo(-4, 0); ctx.moveTo(-4, -12); ctx.lineTo(-4, 12);
        ctx.moveTo(4, -12); ctx.lineTo(4, 12); ctx.moveTo(4, 0); ctx.lineTo(30, 0);
    }
    drawInductor(ctx) {
        ctx.moveTo(-30, 0); ctx.lineTo(-15, 0);
        for(let i=0; i<3; i++) ctx.arc(-10 + i*10, 0, 5, Math.PI, 0);
        ctx.moveTo(15, 0); ctx.lineTo(30, 0);
    }
    drawDiode(ctx) {
        ctx.moveTo(-30, 0); ctx.lineTo(-8, 0); ctx.moveTo(-8,-10); ctx.lineTo(-8,10); ctx.lineTo(8,0); ctx.closePath();
        ctx.moveTo(8,-10); ctx.lineTo(8,10); ctx.moveTo(8,0); ctx.lineTo(30,0);
    }
    drawGround(ctx) {
        ctx.moveTo(0,0); ctx.lineTo(0,15); ctx.moveTo(-10,15); ctx.lineTo(10,15);
        ctx.moveTo(-6,20); ctx.lineTo(6,20); ctx.moveTo(-2,25); ctx.lineTo(2,25);
    }

    isPointInside(x, y) {
        return Math.hypot(this.x - x, this.y - y) < 30;
    }
}

class Wire {
    constructor(p1, p2) { this.p1 = p1; this.p2 = p2; }
    draw(ctx) {
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(this.p1.x, this.p1.y);
        ctx.lineTo(this.p1.x, this.p2.y); ctx.lineTo(this.p2.x, this.p2.y);
        ctx.stroke();
    }
}

class CircuitEditor {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.components = [];
        this.wires = [];
        this.activeWireStart = null;
        this.isDragging = false;
        this.draggedComponent = null;
        this.offset = { x: 0, y: 0 };
        
        this.setupListeners();
        this.resize();
    }

    resize() {
        const rect = this.canvas.parentElement.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
        this.render();
    }

    setupListeners() {
        this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('mouseup', (e) => this.handleMouseUp(e));
        window.addEventListener('keydown', (e) => {
            if (e.key.toLowerCase() === 'r') {
                const s = this.components.find(c => c.selected);
                if (s) { s.rotation = (s.rotation + 90) % 360; this.render(); }
            }
            if (e.key === 'Delete' || e.key === 'Backspace') {
                this.components = this.components.filter(c => !c.selected);
                this.render();
            }
        });
    }

    handleMouseDown(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Port detection (Wiring) - increased click area
        const allPorts = this.components.flatMap(c => c.getRotatedPorts());
        const clickedPort = allPorts.find(p => Math.hypot(p.x - x, p.y - y) < 12);

        if (clickedPort) {
            this.activeWireStart = clickedPort;
            return;
        }

        // Component dragging
        this.draggedComponent = this.components.find(c => c.isPointInside(x, y));
        this.components.forEach(c => c.selected = false);
        if (this.draggedComponent) {
            this.isDragging = true;
            this.offset.x = x - this.draggedComponent.x;
            this.offset.y = y - this.draggedComponent.y;
            this.draggedComponent.selected = true;
        }
        this.render();
    }

    handleMouseMove(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (this.activeWireStart) {
            this.render();
            this.ctx.strokeStyle = '#38bdf8';
            this.ctx.setLineDash([5, 5]);
            this.ctx.beginPath(); ctx.moveTo(this.activeWireStart.x, this.activeWireStart.y);
            ctx.lineTo(this.activeWireStart.x, y); ctx.lineTo(x, y);
            ctx.stroke(); this.ctx.setLineDash([]);
            return;
        }

        if (this.isDragging && this.draggedComponent) {
            this.draggedComponent.x = Math.round((x - this.offset.x) / GRID_SIZE) * GRID_SIZE;
            this.draggedComponent.y = Math.round((y - this.offset.y) / GRID_SIZE) * GRID_SIZE;
            this.render();
        }
    }

    handleMouseUp(e) {
        if (this.activeWireStart) {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const allPorts = this.components.flatMap(c => c.getRotatedPorts());
            const endPort = allPorts.find(p => Math.hypot(p.x - x, p.y - y) < 12);
            
            if (endPort && endPort.owner !== this.activeWireStart.owner) {
                this.wires.push(new Wire(this.activeWireStart, endPort));
            }
            this.activeWireStart = null;
            this.render();
        }
        this.isDragging = false;
        this.draggedComponent = null;
    }

    addComponent(type, x, y) {
        const defaults = { 'R': 1000, 'V': 5, 'I': 0.1, 'L': 0.001, 'C': 0.000001, 'D': 0.7, 'GND': 0 };
        const id = this.components.filter(c => c.type === type).length + 1;
        // Ensure coordinates are within canvas bounds
        if (x < 0 || x > this.canvas.width || y < 0 || y > this.canvas.height) {
            x = this.canvas.width / 2; y = this.canvas.height / 2;
        }
        const comp = new Component(type, x, y, defaults[type], `${type}${id}`);
        this.components.push(comp);
        this.render();
    }

    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawGrid();
        this.wires.forEach(w => w.draw(this.ctx));
        this.components.forEach(comp => comp.draw(this.ctx));
    }

    drawGrid() {
        this.ctx.strokeStyle = '#1e293b';
        this.ctx.lineWidth = 0.5;
        this.ctx.beginPath();
        for (let x = 0; x < this.canvas.width; x += GRID_SIZE) {
            this.ctx.moveTo(x, 0); ctx.lineTo(x, this.canvas.height);
        }
        for (let y = 0; y < this.canvas.height; y += GRID_SIZE) {
            this.ctx.moveTo(0, y); ctx.lineTo(this.canvas.width, y);
        }
        this.ctx.stroke();
    }
}

window.CircuitEditor = CircuitEditor;
