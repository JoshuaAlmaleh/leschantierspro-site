/* LesChantiersPro — small progressive-enhancement script. No dependencies. */
(function(){
  var d=document, root=d.documentElement;
  root.classList.remove('no-js');
  // Sticky header shadow
  var hdr=d.querySelector('.hdr');
  function onScroll(){ if(hdr) hdr.classList.toggle('scrolled', window.scrollY>8); }
  window.addEventListener('scroll', onScroll, {passive:true}); onScroll();
  // Mobile menu
  var btn=d.querySelector('.menu-btn'), mnav=d.getElementById('mnav');
  if(btn&&mnav){ btn.addEventListener('click',function(){ var o=mnav.classList.toggle('open'); btn.setAttribute('aria-expanded', o?'true':'false'); }); }
  // Remember language choice when the visitor uses the switcher
  d.querySelectorAll('[data-setlang]').forEach(function(a){ a.addEventListener('click',function(){ try{localStorage.setItem('lcp_lang',a.getAttribute('data-setlang'))}catch(e){} }); });
  // Reveal on scroll (skipped when reduced motion is requested)
  var els=d.querySelectorAll('.reveal');
  var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduce||!('IntersectionObserver' in window)){ els.forEach(function(e){e.classList.add('in')}); }
  else{
    var io=new IntersectionObserver(function(entries){ entries.forEach(function(en){ if(en.isIntersecting){ en.target.classList.add('in'); io.unobserve(en.target); } }); },{rootMargin:'0px 0px -8% 0px',threshold:.08});
    els.forEach(function(e){ io.observe(e); });
  }
  // Samples page: filter the listing by trade + area (reads ?metier=&secteur= or ?trade=&area=).
  var form=d.querySelector('[data-filter-form]'), list=d.querySelector('[data-list]');
  if(form&&list){
    var sels=form.querySelectorAll('select'), ts=sels[0], as=sels[1];
    var rows=list.querySelectorAll('.lrow'), cnt=list.querySelector('[data-count]'), word=list.querySelector('[data-word]'), empty=list.querySelector('[data-empty]');
    var q; try{q=new URLSearchParams(location.search)}catch(e){q=null}
    function pick(sel,v){ if(!v) return; for(var i=0;i<sel.options.length;i++){ if(sel.options[i].value===v){ sel.value=v; return; } } }
    if(q){ pick(ts,q.get(ts.name)||q.get('metier')||q.get('trade')); pick(as,q.get(as.name)||q.get('secteur')||q.get('area')); }
    function apply(push){
      var t=ts.value, a=as.value, n=0;
      rows.forEach(function(r){ var ok=(!t||(' '+r.getAttribute('data-trades')+' ').indexOf(' '+t+' ')>-1)&&(!a||r.getAttribute('data-area')===a); r.hidden=!ok; if(ok) n++; });
      if(cnt) cnt.textContent=n;
      if(word) word.textContent=word.getAttribute(n===1?'data-one':'data-many');
      if(empty) empty.hidden=n>0;
      if(push&&window.history&&history.replaceState){ var p=[]; if(t)p.push(ts.name+'='+encodeURIComponent(t)); if(a)p.push(as.name+'='+encodeURIComponent(a)); history.replaceState(null,'',location.pathname+(p.length?'?'+p.join('&'):'')); }
    }
    ts.addEventListener('change',function(){apply(true)}); as.addEventListener('change',function(){apply(true)});
    form.addEventListener('submit',function(e){ e.preventDefault(); apply(true); });
    apply(false);
  }
})();
