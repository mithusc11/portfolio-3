const firebaseConfig = {
  apiKey: "YOUR_REAL_API_KEY",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "xxxxxxxxxxxx",
  appId: "1:xxxxxxxxxxxx:web:xxxxxxxxxxxxxxxx"
};

// ✅ Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const storage = firebase.storage();

// ✅ Redirect if not authenticated
auth.onAuthStateChanged(user => {
    if (!user) {
        window.location.href = 'login.html';
    } else {
        loadFiles();
    }
});

// ✅ Logout
document.querySelector('.logout')?.addEventListener('click', () => {
    auth.signOut().then(() => {
        window.location.href = 'login.html';
    }).catch(error => {
        console.error('Logout error:', error);
    });
});

// ✅ Upload logic
const fileUpload = document.getElementById('file-upload');
const dragDrop = document.querySelector('.drag-drop');
const gallery = document.querySelector('.file-gallery');

fileUpload?.addEventListener('change', handleFiles);
dragDrop?.addEventListener('dragover', (e) => {
    e.preventDefault();
    dragDrop.style.background = '#3a3a3a';
});
dragDrop?.addEventListener('dragleave', () => {
    dragDrop.style.background = 'none';
});
dragDrop?.addEventListener('drop', (e) => {
    e.preventDefault();
    dragDrop.style.background = 'none';
    handleFiles({ target: { files: e.dataTransfer.files } });
});

function handleFiles(e) {
    const files = Array.from(e.target.files || e.dataTransfer.files);
    const user = auth.currentUser;
    if (!user) return;

    files.forEach(file => {
        if (file.size > 10 * 1024 * 1024) {
            alert('File too large (max 10MB)');
            return;
        }

        const fileRef = storage.ref(`files/${user.uid}/${Date.now()}_${file.name}`);
        fileRef.put(file).then(() => {
            loadFiles();
        }).catch(error => {
            console.error('Upload error:', error);
        });
    });
}

// ✅ Load files
function loadFiles(search = '', filter = 'all') {
    const user = auth.currentUser;
    if (!user) return;

    gallery.innerHTML = '';
    const folderRef = storage.ref(`files/${user.uid}`);

    folderRef.listAll().then(result => {
        result.items.forEach(item => {
            item.getDownloadURL().then(url => {
                const name = item.name.split('_').slice(1).join('_');
                if (!name.toLowerCase().includes(search.toLowerCase())) return;
                const type = getFileType(name);
                if (filter !== 'all' && type !== filter) return;

                const div = document.createElement('div');
                div.className = 'file-item scroll-reveal';
                div.dataset.url = url;
                div.dataset.name = item.name;

                if (type === 'image' || type === 'gif') {
                    div.innerHTML = `<img src="${url}" alt="${name}"><div class="file-name">${name}</div>`;
                } else if (type === 'video') {
                    div.innerHTML = `<video><source src="${url}" type="video/mp4"></video><div class="file-name">${name}</div>`;
                } else {
                    div.innerHTML = `<div class="file-icon">📄</div><div class="file-name">${name}</div>`;
                }

                gallery.appendChild(div);
            });
        });
    }).catch(error => {
        console.error('List error:', error);
    });
}

function getFileType(name) {
    const ext = name.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'webp'].includes(ext)) return 'image';
    if (ext === 'gif') return 'gif';
    if (ext === 'mp4') return 'video';
    return 'other';
}

// ✅ File modal
const modal = document.getElementById('file-modal');
const modalImage = document.getElementById('modal-image');
const modalVideo = document.getElementById('modal-video');
const modalOther = document.getElementById('modal-other');
const modalName = document.getElementById('modal-name');
const modalInfo = document.querySelector('.modal-info');
const closeModal = document.querySelector('.modal .close');
const downloadBtn = document.getElementById('download-file');
const deleteBtn = document.getElementById('delete-file');

gallery?.addEventListener('click', (e) => {
    const item = e.target.closest('.file-item');
    if (!item) return;

    const url = item.dataset.url;
    const name = item.dataset.name;
    const type = getFileType(name);

    modalImage.style.display = 'none';
    modalVideo.style.display = 'none';
    modalOther.style.display = 'none';
    modalInfo.style.display = 'block';
    modalName.textContent = name.split('_').slice(1).join('_');

    if (type === 'image' || type === 'gif') {
        modalImage.src = url;
        modalImage.style.display = 'block';
    } else if (type === 'video') {
        modalVideo.src = url;
        modalVideo.style.display = 'block';
    } else {
        modalOther.src = url;
        modalOther.style.display = 'block';
    }

    modal.dataset.name = name;
    modal.style.display = 'flex';
});

closeModal?.addEventListener('click', () => {
    modal.style.display = 'none';
    modalVideo.pause();
});

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
        modalVideo.pause();
    }
});

downloadBtn?.addEventListener('click', () => {
    const url = modalImage.src || modalVideo.src || modalOther.src;
    const link = document.createElement('a');
    link.href = url;
    link.download = modalName.textContent;
    link.click();
});

deleteBtn?.addEventListener('click', () => {
    const name = modal.dataset.name;
    const user = auth.currentUser;
    if (!user) return;

    const fileRef = storage.ref(`files/${user.uid}/${name}`);
    fileRef.delete().then(() => {
        modal.style.display = 'none';
        loadFiles();
    }).catch(error => {
        console.error('Delete error:', error);
    });
});

// ✅ Search & filter
const searchInput = document.getElementById('search-files');
const filterSelect = document.getElementById('filter-type');

searchInput?.addEventListener('input', () => {
    loadFiles(searchInput.value, filterSelect.value);
});

filterSelect?.addEventListener('change', () => {
    loadFiles(searchInput.value, filterSelect.value);
});

// ✅ Load files on page load
document.addEventListener('DOMContentLoaded', () => {
    const user = auth.currentUser;
    if (user) loadFiles();
});
