import { useEffect, useState } from 'react';
import { useSiteData } from '../store/useSiteData';
import './admin.css';

const TABS = [
  { id: 'hero', label: 'Hero' },
  { id: 'projects', label: 'Projects' },
  { id: 'about', label: 'Studio Statement' },
  { id: 'services', label: 'Services' },
  { id: 'process', label: 'Process' },
  { id: 'founder', label: 'Founder' },
  { id: 'goa', label: 'Goa Gallery' },
  { id: 'journal', label: 'Journal' },
  { id: 'faq', label: 'FAQ' },
  { id: 'contact', label: 'Contact Info' }
];

const BLANKS = {
  projects: { title: 'New Project', type: 'Ongoing', location: 'Goa', one: 'A short description of the project.', image: 'https://picsum.photos/id/1035/800/1000' },
  services: { title: 'New Service', body: 'Describe this service.', image: 'https://picsum.photos/id/1080/1000/1200' },
  goa: { label: 'new element', image: 'https://picsum.photos/id/1036/600/800', height: 380 },
  journal: { tag: 'General', title: 'New post title', excerpt: 'A short excerpt.', date: '2026', read: '5 min read', image: 'https://picsum.photos/id/1080/800/560' },
  faq: { q: 'New question?', a: 'Answer goes here.' }
};

