const chatContainer = document.getElementById('chat-container');
const initialState = document.getElementById('initial-state');
const chatInput = document.getElementById('chat-input');

function appendUserMessage(text) {
    const msgDiv = document.createElement('div');
    msgDiv.className = 'message user-message';
    msgDiv.innerHTML = `<div class="bubble-user">${text}</div>`;
    chatContainer.appendChild(msgDiv);
    scrollToBottom();
}

function appendAIMessage(htmlContent) {
    const msgDiv = document.createElement('div');
    msgDiv.className = 'message ai-message';
    msgDiv.innerHTML = `<div class="bubble-ai">${htmlContent}</div>`;
    chatContainer.appendChild(msgDiv);
    scrollToBottom();
}

function showLoading() {
    const loader = document.createElement('div');
    loader.id = 'loading';
    loader.className = 'message ai-message';
    loader.innerHTML = `
        <div class="bubble-ai" style="padding: 12px 20px; max-width: 80px;">
            <div class="typing-indicator">
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
            </div>
        </div>
    `;
    chatContainer.appendChild(loader);
    scrollToBottom();
}

function hideLoading() {
    const loader = document.getElementById('loading');
    if(loader) loader.remove();
}

function scrollToBottom() {
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Map scenarios to their specific HTML payloads
const scenarioData = {
    // QUESTION 1 SCENARIOS
    'q1_1': {
        title: 'Cancelled / Rejected',
        badge: 'CANCELLED',
        badgeClass: 'delayed',
        text: 'Order 123456 has been cancelled - all line items were rejected.',
        table: `
            <tr><td class="label">Reason</td><td class="value" style="color: #dc2626;">Customer requested cancellation (Z01)</td></tr>
            <tr><td class="label">Status</td><td class="value">Cancelled</td></tr>
        `,
        source: 'ERP Order Management System'
    },
    'q1_2': {
        title: 'Blocked (Credit Hold)',
        badge: 'BLOCKED',
        badgeClass: 'delayed',
        text: 'Order 123456 is currently on credit hold and cannot proceed until released by the Credit team.',
        table: `
            <tr><td class="label">Credit Status</td><td class="value" style="color: #dc2626;">Not Approved (Hold)</td></tr>
            <tr><td class="label">Delivery Block</td><td class="value">Z1 - Credit Block</td></tr>
        `,
        source: 'ERP Order Management System'
    },
    'q1_4': {
        title: 'Open - Not Yet Allocated',
        badge: 'OPEN',
        badgeClass: 'neutral',
        text: 'Order 123456 is open; no delivery exists yet.',
        table: `
            <tr><td class="label">Estimated Shipping Date</td><td class="value">April 16, 2026</td></tr>
            <tr><td class="label">Credit Status</td><td class="value">Released</td></tr>
        `,
        source: 'ERP Order Management System'
    },
    'q1_5': {
        title: 'Delivery Created (No PGI)',
        badge: 'PROCESSING',
        badgeClass: 'neutral',
        text: 'Order 123456 has delivery 0080012345.',
        table: `
            <tr><td class="label">Delivery Number</td><td class="value">0080012345</td></tr>
            <tr><td class="label">Estimated Shipping Date</td><td class="value">April 16, 2026</td></tr>
            <tr><td class="label">Actual GI Date</td><td class="value" style="color: var(--text-secondary);">Pending</td></tr>
        `,
        source: 'ERP Order Management System'
    },
    'q1_6': {
        title: 'Shipment Created (No PGI)',
        badge: 'PROCESSING',
        badgeClass: 'neutral',
        text: 'Order 123456 has delivery 0080012345, shipment 7891011.',
        table: `
            <tr><td class="label">Delivery Number</td><td class="value">0080012345</td></tr>
            <tr><td class="label">Shipment Number</td><td class="value">7891011</td></tr>
            <tr><td class="label">Estimated Shipping Date</td><td class="value">April 16, 2026</td></tr>
        `,
        source: 'ERP Order Management System'
    },
    'q1_7': {
        title: 'Loaded / Shipped - Not Yet Billed',
        badge: 'SHIPPED',
        badgeClass: 'healthy',
        text: 'Order 123456 was shipped on April 16, 2026. Invoicing is still pending.',
        table: `
            <tr><td class="label">Shipped Date (Actual GI)</td><td class="value">April 16, 2026</td></tr>
            <tr><td class="label">Invoice Status</td><td class="value" style="color: var(--text-secondary);">Pending</td></tr>
        `,
        source: 'ERP Order Management System'
    },
    'q1_8': {
        title: 'Loaded & Billed - Complete',
        badge: 'COMPLETE',
        badgeClass: 'healthy',
        text: 'Order 123456 was shipped on April 16, 2026, invoice 0090004567 was issued on April 17, 2026. This order is complete.',
        table: `
            <tr><td class="label">Shipped Date (Actual GI)</td><td class="value">April 16, 2026</td></tr>
            <tr><td class="label">Invoice Number</td><td class="value">0090004567</td></tr>
            <tr><td class="label">Billing Date</td><td class="value">April 17, 2026</td></tr>
        `,
        source: 'ERP Order Management System'
    },
    'q1_9': {
        title: 'Not Found',
        badge: 'NO MATCH',
        badgeClass: 'delayed',
        text: 'Sorry, I couldn\'t find that order.',
        table: `
            <tr><td class="label">Search Criteria</td><td class="value">Order #123456</td></tr>
            <tr><td class="label">Authorized Sales Orgs</td><td class="value">Checked</td></tr>
            <tr><td class="label">Result</td><td class="value">No record found matching the criteria. Please check the order number and try again.</td></tr>
        `,
        source: 'ERP Order Management System'
    },

    // QUESTION 2 SCENARIOS
    'q2_1': {
        title: 'Inventory Analysis · SKU 123',
        badge: 'STOCK FOUND',
        badgeClass: 'healthy',
        text: 'Plant 4010 currently has 1,250 cases of SKU 123 on hand; there are 8 open orders totaling 3,400 cases against it.',
        table: `
            <tr><td class="label">Plant / Warehouse</td><td class="value">Plant 4010</td></tr>
            <tr><td class="label">On-Hand Unrestricted Stock</td><td class="value">1,250 cases</td></tr>
            <tr><td class="label">Open Sales Orders (Count)</td><td class="value">8 orders</td></tr>
            <tr><td class="label">Open Sales Order Qty</td><td class="value">3,400 cases</td></tr>
        `,
        source: 'Global Inventory Dashboard'
    },
    'q2_2': {
        title: 'Inventory Analysis · SKU 123',
        badge: 'ZERO STOCK',
        badgeClass: 'delayed',
        text: 'Plant 4010 currently has 0 cases of SKU 123 on hand; there are 8 open orders totaling 3,400 cases against it.',
        table: `
            <tr><td class="label">Plant / Warehouse</td><td class="value">Plant 4010</td></tr>
            <tr><td class="label">On-Hand Unrestricted Stock</td><td class="value" style="color: #dc2626;">0 cases</td></tr>
            <tr><td class="label">Open Sales Orders (Count)</td><td class="value">8 orders</td></tr>
            <tr><td class="label">Open Sales Order Qty</td><td class="value">3,400 cases</td></tr>
        `,
        source: 'Global Inventory Dashboard'
    },
    'q2_4': {
        title: 'Inventory Analysis · SKU 123',
        badge: 'NOT FOUND',
        badgeClass: 'delayed',
        text: 'Sorry, I couldn\'t find stock data for that plant and SKU combination. Please confirm the plant and product ID.',
        table: `
            <tr><td class="label">Plant / Warehouse</td><td class="value">Plant 4010</td></tr>
            <tr><td class="label">Product ID</td><td class="value">SKU 123</td></tr>
            <tr><td class="label">Error</td><td class="value">Material is not set up at the requested plant, or plant is outside user authorization.</td></tr>
        `,
        source: 'Global Inventory Dashboard'
    },

    // QUESTION 3 SCENARIOS
    'q3_1': {
        title: 'Shortage Analysis · Sales Org 1234',
        badge: 'SHORTAGES FOUND',
        badgeClass: 'delayed',
        text: 'I found 14 orders with shortages that have not yet shipped for Sales Org 1234 in the selected period.',
        table: `
            <tr><td class="label">SAP # 450012</td><td class="value">SKU 999 (Ordered: 100, Confirmed: 50)</td></tr>
            <tr><td class="label">SAP # 450018</td><td class="value">SKU 888 (Ordered: 200, Confirmed: 0)</td></tr>
            <tr><td class="label">SAP # 450022</td><td class="value">SKU 777 (Ordered: 150, Confirmed: 140)</td></tr>
            <tr><td class="label">...and 11 more</td><td class="value" style="color: #2563eb; cursor: pointer;">View full list</td></tr>
        `,
        source: 'ERP Order Management System'
    },
    'q3_2': {
        title: 'Shortage Analysis · Sales Org 1234',
        badge: 'NO SHORTAGES',
        badgeClass: 'healthy',
        text: 'Good news - I didn\'t find any orders with shortages that haven\'t shipped for the criteria you gave.',
        table: `
            <tr><td class="label">Sales Org</td><td class="value">1234</td></tr>
            <tr><td class="label">Orders Checked</td><td class="value">245</td></tr>
            <tr><td class="label">Orders with Shortages</td><td class="value">0</td></tr>
        `,
        source: 'ERP Order Management System'
    },
    'q3_3': {
        title: 'Shortage Analysis · Sales Org 9999',
        badge: 'NOT AUTHORIZED',
        badgeClass: 'delayed',
        text: 'Sorry, I couldn\'t run that search - the sales organization provided isn\'t recognized or isn\'t one you have access to.',
        table: `
            <tr><td class="label">Sales Org</td><td class="value">9999</td></tr>
            <tr><td class="label">Error</td><td class="value">Invalid or unauthorized sales org supplied.</td></tr>
        `,
        source: 'System Security Matrix'
    },
};


// Handle main question clicks
function askMainQuestion(qType) {
    if(initialState) initialState.style.display = 'none';
    
    let userText = '';
    let chipsHtml = '';
    
    if (qType === 'Q1') {
        userText = 'What is the status of order 123456?';
        chipsHtml = `
            <button class="chip demo-chip" onclick="renderScenario('q1_1')">Simulate: Cancelled/Rejected</button>
            <button class="chip demo-chip" onclick="renderScenario('q1_2')">Simulate: Blocked (Credit/Delivery)</button>
            <button class="chip demo-chip" onclick="renderScenario('q1_4')">Simulate: Open (Not Allocated)</button>
            <button class="chip demo-chip" onclick="renderScenario('q1_5')">Simulate: Delivery Created (No PGI)</button>
            <button class="chip demo-chip" onclick="renderScenario('q1_6')">Simulate: Shipment Created (No PGI)</button>
            <button class="chip demo-chip" onclick="renderScenario('q1_7')">Simulate: Shipped (Not Billed)</button>
            <button class="chip demo-chip" onclick="renderScenario('q1_8')">Simulate: Completed (Shipped & Billed)</button>
            <button class="chip demo-chip" onclick="renderScenario('q1_9')">Simulate: Not Found / No Match</button>
        `;
    } else if (qType === 'Q2') {
        userText = 'What is the current on-hand stock for SKU 123 at plant 4010, and how many open orders exist against it?';
        chipsHtml = `
            <button class="chip demo-chip" onclick="renderScenario('q2_1')">Simulate: Stock Found</button>
            <button class="chip demo-chip" onclick="renderScenario('q2_2')">Simulate: Stock Found but Zero</button>
            <button class="chip demo-chip" onclick="renderScenario('q2_4')">Simulate: Not Found / Not Authorized</button>
        `;
    } else if (qType === 'Q3') {
        userText = 'Show orders with shortages that have not yet shipped, for Sales Org 1234 between Jan 1 and Jan 31.';
        chipsHtml = `
            <button class="chip demo-chip" onclick="renderScenario('q3_1')">Simulate: Shortage Orders Found</button>
            <button class="chip demo-chip" onclick="renderScenario('q3_2')">Simulate: No Shortages Found</button>
            <button class="chip demo-chip" onclick="renderScenario('q3_3')">Simulate: Sales Org Not Authorized</button>
        `;
    }

    appendUserMessage(userText);
    showLoading();
    
    setTimeout(() => {
        hideLoading();
        let aiResponse = `
            <div class="ai-text-content">
                <strong>[DEMO MODE]</strong> Which scenario would you like to simulate for this question?
            </div>
            <div class="follow-up-chips">
                ${chipsHtml}
            </div>
        `;
        appendAIMessage(aiResponse);
    }, 800);
}

// Render a specific scenario payload
function renderScenario(scenarioId) {
    const data = scenarioData[scenarioId];
    if (!data) return;

    // Show loading
    showLoading();

    setTimeout(() => {
        hideLoading();
        
        let aiResponse = `
            <div class="ai-text-content">${data.text}</div>
            <div class="data-card" style="width: 100%;">
                <div class="data-card-header">
                    <span class="data-card-title">${data.title}</span>
                    <span class="status-badge ${data.badgeClass}">${data.badge}</span>
                </div>
                <div class="data-card-body">
                    <table class="data-table">
                        ${data.table}
                    </table>
                </div>
            </div>
            <div class="ai-text-content" style="font-size: 13px; color: var(--text-secondary); margin-bottom: 0; margin-top: 12px;">
                <strong>Source: ${data.source}</strong>
            </div>
            <div class="bubble-footer">
                <span>Data as of 14:00 (refreshed every 2h)</span>
                <a href="#">View SQL</a>
                <span style="cursor: pointer;">▲ helpful</span>
            </div>
        `;
        
        appendAIMessage(aiResponse);
    }, 800);
}

function handleSendText(text) {
    if(initialState) initialState.style.display = 'none';
    appendUserMessage(text);
    showLoading();
    setTimeout(() => {
        hideLoading();
        appendAIMessage("<div class='ai-text-content' style='margin-bottom:0;'>I am an interactive prototype. In a live system, I would process this request by querying SAP and Databricks.</div>");
    }, 1000);
}

function handleSend() {
    const text = chatInput.value.trim();
    if(!text) return;
    chatInput.value = '';
    handleSendText(text);
}

function handleEnter(e) {
    if(e.key === 'Enter') handleSend();
}
