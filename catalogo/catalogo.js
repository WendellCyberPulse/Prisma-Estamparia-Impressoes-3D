const STORAGE_KEYS = { produtos: 'catalogo_produtos', pedidos: 'catalogo_pedidos', settings: 'catalogo_settings' };
function formatCurrency(v) { return `R$ ${Number(v || 0).toFixed(2)}`; }
function load(key) { try { return JSON.parse(localStorage.getItem(key) || 'null'); } catch(e) { return null; } }
function save(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
function seedProdutos() {
  return [
    { id: 'p_caneca_325', nome: 'Caneca Cerâmica 325ml', preco: 29.9, imagem: '../img/logo.png', descricao: 'Caneca de cerâmica de alta qualidade, ideal para sublimação. Capacidade 325ml.' },
    { id: 'p_camisa_algodao', nome: 'Camisa Algodão Básica', preco: 49.9, imagem: '../img/logo.png', descricao: 'Camiseta 100% algodão, confortável e ideal para personalização com diversas técnicas.' },
    { id: 'p_peca_3d', nome: 'Peça Impressão 3D', preco: 79.9, imagem: '../img/logo.png', descricao: 'Peça personalizada impressa em 3D conforme especificações do cliente.' }
  ];
}
function getProdutos() { const p = load(STORAGE_KEYS.produtos); if (Array.isArray(p) && p.length) return p; const seeded = seedProdutos(); save(STORAGE_KEYS.produtos, seeded); return seeded; }
function addProduto(prod) { const list = getProdutos(); const id = `p_${Date.now()}`; const novo = { id, nome: prod.nome, preco: Number(prod.preco), imagem: prod.imagem || '../img/logo.png', descricao: prod.descricao || '' }; list.push(novo); save(STORAGE_KEYS.produtos, list); return novo; }
function updateProdutos(list) { save(STORAGE_KEYS.produtos, list); }
function getSettings() { const s = load(STORAGE_KEYS.settings) || {}; if (!s.nomeRecebedor) s.nomeRecebedor = 'Prisma Studio'; if (!s.cidade) s.cidade = 'Contagem'; if (!('chavePix' in s)) s.chavePix = ''; save(STORAGE_KEYS.settings, s); return s; }
function updateSettings(s) { const cur = getSettings(); const next = Object.assign({}, cur, s); save(STORAGE_KEYS.settings, next); return next; }
function getPedidos() { return load(STORAGE_KEYS.pedidos) || []; }
function getPedidoById(id) { const list = getPedidos(); return list.find(o => o.id === id) || null; }
function addPedido(p) { const list = getPedidos(); const id = `o_${Date.now()}`; const novo = { id, cliente: p.cliente, telefone: p.telefone, observacoes: p.observacoes || '', itens: p.itens || [], total: Number(p.total || 0), status: 'novo', criadoEm: new Date().toISOString(), deviceId: p.deviceId || null, messages: [] }; list.unshift(novo); save(STORAGE_KEYS.pedidos, list); return novo; }
function updatePedidoStatus(id, status) { const list = getPedidos(); const idx = list.findIndex(o => o.id === id); if (idx >= 0) { list[idx].status = status; save(STORAGE_KEYS.pedidos, list); return list[idx]; } return null; }
function removePedido(id) { const list = getPedidos().filter(o => o.id !== id); save(STORAGE_KEYS.pedidos, list); }
function calcTotal(itens) { return Number((itens || []).reduce((acc, it) => acc + Number(it.preco) * Number(it.qtd || 1), 0)); }
function getPixQrUrl(chavePix, valor, nomeRecebedor, cidade, mensagem) { const txt = `PIX\nchave=${chavePix}\nvalor=${Number(valor).toFixed(2)}\nnome=${nomeRecebedor}\ncidade=${cidade}\nmsg=${mensagem || ''}`; const data = encodeURIComponent(txt); return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${data}`; }
function getProdutoById(id) { const list = getProdutos(); return list.find(p => p.id === id) || null; }
function getChat(orderId) { const o = getPedidoById(orderId); return o && Array.isArray(o.messages) ? o.messages : []; }
function addChatMessage(orderId, message) { const list = getPedidos(); const idx = list.findIndex(o => o.id === orderId); if (idx < 0) return null; if (!Array.isArray(list[idx].messages)) list[idx].messages = []; const m = { author: message.author, text: message.text || '', kind: message.kind || 'text', pixUrl: message.pixUrl || '', createdAt: new Date().toISOString() }; list[idx].messages.push(m); save(STORAGE_KEYS.pedidos, list); return m; }
function getOrdersByPhone(phone) { const list = getPedidos(); return list.filter(o => (o.telefone || '').trim() === String(phone).trim()); }
function getOrdersByDeviceId(deviceId) { const list = getPedidos(); return list.filter(o => (o.deviceId || '') === deviceId); }
window.catalogoApi = { formatCurrency, getProdutos, getProdutoById, addProduto, updateProdutos, getSettings, updateSettings, getPedidos, getPedidoById, addPedido, updatePedidoStatus, removePedido, calcTotal, getPixQrUrl, getChat, addChatMessage, getOrdersByPhone, getOrdersByDeviceId };
