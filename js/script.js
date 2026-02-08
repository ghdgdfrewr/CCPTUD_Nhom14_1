// ===== AUTH/LOGIN FUNCTIONS =====
function openLoginModal() {
    document.getElementById('loginModal').style.display = 'flex';
}

function closeLoginModal() {
    document.getElementById('loginModal').style.display = 'none';
}

function toggleAuthMenu() {
    const menu = document.getElementById('authMenu');
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
}

function login() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    if (!email || !password) {
        alert('Vui lòng nhập email và mật khẩu!');
        return;
    }

    if (!email.includes('@')) {
        alert('Email không hợp lệ!');
        return;
    }

    // Lưu thông tin người dùng (đơn giản cho demo)
    const user = {
        email: email,
        name: email.split('@')[0],
        loginTime: new Date().toLocaleString('vi-VN')
    };

    localStorage.setItem('currentUser', JSON.stringify(user));
    
    alert('Đăng nhập thành công!');
    closeLoginModal();
    updateUserDisplay();
    document.getElementById('loginEmail').value = '';
    document.getElementById('loginPassword').value = '';
}

function logout() {
    localStorage.removeItem('currentUser');
    updateUserDisplay();
    closeAuthMenu();
    alert('Đăng xuất thành công!');
}

function signup() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    if (!email || !password) {
        alert('Vui lòng nhập email và mật khẩu!');
        return;
    }

    if (!email.includes('@')) {
        alert('Email không hợp lệ!');
        return;
    }

    if (password.length < 6) {
        alert('Mật khẩu phải có ít nhất 6 ký tự!');
        return;
    }

    // Lưu tài khoản (đơn giản cho demo)
    const user = {
        email: email,
        name: email.split('@')[0],
        loginTime: new Date().toLocaleString('vi-VN')
    };

    localStorage.setItem('currentUser', JSON.stringify(user));
    
    alert('Đăng ký thành công! Xin chào ' + user.name);
    closeLoginModal();
    updateUserDisplay();
    document.getElementById('loginEmail').value = '';
    document.getElementById('loginPassword').value = '';
}

function updateUserDisplay() {
    const authBtn = document.getElementById('authBtn');
    const authMenu = document.getElementById('authMenu');
    const currentUser = localStorage.getItem('currentUser');

    if (currentUser) {
        const user = JSON.parse(currentUser);
        authBtn.textContent = '👤 ' + user.name;
        authBtn.style.backgroundColor = '#4caf50';
        
        // Cập nhật menu xác thực
        authMenu.innerHTML = `
            <div style="padding: 10px; background: white; border-radius: 5px; min-width: 200px;">
                <div style="padding: 10px; border-bottom: 1px solid #eee;">
                    <strong style="color: #667eea;">Xin chào ${user.name}</strong><br>
                    <small style="color: #999;">Email: ${user.email}</small>
                </div>
                <button onclick="viewWishlist()" style="width: 100%; padding: 8px; text-align: left; border: none; background: none; cursor: pointer; color: #333;">❤️ Sản phẩm yêu thích</button>
                <button onclick="logout()" style="width: 100%; padding: 8px; text-align: left; border: none; background: none; cursor: pointer; color: #d32f2f;">🚪 Đăng xuất</button>
            </div>
        `;
    } else {
        authBtn.textContent = '🔑 Đăng nhập';
        authBtn.style.backgroundColor = '#667eea';
        authMenu.style.display = 'none';
        authMenu.innerHTML = '';
    }
}

function closeAuthMenu() {
    document.getElementById('authMenu').style.display = 'none';
}

// ===== FAVORITE/WISHLIST FUNCTIONS =====
function toggleFavorite(productId, event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }

    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        alert('Vui lòng đăng nhập để yêu thích sản phẩm!');
        openLoginModal();
        return;
    }

    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const index = favorites.indexOf(productId);

    if (index > -1) {
        favorites.splice(index, 1);
    } else {
        favorites.push(productId);
    }

    localStorage.setItem('favorites', JSON.stringify(favorites));
    updateFavoriteButtons();
    return false;
}

function toggleFavoritePage(event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }

    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        alert('Vui lòng đăng nhập để yêu thích sản phẩm!');
        openLoginModal();
        return;
    }

    const btn = event.target.closest('.favorite-btn');
    const productId = btn.dataset.productId;

    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const index = favorites.indexOf(productId);

    if (index > -1) {
        favorites.splice(index, 1);
        btn.classList.remove('is-favorite');
        btn.textContent = '🤍 Yêu thích';
        alert('Bỏ yêu thích thành công!');
    } else {
        favorites.push(productId);
        btn.classList.add('is-favorite');
        btn.textContent = '❤️ Yêu thích';
        alert('Thêm vào danh sách yêu thích thành công!');
    }

    localStorage.setItem('favorites', JSON.stringify(favorites));
    return false;
}

function isFavorite(productId) {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    return favorites.includes(productId);
}

function updateFavoriteButtons() {
    const buttons = document.querySelectorAll('.favorite-btn');
    buttons.forEach(btn => {
        const productId = btn.dataset.productId;
        if (isFavorite(productId)) {
            btn.classList.add('is-favorite');
            btn.textContent = '❤️';
        } else {
            btn.classList.remove('is-favorite');
            btn.textContent = '🤍';
        }
    });
}

function viewWishlist() {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    
    if (favorites.length === 0) {
        alert('Danh sách yêu thích của bạn trống!');
        return;
    }

    // Tạo popup hiển thị danh sách yêu thích
    const productNames = {
        'ao-thun-nam': 'Áo thun nam - 199.000₫',
        'quan-jean': 'Quần jean - 299.000₫',
        'giay-the-thao': 'Giày thể thao - 499.000₫',
        'ao-khoac': 'Áo khoác - 599.000₫'
    };

    let message = 'Danh sách sản phẩm yêu thích của bạn:\n\n';
    favorites.forEach((fav, index) => {
        message += (index + 1) + '. ' + (productNames[fav] || fav) + '\n';
    });

    alert(message);
}

// ===== CART FUNCTIONS =====
function addToCart(productName) {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        alert('Vui lòng đăng nhập để mua hàng!');
        openLoginModal();
        return;
    }

    const productMap = {
        'Áo thun nam': 'ao-thun-nam',
        'Quần jean': 'quan-jean',
        'Giày thể thao': 'giay-the-thao',
        'Áo khoác': 'ao-khoac'
    };

    const productKey = productMap[productName];
    if (productKey) {
        window.location.href = `product-detail.html?product=${productKey}`;
    }
}

function updateCartBadge() {
    const cart = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const badgeEl = document.getElementById('cart-count');

    if (totalItems > 0) {
        badgeEl.style.display = 'inline';
        badgeEl.textContent = totalItems;
    } else {
        badgeEl.style.display = 'none';
    }
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    updateUserDisplay();
    updateFavoriteButtons();
    updateCartBadge();

    // Close modals when clicking outside
    window.onclick = function(event) {
        const loginModal = document.getElementById('loginModal');
        if (loginModal && event.target === loginModal) {
            closeLoginModal();
        }
    };

    // Close auth menu when clicking elsewhere
    document.addEventListener('click', function(e) {
        const authBtn = document.getElementById('authBtn');
        const authMenu = document.getElementById('authMenu');
        if (authBtn && authMenu) {
            if (!authBtn.contains(e.target) && !authMenu.contains(e.target)) {
                closeAuthMenu();
            }
        }
    });
});
