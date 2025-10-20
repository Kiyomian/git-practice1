<!-- SCRIPTS -->  <script>
    // Utility: Local Storage helpers
    const db = {
      get(key, fallback){
        try{ return JSON.parse(localStorage.getItem(key)) ?? fallback }catch{ return fallback }
      },
      set(key, value){ localStorage.setItem(key, JSON.stringify(value)) }
    };

    // Countdown timers
    function startCountdowns(){
      const nodes = document.querySelectorAll('.countdown');
      function tick(){
        nodes.forEach(node=>{
          const deadline = new Date(node.getAttribute('data-deadline'));
          const now = new Date();
          const diff = deadline - now;
          const dd = node.querySelector('[data-dd]');
          const hh = node.querySelector('[data-hh]');
          const mm = node.querySelector('[data-mm]');
          const ss = node.querySelector('[data-ss]');
          if(diff <= 0){
            dd.textContent = hh.textContent = mm.textContent = ss.textContent = '00';
            node.setAttribute('aria-label','Event started');
            return;
          }
          const sec = Math.floor(diff/1000);
          const days = Math.floor(sec/86400);
          const hours = Math.floor((sec%86400)/3600);
          const mins = Math.floor((sec%3600)/60);
          const secs = sec%60;
          dd.textContent = String(days).padStart(2,'0');
          hh.textContent = String(hours).padStart(2,'0');
          mm.textContent = String(mins).padStart(2,'0');
          ss.textContent = String(secs).padStart(2,'0');
        });
      }
      tick();
      setInterval(tick,1000);
    }

    // Registration form logic
    function handleRegistration(){
      const form = document.getElementById('registrationForm');
      const status = document.getElementById('regStatus');
      form.addEventListener('submit', (e)=>{
        e.preventDefault();
        const data = Object.fromEntries(new FormData(form).entries());
        // simple validation
        if(!data.username || !data.password){
          alert('Please set a username and password.');
          return;
        }
        const users = db.get('ft_users', {});
        if(users[data.username]){
          alert('Username already exists. Please choose another.');
          return;
        }
        users[data.username] = {
          profile:{
            firstName:data.firstName,lastName:data.lastName,dob:data.dob,academicStatus:data.academicStatus,
            house:data.house,phone:data.phone,email:data.email,message:data.message
          },
          auth:{ password:data.password }
        };
        db.set('ft_users', users);
        db.set('ft_session',{ user:data.username });
        form.reset();
        status.style.display='block';
        updateAuthUI();
        setTimeout(()=>{ status.style.display='none'; location.hash = '#home'; }, 1200);
      })
    }

    // Sign in logic
    function handleSignIn(){
      const form = document.getElementById('signInForm');
      const msg = document.getElementById('loginStatus');
      form.addEventListener('submit', (e)=>{
        e.preventDefault();
        const user = form.loginUser.value.trim();
        const pass = form.loginPass.value;
        const users = db.get('ft_users',{});
        if(users[user] && users[user].auth.password === pass){
          db.set('ft_session',{ user });
          msg.style.display='block'; msg.style.color='#15803d'; msg.textContent='Signed in ✓';
          updateAuthUI();
          setTimeout(()=>{ location.hash = '#home'; msg.style.display='none'; }, 800);
        } else {
          msg.style.display='block'; msg.style.color='#b91c1c'; msg.textContent='Invalid credentials';
        }
      })
    }

    // Auth UI updates
    function updateAuthUI(){
      const pill = document.getElementById('userPill');
      const who = document.getElementById('whoami');
      const signinBtn = document.getElementById('btnSignIn');
      const signupBtn = document.getElementById('btnSignUp');
      const session = db.get('ft_session', null);
      if(session?.user){
        pill.style.display='flex';
        who.textContent = session.user;
        signinBtn.textContent = 'Sign Out';
        signupBtn.textContent = 'My Profile';
      } else {
        pill.style.display='none';
        signinBtn.textContent = 'Sign In';
        signupBtn.textContent = 'Register';
      }
    }

    // Header buttons
    function wireHeaderActions(){
      document.getElementById('btnSignIn').addEventListener('click', ()=>{
        const session = db.get('ft_session', null);
        if(session?.user){ // sign out
          localStorage.removeItem('ft_session');
          updateAuthUI();
        } else {
          location.hash = '#signin';
        }
      });
      document.getElementById('btnSignUp').addEventListener('click', ()=>{
        const session = db.get('ft_session', null);
        if(session?.user){
          alert('Signed in as '+session.user+'\n\n(In a real system this would open the profile page.)');
        } else {
          location.hash = '#register';
        }
      });
    }

    // Contact form (demo)
    function handleContact(){
      const form = document.getElementById('contactForm');
      const status = document.getElementById('contactStatus');
      form.addEventListener('submit', (e)=>{
        e.preventDefault();
        status.style.display='block';
        setTimeout(()=>{ status.style.display='none'; form.reset(); }, 1200);
      })
    }

    // Footer year
    document.getElementById('year').textContent = new Date().getFullYear();

    // Init
    startCountdowns();
    handleRegistration();
    handleSignIn();
    updateAuthUI();
    wireHeaderActions();
    handleContact();
  </script>