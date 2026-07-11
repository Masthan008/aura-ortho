import { 
  createIcons, 
  Activity, 
  Shield, 
  Award, 
  Clock, 
  Star, 
  ChevronRight, 
  ChevronDown,
  ArrowRight, 
  MapPin, 
  Phone, 
  Mail, 
  User, 
  Menu, 
  X, 
  Send, 
  Calendar,
  Heart,
  Zap,
  Smile,
  GraduationCap,
  Briefcase,
  FileText,
  Download,
  Search,
  Check,
  CheckCircle,
  MessageSquare,
  Eye
} from 'lucide';

// Register and create Lucide icons globally
window.addEventListener('DOMContentLoaded', () => {
  createIcons({
    icons: {
      Activity,
      Shield,
      Award,
      Clock,
      Star,
      ChevronRight,
      ChevronDown,
      ArrowRight,
      MapPin,
      Phone,
      Mail,
      User,
      Menu,
      X,
      Send,
      Calendar,
      Heart,
      Zap,
      Smile,
      GraduationCap,
      Briefcase,
      FileText,
      Download,
      Search,
      Check,
      CheckCircle,
      MessageSquare,
      Eye
    }
  });

  // Execute general micro-interactions
  initPageLoader();
  initStickyNavbar();
  initScrollProgress();
  initCursorReactiveGlass();
  initMobileMenu();
  initChatWidget();
  initScrollReveal();
});

// 1. Custom Page Loader (Condensing blur transition on load)
function initPageLoader() {
  const loader = document.getElementById('page-loader');
  if (loader) {
    window.addEventListener('load', () => {
      // Small timeout to appreciate the anti-gravity loader spinner
      setTimeout(() => {
        loader.classList.add('fade-out');
        // Let the reveal transitions fire shortly after loader closes
        setTimeout(() => {
          triggerScrollReveal();
        }, 300);
      }, 800);
    });
  }
}

// 2. Sticky Glass Navbar: shrink and increase backdrop blur on scroll
function initStickyNavbar() {
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navbar.classList.add('shrunk');
      } else {
        navbar.classList.remove('shrunk');
      }
    });
  }
}

// 3. Scroll Progress Bar
function initScrollProgress() {
  const progressBar = document.getElementById('scroll-progress');
  if (progressBar) {
    window.addEventListener('scroll', () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight > 0) {
        const scrolled = (window.scrollY / scrollHeight) * 100;
        progressBar.style.width = `${scrolled}%`;
      }
    });
  }
}

// 4. Cursor-Reactive Glass Panels (3D perspective tilt)
function initCursorReactiveGlass() {
  const tiltCards = document.querySelectorAll('.glass-card-tilt');
  
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left; // x position within element
      const y = e.clientY - rect.top;  // y position within element
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      // Calculate rotation angles (max 5 degrees)
      const rotateX = ((centerY - y) / centerY) * 5;
      const rotateY = ((x - centerX) / centerX) * 5;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
      card.style.transition = 'transform 0.1s ease';
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
      card.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
    });
  });
}

// 5. Mobile full-screen glass menu
function initMobileMenu() {
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileMenu = document.getElementById('mobile-menu-overlay');
  const closeMenu = document.getElementById('mobile-menu-close');
  const menuLinks = document.querySelectorAll('.mobile-menu-link');

  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => {
      mobileMenu.classList.add('active');
      document.body.style.overflow = 'hidden'; // Lock background scroll
    });

    const hideMenu = () => {
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    };

    if (closeMenu) closeMenu.addEventListener('click', hideMenu);
    
    menuLinks.forEach(link => {
      link.addEventListener('click', hideMenu);
    });
  }
}

// 6. Live Chat Widget (Opens glass bubble panel + automated responses)
function initChatWidget() {
  const chatBubble = document.getElementById('chat-bubble');
  const chatPanel = document.getElementById('chat-panel');
  const chatClose = document.getElementById('chat-close');
  const chatForm = document.getElementById('chat-form');
  const chatInput = document.getElementById('chat-input');
  const chatMessages = document.getElementById('chat-messages');

  if (chatBubble && chatPanel) {
    // Open panel
    chatBubble.addEventListener('click', (e) => {
      e.stopPropagation();
      chatPanel.classList.toggle('active');
    });

    // Close panel
    if (chatClose) {
      chatClose.addEventListener('click', (e) => {
        e.stopPropagation();
        chatPanel.classList.remove('active');
      });
    }

    // Close on click outside panel
    document.addEventListener('click', (e) => {
      if (chatPanel.classList.contains('active') && !chatPanel.contains(e.target) && e.target !== chatBubble) {
        chatPanel.classList.remove('active');
      }
    });

    // Handle Form Send
    if (chatForm && chatInput && chatMessages) {
      chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = chatInput.value.trim();
        if (!text) return;

        // Append User Message
        appendMessage('user', text);
        chatInput.value = '';

        // Simulate receptionist response
        setTimeout(() => {
          let reply = "Thank you for reaching out. Would you like to schedule an appointment with one of our orthopedic specialists?";
          if (text.toLowerCase().includes('pain') || text.toLowerCase().includes('hurt')) {
            reply = "I'm sorry to hear that you are in pain. We have sports medicine and joint care specialists available. Please use our booking page to reserve an urgent slot, or let me know your preferred date.";
          } else if (text.toLowerCase().includes('doctor') || text.toLowerCase().includes('physician')) {
            reply = "We have five leading orthopedic specialists at our clinic. You can review their full profiles on our Doctors page or book directly through the booking wizard.";
          }
          appendMessage('bot', reply);
        }, 1000);
      });
    }
  }

  function appendMessage(sender, text) {
    if (!chatMessages) return;
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('chat-msg', sender);
    msgDiv.textContent = text;
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
}

// 7. Scroll-Triggered Reveals: blur-to-focus condensation
function initScrollReveal() {
  window.addEventListener('scroll', triggerScrollReveal);
  triggerScrollReveal(); // Trigger once on load
}

function triggerScrollReveal() {
  const reveals = document.querySelectorAll('.scroll-reveal');
  const triggerBottom = window.innerHeight * 0.85;

  reveals.forEach(reveal => {
    const revealTop = reveal.getBoundingClientRect().top;
    if (revealTop < triggerBottom) {
      reveal.classList.add('revealed');
    }
  });
}
