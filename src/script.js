document.addEventListener('DOMContentLoaded', () => {
    const searchBtn = document.getElementById('search-btn');
    const searchInput = document.getElementById('search');
    const featuredGrid = document.getElementById('featured-grid');
    const resultsGrid = document.getElementById('results-grid');
    const featuredSection = document.getElementById('featured-books');
    const resultsSection = document.getElementById('search-results');

    
    const popularBooks = [
        { title: "The Hobbit", cover_id: 840678, author: "J.R.R. Tolkien" },
        { title: "Harry Potter", cover_id: 10502096, author: "J.K. Rowling" },
        { title: "1984", cover_id: 7222245, author: "George Orwell" },
        { title: "Pride and Prejudice", cover_id: 7030259, author: "Jane Austen" },
        { title: "To Kill a Mockingbird", cover_id: 5785026, author: "Harper Lee" },
        { title: "The Great Gatsby", cover_id: 7467151, author: "F. Scott Fitzgerald" }
    ];

    
    displayBooks(popularBooks, featuredGrid);

    
    searchBtn.addEventListener('click', searchBooks);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') searchBooks();
    });

    async function searchBooks() {
        const query = searchInput.value.trim();
        if (!query) return;

        try {
            const response = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=12`);
            const data = await response.json();
            
            if (data.docs && data.docs.length > 0) {
                const books = data.docs.map(book => ({
                    title: book.title,
                    cover_id: book.cover_i,
                    author: book.author_name ? book.author_name.join(', ') : 'Unknown'
                }));
                
                displayBooks(books, resultsGrid);
                featuredSection.classList.add('hidden');
                resultsSection.classList.remove('hidden');
            } else {
                resultsGrid.innerHTML = '<p class="no-results">No books found</p>';
                featuredSection.classList.add('hidden');
                resultsSection.classList.remove('hidden');
            }
        } catch (error) {
            resultsGrid.innerHTML = '<p class="error">Error searching books</p>';
            featuredSection.classList.add('hidden');
            resultsSection.classList.remove('hidden');
        }
    }

    function displayBooks(books, container) {
        container.innerHTML = '';
        books.forEach(book => {
            const bookCard = document.createElement('div');
            bookCard.className = 'book-card';
            
            const coverUrl = book.cover_id 
                ? `https://covers.openlibrary.org/b/id/${book.cover_id}-M.jpg` 
                : 'https://via.placeholder.com/150x200?text=No+Cover';
            
            bookCard.innerHTML = `
                <img src="${coverUrl}" alt="${book.title}">
                <h3>${book.title}</h3>
                <p>${book.author}</p>
            `;
            
            container.appendChild(bookCard);
        });
    }
});