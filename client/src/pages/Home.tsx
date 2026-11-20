import { useEffect, useState } from 'react';
import { ArrowDown, ArrowRight, ArrowUpRight, Check, CheckCircle2, ChevronRight, CircleHelp, Clipboard, Clock3, FileText, Fingerprint, Globe2, Info, LockKeyhole, Printer, RotateCcw, ShieldCheck, Trash2 } from 'lucide-react';
import { checklist, links, spanishTemplate } from '../tie-data';

type Tab = 'route' | 'norecord' | 'documents' | 'sources';
type Attempt = { id: string; at: string };
const KEYS = { checks: 'tie-guide-checks-v1', attempts: 'tie-guide-attempts-v1' };
function readLocal<T>(key: string, fallback: T): T {
  try { const value = localStorage.getItem(key); return value ? JSON.parse(value) as T : fallback; } catch { return fallback; }
}
function ExtLink({ href, children, className = '' }: { href: string; children: React.ReactNode; className?: string }) {
  return <a className={className} href={href} target="_blank" rel="noreferrer">{children}<ArrowUpRight size={15} aria-hidden="true" /></a>;
}

export default function Home() {
  const [tab, setTab] = useState<Tab>('route');
  const [checked, setChecked] = useState<string[]>(() => readLocal(KEYS.checks, []));
  const [attempts, setAttempts] = useState<Attempt[]>(() => readLocal(KEYS.attempts, []));
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const [storageUnavailable, setStorageUnavailable] = useState(false);
  useEffect(() => {
    try { localStorage.setItem(KEYS.checks, JSON.stringify(checked)); localStorage.setItem(KEYS.attempts, JSON.stringify(attempts)); setStorageUnavailable(false); }
    catch { setStorageUnavailable(true); }
  }, [checked, attempts]);
  const changeTab = (next: Tab) => { setTab(next); setTimeout(() => document.getElementById(`tab-${next}`)?.focus(), 0); };
  const jump = (next: Tab) => { changeTab(next); setTimeout(() => document.getElementById('guide')?.scrollIntoView({behavior:'smooth',block:'start'}), 30); };
  const toggle = (id: string) => setChecked(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const addAttempt = () => setAttempts(prev => [{id: `${Date.now()}-${Math.random().toString(16).slice(2)}`, at: new Date().toISOString()}, ...prev]);
  const copy = async () => {
    try { await navigator.clipboard.writeText(spanishTemplate); setCopied(true); setCopyError(false); window.setTimeout(() => setCopied(false), 3000); }
    catch { setCopyError(true); }
  };
  const formatted = (value: string) => new Intl.DateTimeFormat('ru-RU', {day:'numeric', month:'long', year:'numeric', hour:'2-digit', minute:'2-digit'}).format(new Date(value));
  const tabs: {id:Tab; label:string}[] = [{id:'route',label:'Путь к TIE'}, {id:'norecord',label:'Нет записи'}, {id:'documents',label:'Документы'}, {id:'sources',label:'Источники'}];
  const onTabKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next = index;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    else if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = tabs.length - 1;
    else return;
    event.preventDefault();
    changeTab(tabs[next].id);
  };
  return <div className="site">
    <header className="topbar"><div className="top-inner">
      <a className="brand" href="#top" aria-label="TIE спокойно — на главную"><img src="/logo.svg" alt=""/><span><b>TIE</b> спокойно<small>Независимый помощник</small></span></a>
      <nav className="top-nav" aria-label="Разделы"><button onClick={() => jump('route')}>Как это работает</button><button onClick={() => jump('documents')}>Чек-лист</button><button onClick={() => jump('sources')}>Источники</button></nav>
      <span className="language"><Globe2 size={15}/> RU</span>
    </div></header>
    <main id="top">
      <section className="hero"><div className="hero-inner">
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-dot"/> ПОНЯТНЫЙ МАРШРУТ В ИСПАНИИ</div>
          <h1>Запись на TIE.<br/><em>Шаг за шагом.</em></h1>
          <p className="hero-lead">Одобрение получено, а дальше всё непонятно? Поможем разобраться с записью на отпечатки и подготовкой к визиту.</p>
          <div className="hero-actions"><button className="primary-btn" onClick={() => jump('route')}>Разобраться с записью <ArrowRight size={18}/></button><button className="text-btn" onClick={() => jump('norecord')}>Нет свободных мест? <ArrowDown size={16}/></button></div>
          <div className="hero-trust"><LockKeyhole size={16}/><span>Без регистрации и загрузки документов</span></div>
        </div>
        <div className="hero-art" aria-label="Три этапа получения карты TIE">
          <div className="art-top"><span>ВАШ МАРШРУТ</span><span className="stamp">01 / 03</span></div>
          <h2>От решения<br/>до карточки.</h2>
          <p>Три этапа, которые полезно не путать.</p>
          <div className="path-steps"><div><span className="path-number">01</span><section><b>Одобрение</b><small>Получено решение по вашему делу</small></section><Check size={17}/></div><div><span className="path-number active">02</span><section><b>Визит на отпечатки</b><small>Запись и подготовка документов</small></section><Fingerprint size={18}/></div><div><span className="path-number">03</span><section><b>Получение TIE</b><small>Физическая карта оформляется отдельно</small></section><ChevronRight size={17}/></div></div>
          <div className="art-foot">ПРИМЕЧАНИЕ <span>Порядок зависит от вашей ситуации</span></div>
        </div>
      </div><div className="hero-bottom"><span>РУССКИЙ ЯЗЫК · ОФИЦИАЛЬНЫЕ ССЫЛКИ</span><span>ПРОВЕРЕНО 18 НОЯБРЯ 2026</span></div></section>
      <section className="notice-strip"><Info size={18}/><p><b>Важно:</b> этот помощник не ищет и не бронирует свободные места. Запись вы делаете сами на государственном сайте.</p></section>
      <section className="workspace" id="guide">
        <div className="workspace-heading"><div><span className="section-kicker">ПРАКТИЧЕСКИЙ ПОМОЩНИК</span><h2>Ваш следующий шаг</h2><p>Выберите, что нужно именно сейчас.</p></div><div className="verified"><ShieldCheck size={16}/> Ссылки на официальные сайты</div></div>
        <div className="tabs" role="tablist" aria-label="Путеводитель">{tabs.map((t, index) => <button key={t.id} id={`tab-${t.id}`} role="tab" aria-selected={tab===t.id} aria-controls="guide-panel" tabIndex={tab===t.id ? 0 : -1} className={tab===t.id ? 'selected' : ''} onClick={() => changeTab(t.id)} onKeyDown={event => onTabKeyDown(event, index)}>{t.label}</button>)}</div>
        <div className="content-layout">
          <div className="content-main">
            {tab === 'route' && <div className="panel route-panel" id="guide-panel" role="tabpanel" aria-labelledby="tab-route" tabIndex={0}>
              <div className="panel-label">НАЧНИТЕ ЗДЕСЬ <span>01 — 03</span></div><h3>Сначала разберёмся с записью.</h3><p className="panel-intro">Маршрут предназначен для взрослых после одобрения первоначального временного проживания или его продления. Для детей, студентов, членов семьи граждан ЕС, долгосрочной резиденции и других случаев уточните отдельные требования в ведомстве.</p>
              <div className="route-item"><div className="route-num">01</div><div><h4>Откройте государственный портал</h4><p>Выберите свою провинцию. Затем найдите подходящую процедуру, связанную с TIE и отпечатками, и прочитайте её описание. Названия в разных провинциях могут отличаться.</p><ExtLink className="inline-link" href={links.cita}>Официальный портал записи</ExtLink></div></div>
              <div className="route-item"><div className="route-num">02</div><div><h4>Проверьте детали и документы</h4><p>Уточните требования конкретного отделения. После выбора процедуры система показывает дальнейшие шаги и доступные варианты, если они есть.</p><button className="inline-button" onClick={() => changeTab('documents')}>Открыть чек-лист <ArrowRight size={15}/></button></div></div>
              <div className="route-item"><div className="route-num">03</div><div><h4>Нет свободной даты?</h4><p>Вы можете зафиксировать свои попытки и обратиться за разъяснением. Мы не проверяем наличие мест и не прогнозируем их появление.</p><button className="inline-button" onClick={() => changeTab('norecord')}>Что делать, если нет записи <ArrowRight size={15}/></button></div></div>
              <div className="soft-callout"><CircleHelp size={20}/><p><b>NIE — это номер, TIE — карта.</b> Одобрение, запись на отпечатки и получение карты — разные этапы. При сомнениях уточните свою процедуру в ведомстве.</p></div>
            </div>}
            {tab === 'norecord' && <div className="panel" id="guide-panel" role="tabpanel" aria-labelledby="tab-norecord" tabIndex={0}>
              <div className="panel-label">ЕСЛИ МЕСТ ПОКА НЕТ <span>РУЧНОЙ ПЛАН</span></div><h3>Что делать, если записи нет.</h3><p className="panel-intro">Не стоит пытаться обходить ограничения портала. Сохраните факты для себя и уточните порядок действий в официальном ведомстве.</p>
              <div className="steps-compact"><div><b>1</b><p>Вручную откройте портал и проверьте свою провинцию и подходящую процедуру.</p></div><div><b>2</b><p>Если мест нет, при желании отметьте ниже дату и время своей проверки. Скриншоты храните у себя.</p></div><div><b>3</b><p>Если срок приближается, уже истёк или случай сложный, свяжитесь с профильным ведомством или квалифицированным специалистом. Мы не определяем правовые последствия.</p></div></div>
              <ExtLink className="outline-btn" href={links.cita}>Перейти к записи <ArrowRight size={16}/></ExtLink>
              <div className="block-divider"/>
              <div className="subheading"><div><span className="section-kicker">ТОЛЬКО НА ЭТОМ УСТРОЙСТВЕ</span><h4>Журнал моих проверок</h4></div><Clock3 size={20}/></div>
              <p className="small-copy">Отмечайте только реальные самостоятельные проверки. Журнал — личная заметка, а не доказательство соблюдения сроков и не регистрация обращения.</p>
              <button className="dark-btn" onClick={addAttempt}>Отметить проверку сейчас <Check size={16}/></button>
              {attempts.length === 0 ? <div className="empty-log">Пока нет отметок. Здесь появятся дата и время вашей проверки.</div> : <div className="log-list">{attempts.map((a, i) => <div key={a.id}><span><CheckCircle2 size={16}/>{formatted(a.at)}</span><button onClick={() => setAttempts(prev => prev.filter(x => x.id!==a.id))} aria-label={`Удалить отметку ${i+1}`}><Trash2 size={15}/></button></div>)}<button className="clear-link" onClick={() => setAttempts([])}>Удалить все отметки</button></div>}
              <div className="block-divider"/>
              <div className="subheading"><div><span className="section-kicker">ГОТОВЫЙ ТЕКСТ</span><h4>Как спросить по-испански</h4></div><FileText size={20}/></div><p className="small-copy">Подставьте провинцию и проверьте текст перед отправкой. Не добавляйте персональные данные, пока не убедитесь, что обращаетесь через официальный канал.</p>
              <textarea className="template" readOnly value={spanishTemplate} aria-label="Шаблон обращения на испанском"/>
              <div className="template-actions"><button className="outline-btn" onClick={copy}><Clipboard size={16}/> {copied ? 'Скопировано' : 'Скопировать текст'}</button><ExtLink className="inline-link" href={links.offices}>Контакты Extranjería</ExtLink></div>
              {copyError && <p className="small-copy">Браузер не разрешил копирование. Выделите текст выше и скопируйте вручную.</p>}
              <div className="soft-callout"><Info size={20}/><p>Вопросы о работе самого сайта можно направить через <ExtLink className="inline-link" href={links.tech}>официальный контакт портала</ExtLink>. Личный журнал не передаётся ведомству.</p></div>
            </div>}
            {tab === 'documents' && <div className="panel" id="guide-panel" role="tabpanel" aria-labelledby="tab-documents" tabIndex={0}>
              <div className="panel-label">ПЕРЕД ПРИЁМОМ <span>{checked.length} / {checklist.length}</span></div><h3>Чек-лист подготовки.</h3><p className="panel-intro">Это ориентир, а не полный перечень для всех. До визита обязательно уточните требования своего отделения и тип вашей процедуры.</p>
              <div className="progress-track" aria-label={`Отмечено ${checked.length} из ${checklist.length}`}><span style={{width:`${checked.length/checklist.length*100}%`}}/></div>
              <div className="checks">{checklist.map(item => <div className={`check-row ${checked.includes(item.id)?'done':''}`} key={item.id}><label><input type="checkbox" checked={checked.includes(item.id)} onChange={() => toggle(item.id)}/><span className="check-box"><Check size={13}/></span><span><b>{item.title}</b><small>{item.description}</small></span></label>{item.link && <ExtLink className="check-link" href={item.link}>{item.linkText}</ExtLink>}</div>)}</div>
              <div className="check-actions"><button className="clear-link" onClick={() => setChecked([])}><RotateCcw size={15}/> Сбросить отметки</button><button className="clear-link" onClick={() => window.print()}><Printer size={15}/> Распечатать страницу</button></div>
              <div className="soft-callout"><Info size={20}/><p>Не выбирайте пункт пошлины только по размеру суммы или совету из чата. Проверьте категорию по своему основанию; при сомнениях обратитесь в ведомство.</p></div>
            </div>}
            {tab === 'sources' && <div className="panel" id="guide-panel" role="tabpanel" aria-labelledby="tab-sources" tabIndex={0}><div className="panel-label">ОСНОВА ПОМОЩНИКА <span>18.11.2026</span></div><h3>Официальные источники.</h3><p className="panel-intro">Информация могла измениться после проверки. Перед действием сверяйтесь с первоисточником и своим отделением.</p>
              <div className="source-list"><ExtLink href={links.cita}><span><b>Государственный портал записи</b><small>Выбор провинции и запись на приём</small></span></ExtLink><ExtLink href={links.police}><span><b>Национальная полиция: первичная TIE и после продления</b><small>Процедура, EX-17 и модель пошлины</small></span></ExtLink><ExtLink href={links.ex17}><span><b>Официальная форма EX-17</b><small>Министерство миграции</small></span></ExtLink><ExtLink href={links.fee}><span><b>Пошлина 790, код 012</b><small>Официальная форма Национальной полиции</small></span></ExtLink><ExtLink href={links.offices}><span><b>Контакты офисов Extranjería</b><small>Контакты по провинциям</small></span></ExtLink><ExtLink href={links.policeOffices}><span><b>Поиск отделений полиции</b><small>Официальный локатор подразделений</small></span></ExtLink><ExtLink href={links.legal}><span><b>Правила портала записи</b><small>Юридическое уведомление, включая автоматизированный доступ</small></span></ExtLink><ExtLink href={links.regreso}><span><b>Autorización de regreso</b><small>Официальная информация, если планируется выезд</small></span></ExtLink></div>
            </div>}
          </div>
          <aside className="sidebar"><div className="side-card"><span className="section-kicker">В ВАШЕМ ТЕМПЕ</span><div className="side-icon"><Fingerprint size={25}/></div><h3>Один шаг<br/>за раз.</h3><p>Отмечайте подготовленное в чек-листе. Мы сохраним отметки в браузере этого устройства.</p><button onClick={() => changeTab('documents')}>Открыть чек-лист <ArrowRight size={16}/></button><div className="side-progress"><span>ВЫ ОТМЕТИЛИ</span><b>{checked.length} <small>/ {checklist.length}</small></b></div><div className="side-track"><span style={{width:`${checked.length/checklist.length*100}%`}}/></div></div>
          <div className="side-help"><div className="side-help-icon"><LockKeyhole size={18}/></div><h4>Личные данные остаются у вас</h4><p>Для работы помощника не нужны паспорт, NIE, номера дел, SMS-коды или сканы. Отметки и журнал хранятся только в этом браузере.</p>{storageUnavailable && <p className="storage-warning" role="alert">Браузер не разрешил сохранить или удалить данные. Прежние отметки могут остаться: при необходимости очистите данные сайта в настройках браузера.</p>}<button onClick={() => {setChecked([]); setAttempts([]);}}>Удалить мои отметки и журнал <Trash2 size={14}/></button></div>
          <div className="side-urgent"><span>ЕСТЬ СЛОЖНЫЙ ВОПРОС?</span><p>Дети, студенческий статус, долгосрочная резиденция, сроки или выезд из Испании требуют отдельной проверки.</p><ExtLink href={links.offices}>Уточнить в ведомстве</ExtLink></div></aside>
        </div>
      </section>
      <section className="disclaimer"><div><span className="section-kicker">ЧЕСТНО О ГРАНИЦАХ</span><h2>Помощник, а не ведомство.</h2></div><p>Это независимый информационный прототип. Он не связан с государственными органами Испании, не заменяет юриста и не гарантирует получение записи или карты. Он не определяет последствия пропущенного срока. Если сомневаетесь, свяжитесь с ведомством или квалифицированным специалистом.</p></section>
    </main>
    <footer><div className="footer-inner"><div className="footer-brand"><img src="/logo.svg" alt=""/><span><b>TIE</b> спокойно<small>Независимый помощник на русском</small></span></div><p>Информация проверена 18 ноября 2026 года.<br/>Официальные требования могут измениться.</p><a href="https://github.com/alejoas1981" target="_blank" rel="noreferrer">Aleksey Savchenko · GitHub <ArrowUpRight size={15}/></a><button onClick={() => jump('sources')}>Все источники <ArrowUpRight size={15}/></button></div></footer>
  </div>;
}
