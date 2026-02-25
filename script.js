/**
 * Zenith Web Application Logic
 * Handles navigation, tab switching, and mock data injection for the community feed.
 */

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Navigation Logic (SPA Feel) ---
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.page-section');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();

            // Remove active class from all nav items
            navItems.forEach(nav => nav.classList.remove('active'));
            // Add active class to clicked item
            item.classList.add('active');

            const targetId = item.getAttribute('data-target');

            // Hide all sections
            sections.forEach(sec => {
                sec.classList.remove('active');
                setTimeout(() => sec.classList.add('hidden'), 300); // Wait for fade out
            });

            // Show target section
            const targetSection = document.getElementById(targetId);
            setTimeout(() => {
                targetSection.classList.remove('hidden');
                // Trigger reflow
                void targetSection.offsetWidth;
                targetSection.classList.add('active');
            }, 300);
        });
    });

    // --- 2. Tab Logic (Physical Wellness Page) ---
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active from all tabs
            tabBtns.forEach(t => t.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            tabContents.forEach(c => c.classList.add('hidden'));

            // Activate clicked
            btn.classList.add('active');
            const targetContent = document.getElementById(btn.getAttribute('data-tab'));
            targetContent.classList.remove('hidden');
            // Trigger reflow for animation
            void targetContent.offsetWidth;
            targetContent.classList.add('active');
        });
    });

    // --- 3. Mock Data & Community Feed Render ---
    const MOCK_POSTS = [
        {
            id: 1,
            author: 'Maya Chen',
            handle: '@mayamoves',
            time: '2h ago',
            content: 'Just finished week 2 of the Lower Body Focus schedule. My legs are officially jelly, but mental clarity is at an all-time high! 💪🧘‍♀️ #Progress',
            likes: 124,
            comments: [
                { author: 'Alex_R', text: 'Keep it going! Week 3 is where the real changes happen.' },
                { author: 'SarahJ', text: 'I struggled so much with the squats today, glad I am not alone.' }
            ],
            avatarGradient: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)'
        },
        {
            id: 2,
            author: 'David Kim',
            handle: '@dk_wellness',
            time: '5h ago',
            content: 'Trying out the "Roasted Chickpea Crunch" recipe from the Nutrition hub. Legit the best snack I have had all week while working. High protein and crunchy!',
            likes: 89,
            comments: [
                { author: 'ChefTay', text: 'Add a little smoked paprika next time! Game changer.' }
            ],
            avatarGradient: 'linear-gradient(120deg, #d4fc79 0%, #96e6a1 100%)'
        }
    ];

    const postsContainer = document.getElementById('posts-container');

    function renderPosts() {
        if (!postsContainer) return;
        postsContainer.innerHTML = '';

        MOCK_POSTS.forEach(post => {
            const postEl = document.createElement('div');
            postEl.className = 'post glass-panel';

            // Build comments HTML
            const commentsHtml = post.comments.map(c => `
                <div class="comment">
                    <div class="avatar bg-gradient-3"></div>
                    <div class="comment-box">
                        <strong>${c.author}</strong>
                        <span>${c.text}</span>
                    </div>
                </div>
            `).join('');

            postEl.innerHTML = `
                <div class="post-header">
                    <div class="avatar" style="background: ${post.avatarGradient}"></div>
                    <div class="post-meta">
                        <h4>${post.author}</h4>
                        <span>${post.handle} • ${post.time}</span>
                    </div>
                </div>
                <div class="post-content">
                    <p>${post.content}</p>
                </div>
                <div class="post-footer">
                    <button class="action-btn like-btn" data-id="${post.id}">
                        <i class="ph ph-heart"></i> <span>${post.likes}</span>
                    </button>
                    <button class="action-btn comment-toggle-btn" data-id="${post.id}">
                        <i class="ph ph-chat-circle"></i> ${post.comments.length}
                    </button>
                    <button class="action-btn"><i class="ph ph-share-network"></i> Share</button>
                </div>
                <!-- Comments Section -->
                <div class="comments-section" id="comments-${post.id}">
                    ${commentsHtml}
                    <div class="add-comment">
                        <div class="avatar bg-gradient-1"></div>
                        <div class="comment-input-area" style="flex:1; display:flex; flex-direction:column; gap:0.5rem;">
                            <input type="text" placeholder="Add a comment..." class="comment-input" data-post-id="${post.id}">
                            <div style="display:flex; justify-content:space-between; align-items:center;">
                                <label class="toggle-switch">
                                    <input type="checkbox" class="comment-anon-toggle">
                                    <span class="slider"></span>
                                    <span class="toggle-label" style="font-size:0.75rem;">Anonymously</span>
                                </label>
                                <button class="btn-primary comment-submit" style="padding: 0.3rem 0.8rem; font-size:0.85rem;">Post</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            postsContainer.appendChild(postEl);
        });
    }

    function attachPostEventListeners() {
        document.body.addEventListener('click', function (e) {
            // Toggle Like functionality
            const likeBtn = e.target.closest('.like-btn');
            if (likeBtn) {
                likeBtn.classList.toggle('liked');
                const span = likeBtn.querySelector('span');
                const i = likeBtn.querySelector('i');
                let count = parseInt(span.textContent);

                if (likeBtn.classList.contains('liked')) {
                    count++;
                    i.classList.replace('ph-heart', 'ph-heart-fill');
                } else {
                    count--;
                    i.classList.replace('ph-heart-fill', 'ph-heart');
                }
                span.textContent = count;
                return;
            }

            // Toggle Comments visibility
            const toggleBtn = e.target.closest('.comment-toggle-btn');
            if (toggleBtn) {
                const id = toggleBtn.getAttribute('data-id');
                const commentSection = document.getElementById(`comments-${id}`);
                if (commentSection) {
                    commentSection.classList.toggle('open');
                }
                return;
            }

            // Handle Add Comment (Mock)
            const commentSubmitBtn = e.target.closest('.comment-submit');
            if (commentSubmitBtn) {
                const inputArea = commentSubmitBtn.closest('.comment-input-area');
                const input = inputArea.querySelector('.comment-input');
                const anonToggle = inputArea.querySelector('.comment-anon-toggle');

                const text = input.value.trim();
                if (text) {
                    const commentsWrapper = commentSubmitBtn.closest('.comments-section');
                    const isAnon = anonToggle ? anonToggle.checked : false;
                    const authorName = isAnon ? "Anonymous" : "@You";
                    const avatarStyle = isAnon ? "background: #555" : "bg-gradient-1";

                    const newComment = document.createElement('div');
                    newComment.className = 'comment';
                    newComment.innerHTML = `
                        <div class="avatar ${isAnon ? '' : avatarStyle}" ${isAnon ? 'style="' + avatarStyle + '"' : ''}></div>
                        <div class="comment-box">
                            <strong>${authorName}</strong>
                            <span>${text}</span>
                        </div>
                    `;
                    // Insert before the add-comment input area
                    commentsWrapper.insertBefore(newComment, commentsWrapper.querySelector('.add-comment'));

                    // Reset inputs
                    input.value = '';
                    if (anonToggle) anonToggle.checked = false;

                    // Update comment count visually
                    const postId = input.getAttribute('data-post-id');
                    const cToggleBtn = document.querySelector(`.comment-toggle-btn[data-id="${postId}"]`);
                    if (cToggleBtn) {
                        let currentCount = parseInt(cToggleBtn.textContent.trim());
                        cToggleBtn.innerHTML = `<i class="ph ph-chat-circle"></i> ${currentCount + 1}`;
                    }
                }
                return;
            }
        });
    }

    // --- 4. Mock Data & Mental Discussion Render ---
    const MOCK_MENTAL_POSTS = [
        {
            id: 101,
            author: 'Anonymous Responder',
            time: '1h ago',
            content: 'I find that just taking 5 minutes to breathe before starting work completely changes my day. Anyone else have small morning rituals?',
            likes: 45,
            replies: 12,
            avatarGradient: 'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)'
        },
        {
            id: 102,
            author: 'Chris W.',
            time: '3h ago',
            content: 'Just booked my first session with a counselor through the new link above. Nervous but ready to start working through some things.',
            likes: 210,
            replies: 34,
            avatarGradient: 'linear-gradient(120deg, #f6d365 0%, #fda085 100%)'
        }
    ];

    const mentalContainer = document.getElementById('mental-discussions-container');

    function renderMentalDiscussions() {
        if (!mentalContainer) return;
        mentalContainer.innerHTML = '';

        MOCK_MENTAL_POSTS.forEach(post => {
            const postEl = document.createElement('div');
            postEl.className = 'post glass-panel mt-4';

            postEl.innerHTML = `
                <div class="post-header">
                    <div class="avatar" style="background: ${post.avatarGradient}"></div>
                    <div class="post-meta">
                        <h4>${post.author}</h4>
                        <span>${post.time}</span>
                    </div>
                </div>
                <div class="post-content">
                    <p>${post.content}</p>
                </div>
                <div class="post-footer">
                    <button class="action-btn like-btn" data-id="${post.id}">
                        <i class="ph ph-heart"></i> <span>${post.likes}</span>
                    </button>
                    <button class="action-btn">
                        <i class="ph ph-chat-circle"></i> ${post.replies} Replies
                    </button>
                </div>
            `;
            mentalContainer.appendChild(postEl);
        });
    }

    // Initialize
    renderPosts();
    renderMentalDiscussions();
    attachPostEventListeners();

    // --- 5. Auth Modal Logic ---
    const loginBtn = document.getElementById('login-btn');
    const authModal = document.getElementById('auth-modal');
    const closeModalBtns = document.querySelectorAll('.close-modal');

    if (loginBtn && authModal) {
        loginBtn.addEventListener('click', () => {
            authModal.classList.remove('hidden');
        });

        // Close when clicking the X button
        closeModalBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                authModal.classList.add('hidden');
            });
        });

        // Close when clicking outside the modal content
        authModal.addEventListener('click', (e) => {
            if (e.target === authModal) {
                authModal.classList.add('hidden');
            }
        });
    }

    // --- 6. Anonymous Posting Logic (Mock Interaction) ---
    // This adds a visual response when the user clicks 'Post' on the main areas
    const createPostCards = document.querySelectorAll('.create-post-card');

    createPostCards.forEach(card => {
        const postBtn = card.querySelector('.btn-primary');
        const anonToggle = card.querySelector('.anon-toggle');
        const inputField = card.querySelector('.post-input');

        if (postBtn && inputField) {
            postBtn.addEventListener('click', () => {
                const text = inputField.value.trim();
                if (text) {
                    const isAnon = anonToggle ? anonToggle.checked : false;
                    const authorName = isAnon ? "Anonymous User" : "@You";

                    // For the sake of the mock, we will just alert the action
                    // In a real app, this would append to the DOM list
                    alert(`Mock Success: Posted thread as ${authorName}`);

                    inputField.value = ''; // clear input
                    if (anonToggle) anonToggle.checked = false; // reset toggle
                }
            });
        }
    });

    // Fix Phosphor icons loading issue if added dynamically
    // The CDN script automatically processes icons, but for dynamic content,
    // we sometimes need to re-run the processor if they provide an API for it.
    // In this basic setup, the icons inside the template literals work fine on initial load.
});
