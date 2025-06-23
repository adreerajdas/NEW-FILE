// Toggle sidebar function
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  sidebar.classList.toggle('expanded');
  
  // Toggle aria-expanded for accessibility
  const menuToggle = document.querySelector('.menu-toggle');
  const isExpanded = sidebar.classList.contains('expanded');
  menuToggle.setAttribute('aria-expanded', isExpanded);
}

// Theme toggle functionality
const themeSwitch = document.getElementById('themeSwitch');

// Check for saved theme preference
if (localStorage.getItem('theme') === 'dark') {
  document.body.classList.add('dark');
  themeSwitch.checked = true;
}

// Toggle theme and save preference
themeSwitch.addEventListener('change', function() {
  if (this.checked) {
    document.body.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  } else {
    document.body.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  }
});

// Start Voting button functionality
document.getElementById('startVotingBtn').addEventListener('click', function() {
  // Scroll to footer
  document.getElementById('mainFooter').scrollIntoView({ behavior: 'smooth' });
  
  // Add visual feedback
  this.classList.add('clicked');
  setTimeout(() => {
    this.classList.remove('clicked');
  }, 300);
});

// Close sidebar when clicking outside
document.addEventListener('click', function(event) {
  const sidebar = document.getElementById('sidebar');
  const menuToggle = document.querySelector('.topbar .menu-toggle');
  const closeBtn = document.querySelector('.close-sidebar');
  
  // Only close if sidebar is expanded and click is outside
  if (sidebar.classList.contains('expanded') && 
      !sidebar.contains(event.target) && 
      !menuToggle.contains(event.target) &&
      event.target !== closeBtn) {
    sidebar.classList.remove('expanded');
    menuToggle.setAttribute('aria-expanded', 'false');
  }
});

// Close sidebar when pressing Escape key
document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape') {
    const sidebar = document.getElementById('sidebar');
    if (sidebar.classList.contains('expanded')) {
      sidebar.classList.remove('expanded');
      document.querySelector('.menu-toggle').setAttribute('aria-expanded', 'false');
    }
  }
});