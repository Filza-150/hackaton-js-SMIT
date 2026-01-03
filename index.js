
      const editor = ace.edit("editor");
      editor.setTheme("ace/theme/dracula");
      editor.session.setMode("ace/mode/html");
      editor.setFontSize(14);
      editor.setOptions({
        enableBasicAutocompletion: true,
        enableLiveAutocompletion: true,
        highlightActiveLine: true,
        showLineNumbers: true,
        showGutter: true,
        showPrintMargin: false,
      });
      
      // Set monospace font for editor
      document.getElementById('editor').style.fontFamily = "'Fira Code', monospace";
      let currentFile = "";
      let currentUser = null;
      let users = JSON.parse(localStorage.getItem("users") || "{}");
      let projects = {};
      
      // Check if user is logged in on page load
      document.addEventListener('DOMContentLoaded', () => {
        const loggedInUser = localStorage.getItem('currentUser');
        if (loggedInUser) {
          currentUser = JSON.parse(loggedInUser);
          loadUserProjects();
          showApp();
        } else {
          toggleAuthModal();
        }
      });
      
      // Authentication functions
      function toggleAuthModal() {
        document.getElementById('auth-modal').classList.toggle('hidden');
      }
      
      function showSignInForm() {
        document.getElementById('signin-form').classList.remove('hidden');
        document.getElementById('signup-form').classList.add('hidden');
      }
      
      function showSignUpForm() {
        document.getElementById('signin-form').classList.add('hidden');
        document.getElementById('signup-form').classList.remove('hidden');
      }
      
      function signUp() {
        const name = document.getElementById('signup-name').value.trim();
        const email = document.getElementById('signup-email').value.trim();
        const password = document.getElementById('signup-password').value;
        const confirm = document.getElementById('signup-confirm').value;
        
        if (!name || !email || !password || !confirm) {
          showAlert("All fields are required", "error");
          return;
        }
        
        if (password !== confirm) {
          showAlert("The passwords do not match", "error");
          return;
        }
        
        if (users[email]) {
          showAlert("An account already exists with this email", "error");
          return;
        }
        
        users[email] = {
          name,
          email,
          password, // Note: In a real app, you should hash the password!
          projects: {}
        };
        
        localStorage.setItem("users", JSON.stringify(users));
        showAlert("Account created successfully", "success");
        showSignInForm();
      }
      
      function signIn() {
        const email = document.getElementById('signin-email').value.trim();
        const password = document.getElementById('signin-password').value;
        
        if (!email || !password) {
          showAlert("Email and password are required", "error");
          return;
        }
        
        const user = users[email];
        
        if (!user || user.password !== password) {
          showAlert("Email or password incorrect", "error");
          return;
        }
        
        currentUser = {
          email: user.email,
          name: user.name
        };
        
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        loadUserProjects();
        showApp();
        toggleAuthModal();
        showAlert(`Welcome ${user.name}`, "success");
      }
      
      function signOut() {
        currentUser = null;
        localStorage.removeItem('currentUser');
        hideApp();
        toggleAuthModal();
      }
      
      function loadUserProjects() {
        if (!currentUser) return;
        
        const userData = users[currentUser.email];
        if (userData && userData.projects) {
          projects = userData.projects;
        } else {
          projects = {};
        }
        
        displayProjects();
      }
      
      function saveUserProjects() {
        if (!currentUser) return;
        
        if (!users[currentUser.email]) {
          users[currentUser.email] = {
            ...currentUser,
            projects: {}
          };
        }
        
        users[currentUser.email].projects = projects;
        localStorage.setItem("users", JSON.stringify(users));
      }
      
      function showApp() {
        document.getElementById('app-container').classList.remove('hidden');
        document.getElementById('user-email').textContent = currentUser.email;
        document.getElementById('user-name').textContent = currentUser.name;
      }
      
      function hideApp() {
        document.getElementById('app-container').classList.add('hidden');
      }
      
      // Check empty state
      function checkEmptyState() {
        const emptyState = document.getElementById('empty-state');
        const projectList = document.getElementById('project-list');
        
        if (Object.keys(projects).length === 0) {
          emptyState.classList.remove('hidden');
          projectList.classList.add('hidden');
        } else {
          emptyState.classList.add('hidden');
          projectList.classList.remove('hidden');
        }
      }
      function saveFiles() {
        if (!currentUser) {
          showAlert("Veuillez vous connecter", "error");
          return;
        }
        
        const name = document.getElementById("project-name").value.trim();
        const files = document.getElementById("file-upload").files;
        
        if (!name || files.length === 0) {
          showAlert("Project name and files are required", "error");
          return;
        }
        
        if (!projects[name]) projects[name] = {};
        
        Array.from(files).forEach((file) => {
          const reader = new FileReader();
          reader.onload = () => {
            projects[name][file.name] = reader.result;
            saveUserProjects();
            displayProjects();
            showAlert(`File "${file.name}" added to the project "${name}"`, "success");
          };
          reader.readAsText(file);
        });
        
        // Reset form
        document.getElementById("project-name").value = "";
        document.getElementById("file-upload").value = "";
      }
      
      function displayProjects() {
        const container = document.getElementById("project-list");
        container.innerHTML = "";
        
        checkEmptyState();
        
        Object.entries(projects).forEach(([project, files]) => {
          const card = document.createElement("div");
          card.className = "bg-card backdrop-blur-sm border border-gray-700/50 rounded-xl p-5 shadow-lg card-hover";
          
          const header = document.createElement("div");
          header.className = "flex justify-between items-start mb-3";
          
          const title = document.createElement("h3");
          title.textContent = project;
          title.className = "text-lg font-semibold text-primary-500 truncate";
          
          const fileCount = document.createElement("span");
          fileCount.textContent = `${Object.keys(files).length} fichier${Object.keys(files).length > 1 ? 's' : ''}`;
          fileCount.className = "text-xs bg-glass2 text-gray-400 px-2 py-1 rounded-full";
          
          header.appendChild(title);
          header.appendChild(fileCount);
          card.appendChild(header);
          
          const fileList = document.createElement("div");
          fileList.className = "space-y-2 mb-4 max-h-40 overflow-y-auto pr-2";
          
          Object.keys(files).forEach((filename) => {
            const fileItem = document.createElement("div");
            fileItem.className = "file-item flex items-center justify-between bg-glass hover:bg-glass2 rounded-lg px-3 py-2 cursor-pointer transition-all";
            
            const fileInfo = document.createElement("div");
            fileInfo.className = "flex items-center";
            
            let fileIcon;
            if (filename.endsWith('.html')) {
              fileIcon = '<i class="fab fa-html5 text-orange-500 mr-2"></i>';
            } else if (filename.endsWith('.css')) {
              fileIcon = '<i class="fab fa-css3-alt text-blue-500 mr-2"></i>';
            } else if (filename.endsWith('.js')) {
              fileIcon = '<i class="fab fa-js-square text-yellow-400 mr-2"></i>';
            } else {
              fileIcon = '<i class="fas fa-file-code text-gray-400 mr-2"></i>';
            }
            
            fileInfo.innerHTML = `${fileIcon}<span class="text-sm text-gray-300 truncate">${filename}</span>`;
            
            fileItem.appendChild(fileInfo);
            
            fileItem.onclick = () => {
              editor.setValue(files[filename], -1);
              currentFile = { project, filename };
              updatePreview(files[filename]);
              document.getElementById('current-file').textContent = `${project} / ${filename}`;
              
              // Highlight active file
              document.querySelectorAll('.file-item').forEach(el => {
                el.classList.remove('border-primary-500', 'border');
              });
              fileItem.classList.add('border-primary-500', 'border');
            };
            
            fileList.appendChild(fileItem);
          });
          
          card.appendChild(fileList);
          
          const actions = document.createElement("div");
          actions.className = "flex justify-between items-center";
          
          const downloadBtn = document.createElement("button");
          downloadBtn.innerHTML = '<i class="fas fa-file-archive mr-2"></i> ZIP';
          downloadBtn.className = "text-xs bg-glass hover:bg-glass2 text-gray-300 px-3 py-1 rounded-md transition-all";
          downloadBtn.onclick = (e) => {
            e.stopPropagation();
            downloadProject(project, files);
          };
          
          const deleteBtn = document.createElement("button");
          deleteBtn.innerHTML = '<i class="fas fa-trash-alt mr-2"></i>';
          deleteBtn.className = "text-xs bg-glass hover:bg-red-500/20 text-red-400 px-3 py-1 rounded-md transition-all";
          deleteBtn.onclick = (e) => {
            e.stopPropagation();
            if (confirm(`Delete the project. "${project}" ?`)) {
              delete projects[project];
              saveUserProjects();
              displayProjects();
              showAlert(`Projet "${project}" Deleted.`, "success");
              
              // Clear editor if deleted file was open
              if (currentFile && currentFile.project === project) {
                editor.setValue("", -1);
                document.getElementById('preview-frame').srcdoc = "";
                document.getElementById('current-file').textContent = "No file selected.";
                currentFile = "";
              }
            }
          };
          
          actions.appendChild(downloadBtn);
          actions.appendChild(deleteBtn);
          card.appendChild(actions);
          
          container.appendChild(card);
        });
      }
      
      function saveToFile() {
        if (!currentUser) {
          showAlert("Veuillez vous connecter", "error");
          return;
        }
        
        if (!currentFile) {
          showAlert("Aucun fichier ouvert", "error");
          return;
        }
        
        projects[currentFile.project][currentFile.filename] = editor.getValue();
        saveUserProjects();
        updatePreview(editor.getValue());
        showAlert("File saved successfully", "success");
      }
      
      function updatePreview(code) {
        document.getElementById("preview-frame").srcdoc = code;
      }
      
      function refreshPreview() {
        if (currentFile) {
          updatePreview(editor.getValue());
        }
      }
      
      function downloadProject(name, files) {
        const zip = new JSZip();
        Object.entries(files).forEach(([filename, content]) => {
          zip.file(filename, content);
        });
        zip.generateAsync({ type: "blob" }).then((blob) => {
          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.download = `${name}.zip`;
          link.click();
          showAlert(`Projet "${name}" Downloaded`, "success");
        });
      }
      
      function searchProjects() {
        const query = document.getElementById("search-input").value.toLowerCase();
        const cards = document.querySelectorAll("#project-list > div");
        let hasResults = false;
        
        cards.forEach((card) => {
          const text = card.textContent.toLowerCase();
          const isVisible = text.includes(query);
          card.style.display = isVisible ? "block" : "none";
          
          if (isVisible) hasResults = true;
        });
        
        // Show empty state if no results
        const emptyState = document.getElementById('empty-state');
        if (!hasResults && query !== '') {
          emptyState.classList.remove('hidden');
          emptyState.querySelector('h4').textContent = "No results found.";
          emptyState.querySelector('p').textContent = "Try with another search term.";
        } else {
          emptyState.classList.add('hidden');
        }
      }
      
      // Show alert notification
      function showAlert(message, type) {
        const alert = document.createElement('div');
        alert.className = `fixed top-6 right-6 px-6 py-3 rounded-lg shadow-lg text-white font-medium flex items-center space-x-3 z-50 animate-fade-in ${
          type === 'error' ? 'bg-red-500' : 'bg-accent-500'
        }`;
        
        alert.innerHTML = `
          <i class="fas ${type === 'error' ? 'fa-exclamation-circle' : 'fa-check-circle'}"></i>
          <span>${message}</span>
        `;
        
        document.body.appendChild(alert);
        
        setTimeout(() => {
          alert.classList.add('animate-fade-out');
          setTimeout(() => alert.remove(), 300);
        }, 3000);
      }
      
      // Add animation styles
      const style = document.createElement('style');
      style.textContent = `
        @keyframes animate-fade-in {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
         @keyframes animate-fade-out {
          to { opacity: 0; transform: translateY(-20px); }
        }
        
        @keyframes animate-float {
          0% { transform: translateY(0) translateX(0); opacity: 1; }
          100% { transform: translateY(-100px) translateX(20px); opacity: 0; }
        }
        
        .animate-fade-in {
          animation: animate-fade-in 0.3s ease-out forwards;
        }
        
        .animate-fade-out {
          animation: animate-fade-out 0.3s ease-out forwards;
        }
        
        .animate-float {
          animation: animate-float 8s ease-in-out infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        .animation-delay-6000 {
          animation-delay: 6s;
        }
      `;
      document.head.appendChild(style);
   