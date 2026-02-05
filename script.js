document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('myModal');
    const closeBtn = modal.querySelector('.close');
    const modalImage = document.getElementById('modalImage');
    const modalName = document.getElementById('modalName');
    const modalType = document.getElementById('modalType');
    const modalColor = document.getElementById('modalColor');
    const modalDescription = document.getElementById('modalDescription');
    const modalLifeSpan = document.getElementById('modalLifeSpan');

    const gallery = document.getElementById('animal-gallery');
    const searchInput = document.getElementById('search-input');

    //==== Fetch Animals ====
    async function fetchAnimals() {
        try {
            const res = await fetch("http://localhost:3000/api/images"); // your API
            if (!res.ok) throw new Error('Failed to fetch animals');
            const data = await res.json();
            return data;
        } catch (err) {
            console.error(err);
            gallery.innerHTML = '<p>Failed to load animals.</p>';
            return [];
        }
    }

    //==== Render Animal Grid ====
    function renderAnimals(animals) {
        gallery.innerHTML = '';
        animals.forEach(a => {
            const item = document.createElement('div');
            item.classList.add('image-item'); // important for modal click
            item.dataset.name = a.name;
            item.dataset.type = a.type;
            item.dataset.color = a.color;
            item.dataset.description = a.description;
            item.dataset.lifespan = a.lifespan;
            item.dataset.image = `http://localhost:3000${a.imagePath}`;

           item.innerHTML = `
            <img src="http://localhost:3000${a.imagePath}" alt="${a.name}">
            <div class="detail-box">
                <p><strong>${a.name}</strong></p>
            </div>
        `;
        gallery.appendChild(item);
        });
    }

    //==== Modal Functions ====
    function openModal(data) {
        modalImage.src = data.image;
        modalImage.alt = data.name;
        modalName.textContent = data.name;
        modalType.textContent = data.type;
        modalColor.textContent = data.color;
        modalDescription.textContent = data.description;
        modalLifeSpan.textContent = data.lifespan; 

        modal.style.display = 'flex';
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.style.display = 'none';
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = 'auto';
    }

    //==== Event Listeners ====
    gallery.addEventListener('click', (e) => {
        const item = e.target.closest('.image-item');
        if (!item) return;

        openModal({
            name: item.dataset.name,
            type: item.dataset.type,
            color: item.dataset.color,
            description: item.dataset.description,
            lifespan: item.dataset.lifespan,
            image: item.dataset.image
        });
    });

    closeBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'flex') closeModal();
    });

    //==== Search Functionality ====
    searchInput.addEventListener('input', async () => {
        const query = searchInput.value.toLowerCase();
        const animals = await fetchAnimals();
        const filtered = animals.filter(a => a.name.toLowerCase().includes(query));
        renderAnimals(filtered);
    });

    //==== Initialize Page ====
    (async function init() {
        const animals = await fetchAnimals();
        renderAnimals(animals);
    })();
});
