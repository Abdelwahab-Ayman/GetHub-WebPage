const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

$('#year').textContent = new Date().getFullYear();

// Scroll progress bar
const prog = $('#prog'), root = document.documentElement;
addEventListener('scroll', () => {
  prog.style.width = (root.scrollTop / (root.scrollHeight - root.clientHeight) * 100) + '%';
}, { passive: true });

// Reveal sections on scroll
const rv = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      rv.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });
$$('.rv').forEach(el => rv.observe(el));

// Highlight current nav link
const navLinks = $$('nav a');
const navObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navLinks.forEach(a => {
        if (a.getAttribute('href') === '#' + e.target.id) {
          a.setAttribute('aria-current', 'true');
        } else {
          a.removeAttribute('aria-current');
        }
      });
    }
  });
}, { rootMargin: '-35% 0px -55% 0px' });
navLinks.forEach(a => {
  const target = $(a.getAttribute('href'));
  if (target) navObserver.observe(target);
});

// Typing headline rotating words
if (!reduce) {
  const words = ['offline', 'on a flight', 'behind a firewall', 'with zero lag', 'without sign-in'];
  const rotEl = $('#rot');
  let w = 0, i = words[0].length, del = true;
  (function tick() {
    const word = words[w];
    i += del ? -1 : 1;
    rotEl.textContent = word.slice(0, i);
    let delay = del ? 35 : 75;
    if (!del && i === word.length) {
      del = true;
      delay = 2000;
    } else if (del && i === 0) {
      del = false;
      w = (w + 1) % words.length;
      delay = 320;
    }
    setTimeout(tick, delay);
  })();
}

// Interactive Live Demo Files & Data
const files = {
  'src/Program.cs': '// Program.cs - GetHub application entry point\nusing System;\nusing System.Windows.Forms;\nusing GetHub.Forms;\nusing GetHub.Services;\n\nnamespace GetHub\n{\n    static class Program\n    {\n        [STAThread]\n        static void Main()\n        {\n            Application.EnableVisualStyles();\n            Application.SetCompatibleTextRenderingDefault(false);\n\n            RepoStore store = new RepoStore();\n            Application.Run(new MainForm(store));\n        }\n    }\n}',
  'src/GitHubDownloader.cs': '// GitHubDownloader.cs - Streaming & MAX_PATH segment budgeting\npublic async Task<RepoRecord> DownloadAsync(\n    RepoReference reference,\n    IProgress<DownloadProgress> progress,\n    CancellationToken cancellationToken)\n{\n    var info = await FetchRepoInfoAsync(reference.Owner, reference.Name);\n    var targetPath = _store.GetRepositoryPath(info.Owner, info.Name);\n\n    // Stream and extract archive with deep segment budgeting\n    await DownloadArchiveAsync(info.ArchiveUrl, targetPath, progress);\n    return await FetchDetailsAsync(record, cancellationToken);\n}',
  'src/CommitGraphView.cs': '// CommitGraphView.cs - Custom GDI+ commit graph painter\nprotected override void OnPaint(PaintEventArgs e)\n{\n    Graphics graphics = e.Graphics;\n    graphics.SmoothingMode = SmoothingMode.AntiAlias;\n\n    for (int i = 0; i < _rows.Count; i++)\n    {\n        DrawCommitNode(graphics, _rows[i], i * RowHeight);\n        DrawBranchLanes(graphics, _rows[i]);\n    }\n}',
  'src/MarkdownRenderer.cs': '// MarkdownRenderer.cs - GFM parser with sanitized HTML\npublic static string Render(string markdown, RepoContext context)\n{\n    string html = ParseBlocks(markdown);\n    html = RenderTablesAndTaskLists(html);\n    html = PathResolver.ResolveLocalLinks(html, context);\n    return HtmlSanitizer.Sanitize(html);\n}',
  'README.md': '# GetHub V3.0\n\n> Fast, native offline GitHub and Git repository browser for Windows.\n\n- 100% Offline browsing with full GitHub UI fidelity\n- Interactive commit history, visual graph & diff viewer\n- Native C# .NET 4.8 WinForms with zero electron bloat\n- Public and private repository support via PAT\n- Built-in path segment budgeting overcomes Windows MAX_PATH limits',
  'build.ps1': '# build.ps1 - Automated standalone C# compiler\nparam([string]$Configuration = "Release")\n$csc = "$env:WINDIR\\Microsoft.NET\\Framework64\\v4.0.30319\\csc.exe"\n$sources = Get-ChildItem "src\\GetHub" -Recurse -Filter "*.cs"\n& $csc /target:winexe /optimize+ /out:build\\GetHub.exe $sources\nWrite-Host "GetHub built successfully!" -ForegroundColor Green'
};

