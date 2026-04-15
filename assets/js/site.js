
(() => {
  const root = document.documentElement;
  const current = location.pathname.split('/').pop() || 'index.html';
  const saved = localStorage.getItem('ddingpack-theme') || 'dark';
  root.classList.toggle('dark', saved === 'dark');
  const syncTheme = () => {
    const dark = root.classList.contains('dark');
    localStorage.setItem('ddingpack-theme', dark ? 'dark' : 'light');
    document.querySelectorAll('[data-theme-icon]').forEach(el => el.textContent = dark ? 'dark_mode' : 'light_mode');
    document.querySelectorAll('[data-theme-label]').forEach(el => el.textContent = dark ? '다크 모드' : '라이트 모드');
  };
  syncTheme();
  document.querySelectorAll('[data-theme-toggle]').forEach(btn => btn.addEventListener('click', () => { root.classList.toggle('dark'); syncTheme(); }));

  const drawer = document.querySelector('[data-mobile-drawer]');
  document.querySelectorAll('[data-mobile-menu]').forEach(btn => btn.addEventListener('click', ()=> drawer?.classList.add('show')));
  document.querySelectorAll('[data-mobile-close]').forEach(btn => btn.addEventListener('click', ()=> drawer?.classList.remove('show')));

  const assist = document.querySelector('[data-assist]');
  document.querySelectorAll('[data-assist-open]').forEach(btn => btn.addEventListener('click', ()=> assist?.classList.remove('hidden')));
  document.querySelectorAll('[data-assist-close]').forEach(btn => btn.addEventListener('click', ()=> assist?.classList.add('hidden')));

  const welcome = document.querySelector('.welcome-overlay');
  if (welcome) {
    const seen = localStorage.getItem('ddingpack-welcome-seen') === '1';
    if (!seen) welcome.classList.add('show');
    document.querySelectorAll('[data-welcome-enter]').forEach(btn => btn.addEventListener('click', () => { localStorage.setItem('ddingpack-welcome-seen', '1'); welcome.classList.remove('show'); }));
    document.querySelectorAll('[data-reopen-welcome]').forEach(btn => btn.addEventListener('click', () => welcome.classList.add('show')));
    welcome.addEventListener('click', (e) => { if (e.target === welcome) welcome.classList.remove('show'); });
  }

  document.querySelectorAll('.toast-close').forEach(btn => btn.addEventListener('click', ()=> btn.closest('.toast-area')?.remove()));

  (function initChannelTalk(){
    var w=window; if(w.ChannelIO) return;
    var ch=function(){ ch.c(arguments); }; ch.q=[]; ch.c=function(args){ ch.q.push(args); }; w.ChannelIO=ch;
    function l(){ if(w.ChannelIOInitialized) return; w.ChannelIOInitialized=true; var s=document.createElement('script'); s.type='text/javascript'; s.async=true; s.src='https://cdn.channel.io/plugin/ch-plugin-web.js'; var x=document.getElementsByTagName('script')[0]; x.parentNode.insertBefore(s,x); }
    if(document.readyState==='complete') l(); else w.addEventListener('DOMContentLoaded', l);
    w.ChannelIO('boot',{pluginKey:'5a172fdc-10ee-45ca-b437-b1c63541c969', language:'ko'});
  })();
})();
