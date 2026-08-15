// --- DOM Elements ---
const categoryContainer = document.getElementById('categoryContainer');
const itemsContainer = document.getElementById('itemsContainer');

// --- Fetch Data from JSON file (with cache-busting) ---
fetch('assets/menu-data.json?t=' + Date.now())
    .then(response => {
        if (!response.ok) {
            throw new Error('File not found');
        }
        return response.json();
    })
    .then(data => {
        // The JSON should have a "categories" array
        const menuData = data.categories;
        if (!menuData || menuData.length === 0) {
            itemsContainer.innerHTML = `<div class="empty-state">⏳ هیچ دسته‌بندی یافت نشد</div>`;
            return;
        }
        renderCategories(menuData);
        renderItems(menuData, menuData[0].id);
    })
    .catch(error => {
        console.error('Error loading menu:', error);
        itemsContainer.innerHTML = `
            <div class="empty-state">❌ خطا: فایل menu-data.json پیدا نشد یا فرمت آن اشتباه است</div>
        `;
    });

// --- Render Category Boxes ---
function renderCategories(menuData) {
    categoryContainer.innerHTML = '';
    menuData.forEach((cat, index) => {
        const card = document.createElement('div');
        card.className = 'category-card';
        if (index === 0) card.classList.add('active');
        card.innerHTML = `
            <span class="cat-icon">${cat.icon}</span>
            <span class="cat-title">${cat.title}</span>
            <span class="cat-sub">${cat.subtitle}</span>
        `;
        card.addEventListener('click', () => {
            document.querySelectorAll('.category-card').forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            renderItems(menuData, cat.id);
        });
        categoryContainer.appendChild(card);
    });
}

// --- Render Items for a specific category ---
function renderItems(menuData, categoryId) {
    const category = menuData.find(c => c.id === categoryId);
    if (!category) return;

    itemsContainer.innerHTML = '';

    // Section Title
    const title = document.createElement('h2');
    title.className = 'section-title';
    title.textContent = category.title;
    itemsContainer.appendChild(title);

    // Check if items exist
    if (!category.items || category.items.length === 0) {
        itemsContainer.innerHTML += `<div class="empty-state">⏳ موردی یافت نشد</div>`;
        return;
    }

    // Render each item
    category.items.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'menu-item';
        itemDiv.innerHTML = `
            <div class="item-info">
                <span class="item-name">${item.name}</span>
                <span class="item-desc">${item.desc}</span>
            </div>
            <span class="item-price">${item.price}</span>
        `;
        itemsContainer.appendChild(itemDiv);
    });
}