const progressBar = document.querySelector("#readProgress");
const readingTime = document.querySelector("#readingTime");
const sections = [...document.querySelectorAll("[data-section-nav], .article-section[id]")];
const navLinks = [...document.querySelectorAll(".top-nav a, .toc a")];
const filterButtons = [...document.querySelectorAll(".filter-button")];
const methodCards = [...document.querySelectorAll(".method-card")];
const storyPlot = document.querySelector(".storyline-plot");
const storyNodes = [...document.querySelectorAll(".story-node")];
const storyPreview = document.querySelector("#storyPreview");
const storyDetail = document.querySelector("#storyDetail");

function updateProgress() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0;
  progressBar.style.width = `${progress * 100}%`;
}

function updateReadingTime() {
  const articleText = document.querySelector(".article")?.innerText || "";
  const words = articleText.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 210));
  readingTime.textContent = `${minutes} min`;
}

function setActiveSection(id) {
  navLinks.forEach((link) => {
    const isActive = link.getAttribute("href") === `#${id}`;
    link.classList.toggle("active", isActive);
  });
}

const sectionObserver = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (visible?.target?.id) {
      setActiveSection(visible.target.id);
    }
  },
  {
    rootMargin: "-25% 0px -55% 0px",
    threshold: [0.08, 0.2, 0.4],
  }
);

sections.forEach((section) => sectionObserver.observe(section));

function updateStoryPreview(node) {
  if (!storyPreview) return;
  storyPreview.textContent = node.dataset.summary;
}

function updateStoryDetail(node) {
  if (!storyDetail) return;

  storyNodes.forEach((item) => {
    const isActive = item === node;
    item.classList.toggle("active", isActive);
    item.setAttribute("aria-pressed", String(isActive));
  });

  const era = storyDetail.querySelector(".story-era");
  const title = storyDetail.querySelector("h3");
  const paragraphs = storyDetail.querySelectorAll("p");
  const listItems = storyDetail.querySelectorAll("li");
  const link = storyDetail.querySelector("a");

  era.textContent = node.dataset.era;
  title.textContent = node.dataset.title;
  paragraphs[1].textContent = node.dataset.detail;
  listItems[0].textContent = `Representative: ${node.dataset.papers}`;
  listItems[1].textContent = node.dataset.shift;
  link.href = node.dataset.link;
  link.textContent = node.dataset.linkLabel;
}

function showLinkedMethod(event) {
  const targetId = event.currentTarget.hash?.slice(1);
  const target = targetId ? document.getElementById(targetId) : null;

  if (!target?.classList.contains("method-card")) return;

  filterButtons.forEach((item) => item.classList.toggle("active", item.dataset.filter === "all"));
  methodCards.forEach((card) => card.classList.remove("is-hidden", "method-highlight"));
  target.classList.add("method-highlight");

  window.setTimeout(() => target.classList.remove("method-highlight"), 1800);
}

storyNodes.forEach((node) => {
  node.addEventListener("pointerenter", () => updateStoryPreview(node));
  node.addEventListener("focus", () => updateStoryPreview(node));
  node.addEventListener("click", () => {
    updateStoryPreview(node);
    updateStoryDetail(node);
    storyPlot?.classList.add("has-interacted");
  });
});

storyNodes.forEach((node) => {
  node.setAttribute("aria-pressed", String(node.classList.contains("active")));
});

storyDetail?.querySelector("a")?.addEventListener("click", showLinkedMethod);

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((item) => item.classList.toggle("active", item === button));
    methodCards.forEach((card) => {
      const shouldShow = filter === "all" || card.dataset.family === filter;
      card.classList.toggle("is-hidden", !shouldShow);
    });
  });
});

window.addEventListener("scroll", updateProgress, { passive: true });
window.addEventListener("resize", updateProgress);

updateReadingTime();
updateProgress();
