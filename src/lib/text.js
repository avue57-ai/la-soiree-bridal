// Content text uses *word* for emphasis. Everything else is escaped, so content can never inject markup.
export const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
export const em = (s) => esc(s).replace(/\*([^*]+)\*/g, '<em>$1</em>');

// Body copy: blank line = new paragraph; **bold** and *italic*. Everything else is escaped.
export const md = (s) => esc(s).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/\*([^*]+)\*/g, '<em>$1</em>');
export const paragraphs = (s) => String(s).split(/\n{2,}/).map((p) => md(p.trim())).filter(Boolean);