const commits = {
  main: [
    ['b4f8c92', 'Implement deep path budget segment algorithm for Windows MAX_PATH', '2 days ago', '+84 -12'],
    ['a1e74d3', 'Add CommitDiffView with color-coded side-by-side hunk gutters', '4 days ago', '+215 -34'],
    ['7be04d1', 'Render GitHub Flavored Markdown with HtmlSanitizer & local images', '1 week ago', '+340 -18'],
    ['3c9a812', 'Initial commit: GetHub v3.0 architecture and WinForms shell', '2 weeks ago', '+1250 -0']
  ],
  dev: [
    ['f9102c4', 'Optimize CommitGraphView lane drawing and hit-testing', '3 hours ago', '+62 -8'],
    ['b4f8c92', 'Implement deep path budget segment algorithm for Windows MAX_PATH', '2 days ago', '+84 -12'],
    ['a1e74d3', 'Add CommitDiffView with color-coded side-by-side hunk gutters', '4 days ago', '+215 -34'],
    ['3c9a812', 'Initial commit: GetHub v3.0 architecture and WinForms shell', '2 weeks ago', '+1250 -0']
  ],
  'v3.0': [
    ['b4f8c92', 'Release GetHub V3.0: Full offline GitHub fidelity & diff viewer', '2 days ago', '+84 -12'],
    ['a1e74d3', 'Add CommitDiffView with color-coded side-by-side hunk gutters', '4 days ago', '+215 -34'],
    ['7be04d1', 'Render GitHub Flavored Markdown with HtmlSanitizer & local images', '1 week ago', '+340 -18']
  ]
};

const diffSnippets = {
  'src/Program.cs': [
    '@@ -8,6 +8,11 @@ static class Program',
    '     [STAThread]',
    '     static void Main()',
    '     {',
    '+        Application.EnableVisualStyles();',
    '+        Application.SetCompatibleTextRenderingDefault(false);',
    '+',
    '         RepoStore store = new RepoStore();',
    '         Application.Run(new MainForm(store));',
    '     }'
  ],
  'src/GitHubDownloader.cs': [
    '@@ -24,8 +24,12 @@ public class GitHubDownloader',
    '-    // Legacy unzip without path budgeting',
    '-    ZipFile.ExtractToDirectory(zipPath, targetDir);',
    '+    // Segment budgeting algorithm handles Windows 260-char MAX_PATH limit',
    '+    foreach (var entry in archive.Entries) {',
    '+        string safePath = ResolveSegmentBudget(entry.FullName, targetDir);',
    '+        entry.ExtractToFile(safePath, overwrite: true);',
    '+    }'
  ],
  'src/CommitGraphView.cs': [
    '@@ -45,7 +45,10 @@ protected override void OnPaint(PaintEventArgs e)',
    '     graphics.SmoothingMode = SmoothingMode.AntiAlias;',
    '-    DrawBasicList(graphics);',
    '+    for (int i = 0; i < _rows.Count; i++) {',
    '+        DrawCommitNode(graphics, _rows[i], i * RowHeight);',
    '+        DrawBranchLanes(graphics, _rows[i]);',
    '+    }'
  ],
  'src/MarkdownRenderer.cs': [
    '@@ -12,4 +12,7 @@ public static string Render(string markdown, RepoContext context)',
    '     string html = ParseBlocks(markdown);',
    '+    html = RenderTablesAndTaskLists(html);',
    '+    html = PathResolver.ResolveLocalLinks(html, context);',
    '+    return HtmlSanitizer.Sanitize(html);'
  ],
  'README.md': [
    '@@ -1,3 +1,7 @@',
    '-# GetHub',
    '+# GetHub V3.0',
    '+> Fast, native offline GitHub and Git repository browser for Windows.',
    '+- Interactive visual commit graph and diff viewer',
    '+- Native C# .NET 4.8 with instant launch and minimal memory'
  ],
  'build.ps1': [
    '@@ -1,5 +1,8 @@',
    ' param([string]$Configuration = "Release")',
    '+$csc = "$env:WINDIR\\Microsoft.NET\\Framework64\\v4.0.30319\\csc.exe"',
    '+$sources = Get-ChildItem "src\\GetHub" -Recurse -Filter "*.cs"',
    '+& $csc /target:winexe /optimize+ /out:build\\GetHub.exe $sources',
    '+Write-Host "GetHub built successfully!" -ForegroundColor Green'
  ]
};

