/* BIA MODA FEMININA · Central ADM V3
 * Nenhuma permissão é concedida no navegador.
 * Dados protegidos exigem custom claims + Firestore Rules publicadas.
 */
'use strict';
const $=s=>document.querySelector(s);
const ICONS={
  home:'<path d="m3 10 9-7 9 7v10H3z"/><path d="M9 20v-7h6v7"/>',
  grid:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
  bag:'<path d="M4 8h16l-1 13H5z"/><path d="M9 9V6a3 3 0 0 1 6 0v3"/>',
  orders:'<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 8h6M9 12h6M9 16h4"/>',
  message:'<path d="M20 11a8 8 0 0 1-8 8 8.9 8.9 0 0 1-4-.9L3 20l2-5a8 8 0 1 1 15-4z"/>',
  chart:'<path d="M3 3v18h18"/><path d="m6 15 4-4 4 3 6-7"/>',
  users:'<circle cx="9" cy="8" r="4"/><path d="M2 21v-2a7 7 0 0 1 14 0v2"/><path d="M17 5a4 4 0 0 1 0 8m2 3a5 5 0 0 1 3 5"/>',
  shield:'<path d="M12 2 4 5v6c0 5 3 9 8 11 5-2 8-6 8-11V5z"/><path d="m9 12 2 2 4-4"/>',
  settings:'<circle cx="12" cy="12" r="3"/><path d="M12 2v3m0 14v3M2 12h3m14 0h3M5 5l2 2m10 10 2 2M5 19l2-2M17 7l2-2"/>',
  content:'<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8m-8 4h8m-8 4h5"/>',
  money:'<rect x="2" y="5" width="20" height="14" rx="3"/><circle cx="12" cy="12" r="4"/><path d="M6 12h.01M18 12h.01"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  search:'<circle cx="10" cy="10" r="6"/><path d="m15 15 6 6"/>',
  alert:'<path d="m12 3 10 18H2z"/><path d="M12 10v4m0 3h.01"/>',
  check:'<path d="m4 12 5 5L20 6"/>',
  arrow:'<path d="M5 12h14m-6-6 6 6-6 6"/>',
  'arrow-left':'<path d="M19 12H5m6-6-6 6 6 6"/>',
  'external-link':'<path d="M12 5H5v14h14v-7m-7 0 9-9m-7 0h7v7"/>',
  'log-out':'<path d="M10 3H5v18h5m4-4 5-5-5-5m5 5H9"/>',
  menu:'<path d="M4 6h16M4 12h16M4 18h16"/>',
  folder:'<path d="M2 6h8l2 3h10v11H2z"/>',
  tag:'<path d="M3 3h9l9 9-9 9-9-9z"/><circle cx="8" cy="8" r="1"/>',
  truck:'<path d="M3 6h11v12H3zM14 10h4l3 4v4h-7z"/><circle cx="7" cy="19" r="2"/><circle cx="18" cy="19" r="2"/>',
  eye:'<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  bolt:'<path d="m14 2-9 12h7l-2 8 9-12h-7z"/>',
  file:'<path d="M6 2h9l5 5v15H6zM15 2v6h5"/>',
  history:'<path d="M3 9A9 9 0 1 1 3 16m0-6V4m0 6h6"/><path d="M12 7v5l4 2"/>',
  userplus:'<circle cx="8" cy="8" r="4"/><path d="M2 21v-2a6 6 0 0 1 12 0v2m6-13v8m-4-4h8"/>',
  heart:'<path d="M12 21S2 15 2 8a5 5 0 0 1 10-1 5 5 0 0 1 10 1c0 7-10 13-10 13z"/>',
  instagram:'<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/>',
  copy:'<rect x="8" y="8" width="13" height="13" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/>',
  receipt:'<path d="M5 2h14v20l-4-2-3 2-4-2-3 2z"/><path d="M9 7h6M9 11h6M9 15h4"/>',
  bell:'<path d="M18 8a6 6 0 0 0-12 0c0 7-3 8-3 9h18c0-1-3-2-3-9m-8 12h4"/>',
  calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 2v6m10-6v6M3 10h18"/>'
};
const icon=(name,size=20)=>`<svg class="icon" viewBox="0 0 24 24" width="${size}" height="${size}" aria-hidden="true">${ICONS[name]||ICONS.grid}</svg>`;
const esc=s=>String(s??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const preview=window.BIA_ADM_PREVIEW===true;
const R={
  dashboard:{title:'Visão geral',desc:'Os indicadores mais importantes e os atalhos para administrar sua loja com clareza.',icon:'home',area:'geral'},
  catalogo:{title:'Vitrines e catálogo',desc:'Organize produtos, coleções, categorias, preços e a apresentação da vitrine.',icon:'bag',area:'catalogo'},
  produtos:{title:'Todos os produtos',desc:'Consulte os produtos cadastrados internamente, seus preços e disponibilidade.',icon:'bag',area:'catalogo'},
  'novo-produto':{title:'Adicionar produto',desc:'Cadastre as informações de uma peça antes de prepará-la para a vitrine pública.',icon:'plus',area:'catalogo'},
  categorias:{title:'Categorias',desc:'Separe peças em vestidos, conjuntos, blusas, calças e outros grupos.',icon:'folder',area:'catalogo'},
  colecoes:{title:'Coleções',desc:'Agrupe lançamentos e estilos por temporada ou campanha.',icon:'heart',area:'catalogo'},
  estoque:{title:'Estoque e variações',desc:'Acompanhe quantidades, tamanhos, cores e alertas de reposição.',icon:'grid',area:'catalogo'},
  precos:{title:'Preços e margem',desc:'Consulte preços, custos, descontos e margem prevista.',icon:'tag',area:'catalogo'},
  promocoes:{title:'Promoções',desc:'Planeje ofertas com início, término e critérios de uso.',icon:'bolt',area:'catalogo'},
  vitrines:{title:'Montar vitrines',desc:'Escolha o destaque da loja, a ordem dos itens e as seleções especiais.',icon:'grid',area:'catalogo'},
  banners:{title:'Banners e destaques',desc:'Prepare capas, imagens de campanha e chamadas do site.',icon:'content',area:'catalogo'},
  pedidos:{title:'Pedidos e entregas',desc:'Acompanhe as compras desde a solicitação até a entrega e pós-venda.',icon:'orders',area:'pedidos'},
  'todos-pedidos':{title:'Lista de pedidos',desc:'Consulte os pedidos recebidos, status, datas e próximos passos.',icon:'receipt',area:'pedidos'},
  pagamentos:{title:'Pagamentos',desc:'Verifique confirmações por provedores homologados e conciliação.',icon:'money',area:'pedidos'},
  entregas:{title:'Entregas',desc:'Controle separação, envio, rastreamento e comprovantes.',icon:'truck',area:'pedidos'},
  trocas:{title:'Trocas e devoluções',desc:'Organize pedidos de troca e devolução conforme as políticas da loja.',icon:'history',area:'pedidos'},
  clientes:{title:'Clientes',desc:'Acesse os dados necessários para atender os consumidores autorizados.',icon:'users',area:'pedidos'},
  suporte:{title:'Central de suporte',desc:'Receba e responda dúvidas dos clientes sem misturar os atendimentos.',icon:'message',area:'suporte'},
  'fila-suporte':{title:'Caixa de entrada',desc:'Organize solicitações abertas, prioridade, responsáveis e tempo de resposta.',icon:'message',area:'suporte'},
  'novo-atendimento':{title:'Abrir atendimento',desc:'Registre uma solicitação recebida por outro canal para acompanhamento.',icon:'plus',area:'suporte'},
  'modelos-resposta':{title:'Respostas rápidas',desc:'Mantenha modelos aprovados para dúvidas frequentes e orientações.',icon:'copy',area:'suporte'},
  'central-ajuda':{title:'Perguntas frequentes',desc:'Reúna respostas sobre tamanhos, entregas, trocas e pagamentos.',icon:'file',area:'suporte'},
  'avaliacao-suporte':{title:'Qualidade de atendimento',desc:'Acompanhe resoluções, respostas e avaliações recebidas.',icon:'chart',area:'suporte'},
  metricas:{title:'Métricas e desempenho',desc:'Veja visitas, cliques, origem do tráfego e os resultados da loja.',icon:'chart',area:'metricas'},
  visitantes:{title:'Visitas e sessões',desc:'Acompanhe o fluxo de visitantes quando a medição estiver configurada.',icon:'users',area:'metricas'},
  cliques:{title:'Cliques e interações',desc:'Descubra quais produtos e botões recebem mais interesse.',icon:'bolt',area:'metricas'},
  'produtos-vistos':{title:'Produtos visualizados',desc:'Compare o interesse por categorias, vitrines e produtos.',icon:'eye',area:'metricas'},
  funil:{title:'Funil de compras',desc:'Entenda o caminho de visualização até a conclusão do pedido.',icon:'chart',area:'metricas'},
  campanhas:{title:'Campanhas e origem',desc:'Analise visitas provenientes de Instagram, links e divulgações.',icon:'instagram',area:'metricas'},
  relatorios:{title:'Relatórios',desc:'Organize os relatórios disponíveis e exportações autorizadas.',icon:'file',area:'metricas'},
  equipe:{title:'Equipe e permissões',desc:'Gerencie responsáveis, cargos, convites e limites de acesso.',icon:'users',area:'equipe'},
  membros:{title:'Membros da equipe',desc:'Veja as contas administrativas e seus cargos registrados no servidor.',icon:'users',area:'equipe'},
  'adicionar-adm':{title:'Adicionar administrador',desc:'Atribua ADM 1, ADM 2 ou cargos especializados a contas já cadastradas.',icon:'userplus',area:'equipe'},
  cargos:{title:'Hierarquia de cargos',desc:'Conheça os níveis de autoridade e o que cada patente pode fazer.',icon:'shield',area:'equipe'},
  permissoes:{title:'Matriz de permissões',desc:'Revise quem pode consultar ou alterar cada área da plataforma.',icon:'grid',area:'equipe'},
  'acessos-equipe':{title:'Acessos da equipe',desc:'Analise a atividade administrativa registrada pelo backend.',icon:'history',area:'equipe'},
  conteudo:{title:'Conteúdo e redes',desc:'Administre textos, páginas da marca, canais sociais e comunicação.',icon:'content',area:'conteudo'},
  paginas:{title:'Páginas da loja',desc:'Organize Sobre nós, dúvidas, termos e outras páginas institucionais.',icon:'file',area:'conteudo'},
  instagram:{title:'Instagram oficial',desc:'Gerencie o link público e a apresentação da página oficial da Beatriz.',icon:'instagram',area:'conteudo'},
  mensagens:{title:'Mensagens e avisos',desc:'Planeje avisos informativos, campanhas e mensagens automáticas.',icon:'bell',area:'conteudo'},
  avaliacoes:{title:'Avaliações da loja',desc:'Modere avaliações, respostas e reclamações com transparência.',icon:'heart',area:'conteudo'},
  seo:{title:'Busca e compartilhamento',desc:'Configure títulos, descrições e prévias de links para a marca.',icon:'search',area:'conteudo'},
  seguranca:{title:'Segurança e auditoria',desc:'Controle o histórico de alterações, alertas e política de proteção de dados.',icon:'shield',area:'seguranca'},
  logs:{title:'Logs do sistema',desc:'Inspecione eventos técnicos e alterações registradas no servidor.',icon:'history',area:'seguranca'},
  auditoria:{title:'Auditoria administrativa',desc:'Verifique quem alterou um registro, quando e por qual operação.',icon:'shield',area:'seguranca'},
  alertas:{title:'Alertas e incidentes',desc:'Acompanhe falhas, tentativas bloqueadas e eventos que exigem ação.',icon:'alert',area:'seguranca'},
  consentimentos:{title:'Privacidade e LGPD',desc:'Controle políticas, consentimentos e solicitações relacionadas aos dados.',icon:'file',area:'seguranca'},
  backups:{title:'Backups e recuperação',desc:'Organize rotinas de backup, restauração e continuidade da loja.',icon:'folder',area:'seguranca'},
  financeiro:{title:'Financeiro e resultados',desc:'Visualize vendas, repasses, cupons e solicitações de estorno.',icon:'money',area:'financeiro'},
  vendas:{title:'Vendas e faturamento',desc:'Acompanhe valores confirmados, períodos e relatórios financeiros.',icon:'chart',area:'financeiro'},
  repasses:{title:'Repasses e taxas',desc:'Concilie taxas do intermediador de pagamentos e valores recebidos.',icon:'money',area:'financeiro'},
  cupons:{title:'Cupons',desc:'Planeje benefícios promocionais e condições aplicáveis.',icon:'tag',area:'financeiro'},
  estornos:{title:'Estornos',desc:'Gerencie solicitações financeiras seguindo o provedor responsável.',icon:'history',area:'financeiro'},
  configuracoes:{title:'Configurações da plataforma',desc:'Ajuste identidade, integrações, políticas e manutenção da operação.',icon:'settings',area:'configuracoes'},
  'dados-loja':{title:'Informações da loja',desc:'Mantenha informações oficiais da marca, contatos e endereço de atendimento.',icon:'bag',area:'configuracoes'},
  aparencia:{title:'Identidade visual',desc:'Gerencie logo, cores, espaçamento, botões e acessibilidade.',icon:'heart',area:'configuracoes'},
  integracoes:{title:'Integrações',desc:'Acompanhe serviços de autenticação, pagamento, envio e atendimento.',icon:'bolt',area:'configuracoes'},
  publicacao:{title:'Publicação e versões',desc:'Consulte o fluxo GitHub → Cloudflare e o estado das novas versões.',icon:'external-link',area:'configuracoes'},
  preferencias:{title:'Preferências da equipe',desc:'Ajuste preferências de organização do painel para cada operador.',icon:'settings',area:'configuracoes'},
  acessibilidade:{title:'Acessibilidade',desc:'Revise legibilidade, navegação por teclado, contraste e tamanho de alvos.',icon:'eye',area:'configuracoes'}
};
const GROUPS={
  catalogo:['produtos','novo-produto','categorias','colecoes','estoque','precos','promocoes','vitrines','banners'],
  pedidos:['todos-pedidos','pagamentos','entregas','trocas','clientes'],
  suporte:['fila-suporte','novo-atendimento','modelos-resposta','central-ajuda','avaliacao-suporte'],
  metricas:['visitantes','cliques','produtos-vistos','funil','campanhas','relatorios'],
  equipe:['membros','adicionar-adm','cargos','permissoes','acessos-equipe'],
  conteudo:['paginas','instagram','mensagens','avaliacoes','seo'],
  seguranca:['logs','auditoria','alertas','consentimentos','backups'],
  financeiro:['vendas','repasses','cupons','estornos'],
  configuracoes:['dados-loja','aparencia','integracoes','publicacao','preferencias','acessibilidade']
};
const MAIN=['dashboard','catalogo','pedidos','suporte','metricas','equipe','conteudo','seguranca','financeiro','configuracoes'];
const BOTTOM=['dashboard','catalogo','pedidos','suporte','metricas'];
const PERMS={owner:['*'],tech_owner:['*'],admin1:['catalogo','pedidos','suporte','metricas','conteudo','financeiro','configuracoes'],admin2:['catalogo','pedidos','suporte','metricas'],suporte:['suporte'],catalogo:['catalogo'],analista:['metricas']};
const ROLE_LABEL={owner:'Proprietária · Beatriz',tech_owner:'Direção técnica · Anderson',admin1:'ADM 1 · Gestão',admin2:'ADM 2 · Operações',suporte:'Atendimento',catalogo:'Catálogo',analista:'Análise'};
const ROLE_DESC={owner:'Acesso máximo da proprietária, incluindo equipe, segurança e configurações.',tech_owner:'Acesso máximo do responsável técnico, incluindo manutenção e auditoria.',admin1:'Administra loja, produtos, pedidos, suporte, métricas e conteúdo, sem promover cargos.',admin2:'Opera catálogo, pedidos, suporte e métricas, sem segurança e equipe.',suporte:'Responde e acompanha atendimentos, sem alterar preços ou atribuir cargos.',catalogo:'Gerencia informações de produtos e vitrine.',analista:'Consulta indicadores agregados, sem alterar cadastros ou acessar suporte.'};
let role=null,auth=null,db=null,cloudFns=null,firestore=null,authLib=null,functionsLib=null,currentUser=null;
let routeEntries=[],activeIndex=0,toastTimer=null,previewMode=preview;
history.scrollRestoration='manual';
function permitted(area){return previewMode || area==='geral'||(!!role && (PERMS[role]?.includes('*')||PERMS[role]?.includes(area)));}
function owner(){return role==='owner'||role==='tech_owner';}
function notify(message){const el=$('#toast');el.textContent=message;el.hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.hidden=true,4200);}
function fmtDate(v){try{const d=v?.toDate?.()||new Date(v);return Number.isNaN(d.getTime())?'—':d.toLocaleString('pt-BR',{dateStyle:'short',timeStyle:'short'});}catch{return '—';}}
function currency(v){return new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(Number(v||0));}
function initIcons(root=document){root.querySelectorAll('[data-icon]').forEach(node=>node.replaceWith(svgNode(node.dataset.icon)));}
function svgNode(name){const wrap=document.createElement('span');wrap.innerHTML=icon(name);return wrap.firstElementChild;}
function renderNav(){
  $('#side-nav').innerHTML=MAIN.filter(id=>permitted(R[id].area)).map(id=>`<button class="nav-link" data-nav="${id}">${icon(R[id].icon)}<span>${esc(R[id].title)}</span></button>`).join('');
  $('#bottom-nav').innerHTML=BOTTOM.filter(id=>permitted(R[id].area)).map(id=>`<button class="bottom-item" data-nav="${id}" aria-label="${esc(R[id].title)}">${icon(R[id].icon)}<small>${esc(id==='dashboard'?'Início':id==='catalogo'?'Vitrine':id==='pedidos'?'Pedidos':id==='suporte'?'Suporte':'Métricas')}</small></button>`).join('');
}
function makeCard(id){const d=R[id];return `<button class="tile" data-nav="${id}"><span class="tile-icon">${icon(d.icon)}</span><strong>${esc(d.title)}</strong><p>${esc(d.desc)}</p><span class="tile-arrow">→</span></button>`;}
function stat(label,iconName){return `<div class="stat"><div class="line"><small>${esc(label)}</small>${icon(iconName)}</div><strong>—</strong><span>À espera de dados confiáveis</span></div>`;}
function intro(d,section='CENTRAL ADMINISTRATIVA') {return `<header class="hero"><div><small>${esc(section)}</small><h1>${esc(d.title)}</h1><p>${esc(d.desc)}</p></div><span class="hero-tag">${previewMode?'PRÉVIA VISUAL':'ÁREA RESTRITA'}</span></header>`;}
function blank(title='Nenhum dado disponível',desc='Assim que este recurso for conectado ao backend, os registros reais aparecerão aqui.') {return `<div class="empty-state">${icon('folder',30)}<h3>${esc(title)}</h3><p>${esc(desc)}</p></div>`;}
function dashboardHtml(){return `${intro(R.dashboard,'PAINEL EXECUTIVO')}<div class="stat-grid">${stat('Visitas','eye')}${stat('Pedidos','orders')}${stat('Atendimentos','message')}${stat('Receita confirmada','money')}</div><div class="panel-2"><section class="panel"><div class="group-heading"><h2>Movimento da loja</h2><span>Dados reais após integração</span></div><div class="sparkline">Nenhuma medição coletada</div></section><section class="panel"><h2>Ações prioritárias</h2><p>Continue a implantação por módulos: catálogo, autenticação de equipe, atendimento e métricas.</p><div class="toolbar"><button class="btn ghost" data-nav="novo-produto">${icon('plus')}Cadastrar peça</button><button class="btn ghost" data-nav="fila-suporte">${icon('message')}Ver suporte</button></div></section></div><div class="group-heading"><h2>Áreas de administração</h2><span>Cada função tem sua tela própria</span></div><div class="tiles">${MAIN.slice(1).filter(id=>permitted(R[id].area)).map(makeCard).join('')}</div>`;}
function sectionHtml(id){return `${intro(R[id],'ÁREA / '+id.toUpperCase())}<div class="group-heading"><h2>Funções da área</h2><span>${GROUPS[id]?.length||0} telas separadas</span></div><div class="tiles">${(GROUPS[id]||[]).filter(k=>permitted(R[k].area)).map(makeCard).join('')}</div><div class="alert info">${icon('shield')}Cada tela mantém o contexto anterior: ao tocar em voltar, os filtros e a posição de rolagem da tela anterior são restaurados.</div>`;}
function productForm(){return `<section class="panel"><h2>Novo produto no catálogo interno</h2><p>O cadastro abaixo salva no banco interno após a configuração segura. A publicação na vitrine pública será integrada numa etapa posterior.</p><form id="product-form" class="form-grid" style="margin-top:20px">
<div class="form-field"><label>Nome da peça<input name="name" required minlength="3" maxlength="120" placeholder="Ex.: Vestido floral rosa"></label></div>
<div class="form-field"><label>Código SKU<input name="sku" required minlength="2" maxlength="50" placeholder="Ex.: BIA-001"></label></div>
<div class="form-field"><label>Preço em reais<input name="price" type="number" min="0" step="0.01" required placeholder="89.90"></label></div>
<div class="form-field"><label>Quantidade disponível<input name="stock" type="number" min="0" step="1" required placeholder="10"></label></div>
<div class="form-field"><label>Status<select name="status"><option value="rascunho">Rascunho</option><option value="ativo">Ativo no cadastro interno</option><option value="pausado">Pausado</option></select></label></div>
<div class="form-field"><label>Categoria<input name="category" maxlength="70" placeholder="Vestidos"></label></div>
<div class="form-field full"><label>Descrição<textarea name="description" maxlength="2000" placeholder="Tecido, tamanhos, cores e outros detalhes…"></textarea></label><small>Imagens e variações avançadas entram com a futura integração de vitrine.</small></div>
<div class="form-field full"><button class="btn primary" type="submit" ${previewMode?'disabled':''}>${icon('check')} Salvar produto</button></div>
</form></section>`;}
function replyForm(){return `<form id="ticket-reply" class="form-grid" style="margin-top:16px"><div class="form-field full"><label>Resposta ao cliente<textarea name="message" required maxlength="4000" placeholder="Escreva uma resposta clara e profissional…"></textarea></label></div><div class="form-field"><label>Status do atendimento<select name="status"><option value="em_andamento">Em andamento</option><option value="aguardando_cliente">Aguardando cliente</option><option value="resolvido">Resolvido</option></select></label></div><div class="form-field"><label>Enviar resposta ao histórico<button type="submit" class="btn primary" ${previewMode?'disabled':''}>${icon('message')} Registrar resposta</button></label></div></form>`;}
function ticketsNew(){return `<section class="panel"><h2>Abrir atendimento interno</h2><p>Para registrar contatos vindos de outros canais. A conversa no site para clientes será ligada ao mesmo banco quando criarmos o suporte público.</p><form id="ticket-create" class="form-grid" style="margin-top:20px"><div class="form-field"><label>Nome do cliente<input name="clientName" maxlength="100" required></label></div><div class="form-field"><label>E-mail de contato<input name="clientEmail" type="email" maxlength="160" required></label></div><div class="form-field"><label>Assunto<input name="subject" maxlength="130" required></label></div><div class="form-field"><label>Prioridade<select name="priority"><option value="normal">Normal</option><option value="alta">Alta</option></select></label></div><div class="form-field full"><label>Descrição do pedido<textarea name="description" maxlength="4000" required></textarea></label></div><div><button class="btn primary" ${previewMode?'disabled':''}>${icon('plus')} Registrar solicitação</button></div></form></section>`;}
function teamForm(){return `<section class="panel"><h2>Conceder acesso por cargo</h2><p>Apenas a proprietária e o responsável técnico podem promover pessoas. O e-mail deve já possuir uma conta cadastrada no Firebase Authentication.</p><form id="team-form" class="form-grid" style="margin-top:18px"><div class="form-field"><label>E-mail da pessoa<input type="email" name="email" required placeholder="E-mail da conta existente"></label></div><div class="form-field"><label>Cargo a atribuir<select name="role"><option value="admin1">ADM 1 — Gestão</option><option value="admin2">ADM 2 — Operações</option><option value="suporte">Atendimento</option><option value="catalogo">Catálogo</option><option value="analista">Analista</option><option value="revogar">Revogar acesso</option></select></label></div><div class="form-field full"><button type="submit" class="btn primary" ${previewMode?'disabled':''}>${icon('shield')} Confirmar alteração</button></div></form><div class="callout">Os cargos de Beatriz (proprietária) e Anderson (direção técnica) não podem ser atribuídos ou removidos por esta tela. A ativação inicial é feita de forma segura no servidor.</div></section>`;}
function roleMatrix(){return `<section class="panel"><h2>Hierarquia do painel</h2><p>Cargos exibidos com descrições de responsabilidade. As permissões reais devem ser conferidas nas regras e funções do servidor.</p><div class="rolematrix" style="margin-top:18px">${Object.keys(ROLE_LABEL).map(key=>`<div class="role-row"><strong>${esc(ROLE_LABEL[key])}</strong><p>${esc(ROLE_DESC[key])}</p></div>`).join('')}</div></section>`;}
function linksPanel(){return `<section class="panel"><h2>Instagram da marca</h2><p>Canal divulgado no topo da loja e nas páginas relevantes.</p><div class="toolbar"><a class="btn ghost" href="https://www.instagram.com/bia_modafeminia01/" target="_blank" rel="noopener noreferrer">${icon('instagram')} @bia_modafeminia01 ${icon('external-link')}</a></div><div class="callout">O selo usado no site identifica a página da marca; ele não indica verificação concedida pelo Instagram.</div></section>`;}
function statusPanel(id){const d=R[id]; const hints={
  vitrines:'Aqui ficarão as posições e o agendamento das vitrines da loja pública.',
  pedidos:'A integração de pedidos exige checkout e provedor de pagamento antes de colocar em produção.',
  pagamentos:'Nunca colete ou armazene dados completos de cartão no seu próprio código.',
  logs:'Somente eventos registrados pelo servidor devem aparecer como auditoria válida.',
  consentimentos:'As solicitações de dados dos clientes precisam seguir a LGPD e política de privacidade vigente.',
  backups:'Backups e restaurações deverão ser operados com credenciais e rotinas privadas, não no navegador.',
  cliques:'A contagem de cliques depende da instrumentação da vitrine com respeito às escolhas de privacidade.',
  publicacao:'GitHub conectado à Cloudflare Pages. A área mostra o fluxo; publicação e rollback usam os controles oficiais.',
  integracoes:'Firebase Auth, Firestore, provedor de pagamentos e entregas serão conectados por etapas.'};
  return `<section class="panel"><h2>${esc(d.title)}</h2><p>${esc(hints[id]||d.desc)}</p><div class="toolbar"><span class="tag amber">Módulo preparado · aguardando integração</span></div>${blank('Aguardando integração real','Esta tela tem sua própria rota e preserva a navegação, mas ainda não há dados ou ação de servidor habilitada.')}</section>`;
}
function recordsPanel(title,key){return `<section class="panel"><div class="toolbar"><h2>${esc(title)}</h2><span class="tag amber">Registros do banco</span></div><div class="data-target" data-collection="${esc(key)}">${blank('Carregando registros…','Aguarde a consulta autorizada.')}</div></section>`;}
function analyticsPanel(id){return `<section class="panel"><h2>${esc(R[id].title)}</h2><p>O gráfico exibirá apenas números medidos e agregados. Nenhum dado fictício será mostrado como resultado da loja.</p><div class="data-target" data-collection="analytics_daily">${blank('Aguardando coleta real','Ainda não existem eventos medidos nesta integração.')}</div></section>`;}
function ticketDetail(id){return `<section class="panel" data-ticket-id="${esc(id)}"><h2>Conversa do atendimento</h2><p>Mensagens vinculadas ao ticket, sem misturar clientes ou operadores.</p><div class="data-target" data-collection="ticket_detail">${blank('Abrindo conversa…','Consultando histórico autorizado.')}</div></section>`;}
function mainHtml(key){let id=key.split('::')[0],d=R[id]||{title:'Atendimento',desc:'Detalhamento do atendimento.',icon:'message',area:'suporte'};if(id==='dashboard')return dashboardHtml();if(GROUPS[id])return sectionHtml(id);let content='';switch(id){
case 'novo-produto':content=productForm();break;
case 'produtos':content=recordsPanel('Catálogo interno','admin_products');break;
case 'fila-suporte':content=recordsPanel('Tickets de suporte','support_tickets');break;
case 'novo-atendimento':content=ticketsNew();break;
case 'ticket-detail':content=ticketDetail(key.split('::')[1]||'');break;
case 'membros':content=recordsPanel('Equipe autorizada','admin_team');break;
case 'adicionar-adm':content=teamForm();break;
case 'cargos':case 'permissoes':content=roleMatrix();break;
case 'logs':case 'auditoria':case 'acessos-equipe':content=recordsPanel('Eventos de auditoria','audit_logs');break;
case 'todos-pedidos':content=recordsPanel('Pedidos da loja','admin_orders');break;
case 'instagram':content=linksPanel();break;
case 'visitantes':case 'cliques':case 'produtos-vistos':case 'funil':case 'campanhas':case 'relatorios':content=analyticsPanel(id);break;
default:content=statusPanel(id);break;
}
return intro(d,'CENTRAL / '+esc(d.area.toUpperCase()))+content;}
function screenNode(key){const id=key.split('::')[0],node=document.createElement('section');node.className='view';node.dataset.screen=key;node.dataset.area=R[id]?.area||'suporte';node.innerHTML=mainHtml(key);return node;}
function setActive(index){if(index<0||index>=routeEntries.length)return;const old=routeEntries[activeIndex];if(old){old.scroll=window.scrollY;old.node.hidden=true;}activeIndex=index;const next=routeEntries[index];next.node.hidden=false;const id=next.key.split('::')[0],d=R[id]||{title:'Conversa',area:'suporte'};$('#top-title').textContent=d.title;$('#breadcrumb').textContent=`CENTRAL / ${d.area.toUpperCase()}`;$('#back-btn').disabled=index===0;document.title=`${d.title} · BIA ADM`;document.querySelectorAll('[data-nav]').forEach(b=>b.classList.toggle('active',b.dataset.nav===(GROUPS[id]?id:d.area==='geral'?'dashboard':d.area)));$('#sidebar').classList.remove('open');requestAnimationFrame(()=>window.scrollTo({top:next.scroll||0,behavior:'instant'}));}
function navigate(key){const id=key.split('::')[0];if(id!=='ticket-detail' && !R[id])return notify('Tela não disponível.');const area=R[id]?.area||'suporte';if(!permitted(area)){return notify('Seu cargo não permite acessar esta área.');}if(routeEntries[activeIndex]?.key===key)return;routeEntries[activeIndex].scroll=window.scrollY;routeEntries=routeEntries.slice(0,activeIndex+1);const node=screenNode(key);$('#screen-host').append(node);routeEntries.push({key,node,scroll:0});const i=routeEntries.length-1;history.pushState({biaAdm:true,idx:i,key},'',`#${encodeURIComponent(key)}`);setActive(i);loadData(node,key);}
function startShell(){
  $('#gate').hidden=true;$('#admin-shell').hidden=false;if(previewMode){$('#preview-banner').hidden=false;}
  $('#account-name').textContent=previewMode?'Prévia do painel':currentUser?.displayName||currentUser?.email||'Equipe autorizada';
  $('#account-role').textContent=previewMode?'Demonstração (sem dados)':''+(ROLE_LABEL[role]||'Administrativo');
  $('#live-status').textContent=previewMode?'Modo de prévia':'Acesso autorizado';
  renderNav();$('#screen-host').textContent='';const initial='dashboard';const node=screenNode(initial);$('#screen-host').append(node);routeEntries=[{key:initial,node,scroll:0}];activeIndex=0;history.replaceState({biaAdm:true,idx:0,key:initial},'',`#${initial}`);setActive(0);loadData(node,initial);
}
$('#admin-shell').addEventListener('click',e=>{const target=e.target.closest('[data-nav]');if(target){e.preventDefault();navigate(target.dataset.nav);} });
$('#back-btn').addEventListener('click',()=>{if(activeIndex>0)history.back();});
$('#menu-open').addEventListener('click',()=>{$('#sidebar').classList.toggle('open');});
window.addEventListener('popstate',e=>{if(e.state?.biaAdm && Number.isInteger(e.state.idx) && routeEntries[e.state.idx]?.key===e.state.key){setActive(e.state.idx);return;}if($('#admin-shell').hidden)return;const id=decodeURIComponent(location.hash.slice(1));const ix=routeEntries.findIndex(x=>x.key===id);if(ix>=0)setActive(ix);});
$('#signout').addEventListener('click',async()=>{if(previewMode){notify('Esta é apenas uma prévia.');return;}try{await authLib.signOut(auth);location.replace('../');}catch{notify('Não foi possível sair. Tente novamente.')}});
const listenOnce=new WeakSet();
function wireForms(node,key){if(listenOnce.has(node))return;listenOnce.add(node);const prod=node.querySelector('#product-form');if(prod)prod.addEventListener('submit',submitProduct);const ticket=node.querySelector('#ticket-create');if(ticket)ticket.addEventListener('submit',createTicket);const staff=node.querySelector('#team-form');if(staff)staff.addEventListener('submit',assignRole);const reply=node.querySelector('#ticket-reply');if(reply)reply.addEventListener('submit',submitReply);}
async function submitProduct(e){e.preventDefault();if(previewMode)return;const f=e.currentTarget,d=new FormData(f);if(!permitted('catalogo'))return notify('Sem permissão.');const name=String(d.get('name')||'').trim(),sku=String(d.get('sku')||'').trim(),price=Number(d.get('price')),stock=Number(d.get('stock'));if(name.length<3||!sku||!Number.isFinite(price)||price<0||!Number.isInteger(stock)||stock<0)return notify('Revise os dados do produto.');try{await firestore.addDoc(firestore.collection(db,'admin_products'),{name,sku,price,stock,status:String(d.get('status')),category:String(d.get('category')||'').trim(),description:String(d.get('description')||'').trim(),createdAt:firestore.serverTimestamp(),updatedAt:firestore.serverTimestamp(),authorUid:currentUser.uid});notify('Produto salvo no cadastro interno.');f.reset();}catch(err){notify('Não foi possível salvar. Confira permissões e conexão.');console.warn(err.code||err.message)}}
async function createTicket(e){e.preventDefault();if(previewMode)return;const f=e.currentTarget,d=new FormData(f);try{await firestore.addDoc(firestore.collection(db,'support_tickets'),{clientName:String(d.get('clientName')).trim(),clientEmail:String(d.get('clientEmail')).trim(),subject:String(d.get('subject')).trim(),description:String(d.get('description')).trim(),priority:String(d.get('priority')),status:'aberto',createdAt:firestore.serverTimestamp(),updatedAt:firestore.serverTimestamp(),createdBy:currentUser.uid});notify('Atendimento interno criado.');f.reset();}catch(err){notify('Falha ao criar atendimento.');console.warn(err.code||err.message)}}
async function assignRole(e){e.preventDefault();if(previewMode)return;if(!owner())return notify('Apenas os fundadores podem conceder cargos.');const f=e.currentTarget,d=new FormData(f);const email=String(d.get('email')||'').trim(),newRole=String(d.get('role')||'');if(!email.includes('@'))return notify('Informe um e-mail válido.');if(!['admin1','admin2','suporte','catalogo','analista','revogar'].includes(newRole))return notify('Cargo inválido.');if(!confirm(`Confirmar ${newRole} para ${email}?`))return;try{const call=functionsLib.httpsCallable(cloudFns,'manageTeam');await call({email,role:newRole});notify('Alteração registrada. O usuário precisa renovar a sessão.');f.reset();}catch(err){notify('Não foi possível atribuir o cargo: '+(err.code||'verifique o backend.'));}}
async function submitReply(e){e.preventDefault();if(previewMode)return;const f=e.currentTarget,d=new FormData(f);const view=f.closest('[data-ticket-id]'),id=view?.dataset.ticketId,msg=String(d.get('message')||'').trim(),status=String(d.get('status')||'em_andamento');if(!id||msg.length<2)return notify('Escreva sua resposta.');try{await firestore.addDoc(firestore.collection(db,'support_tickets',id,'messages'),{text:msg,authorUid:currentUser.uid,authorName:currentUser.displayName||'Equipe',kind:'staff',createdAt:firestore.serverTimestamp()});await firestore.updateDoc(firestore.doc(db,'support_tickets',id),{status,updatedAt:firestore.serverTimestamp()});notify('Resposta gravada no histórico interno.');f.reset();loadData(f.closest('.view'),`ticket-detail::${id}`);}catch(err){notify('Não foi possível salvar resposta.');console.warn(err.code||err.message)}}
function table(headers,rows){return `<div class="table-wrap"><table class="table"><thead><tr>${headers.map(s=>`<th>${esc(s)}</th>`).join('')}</tr></thead><tbody>${rows.map(row=>`<tr>${row.map(cell=>`<td>${cell}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;}
async function loadData(node,key){wireForms(node,key);if(previewMode)return;const target=node.querySelector('.data-target');if(!target)return;const type=target.dataset.collection;try{
if(type==='ticket_detail'){
 const id=key.split('::')[1];if(!id){target.innerHTML=blank('Atendimento não encontrado');return;}
 const ticketDoc=await firestore.getDoc(firestore.doc(db,'support_tickets',id));if(!ticketDoc.exists()){target.innerHTML=blank('Atendimento não encontrado');return;}
 const t=ticketDoc.data();const msgs=await firestore.getDocs(firestore.query(firestore.collection(db,'support_tickets',id,'messages'),firestore.limit(100)));const m=[...msgs.docs].sort((a,b)=>((a.data().createdAt?.seconds||0)-(b.data().createdAt?.seconds||0)));target.innerHTML=`<div class="ticket-detail"><div><div class="panel"><h2>${esc(t.subject)}</h2><p>${esc(t.description)}</p></div><div class="message-thread">${m.length?m.map(x=>{const z=x.data();return `<article class="msg ${z.kind==='staff'?'staff':''}"><small>${esc(z.authorName||'Cliente')} · ${esc(fmtDate(z.createdAt))}</small><p>${esc(z.text)}</p></article>`;}).join(''):blank('Sem respostas ainda','Você pode registrar a primeira resposta abaixo.')}</div>${replyForm()}</div><aside class="panel"><h2>Detalhes</h2><p>Cliente: ${esc(t.clientName||'—')}</p><p>Contato: ${esc(t.clientEmail||'—')}</p><p>Status: ${esc(t.status||'—')}</p><p>Prioridade: ${esc(t.priority||'—')}</p></aside></div>`;wireForms(node,key);const reply=target.querySelector('#ticket-reply');reply?.addEventListener('submit',submitReply);return;
}
 const snap=await firestore.getDocs(firestore.query(firestore.collection(db,type),firestore.limit(70)));const rows=snap.docs.map(x=>({id:x.id,...x.data()}));if(rows.length===0){target.innerHTML=blank('Sem registros no momento','Quando esta área receber registros autorizados, aparecerão aqui.');return;}
 if(type==='admin_products')target.innerHTML=table(['Produto','SKU','Preço','Estoque','Status'],rows.map(x=>[esc(x.name),esc(x.sku),esc(currency(x.price)),esc(x.stock),`<span class="tag">${esc(x.status)}</span>`]));
 else if(type==='support_tickets')target.innerHTML=table(['Assunto','Cliente','Prioridade','Status','Ação'],rows.map(x=>[esc(x.subject),esc(x.clientName),esc(x.priority),`<span class="tag">${esc(x.status)}</span>`,`<button class="tap" data-nav="ticket-detail::${esc(x.id)}">Abrir conversa →</button>`]));
 else if(type==='admin_team')target.innerHTML=table(['Nome / E-mail','Patente','Atualização'],rows.map(x=>[esc(x.email||x.name||x.uid),esc(ROLE_LABEL[x.role]||x.role),esc(fmtDate(x.updatedAt))]));
 else if(type==='audit_logs')target.innerHTML=table(['Data','Operação','Responsável','Alvo'],rows.map(x=>[esc(fmtDate(x.at)),esc(x.action||x.event),esc(x.actorUid),esc(x.targetUid||x.targetId||'—')]));
 else if(type==='admin_orders')target.innerHTML=table(['Código','Situação','Valor','Data'],rows.map(x=>[esc(x.number||x.id),esc(x.status),esc(currency(x.total)),esc(fmtDate(x.createdAt))]));
 else if(type==='analytics_daily'){
   const values=rows.map(x=>({date:String(x.day||x.id),clicks:Number(x.clicks||0),visits:Number(x.visits||0)})).sort((a,b)=>a.date.localeCompare(b.date)).slice(-14),max=Math.max(1,...values.map(x=>x.clicks));target.innerHTML=`<div class="stat-grid">${stat('Dias contabilizados','calendar')}${stat('Eventos coletados','bolt')}${stat('Acessos','eye')}${stat('Relatório','chart')}</div><div class="chart-area">${values.map(x=>`<div class="chart-bar" style="height:${Math.max(2,Math.round((x.clicks/max)*100))}%" title="${esc(x.date)}: ${x.clicks} cliques"></div>`).join('')}</div><div class="chart-legend"><span>${esc(values[0]?.date||'—')}</span><span>Cliques medidos · ${values.reduce((s,x)=>s+x.clicks,0)}</span><span>${esc(values.at(-1)?.date||'—')}</span></div>`;
 }
}catch(err){target.innerHTML=blank('Não foi possível consultar esta área','Verifique a conexão, suas permissões e as regras publicadas no Firebase.');console.warn('ADM read error',err.code||err.message);}}
async function boot(){initIcons();if(previewMode){startShell();return;}const c=window.BIA_FIREBASE_CONFIG||{};const configured=['apiKey','authDomain','projectId','appId'].every(k=>typeof c[k]==='string'&&c[k].trim().length>0);if(!configured){$('#gate-status').textContent='Aguardando configuração Firebase. Nenhum acesso administrativo foi liberado.';return;}
 try{
 const [a,au,fs,fn]=await Promise.all([import('https://www.gstatic.com/firebasejs/13.4.0/firebase-app.js'),import('https://www.gstatic.com/firebasejs/13.4.0/firebase-auth.js'),import('https://www.gstatic.com/firebasejs/13.4.0/firebase-firestore.js'),import('https://www.gstatic.com/firebasejs/13.4.0/firebase-functions.js')]);authLib=au;firestore=fs;functionsLib=fn;const app=a.initializeApp(c,'bia-admin-v3');auth=au.getAuth(app);auth.languageCode='pt-BR';db=fs.getFirestore(app);cloudFns=fn.getFunctions(app,'southamerica-east1');
 au.onAuthStateChanged(auth,async user=>{if(!user){$('#gate-status').textContent='Entre com uma conta que tenha patente administrativa ativa.';$('#gate-form').hidden=false;$('#admin-shell').hidden=true;$('#gate').hidden=false;return;}try{const token=await au.getIdTokenResult(user,true);const claim=token.claims.biaRole;if(!ROLE_LABEL[claim])throw new Error('role-missing');role=claim;currentUser=user;startShell();}catch(error){$('#gate-status').textContent='Conta sem cargo administrativo autorizado. Procure a proprietária ou a direção técnica.';$('#gate-form').hidden=true;$('#admin-shell').hidden=true;$('#gate').hidden=false;}});
 $('#gate-form').addEventListener('submit',async e=>{e.preventDefault();const form=e.currentTarget;form.querySelector('button').disabled=true;try{await au.signInWithEmailAndPassword(auth,$('#gate-email').value.trim(),$('#gate-password').value);}catch(err){$('#gate-status').textContent='Não foi possível entrar. Confira os dados e a autorização.';}finally{form.querySelector('button').disabled=false;$('#gate-password').value='';}});
 }catch(error){$('#gate-status').textContent='Erro ao inicializar serviço de login. Verifique conexão e configuração.';console.error('ADM init',error.code||error.message);}
}
boot();
