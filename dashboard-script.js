// Dashboard Application
class DashboardApp {
    constructor() {
        this.dashboardData = null;
        this.currentData = null;
        this.init();
    }

    // Add a flag to prevent re-adding default widgets on every refresh
    async init() {
        try {
            await this.loadDashboardData();

            if (!localStorage.getItem('dashboardInitialized')) {
                this.ensureRequiredWidgets();
                localStorage.setItem('dashboardInitialized', 'true');
                this.saveToLocalStorage();
            }

            this.setupEventListeners();
            this.renderDashboard();
            this.loadFromLocalStorage();
        } catch (error) {
            console.error('Failed to initialize dashboard:', error);
            this.showToast('Failed to load dashboard data', 'error');
        }
    }



    ensureRequiredWidgets() {
        try {
            const cspm = this.currentData.categories.find(c => c.id === 'cnapp-dashboard');
            if (!cspm) return;

            const defaultWidgets = [
                {
                    id: 'cloud-accounts',
                    name: 'Cloud Accounts',
                    type: 'donut-chart',
                    content: '2 Total',
                    data: { connected: 2, notConnected: 2 },
                },
                {
                    id: 'cloud-account-risk',
                    name: 'Cloud Account Risk Assessment',
                    type: 'donut-chart',
                    content: '9659 Total',
                    data: { failed: 1689, warning: 681, notAvailable: 36, passed: 7253 },
                }
            ];

            defaultWidgets.forEach(w => {
                const exists = cspm.widgets.some(widget => widget.id === w.id);
                if (!exists) cspm.widgets.push(w);
            });
        } catch (e) {
            console.warn('ensureRequiredWidgets failed', e);
        }
    }


    async loadDashboardData() {
        try {
            const response = await fetch('dashboard-data.json');
            this.dashboardData = await response.json();
            this.currentData = JSON.parse(JSON.stringify(this.dashboardData));
        } catch (error) {
            console.error('Error loading dashboard data:', error);
            // Always create all 3 categories as fallback
            this.dashboardData = {
                categories: [
                    { id: "cnapp-dashboard", name: "CSPM Executive Dashboard", widgets: [] },
                    { id: "cwpp-dashboard", name: "CWPP Dashboard", widgets: [] },
                    { id: "registry-scan", name: "Registry Scan", widgets: [] }
                ]
            };
            this.currentData = JSON.parse(JSON.stringify(this.dashboardData));
        }
    }