function Field({ label, value, onChange, textarea, type = 'text', options }) {
  return (
    <div className="admin-field">
      <label>{label}</label>
      {options ? (
        <select value={value} onChange={e => onChange(e.target.value)}>
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : textarea ? (
        <textarea value={value} onChange={e => onChange(e.target.value)} />
      ) : (
        <input type={type} value={value} onChange={e => onChange(e.target.value)} />
      )}
    </div>
  );
}

export default function AdminPanel({ onClose, onLock }) {
  const { data, setData, resetToDefault } = useSiteData();
  const [draft, setDraft] = useState(() => structuredClone(data));
  const [tab, setTab] = useState('hero');
  const [toast, setToast] = useState('');

  useEffect(() => { setDraft(structuredClone(data)); }, [data]);

  const showToast = msg => { setToast(msg); setTimeout(() => setToast(''), 2600); };
  const save = () => { setData(draft); showToast('Saved — changes are live in this browser.'); };
  const set = (path, value) => {
    setDraft(prev => {
      const next = structuredClone(prev);
      let obj = next;
      for (let i = 0; i < path.length - 1; i++) obj = obj[path[i]];
      obj[path[path.length - 1]] = value;
      return next;
    });
  };
  const addItem = arr => setDraft(prev => ({ ...prev, [arr]: [...prev[arr], structuredClone(BLANKS[arr])] }));
  const removeItem = (arr, i) => setDraft(prev => ({ ...prev, [arr]: prev[arr].filter((_, idx) => idx !== i) }));

  return (
    <div className="admin-overlay">
      <div className="admin-bar">
        <div className="admin-title">Azumi Admin</div>
        <div className="admin-bar-actions">
          <button className="btn btn-ghost admin-reset" onClick={() => { if (confirm('Reset all content to the original defaults? This discards your edits.')) { resetToDefault(); showToast('Reset to defaults.'); } }}>Reset defaults</button>
          <button className="btn btn-primary admin-save-btn" onClick={save}>Save changes</button>
          {onLock && <button className="btn btn-ghost admin-close-btn" onClick={onLock}>Lock</button>}
          <button className="btn btn-ghost admin-close-btn" onClick={onClose}>Close</button>
        </div>
      </div>
      <div className="admin-tabs">
        {TABS.map(t => (
          <button key={t.id} className={`admin-tab ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>{t.label}</button>
        ))}
      </div>
      <div className="admin-panels">
        {tab === 'hero' && (
          <div className="admin-panel">
            <Field label="Eyebrow tag" value={draft.hero.eyebrow} onChange={v => set(['hero', 'eyebrow'], v)} />
            <div className="admin-grid2">
              <Field label="Line 1 (masked headline)" value={draft.hero.line1} onChange={v => set(['hero', 'line1'], v)} />
              <Field label="Line 2" value={draft.hero.line2} onChange={v => set(['hero', 'line2'], v)} />
            </div>
            <Field label="Subtext" value={draft.hero.sub} onChange={v => set(['hero', 'sub'], v)} textarea />
            <Field label="Scroll hint" value={draft.hero.scrollHint} onChange={v => set(['hero', 'scrollHint'], v)} />
            <Field label="Background image URL" value={draft.hero.image} onChange={v => set(['hero', 'image'], v)} />
          </div>
        )}

        {tab === 'projects' && (
          <div className="admin-panel">
            {draft.projects.map((pr, i) => (
              <div className="admin-list-item" key={i}>
                <button className="admin-remove" onClick={() => removeItem('projects', i)}>×</button>
                <div className="admin-grid2">
                  <Field label="Title" value={pr.title} onChange={v => set(['projects', i, 'title'], v)} />
                  <Field label="Status" value={pr.type} onChange={v => set(['projects', i, 'type'], v)} options={['Ongoing', 'Completed']} />
                </div>
                <div className="admin-grid2">
                  <Field label="Location" value={pr.location} onChange={v => set(['projects', i, 'location'], v)} />
                  <Field label="Image URL" value={pr.image} onChange={v => set(['projects', i, 'image'], v)} />
                </div>
                <Field label="One-liner" value={pr.one} onChange={v => set(['projects', i, 'one'], v)} />
              </div>
            ))}
            <button className="btn btn-dark admin-add" onClick={() => addItem('projects')}>+ Add project</button>
          </div>
        )}

        {tab === 'about' && (
          <div className="admin-panel">
            <div className="admin-grid2">
              <Field label="Statement (before emphasis)" value={draft.about.statementPre} onChange={v => set(['about', 'statementPre'], v)} />
              <Field label="Emphasised word" value={draft.about.statementEm} onChange={v => set(['about', 'statementEm'], v)} />
            </div>
            <Field label="Statement (after emphasis)" value={draft.about.statementPost} onChange={v => set(['about', 'statementPost'], v)} />
            <Field label="Body" value={draft.about.body} onChange={v => set(['about', 'body'], v)} textarea />
            {draft.about.pillars.map((p, i) => (
              <div className="admin-list-item" key={i}>
                <Field label={`Pillar 0${i + 1} title`} value={p.title} onChange={v => set(['about', 'pillars', i, 'title'], v)} />
                <Field label="Text" value={p.text} onChange={v => set(['about', 'pillars', i, 'text'], v)} textarea />
              </div>
            ))}
          </div>
        )}

        {tab === 'services' && (
          <div className="admin-panel">
            {draft.services.map((s, i) => (
              <div className="admin-list-item" key={i}>
                <button className="admin-remove" onClick={() => removeItem('services', i)}>×</button>
                <Field label="Title" value={s.title} onChange={v => set(['services', i, 'title'], v)} />
                <Field label="Description" value={s.body} onChange={v => set(['services', i, 'body'], v)} textarea />
                <Field label="Image URL" value={s.image} onChange={v => set(['services', i, 'image'], v)} />
              </div>
            ))}
            <button className="btn btn-dark admin-add" onClick={() => addItem('services')}>+ Add service</button>
          </div>
        )}

        {tab === 'process' && (
          <div className="admin-panel">
            {draft.processSteps.map((s, i) => (
              <div className="admin-list-item" key={i}>
                <Field label={`Step 0${i + 1} title`} value={s.title} onChange={v => set(['processSteps', i, 'title'], v)} />
                <Field label="Description" value={s.text} onChange={v => set(['processSteps', i, 'text'], v)} textarea />
                <Field
                  label="Applies to (comma separated: Architecture, Interior, Turnkey, Vastu)"
                  value={s.tags.join(', ')}
                  onChange={v => set(['processSteps', i, 'tags'], v.split(',').map(x => x.trim()).filter(Boolean))}
                />
              </div>
            ))}
          </div>
        )}

        {tab === 'founder' && (
          <div className="admin-panel">
            <div className="admin-grid2">
              <Field label="Name" value={draft.founder.name} onChange={v => set(['founder', 'name'], v)} />
              <Field label="Role" value={draft.founder.role} onChange={v => set(['founder', 'role'], v)} />
            </div>
            <Field label="Photo URL" value={draft.founder.photo} onChange={v => set(['founder', 'photo'], v)} />
            <Field label="Personal statement" value={draft.founder.statement} onChange={v => set(['founder', 'statement'], v)} textarea />
            <div className="admin-grid2">
              <Field label="Practice" value={draft.founder.practice} onChange={v => set(['founder', 'practice'], v)} />
              <Field label="Focus" value={draft.founder.focus} onChange={v => set(['founder', 'focus'], v)} />
            </div>
            <Field label="Availability" value={draft.founder.available} onChange={v => set(['founder', 'available'], v)} />
          </div>
        )}

        {tab === 'goa' && (
          <div className="admin-panel">
            {draft.goa.map((g, i) => (
              <div className="admin-list-item" key={i}>
                <button className="admin-remove" onClick={() => removeItem('goa', i)}>×</button>
                <div className="admin-grid2">
                  <Field label="Label" value={g.label} onChange={v => set(['goa', i, 'label'], v)} />
                  <Field label="Image URL" value={g.image} onChange={v => set(['goa', i, 'image'], v)} />
                </div>
              </div>
            ))}
            <button className="btn btn-dark admin-add" onClick={() => addItem('goa')}>+ Add image</button>
          </div>
        )}

        {tab === 'journal' && (
          <div className="admin-panel">
            {draft.journal.map((j, i) => (
              <div className="admin-list-item" key={i}>
                <button className="admin-remove" onClick={() => removeItem('journal', i)}>×</button>
                <div className="admin-grid2">
                  <Field label="Tag / category" value={j.tag} onChange={v => set(['journal', i, 'tag'], v)} />
                  <Field label="Image URL" value={j.image} onChange={v => set(['journal', i, 'image'], v)} />
                </div>
                <Field label="Title" value={j.title} onChange={v => set(['journal', i, 'title'], v)} />
                <Field label="Excerpt" value={j.excerpt} onChange={v => set(['journal', i, 'excerpt'], v)} textarea />
                <div className="admin-grid2">
                  <Field label="Date" value={j.date} onChange={v => set(['journal', i, 'date'], v)} />
                  <Field label="Read time" value={j.read} onChange={v => set(['journal', i, 'read'], v)} />
                </div>
              </div>
            ))}
            <button className="btn btn-dark admin-add" onClick={() => addItem('journal')}>+ Add blog post</button>
          </div>
        )}

        {tab === 'faq' && (
          <div className="admin-panel">
            {draft.faq.map((f, i) => (
              <div className="admin-list-item" key={i}>
                <button className="admin-remove" onClick={() => removeItem('faq', i)}>×</button>
                <Field label="Question" value={f.q} onChange={v => set(['faq', i, 'q'], v)} />
                <Field label="Answer" value={f.a} onChange={v => set(['faq', i, 'a'], v)} textarea />
              </div>
            ))}
            <button className="btn btn-dark admin-add" onClick={() => addItem('faq')}>+ Add question</button>
          </div>
        )}

        {tab === 'contact' && (
          <div className="admin-panel">
            <Field label="Studio address" value={draft.contact.address} onChange={v => set(['contact', 'address'], v)} />
            <div className="admin-grid2">
              <Field label="Email" value={draft.contact.email} onChange={v => set(['contact', 'email'], v)} />
              <Field label="Phone" value={draft.contact.phone} onChange={v => set(['contact', 'phone'], v)} />
            </div>
            <Field label="Hours" value={draft.contact.hours} onChange={v => set(['contact', 'hours'], v)} />
          </div>
        )}
      </div>
      <div className={`toast admin-toast ${toast ? 'show' : ''}`}>{toast}</div>
    </div>
  );
}
