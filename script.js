// Ключ для localStorage
const STORAGE_KEY = 'telegram_accounts';
const ADMIN_PASSWORD = '241512';

// Шаблон аккаунта по умолчанию
const DEFAULT_ACCOUNT_TEMPLATE = {
    id: Date.now(),
    title: '',
    premium: false,
    spamblock: false,
    otlega: false,
    startNumber: '',
    country: '',
    price: '',
    contact: '@silicy'
};

// Загрузка аккаунтов из localStorage
function loadAccounts() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        return JSON.parse(stored);
    }
    // Начальные данные для примера
    return [
        {
            id: 1,
            title: 'Telegram Premium 2020',
            premium: true,
            spamblock: false,
            otlega: true,
            startNumber: '+7 (900)',
            country: 'Россия',
            price: '2500₽',
            contact: '@silicy'
        },
        {
            id: 2,
            title: 'Telegram USA 2019',
            premium: false,
            spamblock: true,
            otlega: false,
            startNumber: '+1 (202)',
            country: 'США',
            price: '1800₽',
            contact: '@silicy'
        }
    ];
}

// Сохранение аккаунтов
function saveAccounts(accounts) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts));
}

// Отображение аккаунтов на главной
function displayAccounts() {
    const grid = document.getElementById('accountsGrid');
    if (!grid) return;
    
    const accounts = loadAccounts();
    
    if (accounts.length === 0) {
        grid.innerHTML = '<div class="account-card" style="text-align: center;">Нет доступных аккаунтов</div>';
        return;
    }
    
    grid.innerHTML = accounts.map(account => `
        <div class="account-card">
            <div class="account-title">${account.title}</div>
            <div class="account-info">
                <div class="info-item">
                    <span class="info-label">Премиум:</span>
                    <span class="info-value">
                        <span class="badge ${account.premium ? 'premium' : ''}">
                            ${account.premium ? '✅ Да' : '❌ Нет'}
                        </span>
                    </span>
                </div>
                <div class="info-item">
                    <span class="info-label">Спамблок:</span>
                    <span class="info-value">
                        <span class="badge ${account.spamblock ? 'spamblock' : 'nospam'}">
                            ${account.spamblock ? '⚠️ Есть' : '✅ Нет'}
                        </span>
                    </span>
                </div>
                <div class="info-item">
                    <span class="info-label">Отлега:</span>
                    <span class="info-value">${account.otlega ? '✅ Да' : '❌ Нет'}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Начало номера:</span>
                    <span class="info-value">${account.startNumber}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Страна:</span>
                    <span class="info-value">${account.country}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Цена:</span>
                    <span class="info-value" style="color: #764ba2; font-size: 18px;">${account.price}</span>
                </div>
            </div>
            <button class="buy-button" onclick="buyAccount('${account.contact}')">
                Купить (${account.contact})
            </button>
        </div>
    `).join('');
}

// Функция покупки
function buyAccount(contact) {
    window.location.href = `https://t.me/${contact.replace('@', '')}`;
}

// Вход в админку
function loginAdmin() {
    const password = document.getElementById('adminPassword').value;
    if (password === ADMIN_PASSWORD) {
        sessionStorage.setItem('admin_logged', 'true');
        window.location.href = 'dashboard.html';
    } else {
        alert('Неверный пароль!');
    }
}

// Проверка авторизации в админке
function checkAdminAuth() {
    if (window.location.pathname.includes('dashboard.html')) {
        if (!sessionStorage.getItem('admin_logged')) {
            window.location.href = 'admin.html';
        }
    }
}

// Добавление аккаунта
function addAccount(event) {
    event.preventDefault();
    
    const newAccount = {
        id: Date.now(),
        title: document.getElementById('title').value,
        premium: document.getElementById('premium').checked,
        spamblock: document.getElementById('spamblock').checked,
        otlega: document.getElementById('otlega').checked,
        startNumber: document.getElementById('startNumber').value,
        country: document.getElementById('country').value,
        price: document.getElementById('price').value,
        contact: '@silicy'
    };
    
    const accounts = loadAccounts();
    accounts.push(newAccount);
    saveAccounts(accounts);
    
    // Очистка формы
    event.target.reset();
    
    // Обновление списка в админке
    displayAdminAccounts();
}

// Удаление аккаунта
function deleteAccount(id) {
    if (confirm('Удалить это объявление?')) {
        const accounts = loadAccounts();
        const filtered = accounts.filter(acc => acc.id !== id);
        saveAccounts(filtered);
        displayAdminAccounts();
        displayAccounts(); // Обновить главную, если нужно
    }
}

// Отображение аккаунтов в админке
function displayAdminAccounts() {
    const list = document.getElementById('adminAccountsList');
    if (!list) return;
    
    const accounts = loadAccounts();
    
    if (accounts.length === 0) {
        list.innerHTML = '<div class="admin-card">Нет объявлений</div>';
        return;
    }
    
    list.innerHTML = accounts.map(account => `
        <div class="admin-card">
            <div>
                <strong>${account.title}</strong><br>
                ${account.country} | ${account.price}
            </div>
            <button class="delete-btn" onclick="deleteAccount(${account.id})">Удалить</button>
        </div>
    `).join('');
}

// Выход из админки
function logoutAdmin() {
    sessionStorage.removeItem('admin_logged');
    window.location.href = 'index.html';
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    displayAccounts();
    checkAdminAuth();
    displayAdminAccounts();
    
    // Обработчик формы добавления
    const addForm = document.getElementById('addAccountForm');
    if (addForm) {
        addForm.addEventListener('submit', addAccount);
    }
});