    setupEventListeners() {
        // Add Widget Button
        document.getElementById('addWidgetBtn').addEventListener('click', () => {
            this.showAddWidgetModal();
        });

        // Close Modal Buttons
        document.getElementById('closeModal').addEventListener('click', () => {
            this.hideAddWidgetModal();
        });

        document.getElementById('closeManagementModal').addEventListener('click', () => {
            this.hideWidgetManagementModal();
        });

        // Cancel Button
        document.getElementById('cancelBtn').addEventListener('click', () => {
            this.hideAddWidgetModal();
        });

        // Confirm Button
        document.getElementById('confirmBtn').addEventListener('click', () => {
            this.handleConfirmWidgets();
        });

        // Tab Navigation
        document.querySelectorAll('.modal-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });

        // Global Search
        document.getElementById('globalSearch').addEventListener('input', (e) => {
            this.handleGlobalSearch(e.target.value);
        });

        // Widget Search in Management Modal
        document.getElementById('widgetSearch').addEventListener('input', (e) => {
            this.handleWidgetSearch(e.target.value);
        });

        // Refresh Button
        document.getElementById('refreshBtn').addEventListener('click', () => {
            this.refreshDashboard();
        });

        // Time Filter
        document.getElementById('timeFilter').addEventListener('change', (e) => {
            this.handleTimeFilter(e.target.value);
        });

        // Menu Button
        document.getElementById('menuBtn').addEventListener('click', () => {
            this.showWidgetManagementModal();
        });

        // Click outside modal to close
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.hideAddWidgetModal();
                this.hideWidgetManagementModal();
            }
        });

        // Escape key to close modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideAddWidgetModal();
                this.hideWidgetManagementModal();
            }
        });
    }

    renderDashboard() {
        const container = document.getElementById('dashboardContent');
        container.innerHTML = '';

        this.currentData.categories.forEach(category => {
            const categoryElement = this.createCategoryElement(category);
            container.appendChild(categoryElement);
        });
    }

    createCategoryElement(category) {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'dashboard-category';
        categoryDiv.setAttribute('data-category-id', category.id);

        const header = document.createElement('div');
        header.className = 'category-header';

        const title = document.createElement('h2');
        title.className = 'category-title';
        title.textContent = category.name;

        const actions = document.createElement('div');
        actions.className = 'category-actions';

        const addBtn = document.createElement('button');
        addBtn.className = 'category-btn';
        addBtn.addEventListener('click', () => {
            this.showAddWidgetModal(category.id);
        });

        const manageBtn = document.createElement('button');
        manageBtn.className = 'category-btn';
        manageBtn.addEventListener('click', () => {
            this.showWidgetManagementModal(category.id);
        });

        actions.appendChild(addBtn);
        actions.appendChild(manageBtn);

        header.appendChild(title);
        header.appendChild(actions);

        const widgetsGrid = document.createElement('div');
        widgetsGrid.className = 'widgets-grid';

        // Create the specific 3x4 grid layout
        this.createGridLayout(widgetsGrid, category);

        categoryDiv.appendChild(header);
        categoryDiv.appendChild(widgetsGrid);

        return categoryDiv;
    }

    createGridLayout(container, category) {
        container.innerHTML = '';

        // Create a 3-column grid dynamically
        category.widgets.forEach((widget, index) => {
            const widgetEl = this.createWidgetElement(widget, category.id);

            // Calculate row/column based on index
            const col = (index % 3) + 1;        // 1, 2, or 3
            const row = Math.floor(index / 3) + 1; // row number starting from 1

            widgetEl.style.gridColumn = col;
            widgetEl.style.gridRow = row;
            container.appendChild(widgetEl);
        });

        // Always add one "Add Widget" placeholder in the next free slot
        const addWidget = this.createAddWidgetPlaceholder(category.id);
        const addCol = ((category.widgets.length) % 3) + 1;
        const addRow = Math.floor(category.widgets.length / 3) + 1;

        addWidget.style.gridColumn = addCol;
        addWidget.style.gridRow = addRow;
        container.appendChild(addWidget);
    }


    createWidgetElement(widget, categoryId) {
        const widgetDiv = document.createElement('div');
        widgetDiv.className = `widget ${widget.type}`;
        widgetDiv.setAttribute('data-widget-id', widget.id);
        widgetDiv.setAttribute('data-category-id', categoryId);

        const header = document.createElement('div');
        header.className = 'widget-header';

        const title = document.createElement('h3');
        title.className = 'widget-title';
        title.textContent = widget.name;

        const actions = document.createElement('div');
        actions.className = 'widget-actions';

        const removeBtn = document.createElement('button');
        removeBtn.className = 'widget-action-btn';
        removeBtn.innerHTML = '<i class="fas fa-times"></i>';
        removeBtn.title = 'Remove widget';
        removeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.removeWidget(widget.id, categoryId);
        });

        actions.appendChild(removeBtn);

        header.appendChild(title);
        header.appendChild(actions);

        const content = document.createElement('div');
        content.className = 'widget-content';

        const text = document.createElement('div');
        text.className = 'widget-text';
        text.textContent = widget.content;

        const description = document.createElement('div');
        description.className = 'widget-description';
        description.textContent = widget.description || '';

        content.appendChild(text);
        content.appendChild(description);

        // Add widget-specific content based on type
        if (widget.type === 'donut-chart' && widget.data) {
            const chartContainer = this.createDonutChart(widget.data);
            content.appendChild(chartContainer);
        } else if (widget.type === 'progress-bar' && widget.data) {
            const progressContainer = this.createProgressBar(widget.data);
            content.appendChild(progressContainer);
        } else if (widget.type === 'bar-chart') {
            const chartPlaceholder = document.createElement('div');
            chartPlaceholder.className = 'chart-placeholder';
            chartPlaceholder.innerHTML = `
                <i class="fas fa-chart-bar" style="font-size: 2rem; color: #9ca3af; margin-bottom: 0.5rem;"></i>
                <p style="color: #6b7280; font-size: 0.9rem;">No Graph data available!</p>
            `;
            chartPlaceholder.style.textAlign = 'center';
            chartPlaceholder.style.padding = '2rem';
            content.appendChild(chartPlaceholder);
        }

        widgetDiv.appendChild(header);
        widgetDiv.appendChild(content);

        return widgetDiv;
    }

    createDonutChart(data) {
    const container = document.createElement('div');
    container.className = 'donut-chart-container';

    const total = Object.values(data).reduce((sum, value) => sum + value, 0);

    // Create wrapper for chart + legend side-by-side
    const wrapper = document.createElement('div');
    wrapper.className = 'donut-chart-wrapper';

    // Create donut chart
    const chart = document.createElement('div');
    chart.className = 'donut-chart';

    // Generate conic gradient
    let currentAngle = 0;
    const segments = [];

    Object.entries(data).forEach(([key, value]) => {
        if (value > 0) {
            const percentage = (value / total) * 100;
            const angle = percentage * 3.6;

            let color = '#e5e7eb'; // default
            if (key === 'connected' || key === 'passed') {
                color = '#3b82f6';
            } else if (key === 'failed' || key === 'critical') {
                color = '#dc2626';
            } else if (key === 'warning' || key === 'high') {
                color = '#ea580c';
            } else if (key === 'notAvailable' || key === 'medium' || key === 'notConnected') {
                color = '#ab702cff';
            }

            segments.push(`${color} ${currentAngle}deg ${currentAngle + angle}deg`);
            currentAngle += angle;
        }
    });

    chart.style.cssText = `
        background: conic-gradient(${segments.join(', ')});
        height: 150px;
        width: 150px;
        border-radius: 50%;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 30px;
    `;

    // Inner circle
    const innerCircle = document.createElement("div");
    innerCircle.style.cssText = `
        background: white;
        height: 80px;
        width: 80px;
        border-radius: 50%;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    `;
    chart.appendChild(innerCircle);

    // Value in center
    const value = document.createElement('div');
    value.className = 'donut-chart-value';
    value.innerHTML = `${total}<span class="total-label">Total</span>`;
    chart.appendChild(value);

    // Legend section
    const legend = document.createElement('div');
    legend.className = 'donut-legend';
    Object.entries(data).forEach(([key, value]) => {
        const legendItem = document.createElement('div');
        legendItem.className = 'donut-legend-item';
        legendItem.innerHTML = `<span class="legend-color" style="background-color: ${
            key === 'connected' || key === 'passed' ? '#3b82f6' :
            key === 'failed' || key === 'critical' ? '#dc2626' :
            key === 'warning' || key === 'high' ? '#ea580c' :
            '#d97706'
        }"></span>${key} (${value})`;
        legend.appendChild(legendItem);
    });

    // Append chart and legend side-by-side
    wrapper.appendChild(chart);
    wrapper.appendChild(legend);
    container.appendChild(wrapper);

    return container;
}


