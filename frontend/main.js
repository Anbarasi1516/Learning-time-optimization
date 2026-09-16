const state = {
  user: null,
  subjects: [],
  progress: [],
  todayPlan: [],
  secondaryPlan: []
};

/* START */

window.addEventListener("DOMContentLoaded", () => {

  bindEvents();

  loadUser();

  if(state.user){
    enterApp();
  }

});

/* EVENTS */

function bindEvents(){

  document.getElementById("showRegister")
    .addEventListener("click", () => {

      document.getElementById("loginCard").classList.add("hidden");
      document.getElementById("registerCard").classList.remove("hidden");

    });

  document.getElementById("showLogin")
    .addEventListener("click", () => {

      document.getElementById("registerCard").classList.add("hidden");
      document.getElementById("loginCard").classList.remove("hidden");

    });

  document.getElementById("registerForm")
    .addEventListener("submit", registerUser);

  document.getElementById("loginForm")
    .addEventListener("submit", loginUser);

  document.getElementById("subjectForm")
    .addEventListener("submit", addSubject);

  document.getElementById("progressForm")
    .addEventListener("submit", updateProgress);

  document.getElementById("generatePlanBtn")
    .addEventListener("click", generateAIPlan);

  document.getElementById("newQuoteBtn")
    .addEventListener("click", showRandomQuote);
  
  document.getElementById("progressQuoteBtn")
    .addEventListener("click", showProgressQuote);

  document.getElementById("secondaryBtn")
    .addEventListener("click", generateSecondaryPlan);

  document.getElementById("logoutBtn")
    .addEventListener("click", logout);

  document.querySelectorAll("nav button[data-page]")
    .forEach(btn => {

      btn.addEventListener("click", () => {

        showPage(btn.dataset.page);

      });

    });

}

/* USER */

function registerUser(e){

  e.preventDefault();

  const user = {
    name: document.getElementById("registerName").value,
    email: document.getElementById("registerEmail").value,
    password: document.getElementById("registerPassword").value,
    dailyHours: document.getElementById("registerDailyHours").value
  };

  localStorage.setItem("user", JSON.stringify(user));

  alert("Registration Successful");

  state.user = user;

  enterApp();

}

function loginUser(e){

  e.preventDefault();

  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  const savedUser = JSON.parse(localStorage.getItem("user"));

  if(
    savedUser &&
    savedUser.email === email &&
    savedUser.password === password
  ){

    state.user = savedUser;

    alert("Login Successful");

    enterApp();

  }else{
    alert("Invalid Email or Password");
  }

}

function logout(){

  location.reload();

}

function loadUser(){

  const user = localStorage.getItem("user");

  if(user){
    state.user = JSON.parse(user);
  }

}

/* APP */

function enterApp(){

  document.getElementById("authPage").classList.add("hidden");

  document.getElementById("mainNav").classList.remove("hidden");

  loadSubjects();

  loadProgress();

  renderSubjects();

  renderProgress();

  renderDashboard();

  showPage("dashboardPage");

}

function showPage(id){

  document.querySelectorAll(".page")
    .forEach(page => page.classList.add("hidden"));

  document.getElementById(id).classList.remove("hidden");

}

/* SUBJECT */

function addSubject(e){

  e.preventDefault();

  const subject = {
    id: Date.now(),
    name: document.getElementById("subjectName").value,
    difficulty: document.getElementById("subjectDifficulty").value,
    priority: document.getElementById("subjectPriority").value,
    examDate: document.getElementById("subjectExamDate").value
  };

  state.subjects.push(subject);

  saveSubjects();

  renderSubjects();

  renderDashboard();

  alert("Subject Added");

  document.getElementById("subjectForm").reset();

}

function renderSubjects(){

  const list = document.getElementById("subjectList");

  if(state.subjects.length === 0){

    list.innerHTML = "<p>No Subjects Added</p>";
    return;

  }

  list.innerHTML = state.subjects.map(subject => `

    <div class="subject-card">

      <div class="subject-top">

        <div>
          <h3>${subject.name}</h3>
          <p>${subject.difficulty} | ${subject.priority}</p>
          <p>Exam: ${subject.examDate}</p>
        </div>

        <button
          class="delete-btn"
          onclick="deleteSubject(${subject.id})"
        >
          Delete
        </button>

      </div>

    </div>

  `).join("");

  renderSubjectOptions();

}

function deleteSubject(id){

  state.subjects = state.subjects.filter(s => s.id !== id);

  saveSubjects();

  renderSubjects();

  renderDashboard();

}

/* STORAGE */

function saveSubjects(){

  localStorage.setItem(
    "subjects",
    JSON.stringify(state.subjects)
  );

}

