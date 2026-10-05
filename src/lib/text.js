// Content text uses *word* for emphasis. Everything else is escaped, so content can never inject markup.
export const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
export const em = (s) => esc(s).replace(/\*([^*]+)\*/g, '<em>$1</em>');
