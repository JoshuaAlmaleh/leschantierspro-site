/* LesChantiersPro — language helper for the root page (x-default).
   Pages are pre-rendered in /fr/ and /en/ (good for SEO); this script only picks a default
   language for visitors landing on "/". French is the default. */
(function(){
  var saved=null; try{saved=localStorage.getItem('lcp_lang')}catch(e){}
  var nav=(navigator.languages&&navigator.languages[0])||navigator.language||'fr';
  var lang=saved||(/^en\b/i.test(nav)?'en':'fr');
  if(document.documentElement.getAttribute('data-autoredirect')==='1'){ location.replace(lang==='en'?'en/':'fr/'); }
})();