function loadSubjects(){

  const subjects = localStorage.getItem("subjects");

  if(subjects){
    state.subjects = JSON.parse(subjects);
  }

}

/* PROGRESS */

function updateProgress(e){

  e.preventDefault();

  const item = {
    subject: document.getElementById("progressSubject").value,
    hours: Number(document.getElementById("hoursStudied").value),
    score: Number(document.getElementById("performanceScore").value),
    completed: document.getElementById("progressStatus").value === "COMPLETED"
  };

  state.progress.push(item);

  saveProgress();

  renderProgress();

  renderDashboard();

  alert("Progress Updated");

}

function renderProgress(){

  const box = document.getElementById("progressSummary");

  if(state.progress.length === 0){

    box.innerHTML = "<p>No Progress Yet</p>";
    renderProgressOverview();
    return;

  }

  box.innerHTML = state.progress.map(p => `

    <div class="plan-card">
      <h3>${p.subject}</h3>
      <p>Hours: ${p.hours}</p>
      <p>Score: ${p.score}</p>
      <p class="status-text ${isCompleted(p) ? "status-complete" : ""}">${isCompleted(p) ? "Completed" : "In progress"}</p>
      <div class="subject-progress-bar" aria-label="${p.subject} score ${p.score}%">
        <div class="progress-fill" style="width:${Math.min(Math.max(p.score, 0), 100)}%"></div>
      </div>
    </div>

  `).join("");
  
  renderProgressOverview();

}

function renderSubjectOptions(){

  const select = document.getElementById("progressSubject");

  select.innerHTML = state.subjects.map(subject => `
    <option value="${subject.name}">
      ${subject.name}
    </option>
  `).join("");

}

function saveProgress(){

  localStorage.setItem(
    "progress",
    JSON.stringify(state.progress)
  );

}

function loadProgress(){

  const progress = localStorage.getItem("progress");

  if(progress){
    state.progress = JSON.parse(progress);
  }

}

/* AI PLAN */

function generateAIPlan(){

  if(state.subjects.length === 0){

    alert("Add subjects first");
    return;

  }

  const sorted = [...state.subjects].sort((a,b)=>{

    const priority = {
      HIGH:3,
      MEDIUM:2,
      LOW:1
    };

    return priority[b.priority] - priority[a.priority];

  });

  state.todayPlan = sorted.map((subject,index)=>({

    ...subject,
    time: `${9 + index}:00 AM`,
    missed:false

  }));

  renderTodayPlan();

}

function renderTodayPlan(){

  const list = document.getElementById("todayPlanList");

  list.innerHTML = state.todayPlan.map((item,index)=>`

    <div class="plan-card ${item.missed ? "missed" : ""}">

      <h3>${item.name}</h3>

      <p>Time: ${item.time}</p>

      <p>Difficulty: ${item.difficulty}</p>

      <p>Priority: ${item.priority}</p>

      <button onclick="markMissed(${index})">
        Mark Missed
      </button>

    </div>

  `).join("");

}

function markMissed(index){

  state.todayPlan[index].missed = true;

  renderTodayPlan();

}

/* SECONDARY PLAN */

function generateSecondaryPlan(){

  const missed = state.todayPlan.filter(item => item.missed);

  if(missed.length === 0){

    alert("No missed sessions");
    return;

  }

  state.secondaryPlan = missed.map((item,index)=>({

    ...item,
    recoveryTime:`${6 + index}:00 PM`

  }));

  const list = document.getElementById("secondaryPlanList");

  document.getElementById("secondaryContainer")
    .classList.remove("hidden");

  list.innerHTML = state.secondaryPlan.map(item=>`

    <div class="plan-card">

      <h3>${item.name}</h3>

      <p>Recovery Time: ${item.recoveryTime}</p>

      <p>Focus Revision Session</p>

    </div>

  `).join("");

}

/* DASHBOARD */

function renderDashboard(){

  document.getElementById("totalSubjects")
    .textContent = state.subjects.length;

  const totalHours = state.progress.reduce(
    (sum,p)=>sum+p.hours,
    0
  );

  document.getElementById("totalHours")
    .textContent = totalHours;

  const high = state.subjects.find(
    s => s.priority === "HIGH"
  );

  document.getElementById("prioritySubject")
    .textContent = high ? high.name : "None";

  const studiedNames = new Set(state.progress.map(item => item.subject));
  const completed = getCompletedProgress();

  document.getElementById("studiedSubjects")
    .textContent = studiedNames.size;

  document.getElementById("completedSubjects")
    .textContent = completed.length;

  document.getElementById("achievementCount")
    .textContent = getAchievements().length;

  renderAchievements();
  renderCompletedSubjects(completed);
  showRandomQuote(false);

  renderChart();

}