let curFile = 'src/Program.cs', curView = 'code';
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const hl = s => esc(s).replace(/(\/\/.*|#.*)|("[^"]*")|\b(using|namespace|class|static|void|public|private|async|await|var|return|param|foreach|new)\b/g,
  (m, c, q, k) => c ? `<span class="c">${m}</span>` : q ? `<span class="s">${m}</span>` : `<span class="k">${m}</span>`);

const out = $('#out'), tree = $('#tree'), statusEl = $('#status'), branch = $('#branch');

function renderTree() {
  const query = $('#q').value.toLowerCase();
  const list = Object.keys(files).filter(n => n.toLowerCase().includes(query));
  tree.innerHTML = list.map(n =>
    `<button data-f="${n}" ${n === curFile ? 'aria-current="true"' : ''}>${n}</button>`
  ).join('') || '<em>No matching files</em>';
}

function render() {
  if (curView === 'code') {
    const lines = files[curFile].split('\n');
    out.innerHTML = lines.map((l, i) =>
      `<span class="ln" data-n="${i + 1}" style="--i:${Math.min(i, 20)}">${hl(l) || ' '}</span>`
    ).join('');
    statusEl.innerHTML = `<span><strong>${branch.value}</strong> · ${curFile}</span><span>${lines.length} lines</span>`;
  } else if (curView === 'log') {
    const list = commits[branch.value] || commits.main;
    out.innerHTML = list.map((c, i) =>
      `<div class="cm" style="--i:${i}"><code>${c[0]}</code><span>${esc(c[1])}</span><span class="stat-tag">${c[3]}</span><small>${c[2]}</small></div>`
    ).join('');
    statusEl.innerHTML = `<span><strong>${branch.value}</strong> branch</span><span>${list.length} commits</span>`;
  } else if (curView === 'diff') {
    const lines = diffSnippets[curFile] || [
      '@@ -1,4 +1,4 @@',
      '-// unmodified snapshot',
      '+// GetHub offline inspect mode',
      ' File matches target repository.'
    ];
    out.innerHTML = lines.map(line => {
      let cls = 'd-row';
      if (line.startsWith('@@')) cls += ' d-hdr';
      else if (line.startsWith('+')) cls += ' d-add';
      else if (line.startsWith('-')) cls += ' d-del';
      return `<div class="${cls}">${esc(line)}</div>`;
    }).join('');
    statusEl.innerHTML = `<span>Diff for <strong>${curFile}</strong></span><span>Side-by-side hunk view</span>`;
  }
}

tree.addEventListener('click', e => {
  const btn = e.target.closest('button');
  if (!btn) return;
  curFile = btn.dataset.f;
  renderTree();
  render();
});

$('#q').addEventListener('input', renderTree);
branch.addEventListener('change', render);

$$('.tabs button').forEach(b => b.addEventListener('click', () => {
  curView = b.dataset.v;
  $$('.tabs button').forEach(t => t.setAttribute('aria-selected', t === b));
  render();
}));

renderTree();
render();

// Feature tabs
const featureTabs = $$('.fl button');
function pickFeature(btn) {
  featureTabs.forEach(t => {
    const on = t === btn;
    t.setAttribute('aria-selected', on);
    t.tabIndex = on ? 0 : -1;
    const panel = $('#' + t.getAttribute('aria-controls'));
    if (panel) panel.hidden = !on;
  });
}

featureTabs.forEach((btn, idx) => {
  btn.addEventListener('click', () => pickFeature(btn));
  btn.addEventListener('keydown', e => {
    const delta = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
    if (!delta) return;
    e.preventDefault();
    const next = featureTabs[(idx + delta + featureTabs.length) % featureTabs.length];
    next.focus();
    pickFeature(next);
  });
});
if (featureTabs.length) pickFeature(featureTabs[0]);

// Build tab switcher
const tabPs = $('#tabPs'), tabVs = $('#tabVs'), cmdEl = $('#cmd');
const psSnippet = `<span class="p"># 1. Clone or download the repository</span>
git clone https://github.com/Abdelwahab-Ayman/GetHub.git
cd GetHub

<span class="p"># 2. Run the automated PowerShell build script (uses csc.exe)</span>
.\\build.ps1 -Configuration Release

<span class="c"># Binary output: .\\build\\GetHub.exe</span>`;

const vsSnippet = `<span class="p"># Method 1: Using MSBuild directly</span>
msbuild GetHub.sln /p:Configuration=Release

<span class="p"># Method 2: Visual Studio 2022</span>
<span class="c"># 1. Open GetHub.sln in Visual Studio</span>
<span class="c"># 2. Select 'Release' configuration and AnyCPU</span>
<span class="c"># 3. Press Ctrl + Shift + B to build</span>
<span class="c"># Output: .\\src\\GetHub\\bin\\Release\\GetHub.exe</span>`;

if (tabPs && tabVs && cmdEl) {
  tabPs.addEventListener('click', () => {
    tabPs.setAttribute('aria-selected', 'true');
    tabVs.setAttribute('aria-selected', 'false');
    cmdEl.innerHTML = psSnippet;
  });
  tabVs.addEventListener('click', () => {
    tabVs.setAttribute('aria-selected', 'true');
    tabPs.setAttribute('aria-selected', 'false');
    cmdEl.innerHTML = vsSnippet;
  });
}

// Copy build commands
$('#copy').addEventListener('click', async e => {
  try {
    await navigator.clipboard.writeText(cmdEl.textContent);
    e.target.textContent = 'Copied!';
    setTimeout(() => { e.target.textContent = 'Copy'; }, 2000);
  } catch {
    e.target.textContent = 'Press Ctrl+C';
  }
});

// Lightbox Modal for UI Design Screenshot
const modal = $('#lightbox'), zoomTrigger = $('#zoomTrigger'), modalClose = $('#modalClose');
if (modal && zoomTrigger) {
  zoomTrigger.addEventListener('click', () => {
    modal.classList.add('active');
  });
  if (modalClose) {
    modalClose.addEventListener('click', () => {
      modal.classList.remove('active');
    });
  }
  modal.addEventListener('click', e => {
    if (e.target === modal) {
      modal.classList.remove('active');
    }
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      modal.classList.remove('active');
    }
  });
}

// Light / Dark Theme toggle
const themeBtn = $('#theme'), docEl = document.documentElement;
function syncTheme() {
  const isDark = docEl.dataset.theme === 'dark';
  themeBtn.setAttribute('aria-pressed', isDark);
  themeBtn.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
}
themeBtn.addEventListener('click', () => {
  docEl.dataset.theme = docEl.dataset.theme === 'dark' ? 'light' : 'dark';
  syncTheme();
  try {
    localStorage.setItem('theme', docEl.dataset.theme);
  } catch (e) {}
});
syncTheme();
