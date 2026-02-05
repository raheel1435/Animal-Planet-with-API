// Wait until the DOM is fully loaded before running any script
document.addEventListener('DOMContentLoaded', () => {
    // ==== SELECT ELEMENTS ====
    const modal = document.getElementById('myModal'); // The modal container
    const closeBtn = modal.querySelector('.close');   // Close button inside modal
    const modalImage = document.getElementById('modalImage'); // Image inside modal
    const modalName = document.getElementById('modalName'); 
    const modalType = document.getElementById('modalType'); 
    const modalColor = document.getElementById('modalColor'); 
    const modalDescription = document.getElementById('modalDescription'); 
    const modalLifeSpan = document.getElementById('modalLifeSpan'); 

    const gallery = document.getElementById('animal-gallery'); // Container for animal images
    const searchInput = document.getElementById('search-input'); // Input for search functionality

    // ==== FETCH ANIMALS FROM API ====
    async function fetchAnimals() {
        try {
            const res = await fetch("http://localhost:3000/api/images"); // Replace with your API endpoint
            if (!res.ok) throw new Error('Failed to fetch animals'); // Handle network errors
            const data = await res.json(); // Convert response to JSON
            return data; // Return the array of animals
        } catch (err) {
            console.error(err);
            // Show error message in gallery if fetch fails
            gallery.innerHTML = '<p>Failed to load animals.</p>';
            return []; // Return empty array so page doesn't break
        }
    }

    // ==== RENDER ANIMAL GRID ====
    function renderAnimals(animals) {
        gallery.innerHTML = ''; // Clear gallery before rendering

        animals.forEach(a => {
            // Create a container for each animal
            const item = document.createElement('div');
            item.classList.add('image-item'); // Class needed for modal click
            // Store all animal data in data-* attributes for easy access
            item.dataset.name = a.name;
            item.dataset.type = a.type;
            item.dataset.color = a.color;
            item.dataset.description = a.description;
            item.dataset.lifeSpan = a.lifeSpan;
            item.dataset.image = `http://localhost:3000${a.imagePath}`;

            // Inject image and brief details
            item.innerHTML = `
                <img src="http://localhost:3000${a.imagePath}" alt="${a.name}">
                <div class="detail-box">
                    <p><strong>${a.name}</strong></p>
                </div>
            `;
            gallery.appendChild(item); // Add to gallery
        });
    }

    // ==== MODAL FUNCTIONS ====
    // Open modal and populate with selected animal data
    function openModal(data) {
        modalImage.src = data.image; // Set modal image
        modalImage.alt = data.name;   // Set alt text for accessibility
        modalName.textContent = data.name;
        modalType.textContent = data.type;
        modalColor.textContent = data.color;
        modalDescription.textContent = data.description;
        modalLifeSpan.textContent = data.lifeSpan;

        modal.style.display = 'flex';           // Show modal
        modal.setAttribute('aria-hidden', 'false'); // Update ARIA for accessibility
        document.body.style.overflow = 'hidden';    // Prevent background scrolling
    }

    // Close modal and reset page state
    function closeModal() {
        modal.style.display = 'none';
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = 'auto'; // Restore scrolling
    }

    // ==== EVENT LISTENERS ====
    // Click on gallery image opens modal
    gallery.addEventListener('click', (e) => {
        const item = e.target.closest('.image-item'); // Ensure click is on an item
        if (!item) return; // Ignore clicks outside items

        openModal({
            name: item.dataset.name,
            type: item.dataset.type,
            color: item.dataset.color,
            description: item.dataset.description,
            lifeSpan: item.dataset.lifeSpan,
            image: item.dataset.image
        });
    });

    // Close modal when clicking the close button
    closeBtn.addEventListener('click', closeModal);

    // Close modal when clicking outside the modal content
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'flex') closeModal();
    });

    // ==== SEARCH FUNCTIONALITY ====
    searchInput.addEventListener('input', async () => {
        const query = searchInput.value.toLowerCase(); // Get query and normalize
        const animals = await fetchAnimals();           // Fetch latest animals
        const filtered = animals.filter(a => a.name.toLowerCase().includes(query)); // Filter by name
        renderAnimals(filtered); // Re-render gallery with filtered results
    });

    // ==== INITIALIZE PAGE ====
    (async function init() {
        const animals = await fetchAnimals(); // Fetch all animals once
        renderAnimals(animals);               // Render initial gallery
    })();
});