createProgressBar(data) {
    const container = document.createElement('div');
    container.className = 'progress-container';

    const total = Object.values(data).reduce((sum, value) => sum + value, 0);

    // Color mapping (expand as needed)
    const colors = {
        critical: '#dc2626', // red
        high: '#ea580c',     // orange
        medium: '#d97706',   // amber
        low: '#16a34a',      // green
        info: '#2563eb',     // blue
        notice: '#8b5cf6',   // purple
        minor: '#14b8a6',    // teal
        other: '#facc15'     // yellow
    };

    // Progress Bar
    const progressBar = document.createElement('div');
    progressBar.className = 'progress-bar';
    progressBar.style.display = 'flex';
    progressBar.style.height = '25px';
    progressBar.style.borderRadius = '6px';
    progressBar.style.overflow = 'hidden';
    progressBar.style.background = '#e5e7eb'; // light grey background

    Object.entries(data).forEach(([key, value]) => {
        if (value > 0) {
            const segment = document.createElement('div');
            const percent = (value / total) * 100;
            segment.style.width = `${percent}%`;
            segment.style.height = '100%';

            // Use color from mapping or default
            segment.style.background = colors[key] || colors.other;

            progressBar.appendChild(segment);
        }
    });

    container.appendChild(progressBar);

    // Legend Section
    const legend = document.createElement('div');
    legend.className = 'progress-legend';
    legend.style.display = 'flex';
    legend.style.flexWrap = 'wrap';
    legend.style.marginTop = '8px';
    legend.style.gap = '10px';

    Object.entries(data).forEach(([key, value]) => {
        if (value > 0) {
            const legendItem = document.createElement('div');
            legendItem.className = 'progress-legend-item';
            legendItem.style.display = 'flex';
            legendItem.style.alignItems = 'center';
            legendItem.style.gap = '5px';

            // Colored box
            const colorBox = document.createElement('span');
            colorBox.className = 'legend-color';
            colorBox.style.display = 'inline-block';
            colorBox.style.width = '15px';
            colorBox.style.height = '15px';
            colorBox.style.background = colors[key] || colors.other;

            // Label text
            const text = document.createElement('span');
            text.textContent = `${this.formatKey(key)} (${value})`;
            text.style.color = '#000';
            text.style.fontWeight = '500';

            legendItem.appendChild(colorBox);
            legendItem.appendChild(text);
            legend.appendChild(legendItem);
        }
    });

    container.appendChild(legend);

    return container;
}




    createAddWidgetPlaceholder(categoryId) {
        const placeholder = document.createElement('div');
        placeholder.className = 'add-widget-placeholder';
        placeholder.addEventListener('click', () => {
            this.showAddWidgetModal(categoryId);
        });

        placeholder.innerHTML = `
            <i class="fas fa-plus"></i>
            <p>Add Widget</p>
        `;

        return placeholder;
    }

    showAddWidgetModal(categoryId = null) {
        const modal = document.getElementById('addWidgetModal');

        // Reset selected widgets
        this.selectedWidgets = [];

        // Populate widget selection list
        this.populateWidgetSelectionList('cspm');

        // Set default category if provided
        this.targetCategoryId = categoryId;

        modal.classList.add('show');
    }

    hideAddWidgetModal() {
        const modal = document.getElementById('addWidgetModal');
        modal.classList.remove('show');
    }

    switchTab(tabName) {
        // Update active tab
        document.querySelectorAll('.modal-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Populate widget selection list for the selected tab
        this.populateWidgetSelectionList(tabName);
    }

    populateWidgetSelectionList(tabName) {
        const container = document.getElementById('widgetSelectionList');
        container.innerHTML = '';

        // Define available widgets for each tab
        const tabWidgets = {
            cspm: [
                { id: 'cloud-accounts', name: 'Cloud Accounts', type: 'donut-chart' },
                { id: 'cloud-account-risk', name: 'Cloud Account Risk Assessment', type: 'donut-chart' }
            ],
            cwpp: [
                { id: 'namespace-alerts', name: 'Top 5 Namespace Specific Alerts', type: 'bar-chart' },
                { id: 'workload-alerts', name: 'Workload Alerts', type: 'bar-chart' }
            ],
            image: [
                { id: 'image-risk-assessment', name: 'Image Risk Assessment', type: 'progress-bar' },
                { id: 'image-security-issues', name: 'Image Security Issues', type: 'progress-bar' }
            ],
            ticket: [
                { id: 'ticket-metrics', name: 'Ticket Metrics', type: 'metric-card' },
                { id: 'ticket-status', name: 'Ticket Status', type: 'text-widget' }
            ]
        };

        const widgets = tabWidgets[tabName] || [];

        widgets.forEach(widget => {
            const item = document.createElement('div');
            item.className = 'widget-selection-item';

            item.innerHTML = `
                <input type="checkbox" id="widget-${widget.id}" value="${widget.id}" data-widget='${JSON.stringify(widget)}'>
                <label for="widget-${widget.id}">${widget.name}</label>
            `;

            // Add event listener for checkbox changes
            const checkbox = item.querySelector('input[type="checkbox"]');
            checkbox.addEventListener('change', (e) => {
                this.handleWidgetSelection(e.target, widget);
            });

            container.appendChild(item);
        });
    }

    handleWidgetSelection(checkbox, widget) {
        if (checkbox.checked) {
            this.selectedWidgets.push(widget);
        } else {
            this.selectedWidgets = this.selectedWidgets.filter(w => w.id !== widget.id);
        }
    }

    handleConfirmWidgets() {
        if (this.selectedWidgets.length === 0) {
            this.showToast('Please select at least one widget', 'warning');
            return;
        }

        // Add selected widgets to the target category
        this.selectedWidgets.forEach(widget => {
            this.addWidgetToCategory(widget);
        });

        this.hideAddWidgetModal();
        this.showToast(`${this.selectedWidgets.length} widget(s) added successfully!`, 'success');
    }

    addWidgetToCategory(widget) {
        const categoryId = this.targetCategoryId || this.getCategoryIdForTab();
        const category = this.currentData.categories.find(cat => cat.id === categoryId);

        if (category) {
            const newWidget = {
                id: this.generateWidgetId(),
                name: widget.name,
                type: widget.type,
                content: this.generateWidgetContent(widget.type),
                description: `Added ${widget.name} widget`,
                data: this.generateWidgetData(widget.type)
            };

            category.widgets.push(newWidget);
            this.saveToLocalStorage();
            this.renderDashboard();
        }
    }

    getCategoryIdForTab() {
        // Map tab names to category IDs
        const tabToCategory = {
            cspm: 'cnapp-dashboard',
            cwpp: 'cwpp-dashboard',
            image: 'registry-scan',
            ticket: 'ticket-dashboard'
        };

        const activeTab = document.querySelector('.modal-tab.active').dataset.tab;
        return tabToCategory[activeTab] || 'cnapp-dashboard';
    }

    generateWidgetContent(widgetType) {
        switch (widgetType) {
            case 'donut-chart':
                return '2 Total';
            case 'progress-bar':
                return '1470 Total Vulnerabilities';
            case 'bar-chart':
                return 'No Graph data available!';
            case 'metric-card':
                return '25 Total';
            case 'text-widget':
                return 'Sample text content';
            default:
                return 'Widget content';
        }
    }

    showWidgetManagementModal(categoryId = null) {
        const modal = document.getElementById('widgetManagementModal');
        this.populateWidgetList(categoryId);
        modal.classList.add('show');
    }

    hideWidgetManagementModal() {
        const modal = document.getElementById('widgetManagementModal');
        modal.classList.remove('show');
    }


    populateWidgetList(categoryId = null) {
        const container = document.getElementById('widgetList');
        container.innerHTML = '';

        this.currentData.categories.forEach(category => {
            if (categoryId && category.id !== categoryId) return;

            category.widgets.forEach(widget => {
                const item = document.createElement('div');
                item.className = 'widget-list-item';
                item.setAttribute('data-widget-id', widget.id);
                item.setAttribute('data-category-id', category.id);

                item.innerHTML = `
                    <div class="widget-list-info">
                        <h4>${widget.name}</h4>
                        <p>${category.name} â€¢ ${widget.type}</p>
                    </div>
                    <div class="widget-list-actions">
                        <button class="remove-btn" onclick="dashboardApp.removeWidget('${widget.id}', '${category.id}')">
                            <i class="fas fa-trash"></i> Remove
                        </button>
                    </div>
                `;

                container.appendChild(item);
            });
        });
    }


    removeWidget(widgetId, categoryId) {
        const category = this.currentData.categories.find(cat => cat.id === categoryId);
        if (category) {
            category.widgets = category.widgets.filter(widget => widget.id !== widgetId);
            this.saveToLocalStorage();
            this.renderDashboard();
            this.populateWidgetList();
            this.showToast('Widget removed successfully!', 'success');
        }
    }

    generateWidgetId() {
        return 'widget_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    generateWidgetData(widgetType) {
        switch (widgetType) {
            case 'donut-chart':
                return {
                    connected: Math.floor(Math.random() * 10) + 1,
                    notConnected: Math.floor(Math.random() * 5) + 1
                };
            case 'progress-bar':
                return {
                    critical: Math.floor(Math.random() * 5),
                    high: Math.floor(Math.random() * 10) + 1,
                    medium: Math.floor(Math.random() * 20) + 5,
                    low: Math.floor(Math.random() * 30) + 10
                };
            default:
                return {};
        }
    }

    handleGlobalSearch(query) {
        const widgets = document.querySelectorAll('.widget');
        const categories = document.querySelectorAll('.dashboard-category');

        if (!query.trim()) {
            // Show all widgets and categories
            widgets.forEach(widget => widget.style.display = 'block');
            categories.forEach(category => category.style.display = 'block');
            return;
        }

        const searchTerm = query.toLowerCase();
        let hasVisibleWidgets = false;

        categories.forEach(category => {
            const categoryWidgets = category.querySelectorAll('.widget');
            let categoryHasVisibleWidgets = false;

            categoryWidgets.forEach(widget => {
                const title = widget.querySelector('.widget-title').textContent.toLowerCase();
                const content = widget.querySelector('.widget-text').textContent.toLowerCase();
                const description = widget.querySelector('.widget-description').textContent.toLowerCase();

                if (title.includes(searchTerm) || content.includes(searchTerm) || description.includes(searchTerm)) {
                    widget.style.display = 'block';
                    categoryHasVisibleWidgets = true;
                    hasVisibleWidgets = true;
                } else {
                    widget.style.display = 'none';
                }
            });

            // Show/hide category based on whether it has visible widgets
            category.style.display = categoryHasVisibleWidgets ? 'block' : 'none';
        });

        // Show message if no results found
        if (!hasVisibleWidgets) {
            this.showToast('No widgets found matching your search', 'warning');
        }
    }

    handleWidgetSearch(query) {
        const items = document.querySelectorAll('.widget-list-item');

        items.forEach(item => {
            const title = item.querySelector('h4').textContent.toLowerCase();
            const category = item.querySelector('p').textContent.toLowerCase();

            if (title.includes(query.toLowerCase()) || category.includes(query.toLowerCase())) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    }

    handleTimeFilter(value) {
        this.showToast(`Time filter changed to: Last ${value} days`, 'success');
        // Here you would typically filter data based on the time range
    }

    refreshDashboard() {
        this.showLoading();
        setTimeout(() => {
            this.renderDashboard();
            this.hideLoading();
            this.showToast('Dashboard refreshed!', 'success');
        }, 1000);
    }

    showLoading() {
        document.getElementById('loadingOverlay').classList.add('show');
    }

    hideLoading() {
        document.getElementById('loadingOverlay').classList.remove('show');
    }

    showToast(message, type = 'success') {
        const container = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;

        const icon = type === 'success' ? 'fa-check-circle' :
            type === 'error' ? 'fa-exclamation-circle' :
                'fa-exclamation-triangle';

        toast.innerHTML = `
            <div class="toast-content">
                <i class="fas ${icon} toast-icon"></i>
                <span class="toast-message">${message}</span>
            </div>
        `;

        container.appendChild(toast);

        // Auto remove after 3 seconds
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    formatKey(key) {
        return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    }

    saveToLocalStorage() {
        try {
            localStorage.setItem('dashboardData', JSON.stringify(this.currentData));
        } catch (error) {
            console.error('Failed to save to localStorage:', error);
        }
    }

    loadFromLocalStorage() {
        try {
            const saved = localStorage.getItem('dashboardData');
            if (saved) {
                this.currentData = JSON.parse(saved);
            }
        } catch (error) {
            console.error('Failed to load from localStorage:', error);
        }
    }

    mergeData(original, saved) {
        // Simple merge - in a real app, you'd want more sophisticated merging
        return saved;
    }
}

// Initialize the dashboard when the page loads
let dashboardApp;
document.addEventListener('DOMContentLoaded', () => {
    dashboardApp = new DashboardApp();
});

// Export for global access
window.dashboardApp = dashboardApp;

