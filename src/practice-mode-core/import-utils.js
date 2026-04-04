const AUDIO_EXTENSIONS = ['.ogg', '.mp3', '.wav', '.m4a', '.aac', '.flac', '.opus'];

export function readText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error(`读取失败: ${file.name}`));
    reader.readAsText(file, 'utf-8');
  });
}

function isLikelyTjaText(text) {
  if (!text) return false;
  return /^\s*#START\b/im.test(text) && /^\s*(TITLE|COURSE|BPM)\s*:/im.test(text);
}

export function decodeTjaBytes(bytes) {
  const encodings = ['utf-8', 'shift_jis', 'euc-jp', 'gb18030'];
  for (const encoding of encodings) {
    try {
      const text = new TextDecoder(encoding, { fatal: true }).decode(bytes);
      if (isLikelyTjaText(text)) {
        return text;
      }
    } catch (_) {
      // Try next encoding.
    }
  }
  throw new Error('无法识别压缩包内 TJA 编码。');
}

export function normalizePath(path) {
  return String(path || '').replace(/\\/g, '/').replace(/^\/+/, '').replace(/\/+$/, '');
}

export function pathDir(path) {
  const normalized = normalizePath(path);
  const idx = normalized.lastIndexOf('/');
  return idx >= 0 ? normalized.slice(0, idx) : '';
}

export function pathBase(path) {
  const normalized = normalizePath(path);
  const idx = normalized.lastIndexOf('/');
  return idx >= 0 ? normalized.slice(idx + 1) : normalized;
}

export function isAudioPath(path) {
  const lower = normalizePath(path).toLowerCase();
  return AUDIO_EXTENSIONS.some((ext) => lower.endsWith(ext));
}

export function getAudioMimeType(path) {
  const lower = normalizePath(path).toLowerCase();
  if (lower.endsWith('.ogg') || lower.endsWith('.opus')) return 'audio/ogg';
  if (lower.endsWith('.mp3')) return 'audio/mpeg';
  if (lower.endsWith('.wav')) return 'audio/wav';
  if (lower.endsWith('.m4a') || lower.endsWith('.aac')) return 'audio/mp4';
  if (lower.endsWith('.flac')) return 'audio/flac';
  return 'audio/*';
}

export function joinPath(baseDir, relativePath) {
  const raw = normalizePath(relativePath);
  if (!raw) return normalizePath(baseDir);
  if (raw.startsWith('/')) return raw.slice(1);
  const baseParts = normalizePath(baseDir).split('/').filter(Boolean);
  const rawParts = raw.split('/').filter(Boolean);
  for (const part of rawParts) {
    if (part === '.') continue;
    if (part === '..') {
      baseParts.pop();
      continue;
    }
    baseParts.push(part);
  }
  return baseParts.join('/');
}

export function extractWavePath(tjaText) {
  const match = tjaText.match(/^\s*WAVE\s*:\s*(.+)\s*$/im);
  if (!match) return '';
  return match[1].trim().replace(/^"|"$/g, '');
}
