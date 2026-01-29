document.addEventListener('DOMContentLoaded', function () {
  // Past shows: simple line-per-item list
  const pastEl = document.getElementById('past-shows');
  if (pastEl) {
    fetch('content/past-shows.txt')
      .then((r) => {
        if (!r.ok) throw new Error('Network response was not ok');
        return r.text();
      })
      .then((text) => {
        const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
        if (lines.length === 0) {
          pastEl.innerHTML = '<li class="text-body-secondary">No past shows available.</li>';
          return;
        }
        pastEl.innerHTML = '';
        lines.forEach(line => {
          const li = document.createElement('li');
          li.textContent = line;
          pastEl.appendChild(li);
        });
      })
      .catch(() => {
        pastEl.innerHTML = '<li class="text-body-secondary">Could not load past shows.</li>';
      });
  }

  // Upcoming shows: structured file with format "eventName;date;cityState;venueName"
  const upcomingEl = document.getElementById('upcoming-list');
  if (upcomingEl) {
    fetch('content/upcoming-shows.txt')
      .then(r => { if (!r.ok) throw new Error('Network response was not ok'); return r.text(); })
      .then(text => {
        const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
        if (lines.length === 0) {
          upcomingEl.innerHTML = '<div class="text-body-secondary small">No upcoming shows.</div>';
          return;
        }
        upcomingEl.innerHTML = '';
        lines.forEach((line, idx) => {
          const parts = line.split(';').map(p => p.trim());
          const [eventName, date, cityState, venueName, buttonText, buttonLink] = parts;

          const top = document.createElement('div');
          top.className = 'd-flex justify-content-between';
          const left = document.createElement('span'); left.textContent = eventName || '';
          const right = document.createElement('span'); right.className = 'text-body-secondary'; right.textContent = date || '';
          top.appendChild(left);
          top.appendChild(right);

          const bottom = document.createElement('div');
          bottom.className = 'text-body-secondary small';
          const venueText = [cityState || '', venueName || ''].filter(Boolean).join(' — ');
          bottom.textContent = venueText;

          const link = document.createElement('a');
          if (buttonLink && buttonText) {
            link.href = buttonLink;
            link.target = '_blank';
            link.rel = 'noopener';
            link.className = 'btn btn-outline-secondary btn-sm mt-2 hd-button1';
            link.textContent = buttonText;
            bottom.appendChild(document.createElement('br'));
            bottom.appendChild(link);
          }

          upcomingEl.appendChild(top);
          upcomingEl.appendChild(bottom);
          if (idx !== lines.length - 1) {

            const hr = document.createElement('hr'); hr.className = 'divider';
            upcomingEl.appendChild(hr);
          }
        });
      })
      .catch(() => {
        upcomingEl.innerHTML = '<div class="text-body-secondary small">Could not load upcoming shows.</div>';
      });
  }

  // Headlines: source content from content/bio.txt
  const headlinesEl = document.getElementById('headlines');
  if (headlinesEl) {
    fetch('content/bio.txt')
      .then(r => { if (!r.ok) throw new Error('Network response was not ok'); return r.text(); })
      .then(text => {
        // Prefer splitting by blank lines into paragraphs; otherwise split by single lines
        let parts = text.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);
        if (parts.length === 0) {
          parts = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
        }
        if (parts.length === 0) {
          headlinesEl.innerHTML = '<div class="text-body-secondary small">No headlines available.</div>';
          return;
        }
        headlinesEl.innerHTML = '';
        parts.forEach((p, idx) => {
          const para = document.createElement('p');
          para.className = 'mb-1';
          para.textContent = p;
          headlinesEl.appendChild(para);
          if (idx !== parts.length - 1) {
            const hr = document.createElement('hr'); hr.className = 'divider';
            headlinesEl.appendChild(hr);
          }
        });
      })
      .catch(() => {
        headlinesEl.innerHTML = '<div class="text-body-secondary small">Could not load headlines.</div>';
      });
  }
});