const quotes = [
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "Success is the sum of small efforts, repeated day in and day out.", author: "Robert Collier" },
  { text: "It always seems impossible until it is done.", author: "Nelson Mandela" },
  { text: "A little progress each day adds up to big results.", author: "Unknown" },
  { text: "You do not have to be perfect. You just have to keep going.", author: "Unknown" }
];

function isCompleted(progressItem){
  return progressItem.completed === true || progressItem.score >= 70;
}

function getCompletedProgress(){
  const latestBySubject = new Map();

  state.progress.forEach(item => latestBySubject.set(item.subject, item));

  return [...latestBySubject.values()].filter(isCompleted);
}

function getAchievements(){
  const achievements = [];
  const totalHours = state.progress.reduce((sum, item) => sum + item.hours, 0);
  const completed = getCompletedProgress();

  if(state.subjects.length > 0) achievements.push({ title: "Learning journey started", detail: `${state.subjects.length} subject${state.subjects.length === 1 ? "" : "s"} on your list` });
  if(totalHours >= 5) achievements.push({ title: "Focused learner", detail: `${totalHours} hours invested` });
  if(completed.length > 0) achievements.push({ title: "First finish line", detail: `${completed.length} subject${completed.length === 1 ? "" : "s"} completed` });
  if(completed.length >= 3) achievements.push({ title: "Momentum builder", detail: "Three subjects completed" });

  return achievements;
}

function renderAchievements(){
  const list = document.getElementById("achievementList");
  const achievements = getAchievements();

  list.innerHTML = achievements.length === 0
    ? '<p class="empty-state">Your first achievement is waiting. Log a study session to begin.</p>'
    : achievements.map(item => `
      <div class="achievement-item">
        <span class="achievement-icon">✓</span>
        <div><strong>${item.title}</strong><span>${item.detail}</span></div>
      </div>
    `).join("");
}

function renderCompletedSubjects(completed){
  const list = document.getElementById("completedSubjectList");

  list.innerHTML = completed.length === 0
    ? '<p class="empty-state">Complete a subject from the Progress page and it will appear here.</p>'
    : completed.map(item => `
      <div class="completed-subject">
        <div><strong>${item.subject}</strong><span>${item.hours} hours studied</span></div>
        <span class="score-badge">${item.score}%</span>
      </div>
    `).join("");
}

function showRandomQuote(changeQuote = true){
  const quote = changeQuote
    ? quotes[Math.floor(Math.random() * quotes.length)]
    : quotes[0];

  document.getElementById("inspirationQuote").textContent = quote.text;
  document.getElementById("quoteAuthor").textContent = quote.author;
}

function renderProgressOverview(){
  const completed = getCompletedProgress().length;
  const totalSubjects = state.subjects.length;
  const percentage = totalSubjects === 0
    ? 0
    : Math.round((completed / totalSubjects) * 100);

  document.getElementById("overallProgressBar").style.width = `${Math.min(percentage, 100)}%`;
  document.getElementById("overallProgressLabel").textContent = `${percentage}% complete`;
  document.getElementById("progressCountLabel").textContent = `${completed} of ${totalSubjects} subjects`;

  document.getElementById("progressHeadline").textContent = totalSubjects === 0
    ? "Start your first study session"
    : percentage === 100 ? "Every subject completed" : `${percentage}% of your subjects completed`;

  document.getElementById("progressOverviewText").textContent = state.progress.length === 0
    ? "Log your hours and performance to see your learning journey grow."
    : `${state.progress.length} study update${state.progress.length === 1 ? "" : "s"} logged. Keep the momentum going.`;
}

function showProgressQuote(){
  const quote = quotes[Math.floor(Math.random() * quotes.length)];

  document.getElementById("progressQuote").textContent = quote.text;
  document.getElementById("progressQuoteAuthor").textContent = quote.author;
}

function renderChart(){

  const ctx = document.getElementById("studyChart");
  const fallback = document.getElementById("studyChartFallback");

  if(!ctx) return;

  if(typeof Chart === "undefined"){
    ctx.classList.add("hidden");
    fallback.classList.remove("hidden");
    return;
  }

  ctx.classList.remove("hidden");
  fallback.classList.add("hidden");

  const labels = state.progress.map(p=>p.subject);

  const data = state.progress.map(p=>p.hours);

  if(window.studyChartInstance){
    window.studyChartInstance.destroy();
  }

  window.studyChartInstance = new Chart(ctx,{

    type:"bar",

    data:{
      labels,
      datasets:[{
        label:"Study Hours",
        data
      }]
    }

  });

}